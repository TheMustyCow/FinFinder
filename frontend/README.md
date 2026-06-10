# FinFinder Frontend

This directory contains the Expo/React Native frontend for FinFinder. From the frontend perspective, the project is the user-facing fishing app: it handles authentication, navigation, catch entry, fish data exploration, map interactions, and the community feed.

## Responsibilities

- Present the Fin Finder mobile/web experience.
- Authenticate users through Amazon Cognito.
- Call the deployed FinFinder API for catches, community posts, map pins, and fishing stats.
- Render native and web map experiences.
- Keep reusable UI, service, hook, and page code organized around app screens.

## Tech stack

- Expo and React Native
- Expo Router
- TypeScript
- Amazon Cognito via `amazon-cognito-identity-js`
- React Native Maps for native map views
- Leaflet and React Leaflet for web map views

## App structure

- `app/` - Expo Router routes and layout used by the app.
- `pages/` - Page-level screen files kept alongside the router setup.
- `components/views/` - Larger screen/view components such as login, signup, map, loading, and fish-data views.
- `components/ui/` - Reusable UI pieces such as buttons, inputs, cards, titles, and error messages.
- `services/` - API/auth service modules for Cognito and catch workflows.
- `hooks/` - Screen hooks for auth flows and backend data fetching.
- `constants/` - Shared colors and Cognito configuration.
- `data/` - Local app data, including lake metadata.
- `android/` - Generated native Android project files.
- `assets/` - Expo image assets such as icons and splash images.

## Main screens

- `login`, `signup`, `confirm`, `resetpassword` - Authentication flows.
- `home` - Main landing area after sign-in.
- `fishdata` - Fishing data summaries.
- `mycatches` - Personal catch log.
- `spotsmap` - Map and fishing spot workflow.
- `community` - Shared community catch posts.

## Getting started

Install dependencies:

```sh
npm install
```

Start Expo:

```sh
npm start
```

Run a specific target:

```sh
npm run web
npm run ios
npm run android
```

## Backend and auth configuration

The app currently calls the deployed API Gateway base URL from `services/catches.ts` and related map/stat hooks. Cognito settings live in `constants/cognito.ts` and are used by `lib/cognito.ts` and `services/auth.ts`.

When backend routes or response shapes change, update the corresponding frontend service or hook at the same time:

- Catch CRUD and community sharing: `services/catches.ts`
- Auth flows: `services/auth.ts`
- Fish stat cards: `hooks/useTopBait.ts`, `hooks/useTopAnglers.ts`, `hooks/useRarestFish.ts`, `hooks/usePopularLocations.ts`, `hooks/useBestTimeOfDay.ts`
- Map pin workflows: `components/views/WebMap.tsx`

## Development notes

- Prefer shared UI from `components/ui/` before creating new screen-specific controls.
- Keep API calls inside services or hooks so screen components stay focused on presentation and interaction.
- Check both native and web behavior when changing maps because the app uses platform-specific map implementations.
