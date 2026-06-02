import json
import os
from typing import Any, Dict, Optional, Tuple

import boto3
from botocore.exceptions import ClientError


dynamodb = boto3.resource("dynamodb")

TABLE_NAME = os.environ.get("CATCHES_TABLE_NAME") or os.environ.get("TABLE_NAME", "FinFinder")
table = dynamodb.Table(TABLE_NAME)


def lambda_handler(event, context):
    method = _get_method(event)

    if method == "OPTIONS":
        return _response(204)

    if method != "DELETE":
        return _response(405, {"error": "Method not allowed"})

    try:
        user_id, username = _get_user(event)
        catch_id = _get_catch_id(event)

        if not catch_id:
            return _response(400, {"error": "catchId is required"})

        key = {
            "Username": username,
            "Catch#": f"CATCH#{catch_id}",
        }

        existing = table.get_item(Key=key).get("Item")
        if not existing:
            return _response(404, {"error": "Catch not found"})

        table.delete_item(Key=key)

        return _response(200, {
            "success": True,
            "id": catch_id,
            "userId": user_id,
        })
    except PermissionError as error:
        return _response(401, {"error": str(error)})
    except ClientError as error:
        return _response(500, {"error": error.response.get("Error", {}).get("Message", "DynamoDB error")})
    except Exception as error:
        return _response(500, {"error": str(error)})


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

    headers = _normalized_headers(event)
    user_id = claims.get("sub") or headers.get("x-user-id")
    username = (
        claims.get("email")
        or claims.get("cognito:username")
        or headers.get("x-user-name")
    )

    if not user_id:
        raise PermissionError("Authenticated user is required")

    if not username:
        raise PermissionError("Authenticated user name is required")

    return user_id, username


def _get_catch_id(event) -> Optional[str]:
    path_parameters = event.get("pathParameters") or {}

    for key in ("catchId", "catch_id", "id"):
        value = path_parameters.get(key)
        if value:
            return str(value).strip("/")

    proxy_path = path_parameters.get("proxy")
    if proxy_path:
        return str(proxy_path).strip("/").split("/")[-1]

    path = event.get("rawPath") or event.get("path") or ""
    for prefix in ("/catches/", "/api/catches/"):
        if path.startswith(prefix):
            return path[len(prefix):].strip("/").split("/")[0]

    return None


def _normalized_headers(event) -> Dict[str, str]:
    headers = event.get("headers") or {}
    return {str(key).lower(): str(value) for key, value in headers.items()}


def _get_method(event) -> str:
    return (
        event.get("httpMethod")
        or event.get("requestContext", {}).get("http", {}).get("method")
        or ""
    ).upper()


def _response(status_code: int, body: Any = None):
    response = {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-User-Id,X-User-Name",
            "Access-Control-Allow-Methods": "OPTIONS,DELETE",
            "Content-Type": "application/json",
        },
    }

    if body is not None:
        response["body"] = json.dumps(body)

    return response
