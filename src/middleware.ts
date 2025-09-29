// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = ["/search", "/report"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const guest = req.cookies.get("guest")?.value === "1";

  // Handle the root path explicitly
  if (pathname === "/") {
    const url = new URL("/auth/signin", req.url);
    const resp = NextResponse.redirect(url);
    return resp;
  }

  // Guard protected areas
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected && !token && !guest) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${search || ""}`);
    const resp = NextResponse.redirect(signInUrl);
    return resp;
  }

  const resp = NextResponse.next();
  return resp;
}

export const config = {
  matcher: ["/", "/search/:path*", "/report/:path*"],
};
