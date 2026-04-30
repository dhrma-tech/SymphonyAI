"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

export type WorkflowStage = 1 | 2 | 3 | 4 | 5; // Describe -> Questions -> Synopsis -> Design -> Phases

interface Project {
  id: string;
  title: string;
  idea: string;
  synopsis: string;
  features: string; // JSON string
  design: string; // JSON string
  phases: string; // JSON string
  activeStage: WorkflowStage;
  status: string;
  updatedAt: string;
}

interface WorkspaceContextType {
  history: Project[];
  currentProject: Project | null;
  activeStage: WorkflowStage;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setActiveStage: (stage: WorkflowStage) => void;
  setCurrentProject: (project: Project | null) => void;
  saveProject: (data: Partial<Project>) => Promise<void>;
  resetWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [history, setHistory] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [activeStage, setActiveStage] = useState<WorkflowStage>(1);

  const fetchHistory = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/workspace");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  }, [session]);

  useEffect(() => {
    void Promise.resolve().then(fetchHistory);
  }, [fetchHistory]);

  const saveProject = async (data: Partial<Project>) => {
    if (!session) return;
    
    const body = {
      ...currentProject,
      ...data,
      activeStage: data.activeStage || activeStage
    };

    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const saved = await res.json();
        setCurrentProject(saved);
        fetchHistory();
      }
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const resetWorkspace = () => {
    setCurrentProject(null);
    setActiveStage(1);
  };

  return (
    <WorkspaceContext.Provider value={{ 
      history, 
      currentProject, 
      activeStage,
      isSidebarOpen,
      setSidebarOpen,
      setActiveStage,
      setCurrentProject,
      saveProject,
      resetWorkspace
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
