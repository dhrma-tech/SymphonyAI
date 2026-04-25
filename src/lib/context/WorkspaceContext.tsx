"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface Project {
  id: string;
  title: string;
  idea: string;
  synopsis: string;
  activePhase: number;
  status: string;
  updatedAt: string;
}

interface WorkspaceContextType {
  isFocusMode: boolean;
  setFocusMode: (mode: boolean) => void;
  activePhase: number;
  setActivePhase: (phase: number) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  history: Project[];
  setHistory: (history: Project[]) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [isFocusMode, setFocusMode] = useState(false);
  const [activePhase, setActivePhase] = useState(1);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  // Hydrate history from API on load
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch("/api/workspace");
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    }
    fetchHistory();
  }, []);

  return (
    <WorkspaceContext.Provider value={{ 
      isFocusMode, setFocusMode, 
      activePhase, setActivePhase, 
      isSidebarOpen, setSidebarOpen,
      history, setHistory,
      currentProject, setCurrentProject
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
