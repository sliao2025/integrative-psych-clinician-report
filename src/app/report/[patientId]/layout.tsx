"use client";

import React, { useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FileText,
  ClipboardList,
  BookOpen,
  ChevronsLeft,
  ChevronsRight,
  Brain,
  Route,
  ChartCandlestick,
} from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { DM_Serif_Text, DM_Sans } from "next/font/google";
import { intPsychTheme } from "@/app/components/theme";
import ReportHeader from "@/app/components/Report/ReportHeader";
import logo from "@/assets/IP_Logo.png";

const dm_serif = DM_Serif_Text({ subsets: ["latin"], weight: ["400"] });
const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function PatientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const pathname = usePathname();
  const { patientId } = React.use(params);
  const { data: session } = useSession();

  // Initialize state from localStorage synchronously to prevent flash
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = window.localStorage.getItem("clinicianSidebarExpanded");
    return saved !== null ? saved === "true" : true;
  });

  const sidebarWidth = isExpanded ? "w-72" : "w-24";
  const toggleIcon = isExpanded ? (
    <ChevronsLeft className="text-white w-5 h-5" />
  ) : (
    <ChevronsRight className="text-white w-5 h-5" />
  );

  const toggleSidebar = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "clinicianSidebarExpanded",
          next ? "true" : "false"
        );
      }
      return next;
    });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "C";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    {
      name: "Intake",
      href: `/report/${patientId}`,
      icon: FileText,
      color: `text-[${intPsychTheme.primary}]`,
    },
    // {
    //   name: "Treatment Plan",
    //   href: `/report/${patientId}/treatment-plan`,
    //   icon: Route,
    //   color: `text-[#f43f5e]`,
    // },
    {
      name: "Assessments",
      href: `/report/${patientId}/assessments`,
      icon: ChartCandlestick,
      color: `text-[${intPsychTheme.accent}]`,
    },
    {
      name: "Journals",
      href: `/report/${patientId}/journals`,
      icon: BookOpen,
      color: `text-[#ffa440]`,
    },
    // {
    //   name: "Learn",
    //   href: `/report/${patientId}/learn`,
    //   icon: Brain,
    //   color: `text-[#f43f5e]`,
    // },
  ];

  const isActive = (href: string) => {
    if (href === `/report/${patientId}`) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <div
      className={`flex h-screen overflow-hidden bg-slate-50 ${dm_sans.className}`}
    >
      {/* Sidebar */}
      <aside
        className={`${sidebarWidth} bg-white border-r-2 border-[#e7e5e4] flex flex-col transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative z-20 `}
      >
        {/* Logo/Title - Header */}
        <div className="relative p-6 flex items-center gap-3 justify-center border-b-2 border-[#e7e5e4]">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-[#e0f2fe] rounded-full transform scale-0 group-hover:scale-110 transition-transform duration-200" />
            <Image
              src={logo}
              alt="Integrative Psych logo"
              className={`relative object-contain transition-all duration-300 ${
                isExpanded ? "h-14 w-14" : "h-10 w-10"
              }`}
            />
          </div>

          {isExpanded && (
            <h1
              className={`${dm_serif.className} text-2xl text-[#1c1917] tracking-tight leading-none`}
              style={{ color: intPsychTheme.primary }}
            >
              Clinician <br /> Portal
            </h1>
          )}

          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="absolute right-[-2px] top-full translate-x-1/2 -translate-y-1/2 bg-[#ffa440] border-[#e7e5e4] p-1.5 rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all z-50 text-white hover:text-white"
            aria-label={isExpanded ? "Shrink sidebar" : "Expand sidebar"}
          >
            {toggleIcon}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 px-4 py-6 space-y-2 scrollbar-hide ${
            isExpanded ? "overflow-y-auto" : "overflow-visible"
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);

            return (
              <div key={tab.href} className="relative group">
                <Link
                  href={tab.href}
                  className={`flex items-center ${
                    isExpanded ? "gap-4 px-4" : "justify-center px-0"
                  } py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden group ${
                    active
                      ? "bg-[#f0f9ff] text-[#113e60] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border-2 border-[#e7e5e4]"
                      : "text-stone-500 hover:bg-stone-100 hover:text-[#113e60] border border-transparent"
                  }`}
                >
                  {/* Active Indicator Pill */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#113e60] rounded-r-full" />
                  )}

                  <Icon
                    className={`w-6 h-6 transition-transform duration-300 group-hover:scale-110 ${
                      active
                        ? tab.color
                        : "text-stone group-hover:text-[#113e60]"
                    }`}
                    strokeWidth={2}
                  />
                  {isExpanded && (
                    <span className="tracking-wide">{tab.name}</span>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div
                    style={{ backgroundColor: intPsychTheme.primary }}
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-4 py-2 text-white text-sm font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999] shadow-xl pointer-events-none"
                  >
                    {tab.name}
                    <div
                      style={{ borderRightColor: intPsychTheme.primary }}
                      className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white"
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t-2 border-[#e7e5e4]">
          <Menu as="div" className="relative">
            <MenuButton
              className={`w-full ${
                isExpanded ? "px-3 py-3" : "justify-center py-2"
              } flex items-center gap-3 rounded-xl hover:bg-[#f5f5f4] border border-transparent hover:border-[#e7e5e4] transition-all group outline-none`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#e0f2fe] border border-[#bae6fd] flex items-center justify-center text-[#0369a1] font-bold text-lg overflow-hidden">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session?.user?.name ?? "Profile"}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    getInitials(session?.user?.name)
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-[#1c1917] truncate">
                    {session?.user?.name || "Clinician"}
                  </p>
                  <p className="text-xs text-stone-500">Clinician</p>
                </div>
              )}
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95 translate-y-2"
              enterTo="transform opacity-100 scale-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100 translate-y-0"
              leaveTo="transform opacity-0 scale-95 translate-y-2"
            >
              <MenuItems
                className={`absolute ${
                  isExpanded
                    ? "left-0 bottom-full mb-4 w-full"
                    : "left-full bottom-0 ml-4 w-56"
                } rounded-xl border border-[#e7e5e4] bg-white shadow-xl focus:outline-none z-[9999] overflow-hidden p-1`}
              >
                <div className="px-4 py-3 bg-[#fafaf9] border-b border-[#e7e5e4] mb-1">
                  <p className="text-xs font-bold text-stone-400 uppercase">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-stone-700 truncate">
                    {session?.user?.email}
                  </p>
                </div>

                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        active ? "bg-red-50 text-red-700" : "text-stone-600"
                      }`}
                    >
                      Log Out
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ReportHeader patientId={patientId} />
        <main
          className="flex-1 overflow-y-auto scroll-smooth"
          style={{ backgroundColor: "#f8fafc" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
