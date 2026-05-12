# FinFinder - Project Context for AI Assistants

## Project Overview

**FinFinder** is a fishing-focused mobile and web application that helps users log catches, view fish-related data, explore fishing spots, and share catches with the community.

- **Repository**: https://github.com/TheMustyCow/FinFinder.git
- **Deadline**: June 10th
- **Target Platforms**: iOS, Android, Web via Expo

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | ~55.0.5 | Core SDK and build system |
| React Native | 0.83.2 | Mobile/web UI framework |
| React | 19.2.0 | UI library |
| TypeScript | ~5.9.2 | Type safety |
| Expo Router | ~55.0.5 | File-based routing |
| AWS Cognito | ^6.3.16 | Authentication |

Key dependencies include `amazon-cognito-identity-js`, `@react-native-async-storage/async-storage`, `expo-crypto`, `expo-linking`, and `expo-status-bar`.

### Backend

| Technology | Status | Purpose |
|------------|--------|---------|
| AWS API Gateway | Active | Public HTTP API routes |
| AWS Lambda | Active/partially implemented | Python backend functions |
| DynamoDB | Active/partially implemented | Catch and fish-data storage |
| AWS Cognito | Active | User authentication |
| Flask | Not current direction | Earlier plan; current backend work is Lambda/API Gateway |

The active API Gateway base URL used in frontend hooks/services is:

```text
https://ii3pxy0ro7.execute-api.us-east-1.amazonaws.com
```

## Project Architecture

The frontend uses an MVC-like structure:

- `frontend/app/` contains Expo Router route entry files.
- `frontend/pages/` contains screen/controller implementations.
- `frontend/components/` contains reusable UI and feature components.
- `frontend/hooks/` contains data-fetching and screen logic hooks.
- `frontend/services/` contains API/service boundaries.
- `frontend/lib/` and `frontend/constants/` contain Cognito setup and constants.

Backend Lambda code currently lives in `backend/`.

Important backend files:

```text
backend/catches_lambda.py  # Catch CRUD/community Lambda handler
backend/top-bait.py        # Existing top-bait Lambda
```

## Current Routes

### Frontend Routes

Expo Router routes:

```text
/                 Loading/session entry
/login            Login
/signup           Signup
/confirm          Email confirmation
/resetpassword    Password reset
/home             Dashboard/home
/fishdata         Fish data tools
/mycatches        Personal catch log
/spotsmap         Spots map
/community        Community feed
```

### API Gateway Routes

Existing fish-data hooks call routes such as:

```text
/bestTime
/top-bait
/topLocations
```

Catch/community routes point to the same Lambda handler, `catches_lambda.lambda_handler`:

```text
POST    /catches
GET     /catches/mine
GET     /catches/community
POST    /catches/{catchId}/community
OPTIONS /catches
OPTIONS /catches/mine
OPTIONS /catches/community
OPTIONS /catches/{catchId}/community
```

All `OPTIONS` routes must have no authorization so browser CORS preflight succeeds.

## Catches Feature

### Frontend

- `frontend/services/catches.ts` is the API boundary for catch-related frontend work.
- `frontend/pages/mycatches.tsx` creates personal catches through `catchesService`.
- `frontend/pages/community.tsx` reads shared catches through `catchesService`.
- `frontend/components/community/Card.tsx` renders community catch cards.
- `catchesService` currently caches `myCatches` and `communityCatches` in memory to avoid repeated API calls during navigation.
- Temporary test headers are still used:

```text
X-User-Id: user-001
X-User-Name: Thomas
```

These should later be replaced with a Cognito `Authorization: Bearer <idToken>` header.

### Backend

`backend/catches_lambda.py` supports:

- creating catches
- listing catches for the current user
- listing community catches
- marking a catch as shared to community

DynamoDB table:

```text
Table name: FinFinder
Partition key: Username
Sort key: Catch#
```

The Lambda currently writes catch sort-key values like:

```text
CATCH#<uuid>
```

Community catches currently use `Scan` unless a GSI is configured. Recommended future GSI:

```text
communityPk
communitySk
```

Then set Lambda env var:

```text
COMMUNITY_INDEX_NAME=<gsi-name>
```

Required Lambda env var:

```text
CATCHES_TABLE_NAME=FinFinder
```

Required Lambda role permissions:

```text
dynamodb:GetItem
dynamodb:PutItem
dynamodb:UpdateItem
dynamodb:Query
dynamodb:Scan
```

on:

```text
arn:aws:dynamodb:us-east-1:283111850741:table/FinFinder
arn:aws:dynamodb:us-east-1:283111850741:table/FinFinder/index/*
```

## Authentication

- Cognito User Pool: `us-east-1_WqzoJUEau`
- `frontend/services/auth.ts` handles login, signup, confirmation, password reset, session checks, and logout.
- `useSession` checks auth state and redirects unauthenticated users.
- Catch API calls currently use temporary test headers. A future step is adding a service helper for the current Cognito ID token and sending it to API Gateway.

## TypeScript Path Aliases

Configured in `frontend/tsconfig.json`:

```json
{
  "@/*": ["./*"],
  "@components/*": ["./components/*"],
  "@hooks/*": ["./hooks/*"],
  "@services/*": ["./services/*"],
  "@lib/*": ["./lib/*"],
  "@constants/*": ["./constants/*"]
}
```

Prefer path aliases for new code when it fits local conventions. Some existing files still use relative imports, especially page-to-service/component imports.

## Development Status

### Completed / Working

- Cognito auth flow
- Navigation shell with custom header
- Fish-data API hooks for best time, top bait, and popular locations
- My Catches form and catch list
- Community page/card grid
- Catch sharing flow from My Catches to Community
- API Gateway/Lambda/DynamoDB catch path is connected
- Catches frontend service includes in-memory caching

### In Progress / Needs Follow-Up

- Replace temporary catch headers with Cognito auth token.
- Add loading/error polish to API-backed screens.
- Move hardcoded API base URLs into config/env.
- Add a DynamoDB GSI for community catches to avoid scans.
- Continue improving responsive design for mobile and desktop.
- Build out `spotsmap` and any remaining dashboard/fish-data polish.

## AI Assistant Instructions

### Code Style & Patterns

1. Follow existing conventions and keep changes scoped.
2. Keep API interaction inside `frontend/services/` or purpose-built hooks.
3. Keep DynamoDB access in backend Lambda/Python, never directly in frontend code.
4. Use TypeScript types for shared API shapes; avoid `any`.
5. Use React Native components and `StyleSheet` for frontend UI.
6. Do not commit changes; the user handles commits.
7. Always check `git status` before broad edits.

### Commands To Run

Before handing off frontend changes:

```bash
cd frontend
npx tsc --noEmit
```

For Python Lambda syntax checks:

```bash
python3 -m py_compile backend/catches_lambda.py
```

To run the Expo app:

```bash
cd frontend
npx expo start
```

## Working Directories

Frontend work:

```text
/Users/thomasweaver/Documents/school/25-26/26Winter/seniorProject/FinFinder/frontend/
```

Backend work:

```text
/Users/thomasweaver/Documents/school/25-26/26Winter/seniorProject/FinFinder/backend/
```

*Last updated: May 12, 2026*
