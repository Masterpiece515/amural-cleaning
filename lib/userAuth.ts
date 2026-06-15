import crypto from "crypto";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "amural-secret-2024";
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    const check = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), check);
  } catch {
    return false;
  }
}

export function createUserToken(userId: string): string {
  const payload = `${userId}:${Date.now()}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyUserToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    if (parts.length < 3) return null;
    const sig = parts[parts.length - 1];
    const payload = parts.slice(0, -1).join(":");
    const expected = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return null;
    return parts[0];
  } catch {
    return null;
  }
}

export const USER_COOKIE = "amural_user";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
