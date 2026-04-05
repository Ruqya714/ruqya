"use client";

import HealerSidebar from "@/components/layout/HealerSidebar";
import { ToastProvider } from "@/components/ui/Toast";

export default function HealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg">
        <HealerSidebar />
        <main className="lg:ms-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
