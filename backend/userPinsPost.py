import json
import os
import uuid
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

import boto3


dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ.get("TABLE_NAME", "FinFinder")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    method = _get_method(event)

    if method == "OPTIONS":
        return _response(204)

    try:
        body = _get_json_body(event)

        username = _optional_string(body.get("Username"))
        if not username:
            return _response(400, {"error": "Username is required"})

        pin_id = _optional_string(body.get("pinId")) or str(uuid.uuid4())
        lat = _optional_decimal(body.get("lat"), "lat")
        lng = _optional_decimal(body.get("lng"), "lng")
        location_name = _optional_string(
            body.get("locationName")
            or body.get("location")
            or body.get("LocationName")
            or body.get("Location")
        )

        if not location_name:
            return _response(400, {"error": "Location name is required"})

        if (lat is None) != (lng is None):
            return _response(400, {"error": "lat and lng must be provided together"})

        if lat is not None and not (Decimal("-90") <= lat <= Decimal("90")):
            return _response(400, {"error": "lat must be between -90 and 90"})

        if lng is not None and not (Decimal("-180") <= lng <= Decimal("180")):
            return _response(400, {"error": "lng must be between -180 and 180"})

        catches = body.get("catches", [])

        if not isinstance(catches, list) or len(catches) == 0:
            return _response(400, {"error": "At least one catch is required"})

        now = datetime.now(timezone.utc)
        created_at = now.isoformat()
        catch_date = now.date().isoformat()
        saved_items = []

        for catch_data in catches:
            catch_id = str(uuid.uuid4())

            item = {
                "Username": username,
                "Catch#": f"CATCH#{catch_id}",
                "pinId": pin_id,
                "entityType": "CATCH",
                "id": catch_id,
                "lat": lat,
                "lng": lng,
                "locationName": location_name,
                "LocationName": location_name,
                "location": location_name,
                "Location": location_name,
                "FishSpecies": _optional_string(catch_data.get("species")),
                "Bait": _optional_string(catch_data.get("bait")),
                "Length": _optional_decimal(catch_data.get("size"), "size") or Decimal("0"),
                "Weight": _optional_decimal(catch_data.get("weight"), "weight") or Decimal("0"),
                "createdAt": created_at,
                "date": catch_date,
            }

            item = {key: value for key, value in item.items() if value is not None}

            table.put_item(Item=item)
            saved_items.append(item)

        return _response(200, {
            "message": "Pins saved successfully",
            "pinId": pin_id,
            "locationName": location_name,
            "date": catch_date,
            "count": len(saved_items),
        })
    except json.JSONDecodeError:
        return _response(400, {"error": "Request body must be valid JSON"})
    except ValueError as error:
        return _response(400, {"error": str(error)})
    except Exception as error:
        return _response(500, {"error": str(error)})


def _get_json_body(event):
    raw_body = event.get("body")

    if not raw_body:
        return {}

    return json.loads(raw_body)


def _optional_string(value):
    if value is None:
        return ""

    return str(value).strip()


def _optional_decimal(value, field_name):
    if value in (None, ""):
        return None

    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        raise ValueError(f"{field_name} must be a number")


def _response(status_code, body=None):
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Name",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
            "Content-Type": "application/json",
        },
        "body": json.dumps(body, default=_json_safe) if body else "",
    }


def _json_safe(value):
    if isinstance(value, Decimal):
        return float(value)
    return value


def _get_method(event):
    return (event.get("httpMethod") or
        event.get("requestContext", {})
        .get("http", {})
        .get("method", "")
    ).upper()
