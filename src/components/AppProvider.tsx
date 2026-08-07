"use client";
import { useTorchManager } from "@/hooks/useTorchManager";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  useTorchManager();
  return <>{children}</>;
}
