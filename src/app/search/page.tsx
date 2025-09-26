"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import Garden from "@/app/components/Garden/Garden";
import logo from "@/assets/IP_Logo.png";
import { intPsychTheme } from "@/app/components/theme";
import { Roboto, DM_Serif_Text } from "next/font/google";
import { useState } from "react";
import { Search } from "lucide-react";
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context";
import { useRouter } from "next/navigation";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700"] });
const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });

export default function ClinicianHome() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const name = session?.user?.name ?? "Clinician";
  const email = session?.user?.email ?? "";

  const [patientFirstname, setPatientFirstname] = useState("");
  const [patientLastname, setPatientLastname] = useState("");

  const searchPatient = async () => {
    try {
      const full = `${patientFirstname} ${patientLastname}`
        .replace(/\s+/g, " ")
        .trim();
      if (!full) {
        console.warn("Please enter a first and/or last name.");
        return;
      }
      const qs = new URLSearchParams({ name: full }).toString();
      const url = `/api/clinician/patients?${qs}`;
      const r = await fetch(url, { method: "GET", cache: "no-store" });
      if (!r.ok) {
        const msg = await r.text();
        throw new Error(`${r.status} ${msg}`);
      }
      const data = await r.json();
      console.log("[searchPatient] received patient data", data);
      router.push(`/report/${data.patient.id}`);
    } catch (error) {
      console.error("Error searching patient:", error);
    }
  };
  return (
    <main className="relative min-h-dvh grid justify-center overflow-hidden">
      {/* Background visuals */}
      <Garden bloom={40} />

      {/* Centered modal card */}
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-3xl px-4"
        style={{ marginTop: "30vh" }}
      >
        <div className="rounded-3xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-md">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={logo}
                alt="Integrative Psych Logo"
                width={80}
                height={80}
                className="object-contain"
              />
              <div>
                <h1
                  className={`${dm_serif.className} text-3xl font-semibold tracking-tight text-slate-700`}
                >
                  {`Welcome, ${name.split(" ")[0]}`}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Integrative Psych Clinician Report{" "}
                </p>
              </div>
            </div>

            {/* Search module (no submit handler as requested) */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-700">
                Search Patient
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Patient First Name"
                  className="w-lg flex-1 rounded-xl border border-gray-300 bg-white/70 backdrop-blur px-3 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  style={{
                    boxShadow: undefined,
                  }}
                  value={patientFirstname}
                  onChange={(e) => setPatientFirstname(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 1.5px ${intPsychTheme.secondary}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "";
                  }}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Patient Last Name"
                  className="w-lg flex-1 rounded-xl border border-gray-300 bg-white/70 backdrop-blur px-3 py-2 text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  style={{
                    boxShadow: undefined,
                  }}
                  value={patientLastname}
                  onChange={(e) => setPatientLastname(e.target.value)}
                  onFocus={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 0 1.5px ${intPsychTheme.secondary}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.boxShadow = "";
                  }}
                />
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-medium text-white transition-all duration-200 cursor-pointer"
                  style={{
                    background: `linear-gradient(0deg, ${intPsychTheme.primary}, ${intPsychTheme.accent})`,
                    boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08)",
                    transition:
                      "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), filter 0.2s",
                  }}
                  onMouseOver={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "scale(1.04)";
                  }}
                  onMouseOut={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "";
                  }}
                  onClick={searchPatient}
                >
                  <Search />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Tip: The input is sensitive to typos, but not case.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
