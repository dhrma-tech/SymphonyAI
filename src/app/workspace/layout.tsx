import { WorkspaceProvider } from "@/lib/context/WorkspaceContext";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WorkspaceProvider>
      {children}
    </WorkspaceProvider>
  );
}
