# HeadHunter Integration Backend

> **AI Context Document**: This README is designed to provide complete context for AI assistants to understand the project architecture, coding patterns, and development approach.

## Project Overview

A Node.js/Express backend application that integrates with the HeadHunter (hh.ru) API for OAuth authentication and user management. The application uses Firebase Firestore as the database and follows a modular, layered architecture pattern.

## Tech Stack

### Core Technologies

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Admin SDK + HeadHunter OAuth 2.0

### Key Dependencies

- `express` - Web framework
- `typescript` - Type safety and modern JavaScript features
- `firebase-admin` - Firebase backend SDK for Firestore and Auth
- `axios` - HTTP client for external API calls (HeadHunter API)
- `joi` - Schema validation for request payloads
- `module-alias` - Path aliasing for cleaner imports
- `dotenv` - Environment variable management
- `nodemon` - Development auto-reload
- `ts-node` - TypeScript execution for development

## Architecture & Design Patterns

### Layered Architecture

The application follows a **strict 3-layer architecture** pattern:

```
Controller → Service → Repository
```

1. **Controller Layer** (`*.controller.ts`)

   - Handles HTTP requests/responses
   - Validates input (via middleware)
   - Calls service layer
   - Returns formatted responses using `ApiResponse` utility
   - No business logic

2. **Service Layer** (`*.service.ts`)

   - Contains business logic
   - Orchestrates data flow
   - Calls repository layer
   - Handles data transformation
   - No direct database access

3. **Repository Layer** (`*.repository.ts`)
   - Direct database operations (Firestore)
   - CRUD operations
   - Data persistence logic
   - Returns domain models

### Module-Based Organization

Each feature is organized as a **self-contained module** with:

- Routes (`*.routes.ts`)
- Controller (`*.controller.ts`)
- Service (`*.service.ts`)
- Repository (`*.repository.ts`)
- Types (`*.types.ts`)
- Validators (`*.validator.ts`)
- Services subdirectory (for external integrations)

## Folder Structure

```
headhunter/
├── src/
│   ├── index.ts                    # Application entry point
│   ├── modules/                    # Feature modules
│   │   ├── index.ts               # Central route aggregator
│   │   ├── auth/                  # Authentication module
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── auth.validator.ts
│   │   │   └── services/
│   │   │       └── hh-api.service.ts  # HeadHunter API integration
│   │   └── user/                  # User management module
│   │       ├── user.routes.ts
│   │       ├── user.controller.ts
│   │       ├── user.service.ts
│   │       ├── user.repository.ts
│   │       ├── user.types.ts
│   │       └── user.validator.ts
│   └── shared/                    # Shared utilities and configurations
│       ├── config/                # Configuration files
│       │   ├── env.config.ts     # Environment variables
│       │   └── firebase.config.ts # Firebase initialization
│       ├── middlewares/           # Express middlewares
│       │   ├── error.middleware.ts
│       │   ├── validation.middleware.ts
│       │   └── auth.middleware.ts
│       ├── types/                 # Shared TypeScript types
│       │   └── common.types.ts
│       └── utils/                 # Utility functions
│           ├── errors.ts         # Custom error classes
│           ├── logger.ts         # Logging utility
│           └── response.ts       # API response formatter
├── module-alias.ts                # Path alias configuration
├── generateFirebaseCredentials.js # Firebase setup script
├── nodemon.json                   # Nodemon configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies and scripts
└── serviceAccountKey.json         # Firebase credentials (gitignored)
```

## Coding Style & Conventions

### Import Style

- **Path Aliases**: Uses `@` prefix for clean imports
  ```typescript
  import { envConfig } from '@config/env.config'
  import { Logger } from '@utils/logger'
  import { validate } from '@middlewares/validation.middleware'
  ```
- **Module Alias Registration**: First import in entry point
  ```typescript
  import 'module-alias/register' // Must be first import
  ```

### Class-Based Architecture

- **Controllers**: Class-based with instance methods

  ```typescript
  export class UserController {
    private userService: UserService

    constructor() {
      this.userService = new UserService()
    }

    createUser = async (req: Request, res: Response, next: NextFunction) => {
      // Implementation
    }
  }
  ```

- **Services**: Class-based with dependency injection via constructor

  ```typescript
  export class UserService {
    private userRepository: UserRepository

    constructor() {
      this.userRepository = new UserRepository()
    }
  }
  ```

- **Repositories**: Class-based with Firestore integration
  ```typescript
  export class UserRepository {
    private collection: FirebaseFirestore.CollectionReference

    constructor() {
      this.collection = db.collection('users')
    }
  }
  ```

### Error Handling Pattern

- **Custom Error Classes**: Extends base `AppError` class

  ```typescript
  export class AppError extends Error {
    constructor(
      public statusCode: number,
      public message: string,
      public isOperational = true
    ) {
      super(message)
      Object.setPrototypeOf(this, AppError.prototype)
      Error.captureStackTrace(this, this.constructor)
    }
  }
  ```

- **Specific Error Types**:

  - `BadRequestError` (400)
  - `UnauthorizedError` (401)
  - `NotFoundError` (404)
  - `InternalServerError` (500)

- **Centralized Error Middleware**: Catches all errors
  ```typescript
  app.use(errorHandler)
  ```

### Response Formatting

- **Standardized API Responses**: Uses `ApiResponse` utility class

  ```typescript
  // Success response
  ApiResponse.success(res, data, 'Success message', 200)
  // Returns: { success: true, message: string, data: T }

  // Error response
  ApiResponse.error(res, 'Error message', 400, errors)
  // Returns: { success: false, message: string, errors?: any }
  ```

### Validation Pattern

- **Joi Schemas**: Defined per module in `*.validator.ts`
- **Middleware-Based**: Applied at route level
  ```typescript
  router.post('/', validate(createUserSchema), userController.createUser)
  ```
- **Validation Middleware**: Returns formatted errors
  ```typescript
  const errors = error.details.map((detail) => ({
    field: detail.path.join('.'),
    message: detail.message,
  }))
  ```

### Logging Pattern

- **Custom Logger Class**: Static methods for different log levels
  ```typescript
  Logger.info('Message', metadata)
  Logger.error('Error message', error)
  Logger.warn('Warning message', metadata)
  Logger.debug('Debug message', metadata) // Only in development
  ```
- **Timestamp Included**: ISO format timestamps on all logs
- **Environment-Aware**: Debug logs only in development mode

### TypeScript Patterns

- **Explicit Types**: All functions have return types
- **Interface/Type Definitions**: Separate `*.types.ts` files per module
- **Async/Await**: Consistent use throughout (no callbacks)
- **Arrow Functions**: Used for controller methods to preserve `this` context

### Naming Conventions

- **Files**: kebab-case (e.g., `user.controller.ts`, `auth.service.ts`)
- **Classes**: PascalCase (e.g., `UserController`, `AuthService`)
- **Functions/Methods**: camelCase (e.g., `createUser`, `getAllUsers`)
- **Constants**: camelCase for config objects (e.g., `envConfig`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `CreateUserDto`)

## Configuration Management

### Environment Variables

Centralized in `src/shared/config/env.config.ts`:

```typescript
export const envConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  hhClientId: process.env.HH_CLIENT_ID,
  hhClientSecret: process.env.HH_CLIENT_SECRET,
  hhRedirectUri: process.env.HH_REDIRECT_URI,
}
```

### Firebase Configuration

- **Initialization**: Side-effect import in `src/index.ts`
  ```typescript
  import '@config/firebase.config'
  ```
- **Exports**: `db` (Firestore), `auth` (Admin Auth), `admin` (SDK)
- **Service Account**: Loaded from path specified in env vars

### Path Aliases

Configured in `module-alias.ts` and `tsconfig.json`:

```typescript
'@config': 'src/shared/config',
'@middlewares': 'src/shared/middlewares',
'@utils': 'src/shared/utils',
'@types': 'src/shared/types',
'@modules': 'src/modules',
```

## API Structure

### Base URL

All routes prefixed with `/api`:

```typescript
app.use('/api', routes)
```

### Current Endpoints

#### Authentication (`/api/auth`)

- `GET /api/auth/hh` - Initiate HeadHunter OAuth flow
- `GET /api/auth/callback` - OAuth callback handler
- `POST /api/auth/refresh` - Refresh access token (validated)

#### Users (`/api/user`)

- `POST /api/user` - Create user (validated with `createUserSchema`)
- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get user by ID

### Route Registration Pattern

Centralized in `src/modules/index.ts`:

```typescript
const router = Router()
router.use('/auth', authRoutes)
router.use('/user', userRoutes)
export default router
```

## External Integrations

### HeadHunter API Integration

- **Service**: `src/modules/auth/services/hh-api.service.ts`
- **OAuth Flow**: Authorization Code Grant
- **Token Management**: Access token + refresh token
- **API Client**: Axios-based HTTP client

### Firebase Firestore

- **Collections**: Document-based NoSQL structure
- **User Collection**: `users` collection for user data
- **Repository Pattern**: All Firestore operations abstracted in repositories

## Development Workflow

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled JavaScript (production)
```

### Development Server

- **Tool**: Nodemon with ts-node
- **Watch**: `src/**/*.ts` files
- **Auto-restart**: On file changes
- **Configuration**: `nodemon.json`

### TypeScript Configuration

- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Enabled
- **Path Mapping**: Matches module-alias configuration
- **Output**: `dist/` directory

## Middleware Stack

### Application-Level Middlewares (in order)

1. `express.json()` - Parse JSON bodies
2. `express.urlencoded({ extended: true })` - Parse URL-encoded bodies
3. Routes (`/api`)
4. `notFoundHandler` - 404 handler
5. `errorHandler` - Global error handler

### Route-Level Middlewares

- `validate(schema)` - Request validation
- `authenticate` - JWT/token authentication (if implemented)

## Error Handling Strategy

### Error Flow

1. Error thrown in controller/service/repository
2. Express catches error (async errors via try-catch)
3. Error passed to `errorHandler` middleware
4. Response formatted based on error type
5. Stack trace included in development mode only

### Error Response Format

```typescript
{
  success: false,
  message: string,
  stack?: string,        // Development only
  error?: string,        // Development only for unhandled errors
}
```

## Database Patterns

### Firestore Operations

- **Create**: `collection.add(data)` or `doc.set(data)`
- **Read**: `collection.get()`, `doc.get()`
- **Update**: `doc.update(data)`
- **Delete**: `doc.delete()`

### Data Transformation

- **Firestore → Domain Model**: Repository layer transforms snapshots
- **DTO → Entity**: Service layer handles transformation
- **Entity → Response**: Controller uses `ApiResponse` utility

## Key Implementation Details

### OAuth Flow (HeadHunter)

1. User initiates: `GET /api/auth/hh`
2. Redirect to HeadHunter authorization URL
3. User authorizes on HeadHunter
4. Callback: `GET /api/auth/callback?code=...`
5. Exchange code for tokens
6. Store tokens in Firestore
7. Return tokens to client

### Token Refresh Flow

1. Client sends refresh token: `POST /api/auth/refresh`
2. Validate refresh token (Joi schema)
3. Call HeadHunter token refresh endpoint
4. Update tokens in Firestore
5. Return new access token

## Code Organization Principles

### Separation of Concerns

- **Routes**: Only route definitions and middleware application
- **Controllers**: HTTP layer, no business logic
- **Services**: Business logic, no HTTP concerns
- **Repositories**: Data access, no business logic

### Dependency Direction

```
Routes → Controllers → Services → Repositories → Database
```

- Each layer only depends on the layer below
- No circular dependencies
- Clear data flow

### Shared Code

- **Config**: Environment and external service configuration
- **Middlewares**: Reusable Express middlewares
- **Utils**: Pure utility functions (logger, errors, response)
- **Types**: Shared TypeScript definitions

## Testing Strategy

_Note: No test files currently present in the project_

Expected pattern when implemented:

- Unit tests: `*.test.ts` or `*.spec.ts`
- Test framework: Jest (likely)
- Location: Alongside source files or in `__tests__` directories

## Environment Setup

### Required Environment Variables

```env
PORT=3000
NODE_ENV=development
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
HH_CLIENT_ID=your_headhunter_client_id
HH_CLIENT_SECRET=your_headhunter_client_secret
HH_REDIRECT_URI=http://localhost:3000/api/auth/callback
```

### Firebase Setup

1. Create Firebase project
2. Generate service account key
3. Save as `serviceAccountKey.json` in project root
4. Set path in environment variables

## Git Workflow

### Ignored Files (`.gitignore`)

- `node_modules/`
- `dist/`
- `.env`
- `serviceAccountKey.json`
- IDE-specific files

## Future Considerations

### Potential Enhancements

- Authentication middleware for protected routes
- Rate limiting middleware
- Request logging middleware
- Database connection pooling
- Caching layer (Redis)
- API documentation (Swagger/OpenAPI)
- Unit and integration tests
- CI/CD pipeline
- Docker containerization

### Scalability Patterns

- Service layer can be extracted to microservices
- Repository pattern allows easy database migration
- Modular structure supports feature-based splitting

## AI Assistant Guidelines

When working with this codebase:

1. **Follow the 3-layer pattern**: Always create controller → service → repository
2. **Use path aliases**: Import from `@config`, `@utils`, etc.
3. **Maintain module structure**: Each feature gets its own module directory
4. **Use custom error classes**: Throw `BadRequestError`, `NotFoundError`, etc.
5. **Format responses**: Always use `ApiResponse.success()` or `ApiResponse.error()`
6. **Validate inputs**: Create Joi schemas in `*.validator.ts`
7. **Log appropriately**: Use `Logger` class for all logging
8. **Type everything**: Define types in `*.types.ts` files
9. **Keep controllers thin**: Business logic belongs in services
10. **Repository for data**: All database operations in repository layer

### Adding a New Feature Module

1. Create module directory: `src/modules/feature-name/`
2. Create files:
   - `feature-name.routes.ts`
   - `feature-name.controller.ts`
   - `feature-name.service.ts`
   - `feature-name.repository.ts` (if database access needed)
   - `feature-name.types.ts`
   - `feature-name.validator.ts`
3. Register routes in `src/modules/index.ts`
4. Follow existing patterns for each layer

### Code Style Checklist

- [ ] Class-based controllers, services, repositories
- [ ] Arrow functions for controller methods
- [ ] Async/await for asynchronous operations
- [ ] Explicit return types on all functions
- [ ] Path aliases for imports
- [ ] Custom error classes for error handling
- [ ] ApiResponse utility for responses
- [ ] Logger for all logging
- [ ] Joi schemas for validation
- [ ] TypeScript interfaces/types defined

---

**Project Status**: Active Development
**Last Updated**: 2024
**Maintainer**: werty.potom
