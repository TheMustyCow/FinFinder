# FinFinder Backend

This directory contains the Python backend handlers for FinFinder. From the backend perspective, the project is an API layer over DynamoDB that receives authenticated user requests from the app, stores catch and map-pin data, and exposes aggregate fishing insights back to the frontend.

## Responsibilities

- Create, list, share, and delete user catch records.
- Persist user map pins and their associated catches.
- Read DynamoDB catch data to calculate fishing summaries.
- Return API Gateway-compatible responses with JSON bodies and CORS headers.
- Trust Cognito/API Gateway authorizer claims or fallback user headers for authenticated catch workflows.

## Files

- `catches_lambda.py` - Main catch API handler. Supports creating catches, reading personal catches, reading community catches, sharing a catch to the community, and deleting a catch.
- `userPinsPost.py` - Saves a map pin and one or more catch entries for a user.
- `deleteCatch.py` - Standalone delete handler for deleting a catch by id.
- `topLocation.py` - Ranks locations for a requested fish species.
- `topBait.py` - Ranks bait usage for a requested fish species.
- `topAnglers.py` - Returns the top anglers by catch count.
- `rarestFish.py` - Returns species ordered from least common to most common.
- `bestTime.py` - Buckets catches by time of day for a requested fish species.

## Data model

The handlers use a DynamoDB table named `FinFinder` by default. Catch records are stored with a partition key named `Username` and a sort key named `Catch#`.

Common catch attributes include:

- `Username`
- `Catch#`
- `entityType`
- `id`
- `FishSpecies` / `fish`
- `Location` / `location`
- `Bait` / `bait`
- `Weight` / `weight`
- `Length` / `length`
- `createdAt`
- `date`
- `isPostedToCommunity`

Community catches can also use `communityPk` and `communitySk` for a DynamoDB secondary index.

## Environment variables

- `CATCHES_TABLE_NAME` - DynamoDB table for catch APIs. Defaults to `FinFinder`.
- `TABLE_NAME` - DynamoDB table for handlers that use the older variable name. Defaults to `FinFinder`.
- `COMMUNITY_INDEX_NAME` - Optional GSI name for querying community catches by `communityPk` and `communitySk`. If omitted, `catches_lambda.py` falls back to scanning for demo use.

## API behavior

`catches_lambda.py` supports these routes when wired through API Gateway:

- `POST /catches` - Create a catch for the signed-in user.
- `GET /catches/mine` - Return the signed-in user's catches.
- `GET /catches/community` - Return catches posted to the community.
- `POST /catches/{catchId}/community` - Mark a personal catch as shared.
- `DELETE /catches/{catchId}` - Delete a personal catch.

The aggregate handlers expect `FishSpecies` as a query string parameter when the ranking is species-specific.

## Local development notes

These files are written for AWS Lambda event payloads, not a long-running local web server. For local testing, invoke `lambda_handler(event, context)` with API Gateway-shaped event objects and AWS credentials configured for DynamoDB access.

Install backend dependencies in a virtual environment if needed:

```sh
python -m venv env
source env/bin/activate
pip install boto3
```

Before changing handler behavior, check the matching frontend services and hooks in `frontend/services/` and `frontend/hooks/` so request paths, fields, and response shapes stay aligned.
