import { jwtVerify } from "jose";

import type { SessionPayload } from "./definitions";

const secretKey = process.env.SESSION_SECRET || process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function decryptSession(
  session: string | undefined = "",
): Promise<SessionPayload | undefined> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return {
      ...payload,
      expiresAt: new Date(payload.expiresAt as string),
    } as unknown as SessionPayload;
  } catch {
    return undefined;
  }
}
