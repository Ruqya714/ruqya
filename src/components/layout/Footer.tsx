"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { SITE_NAME_SHORT } from "@/lib/constants";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const nav = useTranslations("Navigation");
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadSettings() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        const vals: Record<string, string> = {};
        data.forEach((s) => { vals[s.key] = s.value; });
        setSettings(vals);
      }
    }
    loadSettings();
  }, []);

  const navLinks = [
    { href: "/", key: "home" as const },
    { href: "/about", key: "about" as const },
    { href: "/services", key: "services" as const },
    { href: "/treatment-journey", key: "journey" as const },
    { href: "/blog", key: "blog" as const },
    { href: "/faq", key: "faq" as const },
    { href: "/contact", key: "contact" as const },
  ];

  const ensureHttps = (url: string | undefined | null) => {
    if (!url) return "#";
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

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
              <li><Link href={"/courses" as any} className="text-sm text-gray-300 hover:text-white transition-colors">{t("svcCourses")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-base mb-4 text-accent">{t("contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-gray-300" dir="ltr">{settings.phone || "+90 5XX XXX XXXX"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm text-gray-300">{settings.email || "info@ruqyah-center.com"}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{locale === 'tr' ? t("location") : (settings.address || t("location"))}</span>
              </li>
            </ul>

            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {settings.instagram && (
                <a href={ensureHttps(settings.instagram)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
              )}
              {settings.youtube && (
                <a href={ensureHttps(settings.youtube)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
                </a>
              )}
              {settings.facebook && (
                <a href={ensureHttps(settings.facebook)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {settings.tiktok && (
                <a href={ensureHttps(settings.tiktok)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/></svg>
                </a>
              )}
              {settings.x_twitter && (
                <a href={ensureHttps(settings.x_twitter)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="X">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
                </a>
              )}
              {settings.snapchat && (
                <a href={ensureHttps(settings.snapchat)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Snapchat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11.968 1.488C13.431 1.48 14.88 2.016 16.03 2.909c1.972 1.517 2.656 4.316 2.685 4.542.455.053 1.25.109 1.637.363.387.253.308.775.146 1.05-.184.31-.692.793-1.42 1.353-.162 1.956.12 3.864.814 5.626l.487 1.23c.362.868 1.576 1.164 2.457 1.164h.16V19.34c-1.375.05-3.003.354-4.886 1.565-.547.351-1.226.79-1.928 1.1C14.73 22.648 13.251 22.99 12 23c-1.251-.01-2.73-.352-4.182-.995-.702-.31-1.381-.75-1.928-1.1-1.884-1.21-3.512-1.515-4.887-1.565v-1.103h.161c.88 0 2.094-.296 2.456-1.164L4.108 15.84c.693-1.762.975-3.668.813-5.626-.728-.56-1.236-1.043-1.42-1.352-.162-.275-.241-.798.146-1.05.387-.255 1.182-.31 1.637-.363.03-.226.714-3.025 2.686-4.542C9.118 2.016 10.567 1.48 12.03 1.488ZM9.155 18.257c.502.502 1.341 1.026 2.845 1.026 1.503 0 2.342-.524 2.844-1.026.155-.155.38-.202.576-.118 1.62.68 3.018 1.264 4.148 1.706-.528-.485-1.155-.916-1.83-1.26-1.115-.568-1.487-1.483-1.498-1.513-.153-.352-.572-.497-.931-.322l-.1.05c-.266.136-1.272.585-3.21.585-1.938 0-2.943-.45-3.21-.585 0 0-3.642-1.758-3.053 0-.012.03-.384.945-1.499 1.513-.675.344-1.302.775-1.83 1.26 1.13-.442 2.528-1.026 4.148-1.706.196-.084.421-.037.576.118Z" /></svg>
                </a>
              )}
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
