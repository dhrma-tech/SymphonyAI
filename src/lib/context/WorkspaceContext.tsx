"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface WorkspaceContextType {
  isFocusMode: boolean;
  setFocusMode: (mode: boolean) => void;
  activePhase: number;
  setActivePhase: (phase: number) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setFocusMode] = useState(false);
  const [activePhase, setActivePhase] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Keyboard shortcut for Focus Mode: Cmd + .
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "." && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setFocusMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <WorkspaceContext.Provider value={{
      isFocusMode,
      setFocusMode,
      activePhase,
      setActivePhase,
      isSidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
