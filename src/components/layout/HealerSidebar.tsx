"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { HEALER_NAV_LINKS, SITE_NAME_SHORT } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  CalendarCheck: <CalendarCheck size={20} />,
  User: <User size={20} />,
};

export default function HealerSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <Image src="/logo.png" alt="مركز الرقية" width={44} height={44} className="w-11 h-11 rounded-full flex-shrink-0" />
        <div>
          <h2 className="text-sm font-bold text-white">لوحة المعالج</h2>
          <p className="text-[10px] text-gray-400">{SITE_NAME_SHORT}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {HEALER_NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/healer"
              ? pathname === "/healer"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-gray-300 hover:bg-white/8 hover:text-white"
                }
              `}
            >
              <span className="flex-shrink-0">{iconMap[link.icon]}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-white/8 hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
          <span>عرض الموقع</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 right-4 z-40 lg:hidden p-2.5 rounded-lg bg-primary-dark text-white shadow-lg"
        aria-label="فتح القائمة"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-64 bg-primary-dark
          transform transition-transform duration-300 lg:hidden
          ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 left-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          aria-label="إغلاق القائمة"
        >
          <X size={20} />
        </button>
        {renderSidebarContent()}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 right-0 h-full w-64 bg-primary-dark z-30">
        {renderSidebarContent()}
      </aside>
    </>
  );
}
