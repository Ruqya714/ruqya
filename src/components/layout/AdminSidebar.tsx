"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ADMIN_NAV_LINKS, SITE_NAME_SHORT } from "@/lib/constants";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  CalendarCheck: <CalendarCheck size={20} />,
  Clock: <Clock size={20} />,
  Users: <Users size={20} />,
  Briefcase: <Briefcase size={20} />,
  FileText: <FileText size={20} />,
  MessageSquare: <MessageSquare size={20} />,
  HelpCircle: <HelpCircle size={20} />,
  Settings: <Settings size={20} />,
};

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
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
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h2 className="text-sm font-bold text-white truncate">
              لوحة التحكم
            </h2>
            <p className="text-[10px] text-gray-400 truncate">
              {SITE_NAME_SHORT}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              title={isCollapsed ? link.label : undefined}
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
              {!isCollapsed && <span>{link.label}</span>}
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
          {!isCollapsed && <span>عرض الموقع</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>تسجيل الخروج</span>}
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
      <aside
        className={`
          hidden lg:block fixed top-0 right-0 h-full bg-primary-dark z-30
          transition-all duration-300
          ${isCollapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {renderSidebarContent()}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -left-3 top-20 w-6 h-6 rounded-full bg-primary-dark border-2 border-bg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          aria-label={isCollapsed ? "توسيع" : "تصغير"}
        >
          <ChevronLeft
            size={12}
            className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </aside>
    </>
  );
}
