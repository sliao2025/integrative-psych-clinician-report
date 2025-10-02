"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Garden from "@/app/components/Garden/Garden";
import logo from "@/assets/IP_Logo.png";
import { intPsychTheme } from "@/app/components/theme";
import { Roboto, DM_Serif_Text } from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

export default function LoginPage() {
  return (
    <main className="relative min-h-dvh grid justify-center overflow-hidden">
      {/* Background visuals */}
      <Garden bloom={0.6} />

      {/* Centered modal card */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-2xl px-4"
        style={{ marginTop: "30vh" }}
      >
        <div className="rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-md">
          <div className="p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Image
                src={logo}
                alt="Integrative Psych Logo"
                width={100}
                height={100}
                className="object-contain"
              />
              <div>
                <h1
                  className={`${dm_serif.className} text-3xl font-semibold tracking-tight text-slate-700`}
                >
                  Integrative Psych Clinician Portal
                </h1>
                <p className="text-sm text-gray-500">
                  Sign in with your @psych-nyc.com Google account
                </p>
              </div>
            </div>

            <button
              onClick={() => signIn("google", { callbackUrl: "/search" })}
              className="w-full cursor-pointer inline-flex items-center justify-center gap-3 rounded-full px-5 py-3 font-medium text-white transition-all duration-200"
              style={{
                background: `linear-gradient(0deg, ${intPsychTheme.primary}, ${intPsychTheme.accent})`,
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                transition: `transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.2s`,
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1.01)";
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "";
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 533.5 544.3"
                aria-hidden="true"
                className="shrink-0"
              >
                <path
                  fill="#4285F4"
                  d="M533.5 278.4c0-18.5-1.7-36.3-5-53.3H272v100.9h146.9c-6.3 34-25 62.8-53.3 82v68.2h86.2c50.4-46.5 81.7-115 81.7-197.8z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c73.9 0 135.9-24.5 181.2-66.4l-86.2-68.2c-23.9 16.1-54.6 25.7-95 25.7-72.9 0-134.7-49.2-156.7-115.3H26.7v72.5C71.7 486.7 165.7 544.3 272 544.3z"
                />
                <path
                  fill="#FBBC05"
                  d="M115.3 320.1c-10.6-31.8-10.6-66.3 0-98.1V149.5H26.7c-38.6 77.1-38.6 168.3 0 245.4l88.6-74.8z"
                />
                <path
                  fill="#EA4335"
                  d="M272 107.7c39.9-.6 78.2 14 107.5 40.9l80.2-80.2C409.6 25.8 344.4-.1 272 0 165.7 0 71.7 57.6 26.7 149.5l88.6 72.5C137.3 156.9 199.1 107.7 272 107.7z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <p className="mt-4 text-xs text-gray-500 text-center">
              By continuing, you agree to our Privacy Policy and Terms.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
