"use client";

import { useState, useEffect, useRef } from "react";
import { Link, usePathname } from "@/i18n/routing";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  // Map href to translation keys
  const getNavKey = (href: string) => {
    switch(href) {
      case "/": return "home";
      case "/about": return "about";
      case "/services": return "services";
      case "/courses": return "courses";
      case "/treatment-journey": return "journey";
      case "/blog": return "blog";
      case "/faq": return "faq";
      case "/contact": return "contact";
      default: return "home";
    }
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="مركز الرقية بكلام الرحمن"
              width={64}
              height={64}
              className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-md"
              priority
            />
            <div className="hidden sm:block">
              <h1 className="text-sm lg:text-base font-bold text-primary-dark leading-tight">
                مركز الرقية بكلام الرحمن
              </h1>
              <p className="text-xs text-text-secondary">
                لرد كيد الشيطان
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`/tr${link.href !== '/' ? link.href : 'never'}`);
              return (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-text-secondary hover:text-primary hover:bg-primary/5"
                    }
                  `}
                >
                  {t(getNavKey(link.href))}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            {/* Language Switcher (Disabled temporarily for client review) */}
            {/* <div className="flex gap-1 text-xs font-bold items-center border border-border p-1 rounded-lg">
              <Link href={pathname as any} locale="ar" className={`px-2 py-1 rounded-md text-text-secondary hover:bg-gray-100`}>AR</Link>
              <Link href={pathname as any} locale="tr" className={`px-2 py-1 rounded-md text-text-secondary hover:bg-gray-100`}>TR</Link>
            </div> */}

            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-all duration-200 shadow-sm"
            >
              <Phone size={16} />
              {t("booking")}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
              aria-label="القائمة"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden border-t border-border bg-white transition-all duration-300 overflow-hidden ${
          isMenuOpen ? "max-h-[600px] opacity-100 shadow-xl" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-6 space-y-2 max-h-[80vh] overflow-y-auto">
          {PUBLIC_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`/tr${link.href !== '/' ? link.href : 'never'}`);
            return (
              <Link
                key={link.href}
                href={link.href as any}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "text-primary bg-primary/5 border border-primary/10"
                      : "text-text-secondary hover:text-primary hover:bg-primary/5"
                  }
                `}
              >
                {t(getNavKey(link.href))}
              </Link>
            );
          })}
          <div className="pt-4 mt-2 border-t border-gray-100">
            <Link
              href="/booking"
              onClick={() => setIsMenuOpen(false)}
              className="flex justify-center items-center gap-2 w-full px-4 py-3.5 rounded-lg bg-accent text-white text-sm font-bold text-center hover:bg-accent-light hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Phone size={18} />
              {t("booking")}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
