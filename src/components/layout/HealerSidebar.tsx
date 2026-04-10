"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
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
import { SITE_NAME_SHORT } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function HealerSidebar() {
  const t = useTranslations("HealerSidebar");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingBookings, setPendingBookings] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/healer", label: t("home"), icon: <LayoutDashboard size={20} />, badge: null },
    { href: "/healer/bookings", label: t("myBookings"), icon: <CalendarCheck size={20} />, badge: "bookings" },
    { href: "/healer/profile", label: t("myProfile"), icon: <User size={20} />, badge: null },
  ];

  useEffect(() => {
    const supabase = createClient();
    
    const fetchPendingBookings = async () => {
      // Get the current healer's user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // Get healer record
      const { data: healer } = await supabase
        .from("healers")
        .select("id")
        .eq("profile_id", user.id)
        .single();
      
      if (!healer) return;

      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("healer_id", healer.id)
        .in("status", ["pending", "confirmed"]);
      
      setPendingBookings(count || 0);
    };

    fetchPendingBookings();

    const channel = supabase
      .channel("healer_bookings_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        fetchPendingBookings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Clear badge when viewing bookings
  useEffect(() => {
    if (pathname.includes("/healer/bookings")) {
      setPendingBookings(0);
    }
  }, [pathname]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <Image src="/logo.png" alt="Logo" width={44} height={44} className="w-11 h-11 rounded-full flex-shrink-0" />
        <div>
          <h2 className="text-sm font-bold text-white">{t("panelTitle")}</h2>
          <p className="text-[10px] text-gray-400">{SITE_NAME_SHORT}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive =
            link.href === "/healer"
              ? pathname === "/healer" || pathname.match(/^\/[a-z]{2}\/healer$/)
              : pathname.includes(link.href);
          const badgeCount = link.badge === "bookings" ? pendingBookings : 0;
          return (
            <Link
              key={link.href}
              href={link.href as any}
              onClick={() => setIsMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive ? "bg-white/15 text-white shadow-sm" : "text-gray-300 hover:bg-white/8 hover:text-white"}
              `}
            >
              <div className="relative flex-shrink-0">
                {link.icon}
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -end-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-primary-dark"></span>
                )}
              </div>
              <span>{link.label}</span>
              {badgeCount > 0 && (
                <span className="ms-auto bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {badgeCount}
                </span>
              )}
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
          <span>{t("viewSite")}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut size={20} />
          <span>{t("logout")}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 start-4 z-40 lg:hidden p-2.5 rounded-lg bg-primary-dark text-white shadow-lg"
        aria-label={t("openMenu")}
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
          fixed top-0 start-0 z-50 h-full w-64 bg-primary-dark
          transform transition-transform duration-300 lg:hidden
          ${isMobileOpen ? "translate-x-0" : "rtl:translate-x-full ltr:-translate-x-full"}
        `}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 end-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          aria-label={t("closeMenu")}
        >
          <X size={20} />
        </button>
        {renderSidebarContent()}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 start-0 h-full w-64 bg-primary-dark z-30">
        {renderSidebarContent()}
      </aside>
    </>
  );
}
