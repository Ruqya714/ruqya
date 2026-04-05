"use client";

import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_NAME_SHORT } from "@/lib/constants";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");

  const navLinks = [
    { href: "/", key: "home" as const },
    { href: "/about", key: "about" as const },
    { href: "/services", key: "services" as const },
    { href: "/treatment-journey", key: "journey" as const },
    { href: "/blog", key: "blog" as const },
    { href: "/faq", key: "faq" as const },
    { href: "/contact", key: "contact" as const },
  ];

  return (
    <footer className="bg-teal-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="Logo" width={56} height={56} className="w-14 h-14 rounded-full" />
              <h3 className="font-bold text-lg">{SITE_NAME_SHORT}</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{t("aboutDesc")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-base mb-4 text-accent">{t("quickLinks")}</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href as any} className="text-sm text-gray-300 hover:text-white transition-colors duration-200">
                    {nav(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-base mb-4 text-accent">{t("ourServices")}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">{t("svcConsult")}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">{t("svcDiagnosis")}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">{t("svcSupervised")}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-300 hover:text-white transition-colors">{t("svcCourses")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4 text-accent">{t("contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-gray-300" dir="ltr">+90 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-gray-300">info@ruqyah-center.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{t("location")}</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">{t("basmala")}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">{t("privacyPolicy")}</Link>
            <Link href="/terms-of-service" className="text-sm text-gray-400 hover:text-white transition-colors">{t("termsOfService")}</Link>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {SITE_NAME_SHORT}. {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
