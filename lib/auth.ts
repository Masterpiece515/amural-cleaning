import { createHmac } from "crypto";

export const COOKIE_NAME = "amural_admin";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function createToken(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHmac("sha256", "amural-cleaning-admin-v1").update(`admin:${password}`).digest("hex");
}

export function verifyToken(token: string | undefined): boolean {
  return !!token && token === createToken();
}
