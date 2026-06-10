# FinFinder

FinFinder is a fishing companion app for logging catches, exploring fishing spots, and learning from community catch data. The project is split into an Expo/React Native frontend and a Python/AWS backend that stores catch records, user map pins, and aggregate fishing insights.

## Project perspective

From the root of the repository, FinFinder is the full product: a mobile/web client, backend Lambda handlers, shared project context, and supporting configuration. Use this level when you need to understand how the frontend and backend fit together or when you are onboarding to the whole codebase.

## Repository layout

- `frontend/` - Expo Router app for authentication, catch logging, maps, community posts, and fish data views.
- `backend/` - Python Lambda handlers for catches, pins, deletes, and aggregate fishing stats backed by DynamoDB.
- `docs/ai/` - Project context and AI collaboration notes.
- `package.json` - Root JavaScript dependencies used outside the Expo app.

## Main features

- User signup, login, confirmation, password reset, and session handling through Amazon Cognito.
- Personal catch logging with species, location, bait, weight, length, description, and optional coordinates.
- Community catch feed for catches users choose to share.
- Map-based fishing spot and pin workflows.
- Fish data summaries such as top anglers, popular locations, bait rankings, rarest fish, and best time of day.

## Tech stack

- Frontend: Expo, React Native, Expo Router, TypeScript, React Native Maps, Leaflet/React Leaflet for web maps.
- Backend: Python AWS Lambda handlers, API Gateway-style events, DynamoDB, boto3.
- Auth and cloud services: Amazon Cognito, API Gateway, DynamoDB.

## Getting started

Install frontend dependencies:

```sh
cd frontend
npm install
```

Run the app:

```sh
npm start
```

Common Expo targets:

```sh
npm run web
npm run ios
npm run android
```

The backend code is organized as deployable Lambda handlers. It expects AWS credentials and deployed AWS resources when run against real data. See `backend/README.md` for handler details and environment variables.

## Documentation

- Frontend guide: `frontend/README.md`
- Backend guide: `backend/README.md`
- AI/project context: `docs/ai/`
