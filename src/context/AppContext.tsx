import { createContext, useContext, useState, type ReactNode } from "react";
import type { CareerAnalysis, StudentProfile } from "../types";

interface AppContextType {
  profile: StudentProfile | null;
  setProfile: (p: StudentProfile | null) => void;
  analysis: CareerAnalysis | null;
  setAnalysis: (a: CareerAnalysis | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);

  return (
    <AppContext.Provider value={{ profile, setProfile, analysis, setAnalysis }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
