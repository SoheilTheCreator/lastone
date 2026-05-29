'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardHeader from "./components/DashboardHeader";
import DashboardShell from "./components/DashboardShell";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { auth, isReady } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<string>("home");

  useEffect(() => {
    if (!isReady) return;

    if (!auth) {
      router.replace("/login");
    }
  }, [auth, isReady, router]);

  // Wait until auth is hydrated from localStorage
  if (!isReady) {
    return null; // or loading spinner
  }

  // After hydration, if still no auth, don't render dashboard
  if (!auth) {
    return null;
  }

  return (
    <main className="flex flex-col">
      <DashboardHeader handleTab={setActiveTab} />
      <DashboardShell activeTab={activeTab} />
    </main>
  );
}
