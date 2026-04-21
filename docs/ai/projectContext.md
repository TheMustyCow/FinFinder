# FinFinder - Project Context for AI Assistants

## Project Overview

**FinFinder** is a fishing-focused mobile and web application that enables users to collaborate and track fish globally. The app provides features for logging catches, viewing fish data, exploring fishing spots on a map, and engaging with a community of anglers.

- **Repository**: https://github.com/TheMustyCow/FinFinder.git
- **Deadline**: June 10th
- **Target Platforms**: iOS, Android (via Expo), Web

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Expo | ~55.0.5 | Core SDK & build system |
| React Native | 0.83.2 | Mobile UI framework |
| React | 19.2.0 | UI library |
| TypeScript | ~5.9.2 | Type safety |
| Expo Router | ~55.0.5 | File-based routing |
| AWS Cognito | ^6.3.16 | Authentication |

**Key Dependencies**: `amazon-cognito-identity-js` (User auth), `@react-native-async-storage` (Local storage), `expo-crypto` (Cryptographic functions), `expo-linking` (Deep linking), `expo-status-bar` (Status bar management)

### Backend (Planned/Partially Implemented)

| Technology | Status | Purpose |
|------------|--------|---------|
| Python/Flask | Planned | API server |
| DynamoDB | Planned | Database |
| AWS Lambda | Possible | Serverless functions |
| AWS Cognito | Active | Authentication (us-east-1) |

## Project Architecture

**Pattern**: MVC-like structure with clear separation of concerns

### Frontend Directory Structure (`/frontend/`)

```
frontend/
├── app/                    # Expo Router pages (file-based routing)
│   ├── _layout.tsx         # Root layout with navigation header
│   ├── index.tsx           # Entry point (loading + session check)
│   ├── login.tsx           # Auth: Login page
│   ├── signup.tsx          # Auth: Signup page
│   ├── confirm.tsx         # Auth: Email confirmation
│   ├── resetpassword.tsx   # Auth: Password reset
│   ├── home.tsx            # Main: Dashboard (blank placeholder)
│   ├── fishdata.tsx        # Main: Fish information (blank placeholder)
│   ├── mycatches.tsx       # Main: User's catch log (blank placeholder)
│   ├── spotsmap.tsx        # Main: Map of fishing spots (blank placeholder)
│   └── community.tsx       # Main: Social/community (blank placeholder)
│
├── pages/                  # Screen controllers (MVC "Controller")
│   ├── index.tsx           # Session check controller
│   ├── login.tsx           # Login screen controller
│   ├── signup.tsx          # Signup screen controller
│   ├── confirm.tsx         # Confirmation controller
│   ├── resetpassword.tsx   # Password reset controller
│   ├── home.tsx            # Home screen controller
│   ├── fishdata.tsx        # Fish data controller
│   ├── mycatches.tsx       # My catches controller
│   ├── spotsmap.tsx        # Spots map controller
│   └── community.tsx       # Community controller
│
├── components/
│   ├── index.ts            # Barrel export
│   ├── ui/                 # Reusable UI components (Button.tsx, Input.tsx, Title.tsx, ErrorMessage.tsx, AuthFooter.tsx, Link.tsx)
│   └── views/              # Screen view components (LoginView.tsx, SignupView.tsx, ConfirmView.tsx, ResetPasswordView.tsx, LoadingView.tsx)
│
├── hooks/                  # Custom React hooks (useSession.ts, useLogin.ts, useSignup.ts, useConfirm.ts, useResetPassword.ts)
│
├── services/               # Business logic / API calls (auth.ts - AWS Cognito)
│
├── lib/                    # Library/utility code (cognito.ts)
│
├── constants/              # Constants (cognito.ts)
│
└── assets/                 # Images & icons
```

### TypeScript Path Aliases

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

**Always use path aliases** instead of relative imports (e.g., `import Button from '@components/ui/Button'` not `import Button from '../components/ui/Button'`).

## GitHub Workflow

### Branch Strategy

- **main**: Production branch - PRs required, protected
- **develop**: Integration branch - PRs required, protected
- **feature branches**: Branch off `develop`, merge back via PR

### Current Branches
- `main` - Production
- `develop` - Active development
- `communityPage` - Current feature branch

### AI Assistant Guidelines
- Create feature branches off `develop` for new work
- Never commit directly to `main` or `develop`
- **NEVER commit to GitHub - only the user should commit changes**
- No CI/CD pipeline currently in place
- Always check git status before operations

## Development Status

### Completed
- Authentication system (AWS Cognito) - fully functional
- Navigation structure with custom header
- MVC-like architecture established
- UI component library
- All page placeholders created

### In Progress / Todo
- Implement main app screens (currently blank placeholders): `fishdata.tsx` (Fish information database), `mycatches.tsx` (Personal catch tracking), `spotsmap.tsx` (Fishing locations map), `community.tsx` (Social features)
- Backend API (Flask + DynamoDB)
- Responsive design for mobile + desktop views

## AI Assistant Instructions

### Code Style & Patterns

1. **Follow existing conventions**: Match current code style, naming patterns, and architecture
2. **Use path aliases**: Always import via `@components`, `@hooks`, `@services`, etc.
3. **MVC structure**: Keep logic in hooks/services, views in components/views, routing in app/
4. **TypeScript**: Use strict typing, avoid `any`
5. **React Native**: Use components from `react-native`, style with StyleSheet

### Preferred Assistance Mode

**Guidance over full implementation**: When implementing new features:
- Provide function signatures with JSDoc/type comments
- Include TODO comments explaining what logic is needed
- Create empty scaffold with clear implementation steps
- Let the developer fill in the details

Example:
```typescript
// TODO: Fetch fish data from backend API
// Expected endpoint: GET /api/fish
// Expected response: FishData[] with fields: id, name, species, description, imageUrl
const fetchFishData = async (): Promise<FishData[]> => {
  // Implementation goes here
  return [];
};
```

### Commands to Run

**Before committing**:
```bash
# TypeScript type checking
npx tsc --noEmit

# Start development server
npx expo start
```

### Navigation Structure

- App uses Expo Router file-based routing
- Route structure: `/` (Loading/entry), `/login` (Login), `/signup` (Signup), `/confirm` (Email confirmation), `/resetpassword` (Password reset), `/home` (Dashboard), `/fishdata` (Fish database), `/mycatches` (User's catches), `/spotsmap` (Map view), `/community` (Community features)

### Authentication

- AWS Cognito User Pool: us-east-1_WqzoJUEau
- Always check session state using `useSession` hook
- Protected routes should redirect to `/login` if unauthenticated
- Auth tokens stored in AsyncStorage

## External APIs (To Be Populated)

| Service | Purpose | Status |
|---------|---------|--------|
| [TBD] | Map rendering (Google Maps/Mapbox) | Planned |
| [TBD] | Weather data for fishing conditions | Planned |
| [TBD] | Fish species database | Planned |
| Backend API | Flask API for fish/catches data | Planned |

**Note**: Add API keys and credentials to environment variables, never hardcode them.

## Priority Features (Post-Auth)

Current priority is implementing the four main application screens to work together with responsive design:

1. **FishData** - Browse/search fish species database
2. **MyCatches** - Log and view personal fishing catches
3. **SpotsMap** - Interactive map showing fishing locations
4. **Community** - Social features, sharing catches, discussions

## Working Directory

All frontend work happens in `/Users/thomasweaver/Documents/school/25-26/26Winter/seniorProject/FinFinder/frontend/`

Backend work happens in `/Users/thomasweaver/Documents/school/25-26/26Winter/seniorProject/FinFinder/backend/`

*Last updated: April 13, 2026*
