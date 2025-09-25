import "./globals.css";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import type { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Clinician Portal — Integrative Psych",
  description:
    "Secure access to patient reports for Integrative Psych clinicians.",
};

/**
 * Root layout runs on the server. We resolve the session here using `auth()`.
 * - No adapter/db writes are used; this is a JWT-only session.
 * - `session` is available for server components down the tree.
 * - If you later need `useSession()` in client components, add a small
 *   <SessionProvider> wrapper at the root (can be added without changing this file).
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Optional: pull a couple of safe flags for styling/telemetry.
  const isAuthed = Boolean(session?.user?.email?.endsWith?.("@psych-nyc.com"));
  const email = session?.user?.email ?? "";

  return (
    <html
      lang="en"
      data-auth={isAuthed ? "true" : "false"}
      data-user-email={email}
      className="h-full"
    >
      <body
        style={{
          background:
            "linear-gradient(to top, rgba(7, 255, 36, 0.3), rgba(150, 236, 178, 0.15), rgba(255, 255, 255, 1))",
        }}
        className="min-h-dvh  text-[color:var(--foreground)] antialiased"
      >
        {/* 
          If you want a global background layer or safe-area spacer, add it here.
          Keep children wrapped so pages can control their own scroll/overflow.
        */}
        <div id="app-root" className="relative min-h-dvh">
          <Providers session={session}>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
