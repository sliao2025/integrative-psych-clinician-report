// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedPrefixes = ["/clinician"];

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const guest = req.cookies.get("guest")?.value === "1";

  // Handle the root path explicitly
  if (pathname === "/") {
    const url = new URL("/auth/signin", req.url);
    // if (!(token || guest)) url.searchParams.set("callbackUrl", "/intake");
    // const resp = NextResponse.redirect(url);
    // if (token && guest) {
    //   resp.cookies.set("guest", "", { path: "/", maxAge: 0 });
    //   resp.cookies.delete("guest");
    // }
    const resp = NextResponse.redirect(url);
    return resp;
  }

  // Guard protected areas
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected && !token && !guest) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", `${pathname}${search || ""}`);
    const resp = NextResponse.redirect(signInUrl);
    if (token && guest) {
      resp.cookies.set("guest", "", { path: "/", maxAge: 0 });
      resp.cookies.delete("guest");
    }
    return resp;
  }

  const resp = NextResponse.next();
  if (guest) {
    resp.cookies.set("guest", "", { path: "/", maxAge: 0 });
    resp.cookies.delete("guest");
  }
  return resp;
}

export const config = {
  matcher: ["/", "/intake/:path*", "/sessions/:path*"],
};
