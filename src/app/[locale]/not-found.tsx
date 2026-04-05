"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-[#2d6a4f] mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{t("title")}</h1>
        <p className="text-gray-500 mb-8">{t("desc")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2d6a4f] text-white font-medium hover:bg-[#3a7d5f] transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
