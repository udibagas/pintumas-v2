// Authentication Module Index
// This file provides a centralized export for all authentication functions

// Export all Node.js runtime functions
export * from "../auth";

// Export all Edge runtime functions
export * from "../auth-edge";

// Export all universal functions
export * from "../auth-universal";

// Export types
export * from "../auth.types";

// Export configuration
export * from "../edge-runtime-config";

// Default export for backward compatibility
export { verifyTokenEdge } from "../auth-edge";
export {
  verifyToken,
  hashPassword,
  verifyPassword,
  generateToken,
  getCurrentUser,
} from "../auth";
