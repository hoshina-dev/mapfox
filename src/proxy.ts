import { NextRequest, NextResponse } from "next/server";

import { decryptSession } from "@/libs/sessionCrypto";

export default async function proxy(req: NextRequest) {
  // Check session cookie
  const session = req.cookies.get("session")?.value;
  const payload = await decryptSession(session);

  // Redirect authenticated users away from auth pages
  const isAuthPage =
    req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup";

  if (isAuthPage && payload?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // Refresh session expiry on every request if session exists
  if (payload?.userId) {
    const res = NextResponse.next();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    res.cookies.set("session", session!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
