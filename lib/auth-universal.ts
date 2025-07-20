// Universal Authentication Functions
// This file provides functions that work in both Node.js and Edge Runtime environments

import {
  verifyToken,
  hashPassword,
  verifyPassword,
  generateToken,
  getCurrentUser,
} from "./auth";

import {
  verifyTokenEdge,
  hashPasswordEdge,
  verifyPasswordEdge,
  generateTokenEdge,
  isEdgeRuntime,
} from "./auth-edge";

// Universal token verification (works in both Node.js and Edge Runtime)
export async function verifyTokenUniversal(token: string): Promise<any> {
  if (isEdgeRuntime()) {
    return verifyTokenEdge(token);
  } else {
    return verifyToken(token);
  }
}

// Universal password hashing (works in both Node.js and Edge Runtime)
export async function hashPasswordUniversal(password: string): Promise<string> {
  if (isEdgeRuntime()) {
    return hashPasswordEdge(password);
  } else {
    return hashPassword(password);
  }
}

// Universal password verification (works in both Node.js and Edge Runtime)
export async function verifyPasswordUniversal(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (isEdgeRuntime()) {
    return verifyPasswordEdge(password, hashedPassword);
  } else {
    return verifyPassword(password, hashedPassword);
  }
}

// Universal token generation (works in both Node.js and Edge Runtime)
export async function generateTokenUniversal(payload: any): Promise<string> {
  if (isEdgeRuntime()) {
    return generateTokenEdge(payload);
  } else {
    return generateToken(payload);
  }
}

// Re-export utility functions
export { isEdgeRuntime } from "./auth-edge";

// Re-export Node.js functions
export {
  verifyToken,
  hashPassword,
  verifyPassword,
  generateToken,
  getCurrentUser,
} from "./auth";

// Re-export Edge functions
export {
  verifyTokenEdge,
  hashPasswordEdge,
  verifyPasswordEdge,
  generateTokenEdge,
  verifyTokenEdgeSimple,
} from "./auth-edge";
