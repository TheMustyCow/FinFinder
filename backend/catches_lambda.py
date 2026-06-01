import json
import os
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, Dict, Optional, Tuple

import boto3
from boto3.dynamodb.conditions import Attr, Key
from botocore.exceptions import ClientError


dynamodb = boto3.resource("dynamodb")

CATCHES_TABLE_NAME = os.environ.get("CATCHES_TABLE_NAME", "FinFinder")
COMMUNITY_INDEX_NAME = os.environ.get("COMMUNITY_INDEX_NAME")

table = dynamodb.Table(CATCHES_TABLE_NAME)


def lambda_handler(event, context):
    method = _get_method(event)
    path = _get_path(event)

    if method == "OPTIONS":
        return _response(204)

    try:
        user_id, username = _get_user(event)

        if method == "POST" and _matches_any(path, ["/catches", "/api/catches"]):
            return _create_catch(event, user_id, username)

        if method == "GET" and _matches_any(path, ["/catches/mine", "/api/catches/mine"]):
            return _get_my_catches(username)

        if method == "GET" and _matches_any(path, ["/catches/community", "/api/catches/community"]):
            return _get_community_catches()

        catch_id = _extract_path_id(path, "/catches/", "/community") or _extract_path_id(
            path,
            "/api/catches/",
            "/community",
        )
        if method == "POST" and catch_id:
            return _post_catch_to_community(username, catch_id)

        return _response(404, {"error": "Route not found"})
    except ValueError as error:
        return _response(400, {"error": str(error)})
    except PermissionError as error:
        return _response(401, {"error": str(error)})
    except ClientError as error:
        return _response(500, {"error": error.response.get("Error", {}).get("Message", "DynamoDB error")})
    except Exception:
        return _response(500, {"error": "Unexpected server error"})


def _create_catch(event, user_id: str, username: str):
    body = _get_json_body(event)

    fish = _required_string(body, "fish")
    location = _required_string(body, "location")
    desc = str(body.get("desc", "")).strip()
    bait = _optional_string(body, "bait")
    weight = _required_number(body, "weight")
    length = _required_number(body, "length")
    latitude = _optional_number(body, "latitude")
    longitude = _optional_number(body, "longitude")
    post_to_community = bool(body.get("isPostedToCommunity", False))

    if (latitude is None) != (longitude is None):
        raise ValueError("latitude and longitude must be provided together")

    if latitude is not None and not (Decimal("-90") <= latitude <= Decimal("90")):
        raise ValueError("latitude must be between -90 and 90")

    if longitude is not None and not (Decimal("-180") <= longitude <= Decimal("180")):
        raise ValueError("longitude must be between -180 and 180")

    now = datetime.now(timezone.utc)
    catch_id = str(uuid.uuid4())

    item = {
        "Username": _username_pk(username),
        "Catch#": _catch_sk(catch_id),
        "entityType": "CATCH",
        "id": catch_id,
        "fish": fish,
        "FishSpecies": fish,
        "weight": Decimal(str(weight)),
        "Weight": Decimal(str(weight)),
        "length": Decimal(str(length)),
        "Length": Decimal(str(length)),
        "location": location,
        "Location": location,
        "date": now.date().isoformat(),
        "createdAt": now.isoformat(),
        "desc": desc,
        "Description": desc,
        "userId": user_id,
        "userName": username,
        "isPostedToCommunity": post_to_community,
    }

    if bait:
        item["bait"] = bait
        item["Bait"] = bait

    if latitude is not None and longitude is not None:
        item["latitude"] = latitude
        item["Latitude"] = latitude
        item["longitude"] = longitude
        item["Longitude"] = longitude

    if post_to_community:
        item["communityPk"] = "COMMUNITY"
        item["communitySk"] = f"{item['createdAt']}#{catch_id}"

    table.put_item(Item=item)

    return _response(201, _to_catch_response(item))


def _get_my_catches(username: str):
    response = table.query(
        KeyConditionExpression=Key("Username").eq(_username_pk(username)) & Key("Catch#").begins_with("CATCH#"),
        ScanIndexForward=False,
    )

    return _response(200, [_to_catch_response(item) for item in response.get("Items", [])])


def _get_community_catches():
    if COMMUNITY_INDEX_NAME:
        response = table.query(
            IndexName=COMMUNITY_INDEX_NAME,
            KeyConditionExpression=Key("communityPk").eq("COMMUNITY"),
            ScanIndexForward=False,
        )
    else:
        # Demo fallback. For production, set COMMUNITY_INDEX_NAME to a GSI on communityPk/communitySk.
        response = table.scan(FilterExpression=Attr("entityType").eq("CATCH") & Attr("isPostedToCommunity").eq(True))

    items = response.get("Items", [])
    items.sort(key=lambda item: item.get("createdAt", ""), reverse=True)

    return _response(200, [_to_catch_response(item) for item in items])


def _post_catch_to_community(username: str, catch_id: str):
    key = {
        "Username": _username_pk(username),
        "Catch#": _catch_sk(catch_id),
    }

    existing = table.get_item(Key=key).get("Item")
    if not existing:
        return _response(404, {"error": "Catch not found"})

    community_sk = f"{existing.get('createdAt', datetime.now(timezone.utc).isoformat())}#{catch_id}"

    response = table.update_item(
        Key=key,
        UpdateExpression=(
            "SET isPostedToCommunity = :posted, "
            "communityPk = :communityPk, "
            "communitySk = :communitySk"
        ),
        ExpressionAttributeValues={
            ":posted": True,
            ":communityPk": "COMMUNITY",
            ":communitySk": community_sk,
        },
        ReturnValues="ALL_NEW",
    )

    return _response(200, _to_catch_response(response["Attributes"]))


def _get_user(event) -> Tuple[str, str]:
    claims = (
        event.get("requestContext", {})
        .get("authorizer", {})
        .get("jwt", {})
        .get("claims", {})
    )

    legacy_claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
    if legacy_claims:
        claims = legacy_claims

    headers = event.get("headers") or {}
    user_id = claims.get("sub") or headers.get("x-user-id") or headers.get("X-User-Id")
    user_name = (
        claims.get("email")
        or claims.get("cognito:username")
        or headers.get("x-user-name")
        or headers.get("X-User-Name")
        or "Angler"
    )

    if not user_id:
        raise PermissionError("Authenticated user is required")

    return user_id, user_name


def _get_json_body(event) -> Dict[str, Any]:
    raw_body = event.get("body")

    if not raw_body:
        return {}

    if event.get("isBase64Encoded"):
        raise ValueError("Base64 encoded bodies are not supported")

    try:
        return json.loads(raw_body)
    except json.JSONDecodeError:
        raise ValueError("Request body must be valid JSON")


def _required_string(body: Dict[str, Any], field: str) -> str:
    value = str(body.get(field, "")).strip()
    if not value:
        raise ValueError(f"{field} is required")
    return value


def _optional_string(body: Dict[str, Any], field: str) -> Optional[str]:
    value = str(body.get(field, "")).strip()
    return value or None


def _required_number(body: Dict[str, Any], field: str) -> Decimal:
    value = body.get(field)

    if value in (None, ""):
        raise ValueError(f"{field} is required")

    try:
        return Decimal(str(value))
    except Exception:
        raise ValueError(f"{field} must be a number")


def _optional_number(body: Dict[str, Any], field: str) -> Optional[Decimal]:
    value = body.get(field)

    if value in (None, ""):
        return None

    try:
        return Decimal(str(value))
    except Exception:
        raise ValueError(f"{field} must be a number")


def _to_catch_response(item: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": item.get("id"),
        "fish": item.get("fish") or item.get("FishSpecies"),
        "weight": _json_safe(item.get("weight") or item.get("Weight")),
        "length": _json_safe(item.get("length") or item.get("Length")),
        "location": item.get("location") or item.get("Location"),
        "latitude": _json_safe(item.get("latitude") or item.get("Latitude")),
        "longitude": _json_safe(item.get("longitude") or item.get("Longitude")),
        "date": item.get("date"),
        "desc": item.get("desc") or item.get("Description") or "",
        "userId": item.get("userId"),
        "userName": item.get("userName"),
        "bait": item.get("bait") or item.get("Bait"),
        "isPostedToCommunity": bool(item.get("isPostedToCommunity", False)),
    }


def _response(status_code: int, body: Any = None):
    response = {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Name",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
            "Content-Type": "application/json",
        },
    }

    if body is not None:
        response["body"] = json.dumps(body, default=_json_safe)

    return response


def _json_safe(value):
    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)
        return float(value)

    return value


def _get_method(event) -> str:
    return (
        event.get("requestContext", {}).get("http", {}).get("method")
        or event.get("httpMethod")
        or ""
    ).upper()


def _get_path(event) -> str:
    return event.get("rawPath") or event.get("path") or ""


def _matches(path: str, route: str) -> bool:
    return path.rstrip("/") == route.rstrip("/")


def _matches_any(path: str, routes) -> bool:
    return any(_matches(path, route) for route in routes)


def _extract_path_id(path: str, prefix: str, suffix: str) -> Optional[str]:
    if not path.startswith(prefix) or not path.endswith(suffix):
        return None

    catch_id = path[len(prefix) : -len(suffix)]
    return catch_id.strip("/") or None


def _username_pk(username: str) -> str:
    return username


def _catch_sk(catch_id: str) -> str:
    return f"CATCH#{catch_id}"
