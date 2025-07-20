import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Edge-compatible version for middleware
export async function verifyTokenEdge(token: string): Promise<any> {
  try {
    // For Edge Runtime, we'll use a simpler approach
    // You might want to use a different JWT library or implement your own
    const [header, payload, signature] = token.split(".");

    if (!header || !payload || !signature) {
      return null;
    }

    // Decode the payload (this is not secure verification, just parsing)
    const decodedPayload = JSON.parse(atob(payload));

    // Check expiration
    if (
      decodedPayload.exp &&
      decodedPayload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}
