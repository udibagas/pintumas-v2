# Authentication Module Structure

This directory contains the authentication system split into specialized files for better organization and Edge Runtime support.

## File Structure

```
lib/
├── auth.ts                 # Node.js runtime functions (bcryptjs, jsonwebtoken)
├── auth-edge.ts            # Edge runtime functions (Web Crypto API)
├── auth-universal.ts       # Universal functions (auto-detect runtime)
├── auth.types.ts           # TypeScript type definitions
├── edge-runtime-config.ts  # Configuration and utilities
└── auth/
    └── index.ts            # Centralized exports (optional)
```

## Files Overview

### `auth.ts` - Node.js Runtime

- **Purpose**: Traditional Node.js authentication functions
- **Dependencies**: `bcryptjs`, `jsonwebtoken`, `next/headers`
- **Functions**:
  - `hashPassword()` - Password hashing with bcrypt
  - `verifyPassword()` - Password verification with bcrypt
  - `generateToken()` - JWT token generation
  - `verifyToken()` - JWT token verification
  - `getCurrentUser()` - Get current user from cookies

### `auth-edge.ts` - Edge Runtime

- **Purpose**: Edge Runtime compatible authentication functions
- **Dependencies**: Web Crypto API only (no external libraries)
- **Functions**:
  - `verifyTokenEdge()` - Secure JWT verification with signature validation
  - `hashPasswordEdge()` - Password hashing with Web Crypto API
  - `verifyPasswordEdge()` - Password verification with Web Crypto API
  - `generateTokenEdge()` - JWT token generation with Web Crypto API
  - `verifyTokenEdgeSimple()` - Simple token verification (backward compatibility)
  - `isEdgeRuntime()` - Runtime environment detection

### `auth-universal.ts` - Universal Functions

- **Purpose**: Functions that work in both environments
- **Dependencies**: Imports from both `auth.ts` and `auth-edge.ts`
- **Functions**:
  - `verifyTokenUniversal()` - Auto-detects runtime and uses appropriate function
  - `hashPasswordUniversal()` - Auto-detects runtime and uses appropriate function
  - `verifyPasswordUniversal()` - Auto-detects runtime and uses appropriate function
  - `generateTokenUniversal()` - Auto-detects runtime and uses appropriate function

## Usage Examples

### For Middleware (Edge Runtime)

```typescript
import { verifyTokenEdge } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const decoded = await verifyTokenEdge(token);
  // ...
}
```

### For API Routes (Node.js Runtime)

```typescript
import { verifyToken, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();
  const hash = await hashPassword(password);
  // ...
}
```

### For Universal Code

```typescript
import {
  verifyTokenUniversal,
  hashPasswordUniversal,
} from "@/lib/auth-universal";

// Works in both Edge Runtime and Node.js
const decoded = await verifyTokenUniversal(token);
const hash = await hashPasswordUniversal(password);
```

### Using the Index File (Optional)

```typescript
// Import everything from one place
import {
  verifyToken, // Node.js
  verifyTokenEdge, // Edge Runtime
  verifyTokenUniversal, // Universal
  isEdgeRuntime, // Utility
} from "@/lib/auth";
```

## Migration Guide

### From Original `auth.ts`

The original functions remain unchanged:

- `verifyToken()` - Still works the same
- `hashPassword()` - Still works the same
- `verifyPassword()` - Still works the same
- `getCurrentUser()` - Still works the same

### For Edge Runtime

Replace imports in middleware:

```typescript
// Before
import { verifyTokenEdge } from "@/lib/auth";

// After
import { verifyTokenEdge } from "@/lib/auth-edge";
```

### For Universal Code

```typescript
// Before (Node.js only)
import { verifyToken } from "@/lib/auth";
const decoded = verifyToken(token);

// After (Universal)
import { verifyTokenUniversal } from "@/lib/auth-universal";
const decoded = await verifyTokenUniversal(token);
```

## Benefits

1. **Separation of Concerns**: Clear distinction between runtime environments
2. **Better Tree Shaking**: Only import what you need
3. **Easier Maintenance**: Edge and Node.js code are separate
4. **Backward Compatibility**: Existing code continues to work
5. **Type Safety**: Better TypeScript support with dedicated types
6. **Performance**: Edge Runtime functions are optimized for cold starts

## Security Notes

- Edge Runtime functions provide the same security level as Node.js functions
- JWT signature verification is properly implemented in Edge Runtime
- Password hashing uses secure methods in both environments
- All functions use constant-time comparisons where appropriate
