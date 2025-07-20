// Edge Runtime Authentication Functions
// This file contains authentication functions optimized for Edge Runtime environments
// such as Next.js middleware and Edge API routes

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Utility function to detect Edge Runtime
export function isEdgeRuntime(): boolean {
  return (
    typeof process === "undefined" ||
    process.env.NEXT_RUNTIME === "edge" ||
    (typeof globalThis !== "undefined" && "EdgeRuntime" in globalThis)
  );
}

// Edge-compatible JWT verification using Web Crypto API
export async function verifyTokenEdge(token: string): Promise<any> {
  try {
    const [header, payload, signature] = token.split(".");

    if (!header || !payload || !signature) {
      return null;
    }

    // Decode header and payload
    const decodedHeader = JSON.parse(atob(header));
    const decodedPayload = JSON.parse(atob(payload));

    // Check if algorithm is supported (HS256)
    if (decodedHeader.alg !== "HS256") {
      return null;
    }

    // Check expiration
    if (
      decodedPayload.exp &&
      decodedPayload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    // Create signature verification data
    const signingInput = `${header}.${payload}`;
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(JWT_SECRET);

    // Import the secret key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      secretKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    // Create expected signature
    const expectedSignatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(signingInput)
    );

    // Convert to base64url
    const expectedSignatureArray = Array.from(
      new Uint8Array(expectedSignatureBuffer)
    );
    const expectedSignature = btoa(
      String.fromCharCode.apply(null, expectedSignatureArray)
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    // Compare signatures
    if (signature !== expectedSignature) {
      return null;
    }

    return decodedPayload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

// Edge-compatible password hashing using Web Crypto API
export async function hashPasswordEdge(password: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Generate random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));

    // Create password buffer with salt
    const passwordWithSalt = new Uint8Array(data.length + salt.length);
    passwordWithSalt.set(data);
    passwordWithSalt.set(salt, data.length);

    // Hash using SHA-256 (multiple rounds for security)
    let hash = await crypto.subtle.digest("SHA-256", passwordWithSalt);

    // Apply multiple rounds of hashing (similar to bcrypt rounds)
    for (let i = 0; i < 12; i++) {
      const hashArray = new Uint8Array(hash);
      const saltedHash = new Uint8Array(hashArray.length + salt.length);
      saltedHash.set(hashArray);
      saltedHash.set(salt, hashArray.length);
      hash = await crypto.subtle.digest("SHA-256", saltedHash);
    }

    // Combine salt and hash for storage
    const result = new Uint8Array(salt.length + hash.byteLength);
    result.set(salt);
    result.set(new Uint8Array(hash), salt.length);

    // Convert to base64 for storage
    const resultArray = Array.from(result);
    return btoa(String.fromCharCode.apply(null, resultArray));
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

// Edge-compatible password verification
export async function verifyPasswordEdge(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Decode the stored hash
    const stored = new Uint8Array(
      atob(hashedPassword)
        .split("")
        .map((char) => char.charCodeAt(0))
    );

    // Extract salt (first 16 bytes) and hash (rest)
    const salt = stored.slice(0, 16);
    const storedHash = stored.slice(16);

    // Create password buffer with salt
    const passwordWithSalt = new Uint8Array(data.length + salt.length);
    passwordWithSalt.set(data);
    passwordWithSalt.set(salt, data.length);

    // Hash using the same process
    let hash = await crypto.subtle.digest("SHA-256", passwordWithSalt);

    // Apply multiple rounds of hashing
    for (let i = 0; i < 12; i++) {
      const hashArray = new Uint8Array(hash);
      const saltedHash = new Uint8Array(hashArray.length + salt.length);
      saltedHash.set(hashArray);
      saltedHash.set(salt, hashArray.length);
      hash = await crypto.subtle.digest("SHA-256", saltedHash);
    }

    const computedHash = new Uint8Array(hash);

    // Compare hashes in constant time
    if (computedHash.length !== storedHash.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedHash.length; i++) {
      result |= computedHash[i] ^ storedHash[i];
    }

    return result === 0;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

// Simple token verification for Edge Runtime (less secure, for backward compatibility)
export async function verifyTokenEdgeSimple(token: string): Promise<any> {
  try {
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

// Generate JWT token for Edge Runtime (using Web Crypto API)
export async function generateTokenEdge(payload: any): Promise<string> {
  try {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + 7 * 24 * 60 * 60, // 7 days
    };

    // Encode header and payload
    const encodedHeader = btoa(JSON.stringify(header))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const encodedPayload = btoa(JSON.stringify(tokenPayload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    // Create signature
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(JWT_SECRET);

    // Import the secret key for HMAC
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      secretKey,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    // Create signature
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(signingInput)
    );

    // Convert signature to base64url
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signature = btoa(String.fromCharCode.apply(null, signatureArray))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  } catch (error) {
    console.error("Token generation error:", error);
    throw new Error("Failed to generate token");
  }
}
