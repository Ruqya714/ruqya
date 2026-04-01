"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { PUBLIC_NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
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
              <p className="text-[10px] lg:text-xs text-text-secondary">
                لرد كيد الشيطان
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "text-primary bg-primary/5"
                        : "text-text-secondary hover:text-primary hover:bg-primary/5"
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile menu */}
          <div className="flex items-center gap-3">
            <Link
              href="/booking"
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-light transition-all duration-200 shadow-sm"
            >
              <Phone size={16} />
              سجّل حالتك
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
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
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
                {link.label}
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
              سجّل حالتك الآن
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
