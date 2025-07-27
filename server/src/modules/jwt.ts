import { decode, sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

export async function createToken(payload: JWTPayload): Promise<string> {
  return sign(payload, process.env.JWT_SECRET!);
}

export function verifyToken(token: string): object | null {
  try {
    return verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): object | null {
  try {
    return decode(token);
  } catch (error) {
    return null;
  }
}
