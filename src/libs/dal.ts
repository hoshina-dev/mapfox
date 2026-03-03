import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";

import { decrypt, type SessionPayload } from "./session";

export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    return null;
  }

  return session;
});
