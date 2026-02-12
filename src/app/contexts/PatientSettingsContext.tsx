"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface PatientSettings {
  journalEnabled: boolean;
  scalesEnabled: boolean;
}

interface PatientSettingsContextType {
  settings: PatientSettings;
  toggleSetting: (key: "journalEnabled" | "scalesEnabled") => Promise<void>;
}

const PatientSettingsContext = createContext<PatientSettingsContextType>({
  settings: { journalEnabled: false, scalesEnabled: false },
  toggleSetting: async () => {},
});

export function usePatientSettings() {
  return useContext(PatientSettingsContext);
}

export function PatientSettingsProvider({
  patientId,
  children,
}: {
  patientId: string;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<PatientSettings>({
    journalEnabled: false,
    scalesEnabled: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/clinician/settings/${patientId}`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    if (patientId) fetchSettings();
  }, [patientId]);

  const toggleSetting = async (key: "journalEnabled" | "scalesEnabled") => {
    const newValue = !settings[key];
    setSettings((prev) => ({ ...prev, [key]: newValue }));
    try {
      await fetch(`/api/clinician/settings/${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: newValue }),
      });
    } catch (err) {
      // Revert on failure
      setSettings((prev) => ({ ...prev, [key]: !newValue }));
      console.error("Failed to update setting:", err);
    }
  };

  return (
    <PatientSettingsContext.Provider value={{ settings, toggleSetting }}>
      {children}
    </PatientSettingsContext.Provider>
  );
}
