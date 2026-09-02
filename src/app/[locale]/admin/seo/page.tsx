"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { loadAllPagesSeoAction, savePageSeoAction, SavePageSeoInput } from "@/app/actions/cms";
import {
  Search,
  Save,
  Sparkles,
  Layout,
} from "lucide-react";

type LocaleTab = "ar" | "tr";

interface PageRouteInfo {
  path: string;
  nameAr: string;
  nameTr: string;
  defaultTitleAr: string;
  defaultTitleTr: string;
  defaultDescAr: string;
  defaultDescTr: string;
}

const PUBLIC_PAGES: PageRouteInfo[] = [
  {
    path: "/",
    nameAr: "الصفحة الرئيسية",
    nameTr: "Ana Sayfa",
    defaultTitleAr: "مركز الرقية بكلام الرحمن لرد كيد الشيطان",
    defaultTitleTr: "Ruqya Şifa Merkezi - Kur'an ve Sünnet Işığında Tedavi",
    defaultDescAr: "مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم في إسطنبول وجميع أنحاء العالم.",
    defaultDescTr: "Ruqya ve manevi şifa alanında Kur'an ve Sünnet ışığında uzman danışmanlık ve tedavi merkezi.",
  },
  {
    path: "/about",
    nameAr: "من نحن",
    nameTr: "Hakkımızda",
    defaultTitleAr: "من نحن | مركز الرقية بكلام الرحمن",
    defaultTitleTr: "Hakkımızda | Ruqya Şifa Merkezi",
    defaultDescAr: "تعرف على مركز الرقية بكلام الرحمن، رؤيتنا، وخبرائنا المتخصصين في العلاج بالقرآن منذ 2017.",
    defaultDescTr: "Ruqya Center hakkında detaylı bilgi, vizyonumuz ve uzman kadromuz.",
  },
  {
    path: "/services",
    nameAr: "خدماتنا",
    nameTr: "Hizmetlerimiz",
    defaultTitleAr: "خدماتنا العلاجية | مركز الرقية بكلام الرحمن",
    defaultTitleTr: "Hizmetlerimiz | Ruqya Şifa Merkezi",
    defaultDescAr: "استشارات صوتية، تشخيص بالرقية، علاج بإشراف خاص، وكورسات علاجية متخصصة.",
    defaultDescTr: "Manevi danışmanlık, ruqya ile teşhis ve kişiye özel şifa programları.",
  },
  {
    path: "/courses",
    nameAr: "الكورسات والتدريب",
    nameTr: "Kurslarımız",
    defaultTitleAr: "تأهيل ودورات المعالجين | مركز الرقية",
    defaultTitleTr: "Uzman Yetiştirme Kursları | Ruqya Center",
    defaultDescAr: "دورات تدريبية متخصصة في تأهيل الرقاة والمعالجين وفق الكتاب والسنة النبوية.",
    defaultDescTr: "Ruqya ve manevi şifa alanında uzmanlık ve eğitim kursları.",
  },
  {
    path: "/treatment-journey",
    nameAr: "الرحلة العلاجية",
    nameTr: "Şifa Yolculuğu",
    defaultTitleAr: "الرحلة العلاجية | خطوات العلاج والشفاء",
    defaultTitleTr: "Şifa Yolculuğu | Tedavi Adımları",
    defaultDescAr: "تعرف على خطوات ومراحل البرنامج العلاجي في مركز الرقية من التشخيص حتى الشفاء التام والتحصين.",
    defaultDescTr: "İlk başvurudan tam şifaya kadar manevi tedavi adımları ve süreç rehberi.",
  },
  {
    path: "/blog",
    nameAr: "المدونة والمقالات",
    nameTr: "Blog ve Makaleler",
    defaultTitleAr: "المقالات والتوعية | مركز الرقية الشرعية",
    defaultTitleTr: "Blog ve Manevi Rehberlik | Ruqya Center",
    defaultDescAr: "مقالات شرعية وتوعوية حول فقه الرقية، التحصينات، وإبطال السحر والحسد.",
    defaultDescTr: "Ruqya, manevi korunma ve şifa duaları üzerine rehber makaleler.",
  },
  {
    path: "/faq",
    nameAr: "الأسئلة الشائعة",
    nameTr: "Sıkça Sorulan Sorular",
    defaultTitleAr: "الأسئلة الشائعة حول الرقية والعلاج | مركز الرقية",
    defaultTitleTr: "Sıkça Sorulan Sorular | Ruqya Center",
    defaultDescAr: "إجابات وافية على كافة التساؤلات حول تكاليف وخطوات وجلسات الرقية الشرعية.",
    defaultDescTr: "Tedavi süreci, seanslar ve randevu hakkında en çok merak edilen sorular.",
  },
  {
    path: "/contact",
    nameAr: "اتصل بنا",
    nameTr: "İletişim",
    defaultTitleAr: "اتصل بنا | مركز الرقية بكلام الرحمن",
    defaultTitleTr: "İletişim | Ruqya Center",
    defaultDescAr: "تواصل معنا مباشرة عبر الهاتف أو الواتساب أو البريد الإلكتروني لحجز الاستشارة.",
    defaultDescTr: "Telefon, WhatsApp ve e-posta ile uzman ekibimize hemen ulaşın.",
  },
  {
    path: "/booking",
    nameAr: "حجز موعد واستشارة",
    nameTr: "Randevu Al",
    defaultTitleAr: "سجّل حالتك واحجز موعد استشارة | مركز الرقية",
    defaultTitleTr: "Randevu Oluştur | Ruqya Center",
    defaultDescAr: "سجل بيانات حالتك واختر المعالج والوقت المناسب للحصول على استشارة تشخيصية دقيقة.",
    defaultDescTr: "Manevi danışmanlık ve ruqya seansı için bilgilerinizi girerek randevu oluşturun.",
  },
  {
    path: "/privacy-policy",
    nameAr: "سياسة الخصوصية",
    nameTr: "Gizlilik Politikası",
    defaultTitleAr: "سياسة الخصوصية | مركز الرقية الشرعية",
    defaultTitleTr: "Gizlilik Politikası | Ruqya Center",
    defaultDescAr: "التزامنا التام بسرية بيانات المرضى والمستفيدين وحمايتها وفق أعلى المعايير.",
    defaultDescTr: "Kişisel verilerinizin korunması ve gizlilik taahhüdümüz.",
  },
  {
    path: "/terms-of-service",
    nameAr: "شروط الخدمة",
    nameTr: "Kullanım Şartları",
    defaultTitleAr: "شروط الخدمة والاستخدام | مركز الرقية",
    defaultTitleTr: "Kullanım Şartları | Ruqya Center",
    defaultDescAr: "الشروط والأحكام المنظمة لخدمات الرقية والاستشارات في المركز.",
    defaultDescTr: "Hizmet ve randevu koşulları hakkında bilgilendirme.",
  },
];

export default function AdminSeoPage() {
  const [locale, setLocale] = useState<LocaleTab>("ar");
  const [selectedPath, setSelectedPath] = useState<string>("/");
  const [seoData, setSeoData] = useState<Record<string, SavePageSeoInput>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const loadSeo = useCallback(async () => {
    setIsLoading(true);
    const res = await loadAllPagesSeoAction(locale);
    if (res.success && res.data) {
      setSeoData(res.data);
    }
    setIsLoading(false);
  }, [locale]);

  useEffect(() => {
    loadSeo();
  }, [loadSeo]);

  const currentRoute = PUBLIC_PAGES.find((p) => p.path === selectedPath) || PUBLIC_PAGES[0];
  const isTr = locale === "tr";

  const defaultTitle = isTr ? currentRoute.defaultTitleTr : currentRoute.defaultTitleAr;
  const defaultDesc = isTr ? currentRoute.defaultDescTr : currentRoute.defaultDescAr;

  const currentMetaTitle = seoData[selectedPath]?.metaTitle || "";
  const currentMetaDesc = seoData[selectedPath]?.metaDescription || "";
  const currentKeywords = seoData[selectedPath]?.metaKeywords || "";
  const currentOgImage = seoData[selectedPath]?.ogImageUrl || "";
  const currentCanonical = seoData[selectedPath]?.canonicalUrl || "";

  // Effective preview values
  const displayTitle = currentMetaTitle.trim() || defaultTitle;
  const displayDesc = currentMetaDesc.trim() || defaultDesc;

  const handleFieldChange = (field: keyof SavePageSeoInput, value: string) => {
    setSeoData((prev) => ({
      ...prev,
      [selectedPath]: {
        ...(prev[selectedPath] || {
          pagePath: selectedPath,
          locale,
          metaTitle: "",
          metaDescription: "",
          metaKeywords: "",
          ogImageUrl: "",
          canonicalUrl: "",
        }),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await savePageSeoAction({
        pagePath: selectedPath,
        locale,
        metaTitle: currentMetaTitle,
        metaDescription: currentMetaDesc,
        metaKeywords: currentKeywords,
        ogImageUrl: currentOgImage,
        canonicalUrl: currentCanonical,
      });

      if (res.success) {
        toast(res.message || "تم حفظ إعدادات الـ SEO بنجاح", "success");
      } else {
        toast(res.error || "فشل حفظ إعدادات الـ SEO", "error");
      }
    } catch {
      toast("حدث خطأ أثناء الحفظ", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const fullUrl = `https://ruqyacenter.com${isTr ? "/tr" : ""}${selectedPath === "/" ? "" : selectedPath}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2.5">
            <Search className="text-primary" size={26} />
            إدارة محركات البحث (SEO Manager)
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            خصص عناوين الصفحات (Title)، الأوصاف (Meta Description)، والكلمات المفتاحية لكل صفحة باللغتين
          </p>
        </div>

        {/* Locale Selector */}
        <div className="flex items-center bg-bg p-1.5 rounded-xl border border-border self-stretch sm:self-auto">
          <button
            onClick={() => setLocale("ar")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              locale === "ar"
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span>🇸🇦</span> العربية
          </button>
          <button
            onClick={() => setLocale("tr")}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              locale === "tr"
                ? "bg-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <span>🇹🇷</span> Türkçe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pages Sidebar List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-border p-4 shadow-sm space-y-1.5">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider px-3 py-2">
            صفحات الموقع ({PUBLIC_PAGES.length})
          </h2>
          <div className="space-y-1">
            {PUBLIC_PAGES.map((page) => {
              const isSelected = selectedPath === page.path;
              const hasCustom = !!seoData[page.path]?.metaTitle;
              return (
                <button
                  key={page.path}
                  onClick={() => setSelectedPath(page.path)}
                  className={`w-full text-start px-3.5 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-primary text-white shadow-sm font-bold"
                      : "text-text-primary hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Layout size={16} className={isSelected ? "text-white" : "text-text-muted"} />
                    <span className="truncate">{isTr ? page.nameTr : page.nameAr}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className={`text-[11px] px-2 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-text-secondary"
                    }`}>
                      {page.path}
                    </span>
                    {hasCustom && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="مخصص" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEO Editor & Google Live Preview */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-border">
              <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
              <p className="text-text-secondary text-sm">جاري تحميل إعدادات الصفحة...</p>
            </div>
          ) : (
            <>
              {/* Google Live Snippet Preview */}
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    معاينة حية في محرك بحث Google (Live Snippet Preview)
                  </h3>
                  <span className="text-xs text-text-muted">شكل النتيجة المتوقع في نتائج البحث</span>
                </div>

                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200/80 font-sans space-y-1.5" dir="ltr">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">R</div>
                    <span className="truncate">{fullUrl}</span>
                  </div>
                  <h4 className="text-lg text-[#1a0dab] hover:underline cursor-pointer font-medium leading-snug line-clamp-1" dir={isTr ? "ltr" : "rtl"}>
                    {displayTitle}
                  </h4>
                  <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-2" dir={isTr ? "ltr" : "rtl"}>
                    {displayDesc}
                  </p>
                </div>
              </div>

              {/* Form Controls */}
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h3 className="text-base font-bold text-text-primary">
                      تعديل بيانات: {isTr ? currentRoute.nameTr : currentRoute.nameAr} ({selectedPath})
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      اترك الحقل فارغاً لاستخدام النص الافتراضي المحسّن تلقائياً
                    </p>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    حفظ إعدادات الـ SEO
                  </button>
                </div>

                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-text-primary">
                      عنوان الصفحة في محركات البحث (Meta Title)
                    </label>
                    <span className={`text-xs ${
                      displayTitle.length > 60 ? "text-amber-600 font-bold" : "text-text-muted"
                    }`}>
                      {displayTitle.length} / 60 حرف موصى به
                    </span>
                  </div>
                  <input
                    value={currentMetaTitle}
                    placeholder={defaultTitle}
                    onChange={(e) => handleFieldChange("metaTitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    dir={isTr ? "ltr" : "rtl"}
                  />
                  <p className="text-[11px] text-text-muted mt-1">
                    القيمة الافتراضية: {defaultTitle}
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-text-primary">
                      وصف الصفحة (Meta Description)
                    </label>
                    <span className={`text-xs ${
                      displayDesc.length > 160 ? "text-amber-600 font-bold" : "text-text-muted"
                    }`}>
                      {displayDesc.length} / 160 حرف موصى به
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentMetaDesc}
                    placeholder={defaultDesc}
                    onChange={(e) => handleFieldChange("metaDescription", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                    dir={isTr ? "ltr" : "rtl"}
                  />
                  <p className="text-[11px] text-text-muted mt-1">
                    القيمة الافتراضية: {defaultDesc}
                  </p>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">
                    الكلمات المفتاحية (Meta Keywords) - مفصولة بفواصل
                  </label>
                  <input
                    value={currentKeywords}
                    placeholder={isTr ? "ruqya, manevi sifa, seans, tedavi" : "رقية شرعية, علاج السحر, مركز الرقية, استشارات"}
                    onChange={(e) => handleFieldChange("metaKeywords", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    dir={isTr ? "ltr" : "rtl"}
                  />
                </div>


              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
