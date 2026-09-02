"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui";
import {
  loadAllCmsSectionsAction,
  saveCmsSectionAction,
  fetchFaqsAction,
  saveFaqAction,
  deleteFaqAction,
  FaqItem,
} from "@/app/actions/cms";
import {
  Save,
  Home,
  Info,
  Briefcase,
  GraduationCap,
  Sparkles,
  HelpCircle,
  LayoutTemplate,
  Plus,
  Pencil,
  Trash2,
  Sparkle,
} from "lucide-react";

type LocaleTab = "ar" | "tr";
type PageTab =
  | "home"
  | "about"
  | "services"
  | "courses"
  | "journey"
  | "faq"
  | "global";

interface SectionDef {
  pageName: string;
  sectionKey: string;
}

const PAGE_SECTIONS: Record<PageTab, SectionDef[]> = {
  home: [
    { pageName: "home", sectionKey: "hero" },
    { pageName: "home", sectionKey: "about_preview" },
    { pageName: "home", sectionKey: "services_preview" },
    { pageName: "home", sectionKey: "treatments" },
    { pageName: "home", sectionKey: "cta" },
  ],
  about: [
    { pageName: "about", sectionKey: "hero" },
    { pageName: "about", sectionKey: "story" },
    { pageName: "about", sectionKey: "vision_mission" },
    { pageName: "about", sectionKey: "features" },
  ],
  services: [
    { pageName: "services", sectionKey: "hero" },
    { pageName: "services", sectionKey: "consult_card" },
    { pageName: "services", sectionKey: "treat_section" },
    { pageName: "services", sectionKey: "overview" },
    { pageName: "services", sectionKey: "infographic" },
    { pageName: "services", sectionKey: "cta" },
  ],
  courses: [
    { pageName: "courses", sectionKey: "program" },
    { pageName: "courses", sectionKey: "features" },
    { pageName: "courses", sectionKey: "golden" },
    { pageName: "courses", sectionKey: "notes_cta" },
  ],
  journey: [
    { pageName: "treatment_journey", sectionKey: "hero" },
    { pageName: "treatment_journey", sectionKey: "steps" },
    { pageName: "treatment_journey", sectionKey: "cta" },
  ],
  faq: [
    { pageName: "faq", sectionKey: "hero" },
  ],
  global: [
    { pageName: "global", sectionKey: "header" },
    { pageName: "global", sectionKey: "footer" },
  ],
};

export default function AdminContentPage() {
  const [locale, setLocale] = useState<LocaleTab>("ar");
  const [activeTab, setActiveTab] = useState<PageTab>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);
  const [cmsData, setCmsData] = useState<Record<string, Record<string, any>>>({});

  // FAQ Management State
  const [faqsList, setFaqsList] = useState<FaqItem[]>([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    question_tr: "",
    answer_tr: "",
    display_order: "1",
  });
  const [isSavingFaq, setIsSavingFaq] = useState(false);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const res = await loadAllCmsSectionsAction(locale);
    if (res.success && res.data) {
      setCmsData(res.data);
    }
    setIsLoading(false);
  }, [locale]);

  const loadFaqs = useCallback(async () => {
    setIsLoadingFaqs(true);
    const res = await fetchFaqsAction();
    if (res.success && res.data) {
      setFaqsList(res.data);
    }
    setIsLoadingFaqs(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === "faq") {
      loadFaqs();
    }
  }, [activeTab, loadFaqs]);

  const getVal = (page: string, section: string, field: string, fallback: any = "") => {
    return cmsData[page]?.[section]?.[field] ?? fallback;
  };

  const setVal = (page: string, section: string, field: string, value: any) => {
    setCmsData((prev) => {
      const pageData = prev[page] || {};
      const sectionData = pageData[section] || {};
      return {
        ...prev,
        [page]: {
          ...pageData,
          [section]: {
            ...sectionData,
            [field]: value,
          },
        },
      };
    });
  };

  const handleSaveSection = async (pageName: string, sectionKey: string) => {
    const saveKey = `${pageName}_${sectionKey}`;
    setIsSaving(saveKey);
    try {
      const sectionContent = cmsData[pageName]?.[sectionKey] || {};
      const res = await saveCmsSectionAction({
        pageName,
        sectionKey,
        locale,
        contentJson: sectionContent,
      });

      if (res.success) {
        toast(res.message || "تم حفظ المحتوى بنجاح وتحديث الموقع فوراً", "success");
      } else {
        toast(res.error || "فشل الحفظ", "error");
      }
    } catch {
      toast("حدث خطأ غير متوقع أثناء الحفظ", "error");
    } finally {
      setIsSaving(null);
    }
  };

  const handleSaveAllActivePage = async () => {
    const sections = PAGE_SECTIONS[activeTab];
    if (!sections || sections.length === 0) return;

    setIsSavingAll(true);
    try {
      let successCount = 0;
      for (const item of sections) {
        const sectionContent = cmsData[item.pageName]?.[item.sectionKey] || {};
        const res = await saveCmsSectionAction({
          pageName: item.pageName,
          sectionKey: item.sectionKey,
          locale,
          contentJson: sectionContent,
        });
        if (res.success) successCount++;
      }

      toast(`تم حفظ كافة أقسام الصفحة بنجاح (${successCount} قسم)`, "success");
    } catch {
      toast("حدث خطأ أثناء حفظ بعض الأقسام", "error");
    } finally {
      setIsSavingAll(false);
    }
  };

  // FAQ CRUD handlers
  const handleOpenNewFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      question: "",
      answer: "",
      question_tr: "",
      answer_tr: "",
      display_order: String(faqsList.length + 1),
    });
    setShowFaqModal(true);
  };

  const handleOpenEditFaq = (f: FaqItem) => {
    setEditingFaq(f);
    setFaqForm({
      question: f.question,
      answer: f.answer,
      question_tr: f.question_tr || "",
      answer_tr: f.answer_tr || "",
      display_order: String(f.display_order),
    });
    setShowFaqModal(true);
  };

  const handleSaveFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFaq(true);
    const res = await saveFaqAction({
      id: editingFaq?.id,
      question: faqForm.question,
      answer: faqForm.answer,
      question_tr: faqForm.question_tr,
      answer_tr: faqForm.answer_tr,
      display_order: parseInt(faqForm.display_order) || 1,
    });
    setIsSavingFaq(false);
    if (res.success) {
      toast(editingFaq ? "تم تعديل السؤال بنجاح" : "تمت إضافة السؤال بنجاح", "success");
      setShowFaqModal(false);
      loadFaqs();
    } else {
      toast(res.error || "فشل حفظ السؤال", "error");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال من قاعدة البيانات؟")) return;
    const res = await deleteFaqAction(id);
    if (res.success) {
      toast("تم حذف السؤال بنجاح", "success");
      loadFaqs();
    } else {
      toast(res.error || "فشل حذف السؤال", "error");
    }
  };

  const isTr = locale === "tr";

  const tabsConfig = [
    { id: "home", label: "الرئيسية", icon: <Home size={17} /> },
    { id: "about", label: "من نحن", icon: <Info size={17} /> },
    { id: "services", label: "الخدمات", icon: <Briefcase size={17} /> },
    { id: "courses", label: "الكورسات والتدريب", icon: <GraduationCap size={17} /> },
    { id: "journey", label: "الرحلة العلاجية", icon: <Sparkles size={17} /> },
    { id: "faq", label: "الأسئلة الشائعة", icon: <HelpCircle size={17} /> },
    { id: "global", label: "الهيدر والفوتر", icon: <LayoutTemplate size={17} /> },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <Sparkle size={14} className="fill-primary" />
            <span>لوحة تحكم نصوص ومحتوى الموقع</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            إدارة محتوى الصفحات
          </h1>
          <p className="text-text-secondary text-sm mt-1.5 leading-relaxed max-w-2xl">
            خصص كافة النصوص، العناوين، الشروحات، الكروت، ونقاط الميزات بدقة وتطابق كامل مع صفحات الموقع الحالية.
          </p>
        </div>

        {/* Language Switcher & Save All */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Language Segmented Control */}
          <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-border">
            <button
              onClick={() => setLocale("ar")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                locale === "ar"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              العربية
            </button>
            <button
              onClick={() => setLocale("tr")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                locale === "tr"
                  ? "bg-white text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Türkçe
            </button>
          </div>

          {/* Save All Button for current page */}
          <button
            onClick={handleSaveAllActivePage}
            disabled={isSavingAll}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all shadow-sm disabled:opacity-50 flex-shrink-0"
          >
            {isSavingAll ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            حفظ كافة أقسام الصفحة
          </button>
        </div>
      </div>

      {/* Tabs Navigation Pills */}
      <div className="bg-white p-2 rounded-2xl border border-border shadow-sm overflow-x-auto flex items-center gap-2">
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as PageTab)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white shadow-sm scale-[1.02]"
                  : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-border shadow-sm">
          <div className="w-9 h-9 border-3 border-primary/25 border-t-primary rounded-full animate-spin mx-auto mb-3.5" />
          <p className="text-text-secondary text-sm font-medium">جاري جلب المحتوى والمفاتيح...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ========================================================================= */}
          {/* TAB 1: HOME PAGE */}
          {/* ========================================================================= */}
          {activeTab === "home" && (
            <div className="space-y-6">
              {/* 1. Hero */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">ترويسة الصفحة الرئيسية وإحصائياتها</h2>
                      <p className="text-xs text-text-secondary mt-0.5">الشارة، العناوين الرئيسية، الوصف الترحيبي، وأزرار الحجز والإحصائيات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("home", "hero")}
                    disabled={isSaving === "home_hero"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "home_hero" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الترويسة
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الشارة العلوية (Badge)</label>
                    <input
                      value={getVal("home", "hero", "badge", isTr ? "2017'den beri Manevi Şifa Uzmanı" : "مركز متخصص في الرقية الشرعية منذ 2017")}
                      onChange={(e) => setVal("home", "hero", "badge", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان - السطر الأول</label>
                    <input
                      value={getVal("home", "hero", "title1", isTr ? "Ruqya Şifa" : "مركز الرقية")}
                      onChange={(e) => setVal("home", "hero", "title1", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الملون (Gradient Highlight)</label>
                    <input
                      value={getVal("home", "hero", "title2", isTr ? "Merkezi" : "بكلام الرحمن")}
                      onChange={(e) => setVal("home", "hero", "title2", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان - السطر الثاني</label>
                    <input
                      value={getVal("home", "hero", "title3", isTr ? "Kur'an ve Sünnet Işığında" : "لرد كيد الشيطان")}
                      onChange={(e) => setVal("home", "hero", "title3", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف الترحيبي</label>
                    <textarea
                      rows={3}
                      value={getVal("home", "hero", "description", isTr ? "Kur'an ve Sünnet ışığında manevi ve psikolojik rahatsızlıklardan kurtulmanız için yanınızdayız." : "نسعى بإذن الله لمساعدتك على التعافي من الأمراض الروحية والنفسية من خلال العلاج بكتاب الله وسنة رسوله ﷺ")}
                      onChange={(e) => setVal("home", "hero", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر الحجز الرئيسي</label>
                    <input
                      value={getVal("home", "hero", "ctaBook", isTr ? "Randevu Al" : "سجّل حالتك الآن")}
                      onChange={(e) => setVal("home", "hero", "ctaBook", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر من نحن الثانوي</label>
                    <input
                      value={getVal("home", "hero", "ctaAbout", isTr ? "Hakkımızda" : "تعرّف علينا")}
                      onChange={(e) => setVal("home", "hero", "ctaAbout", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>

                  {/* 3 Stats */}
                  <div className="md:col-span-2 pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-primary mb-3">الإحصائيات الثلاث في الترويسة:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2">
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">إحصائية {num}</span>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">الرقم / القيمة</label>
                            <input
                              value={getVal("home", "hero", `stat${num}Val`, num === 1 ? "+1000" : num === 2 ? "+25" : "+20")}
                              onChange={(e) => setVal("home", "hero", `stat${num}Val`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-bold text-accent"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">التسمية</label>
                            <input
                              value={getVal("home", "hero", `stat${num}Label`, num === 1 ? (isTr ? "Tedavi Edilen Vaka" : "حالة تم علاجها") : num === 2 ? (isTr ? "Yıllık Deneyim" : "سنوات خبرة") : (isTr ? "Hizmet Verilen Ülke" : "دولة حول العالم"))}
                              onChange={(e) => setVal("home", "hero", `stat${num}Label`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. About Preview */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم نبذة من نحن والكروت الثلاثة</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان، الوصف، وكروت المميزات الثلاثة المعروضة بالرئيسية</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("home", "about_preview")}
                    disabled={isSaving === "home_about_preview"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "home_about_preview" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ نبذة من نحن
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان القسم</label>
                    <input
                      value={getVal("home", "about_preview", "title", isTr ? "Hakkımızda" : "من نحن")}
                      onChange={(e) => setVal("home", "about_preview", "title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">وصف القسم</label>
                    <textarea
                      rows={2}
                      value={getVal("home", "about_preview", "description", isTr ? "2017 yılında İstanbul'da kurulan merkezimiz, Kur'an ve Sünnet ışığında online manevi tedavi hizmeti sunmaktadır. Manevi özgünlük ile düzenli bilimsel yaklaşımı bir araya getiriyoruz." : "مركز متخصص في الرقية الشرعية تأسس عام 2017 في إسطنبول، يقدم خدمات العلاج بالقرآن الكريم والسنة النبوية عبر الإنترنت لجميع أنحاء العالم. نجمع بين الأصالة الشرعية والمنهج العلمي المنظم.")}
                      onChange={(e) => setVal("home", "about_preview", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-primary mb-3">الكروت الثلاثة المعروضة:</p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2.5">
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">الكرت {num}</span>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">العنوان</label>
                            <input
                              value={getVal("home", "about_preview", `feat${num}Title`, num === 1 ? (isTr ? "Doğru Şer'i Metot" : "منهج شرعي صحيح") : num === 2 ? (isTr ? "Online Danışmanlık" : "استشارات أونلاين") : (isTr ? "Uzman Kadro" : "فريق متخصص"))}
                              onChange={(e) => setVal("home", "about_preview", `feat${num}Title`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                            <textarea
                              rows={2}
                              value={getVal("home", "about_preview", `feat${num}Desc`, num === 1 ? (isTr ? "Tüm tedavi yöntemlerimizde Kur'an ve Sünnete bağlıyız." : "نلتزم بالكتاب والسنة في جميع أساليب العلاج والرقية") : num === 2 ? (isTr ? "Sesli danışmanlık ile tüm dünyaya hizmet sunuyoruz." : "نقدم خدماتنا لجميع أنحاء العالم عبر الاستشارات الصوتية") : (isTr ? "Rukye ve manevi tedavi alanında deneyimli uzmanlar." : "معالجون ذوو خبرة طويلة في مجال الرقية الشرعية والعلاج"))}
                              onChange={(e) => setVal("home", "about_preview", `feat${num}Desc`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs resize-y"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Services Preview */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">3</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم الخدمات والكروت الأربعة وأزرارها بالرئيسية</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان، الوصف، الكروت الأربعة المعروضة، ونصوص أزرار الحجز لكل كرت</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("home", "services_preview")}
                    disabled={isSaving === "home_services_preview"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "home_services_preview" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم الخدمات
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان قسم الخدمات الرئيسي</label>
                    <input
                      value={getVal("home", "services_preview", "title", isTr ? "Hizmetlerimiz" : "خدماتنا")}
                      onChange={(e) => setVal("home", "services_preview", "title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">وصف قسم الخدمات الرئيسي</label>
                    <input
                      value={getVal("home", "services_preview", "description", isTr ? "Manevi şifa ve rukye alanında uzman hizmetler sunuyoruz." : "نقدم مجموعة متكاملة من الخدمات العلاجية المتخصصة في الرقية الشرعية")}
                      onChange={(e) => setVal("home", "services_preview", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-primary mb-3">الكروت الأربعة وأزرار الحجز:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { num: 1, defaultTitle: isTr ? "Sesli Danışmanlık" : "الاستشارة الصوتية", defaultDesc: isTr ? "Terapistle durum tespiti ve tedavi planı için sesli görüşme seansı." : "جلسة استشارية صوتية مع الراقي لتقييم الحالة والإرشاد للخطة العلاجية قبل البدء بتحديد العلاج", defaultBtn: isTr ? "Randevu Al" : "احجز الآن" },
                        { num: 2, defaultTitle: isTr ? "Rukye ile Teşhis" : "التشخيص بالرقية", defaultDesc: isTr ? "Hastalık türünü yüksek doğrulukla belirlemek için uzman rukye seansı." : "جلسة متخصصة لقراءة الرقية ومراقبة الأعراض لتحديد نوع الإصابة بدقة عالية", defaultBtn: isTr ? "Randevu Al" : "احجز الآن" },
                        { num: 3, defaultTitle: isTr ? "Özel Gözetimli Tedavi" : "العلاج بإشراف خاص", defaultDesc: isTr ? "Zorlu vakalar için düğüm çözme ve doğrudan rukye seansları ile sürekli destek." : "برنامج علاجي مخصص ومباشر مع استخراج العقد ودعم متواصل حتى الشفاء التام وللحالات المستعصية", defaultBtn: isTr ? "Randevu Al" : "احجز الآن" },
                        { num: 4, defaultTitle: isTr ? "Uzaktan Bireysel Tedavi Kursu" : "الكورس العلاجي الذاتي عن بعد", defaultDesc: isTr ? "Seyahat edemeyenler için rehberlik ve bireysel destek içeren sistematik kurs." : "كورس علاجي منهجي مخصص للحالات التي لا يمكنها السفر، مع خدمات التوجيه والدعم الذاتي", defaultBtn: isTr ? "Randevu Al" : "احجز الآن" },
                      ].map((s) => (
                        <div key={s.num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2.5">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">الخدمة {s.num}</span>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">عنوان الخدمة</label>
                            <input
                              value={getVal("home", "services_preview", `svc${s.num}Title`, s.defaultTitle)}
                              onChange={(e) => setVal("home", "services_preview", `svc${s.num}Title`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-semibold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                            <textarea
                              rows={2}
                              value={getVal("home", "services_preview", `svc${s.num}Desc`, s.defaultDesc)}
                              onChange={(e) => setVal("home", "services_preview", `svc${s.num}Desc`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs resize-y"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">نص زر الكرت</label>
                            <input
                              value={getVal("home", "services_preview", `svc${s.num}Btn`, s.defaultBtn)}
                              onChange={(e) => setVal("home", "services_preview", `svc${s.num}Btn`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. What We Treat (4 Categories) */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">4</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم ما الذي يمكن علاجه (4 فئات بالصفحة الرئيسية)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان، الوصف، والفئات الأربعة مع نقاط كل فئة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("home", "treatments")}
                    disabled={isSaving === "home_treatments"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "home_treatments" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم العلاجات
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان القسم</label>
                    <input
                      value={getVal("home", "treatments", "title", isTr ? "Neler Tedavi Edilebilir?" : "ما الذي يمكن علاجه؟")}
                      onChange={(e) => setVal("home", "treatments", "title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">وصف القسم</label>
                    <input
                      value={getVal("home", "treatments", "description", isTr ? "Manevi, psikolojik ve sağlık durumlarını Allah'ın izniyle tedavi ediyoruz." : "نعالج بإذن الله مختلف الحالات الروحية والنفسية والصحية")}
                      onChange={(e) => setVal("home", "treatments", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { num: 1, defaultTitle: isTr ? "Ruhani Hastalıklar" : "الأمراض الروحية", i1: isTr ? "Nazar ve Haset" : "العين والحسد", i2: isTr ? "Tüm Büyü Çeşitleri" : "السحر بأنواعه", i3: isTr ? "Cin Çarpması ve Musallat" : "المس والتلبس" },
                        { num: 2, defaultTitle: isTr ? "Psikolojik Rahatsızlıklar" : "الأمراض النفسية", i1: isTr ? "Kaygı ve Depresyon" : "القلق والاكتئاب", i2: isTr ? "Obsesif Kompulsif Bozukluk" : "الوسواس القهري", i3: isTr ? "Kronik Uykusuzluk" : "الأرق المزمن" },
                        { num: 3, defaultTitle: isTr ? "Zorlu ve Ağır Vakalar" : "الحالات المستعصية", i1: isTr ? "Kanser ve Otizm" : "أمراض السرطان والتوحد", i2: isTr ? "Sara ve Hepatit" : "الصرع والتهاب الكبد", i3: isTr ? "Tekrarlayan Düşükler" : "الإسقاط المتكرر وتأخر الإنجاب" },
                        { num: 4, defaultTitle: isTr ? "Manevi Korunma ve Önlem" : "التحصين والوقاية", i1: isTr ? "Günlük Korunma" : "التحصين اليومي", i2: isTr ? "Ev Koruma" : "تحصين المنزل", i3: isTr ? "Çocukları Koruma" : "حماية الأطفال" },
                      ].map((cat) => (
                        <div key={cat.num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2.5">
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">فئة {cat.num}</span>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">عنوان الفئة</label>
                            <input
                              value={getVal("home", "treatments", `treat${cat.num}Title`, cat.defaultTitle)}
                              onChange={(e) => setVal("home", "treatments", `treat${cat.num}Title`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs font-bold bg-white"
                            />
                          </div>
                          <div className="space-y-1.5 pt-1">
                            <label className="block text-[10px] font-bold text-text-secondary">العناصر (3 عناصر):</label>
                            <input
                              placeholder="عنصر 1"
                              value={getVal("home", "treatments", `treat${cat.num}Item1`, cat.i1)}
                              onChange={(e) => setVal("home", "treatments", `treat${cat.num}Item1`, e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg border border-border text-xs bg-white"
                            />
                            <input
                              placeholder="عنصر 2"
                              value={getVal("home", "treatments", `treat${cat.num}Item2`, cat.i2)}
                              onChange={(e) => setVal("home", "treatments", `treat${cat.num}Item2`, e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg border border-border text-xs bg-white"
                            />
                            <input
                              placeholder="عنصر 3"
                              value={getVal("home", "treatments", `treat${cat.num}Item3`, cat.i3)}
                              onChange={(e) => setVal("home", "treatments", `treat${cat.num}Item3`, e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg border border-border text-xs bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. CTA */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">5</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم الدعوة الختامية وزر التسجيل (CTA)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">البطاقة السفلية للتشجيع على الحجز بالرئيسية</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("home", "cta")}
                    disabled={isSaving === "home_cta"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "home_cta" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم الدعوة
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي للبطاقة</label>
                    <input
                      value={getVal("home", "cta", "title", isTr ? "Başlamaya Hazır mısınız?" : "هل أنت مستعد للبدء؟")}
                      onChange={(e) => setVal("home", "cta", "title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر الإجراء</label>
                    <input
                      value={getVal("home", "cta", "buttonText", isTr ? "Randevu Al" : "سجّل حالتك الآن")}
                      onChange={(e) => setVal("home", "cta", "buttonText", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف التحفيزي</label>
                    <textarea
                      rows={2}
                      value={getVal("home", "cta", "description", isTr ? "Şimdi durumunuzu kaydedin, uzman ekibimiz randevu için sizinle iletişime geçsin." : "سجّل حالتك الآن وسيتم التواصل معك من قبل أحد المتخصصين لتحديد موعد الاستشارة المناسب")}
                      onChange={(e) => setVal("home", "cta", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: ABOUT US */}
          {/* ========================================================================= */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* 1. Hero */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">ترويسة صفحة من نحن</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان والوصف الترحيبي العام</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("about", "hero")}
                    disabled={isSaving === "about_hero"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "about_hero" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الترويسة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("about", "hero", "title", isTr ? "Hakkımızda" : "من نحن")}
                      onChange={(e) => setVal("about", "hero", "title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف</label>
                    <textarea
                      rows={2}
                      value={getVal("about", "hero", "description", isTr ? "2017 yılında İstanbul'da kurulan merkezimiz, Kur'an-ı Kerim ve Sünnet ışığında tüm dünyaya hizmet sunmaktadır." : "مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم تأسس عام 2017 في إسطنبول، نقدم خدماتنا لجميع أنحاء العالم عبر الإنترنت")}
                      onChange={(e) => setVal("about", "hero", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Story */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قصة المركز وإحصائياته</h2>
                      <p className="text-xs text-text-secondary mt-0.5">الفقرات التفصيلية لقصة التأسيس وأرقام الإحصائيات الأربعة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("about", "story")}
                    disabled={isSaving === "about_story"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "about_story" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قصة المركز
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الشارة (Tag)</label>
                    <input
                      value={getVal("about", "story", "storyTag", isTr ? "Hikayemiz" : "قصتنا")}
                      onChange={(e) => setVal("about", "story", "storyTag", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("about", "story", "storyTitle", isTr ? "İman ve Samimiyetle Başlayan Bir Yolculuk" : "رحلة بدأت بإيمان ونية صادقة")}
                      onChange={(e) => setVal("about", "story", "storyTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">الفقرة الأولى (تأسيس المركز)</label>
                      <textarea
                        rows={2}
                        value={getVal("about", "story", "storyP1", isTr ? "Merkezimiz 2017 yılında İstanbul'da +25 yıllık tecrübeyle kurulmuştur." : "تأسس مركز الرقية بكلام الرحمن لرد كيد الشيطان عام 2017 في مدينة إسطنبول التركية، بأدارة الخبير والمعالج (سيف الله) (ابو عامر) بخبرة +25 عام.")}
                        onChange={(e) => setVal("about", "story", "storyP1", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">الفقرة الثانية (البرنامج العلاجي)</label>
                      <textarea
                        rows={2}
                        value={getVal("about", "story", "storyP2", isTr ? "Merkezimiz düğüm çözme ve manevi arınma konusunda öncüdür." : "يُعد مركزنا صاحب البرنامج العلاجي الأول في العالم بفضل الله في استخراج العقد والأسحار وطرد الشيطان من الجسد، وهو العلاج الشامل لجميع الإصابات الروحية (سحر، مس، عين، حسد).")}
                        onChange={(e) => setVal("about", "story", "storyP2", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">الفقرة الثالثة (استقبال الحالات المستعصية)</label>
                      <textarea
                        rows={2}
                        value={getVal("about", "story", "storyP3", isTr ? "Dünyanın her yerinden zorlu vakaları kabul etmekteyiz." : "نستقبل الحالات من جميع أنحاء العالم، ونتخصص في التعامل مع \"الحالات المستعصية\" التي تشمل: (أمراض السرطان، أمراض الصرع وزيادة الشحنات الكهربائية، أمراض التوحد، الإسقاط المتكرر عند النساء، والتهاب الكبد الفيروسي).")}
                        onChange={(e) => setVal("about", "story", "storyP3", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                      />
                    </div>
                  </div>

                  {/* 4 Stats */}
                  <div className="md:col-span-2 pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-primary mb-3">الإحصائيات الأربعة للمركز:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      {[
                        { num: 1, val: "2017", label: isTr ? "Kuruluş Yılı" : "سنة التأسيس" },
                        { num: 2, val: "+1000", label: isTr ? "Tedavi Edilen Vaka" : "حالة تم علاجها" },
                        { num: 3, val: "+20", label: isTr ? "Hizmet Verilen Ülke" : "دولة حول العالم" },
                        { num: 4, val: "+25", label: isTr ? "Yıllık Deneyim" : "سنوات خبرة" },
                      ].map((st) => (
                        <div key={st.num} className="p-3 bg-gray-50/80 rounded-xl border border-border/80 space-y-1.5">
                          <label className="block text-[11px] font-semibold text-text-secondary">إحصائية {st.num}</label>
                          <input
                            value={getVal("about", "story", `stat${st.num}Val`, st.val)}
                            onChange={(e) => setVal("about", "story", `stat${st.num}Val`, e.target.value)}
                            className="w-full px-2.5 py-1 rounded border border-border text-sm font-bold text-primary bg-white"
                          />
                          <input
                            value={getVal("about", "story", `stat${st.num}Label`, st.label)}
                            onChange={(e) => setVal("about", "story", `stat${st.num}Label`, e.target.value)}
                            className="w-full px-2.5 py-1 rounded border border-border text-xs bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Vision & Mission */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">3</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">الرؤية والرسالة</h2>
                      <p className="text-xs text-text-secondary mt-0.5">رؤية المركز وأهدافه ورسالته السامية</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("about", "vision_mission")}
                    disabled={isSaving === "about_vision_mission"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "about_vision_mission" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الرؤية والرسالة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-5 bg-gray-50/80 rounded-2xl border border-border/80 space-y-3">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">الرؤية (Vision)</span>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">عنوان الرؤية</label>
                      <input
                        value={getVal("about", "vision_mission", "visionTitle", isTr ? "Vizyonumuz" : "رؤيتنا")}
                        onChange={(e) => setVal("about", "vision_mission", "visionTitle", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-border text-sm font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">نص الرؤية</label>
                      <textarea
                        rows={3}
                        value={getVal("about", "vision_mission", "visionDesc", isTr ? "İslam dünyasında güvenilir şer'i rukye alanında öncü referans olmak." : "أن نكون المرجع الأول في العالم العربي والإسلامي لتقديم خدمات الرقية الشرعية الموثوقة وفق منهج علمي شرعي متكامل، والوصول إلى كل محتاج أينما كان.")}
                        onChange={(e) => setVal("about", "vision_mission", "visionDesc", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white resize-y"
                      />
                    </div>
                  </div>

                  <div className="p-5 bg-gray-50/80 rounded-2xl border border-border/80 space-y-3">
                    <span className="text-xs font-bold text-accent bg-amber-50 px-2.5 py-1 rounded-md">الرسالة (Mission)</span>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">عنوان الرسالة</label>
                      <input
                        value={getVal("about", "vision_mission", "missionTitle", isTr ? "Misyonumuz" : "رسالتنا")}
                        onChange={(e) => setVal("about", "vision_mission", "missionTitle", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-border text-sm font-bold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-text-primary mb-1">نص الرسالة</label>
                      <textarea
                        rows={3}
                        value={getVal("about", "vision_mission", "missionDesc", isTr ? "Kur'an ve Sünnet ışığında en yüksek dürüstlük ve profesyonellikle rukye hizmeti sunmak." : "تقديم خدمات الرقية الشرعية والعلاج بالقرآن والسنة بأعلى مستوى من المهنية والأمانة، مع تثقيف المجتمع حول أهمية التحصين والعلاج الشرعي وكيفية الوقاية من الأمراض الروحية.")}
                        onChange={(e) => setVal("about", "vision_mission", "missionDesc", e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white resize-y"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Features */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">4</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم ما يميزنا (6 ميزات بصفحة من نحن)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">عناوين وشروحات مميزات المركز التنافسية</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("about", "features")}
                    disabled={isSaving === "about_features"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "about_features" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ ما يميزنا
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان قسم المميزات</label>
                    <input
                      value={getVal("about", "features", "featuresTitle", isTr ? "Bizi Farklı Kılanlar" : "ما يميّزنا")}
                      onChange={(e) => setVal("about", "features", "featuresTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">وصف قسم المميزات</label>
                    <input
                      value={getVal("about", "features", "featuresDesc", isTr ? "Hizmetlerimizde en yüksek kalite ve dürüstlük standartlarına bağlıyız." : "نلتزم بأعلى معايير الجودة والأمانة في تقديم خدماتنا")}
                      onChange={(e) => setVal("about", "features", "featuresDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 border-t border-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { num: 1, defaultTitle: isTr ? "Şer'i Metot ve Teşhis Kanıtı" : "منهج شرعي وإثبات للإصابة", defaultDesc: isTr ? "Kur'an ve Sünnete bağlıyız ve cinlerle asla konuşmayız." : "نلتزم بالكتاب والسنة والامتناع التام عن التكلم مع الجن بأي حال من الأحوال، مع إثبات الإصابة قبل وبعد العلاج." },
                        { num: 2, defaultTitle: isTr ? "Kapsamlı Deneyim" : "خبرة طويلة", defaultDesc: isTr ? "25 yıllık deneyimli uzmanlar gözetiminde yan etkisiz tedavi." : "تقديم خدمات علاجية بدون أي أضرار جانبية بمصداقية عالية تحت إشراف معالجين مختصين بخبرة 25 عاماً." },
                        { num: 3, defaultTitle: isTr ? "Doğrudan ve Küresel Hizmetler" : "خدمات مباشرة وعالمية", defaultDesc: isTr ? "İstanbul merkezimizde doğrudan hasta kabulü ve özel durumlarda seyahat imkânı." : "استقبال المرضى بشكل مباشر في مركزنا بإسطنبول، مع إمكانية سفر المعالجين للحالات الخاصة وفق شروط محددة." },
                        { num: 4, defaultTitle: isTr ? "Tedavi ve Koruma Kursları" : "كورسات علاجية ووقائية", defaultDesc: isTr ? "Kişisel ve ailevi koruma için sistemli tedavi programları." : "توفير كورسات علاجية للعلاج الذاتي المنهجي، وتقديم برامج وقائية للأفراد والأسر تكون درعاً متيناً وحصناً حصيناً." },
                        { num: 5, defaultTitle: isTr ? "Periyodik ve Kapsamlı Takip" : "متابعة دورية وشاملة", defaultDesc: isTr ? "Tam şifaya kadar her yaştan hasta için düzenli takip." : "متابعة دورية ومستمرة للحالات من كافة الأعمار حتى الشفاء التام بإذن الله تعالى." },
                        { num: 6, defaultTitle: isTr ? "Ailevi Rehberlik ve Yönlendirme" : "إرشاد وتوجيه أسري", defaultDesc: isTr ? "Tedavi sürecini desteklemek için ailelere rehberlik." : "إرشاد وتوجيه أسر المرضى لدعم العملية العلاجية وتعزيز الاستقرار النفسي." },
                      ].map((item) => (
                        <div key={item.num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2">
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">ميزة {item.num}</span>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">العنوان</label>
                            <input
                              value={getVal("about", "features", `feat${item.num}Title`, item.defaultTitle)}
                              onChange={(e) => setVal("about", "features", `feat${item.num}Title`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs font-semibold bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                            <textarea
                              rows={2}
                              value={getVal("about", "features", `feat${item.num}Desc`, item.defaultDesc)}
                              onChange={(e) => setVal("about", "features", `feat${item.num}Desc`, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white resize-y"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SERVICES PAGE */}
          {/* ========================================================================= */}
          {activeTab === "services" && (
            <div className="space-y-6">
              {/* 1. Services Hero */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">ترويسة صفحة الخدمات</h2>
                      <p className="text-xs text-text-secondary mt-0.5">الشارة، العنوان الرئيسي، والوصف الترحيبي</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("services", "hero")}
                    disabled={isSaving === "services_hero"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "services_hero" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الترويسة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الشارة العلوية (Badge / Tag)</label>
                    <input
                      value={getVal("services", "hero", "heroTag", isTr ? "Manevi Şifa ve Tedavi" : "تبدأ رحلتك العلاجية من هنا")}
                      onChange={(e) => setVal("services", "hero", "heroTag", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("services", "hero", "heroTitle", isTr ? "Tedavi Hizmetlerimiz" : "الخدمات العلاجية")}
                      onChange={(e) => setVal("services", "hero", "heroTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف الترحيبي الشامل</label>
                    <textarea
                      rows={2}
                      value={getVal("services", "hero", "heroDesc", isTr ? "Kur'an-ı Kerim ve Sünnet ışığında kişiye özel hazırlanan profesyonel manevi tedavi programları." : "نقدم مجموعة متكاملة من خدمات الرقية الشرعية للتعافي من الأمراض الروحية، وكلها تبدأ بخطوة واحدة أساسية للتقييم الصحيح")}
                      onChange={(e) => setVal("services", "hero", "heroDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Services Consultation Box */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">بطاقة الاستشارة الصوتية وحجز الموعد</h2>
                      <p className="text-xs text-text-secondary mt-0.5">عنوان ووصف الاستشارة، نقاط لماذا نبدأ بالاستشارة الـ 6، وصندوق زر الحجز</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("services", "consult_card")}
                    disabled={isSaving === "services_consult_card"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "services_consult_card" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ بطاقة الاستشارة
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان بطاقة الاستشارة</label>
                      <input
                        value={getVal("services", "consult_card", "consultTitle", isTr ? "Sesli Danışmanlık ve Teşhis" : "الاستشارة الصوتية")}
                        onChange={(e) => setVal("services", "consult_card", "consultTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان قائمة لماذا نبدأ بالاستشارة؟</label>
                      <input
                        value={getVal("services", "consult_card", "whyConsult", isTr ? "Neden Danışmanlıkla Başlıyoruz?" : "لماذا نبدأ بالاستشارة؟")}
                        onChange={(e) => setVal("services", "consult_card", "whyConsult", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف التفصيلي للاستشارة</label>
                      <textarea
                        rows={3}
                        value={getVal("services", "consult_card", "consultDesc", isTr ? "Tüm tedavi ve teşhis hizmetlerimizin zorunlu giriş kapısıdır. Her vaka farklı olduğu için sesli danışmanlık ile detaylı değerlendirme yapılmadan doğrudan tedaviye başlanamaz." : "بوابة الدخول الإلزامية لجميع خدماتنا العلاجية والتشخيصية. لأن كل حالة تختلف عن الأخرى، لا يمكننا البدء بأي برنامج علاجي أو استقبال أي مريض بشكل مباشر قبل إجراء تقييم دقيق وشامل لحالته عبر الاستشارة الصوتية.")}
                        onChange={(e) => setVal("services", "consult_card", "consultDesc", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* 6 Why Points */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-primary mb-3">نقاط "لماذا نبدأ بالاستشارة؟" (6 نقاط):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {[
                        { num: 1, defaultVal: isTr ? "Hastanın tedaviye bağlılığından ve ciddiyetinden emin olmak" : "التأكد من جدية المريض والتزامه بالعلاج" },
                        { num: 2, defaultVal: isTr ? "Sorunu ve arama nedenini kesin olarak anlamak" : "فهم المشكلة وسبب الاتصال بشكل دقيق" },
                        { num: 3, defaultVal: isTr ? "Tedavi masraflarının karşılanabilirliğini belirlemek" : "تحديد إمكانية تغطية التكاليف العلاجية" },
                        { num: 4, defaultVal: isTr ? "Tedavi şartlarını tam şeffaflıkla açıklamak" : "توضيح شروط العلاج بكل شفافية" },
                        { num: 5, defaultVal: isTr ? "Sizin için en uygun hizmete yönlendirmek" : "توجيهك للخدمة الأنسب لك" },
                        { num: 6, defaultVal: isTr ? "Doğrudan katılım mı yoksa uzaktan mı gerektiğini belirlemek" : "تحديد الحاجة لحضور مباشر أو عن بعد" },
                      ].map((item) => (
                        <div key={item.num} className="p-3 bg-gray-50/80 rounded-xl border border-border/80 space-y-1">
                          <span className="text-[11px] font-bold text-primary">نقطة {item.num}</span>
                          <input
                            value={getVal("services", "consult_card", `whyItem${item.num}`, item.defaultVal)}
                            onChange={(e) => setVal("services", "consult_card", `whyItem${item.num}`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Box */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-primary mb-3">الصندوق الجانبي لزر الحجز:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50/80 rounded-2xl border border-border/80">
                      <div>
                        <label className="block text-[11px] font-bold text-text-primary mb-1">عنوان الصندوق</label>
                        <input
                          value={getVal("services", "consult_card", "bookConsult", isTr ? "Randevu Al" : "احجز استشارتك")}
                          onChange={(e) => setVal("services", "consult_card", "bookConsult", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className="block text-[11px] font-bold text-text-primary mb-1">الوصف الإرشادي داخل الصندوق</label>
                        <input
                          value={getVal("services", "consult_card", "bookConsultDesc", isTr ? "Bilgilerinizi doldurun ve resepsiyon görevlimiz randevunuzu ayarlamak için sizinle iletişime geçsin" : "قم بتعبئة بياناتك وسيتواصل معك موظف الاستقبال لتحديد الموعد مع الراقي المختص")}
                          onChange={(e) => setVal("services", "consult_card", "bookConsultDesc", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-text-primary mb-1">نص زر الحجز (Button Text)</label>
                        <input
                          value={getVal("services", "consult_card", "bookNowCTA", isTr ? "Hemen Başvur" : "احجز موعدك الآن")}
                          onChange={(e) => setVal("services", "consult_card", "bookNowCTA", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs font-bold text-accent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-text-primary mb-1">نص السرية التامة</label>
                        <input
                          value={getVal("services", "consult_card", "confidential", isTr ? "Tam Gizlilik ve Güvenlik" : "سرية تامة لجميع البيانات")}
                          onChange={(e) => setVal("services", "consult_card", "confidential", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs text-green-600 bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-text-primary mb-1">نص التواصل السريع</label>
                        <input
                          value={getVal("services", "consult_card", "fastContact", isTr ? "Hızlı İletişim Desteği" : "تواصل سريع لترتيب الموعد")}
                          onChange={(e) => setVal("services", "consult_card", "fastContact", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs text-primary bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Treatments Section (4 Cards) */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">3</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم ما الذي يمكن علاجه بالرقية الشرعية</h2>
                      <p className="text-xs text-text-secondary mt-0.5">عناوين وأوصاف كروت العلاجات الأربعة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("services", "treat_section")}
                    disabled={isSaving === "services_treat_section"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "services_treat_section" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم العلاجات
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان القسم الرئيسي</label>
                      <input
                        value={getVal("services", "treat_section", "treatTitle", isTr ? "Şer'i Rukye ile Neler Tedavi Edilebilir?" : "ما الذي يمكن علاجه بالرقية الشرعية؟")}
                        onChange={(e) => setVal("services", "treat_section", "treatTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">وصف القسم</label>
                      <input
                        value={getVal("services", "treat_section", "treatDesc", isTr ? "Şer'i rukye, Peygamber Efendimizin (s.a.v) rehberliğine dayanarak geniş bir alanı kapsayan tedavi yöntemidir" : "تغطي الرقية الشرعية مجالات واسعة استناداً إلى التوجيهات النبوية الشريفة، لتشمل جميع أنواع الأذى")}
                        onChange={(e) => setVal("services", "treat_section", "treatDesc", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {[
                      {
                        num: 1,
                        defaultTitle: isTr ? "Ruhani Hastalıkların Tedavisi" : "علاج الأمراض الروحية",
                        defaultDesc: isTr ? "Rukye, büyü, cin çarpması, nazar ve haset gibi şeytani ruhlardan kaynaklanan ruhani hastalıkları tedavi eden şer'i yöntemlerden biridir." : "تعتبر الرقية من الطرق الشرعية التي تعالج الأمراض الروحية من السحر والمس والعين والحسد التي يكون سببها الأرواح الشيطانية."
                      },
                      {
                        num: 2,
                        defaultTitle: isTr ? "Psikolojik Sorunların Tedavisi" : "علاج الامراض النفسية",
                        defaultDesc: isTr ? "Psikolojik sorunlardan muzdarip vakalarla yapılan çalışmalar, şer'i rukye'nin psikolojik dengeye katkı sağladığını kanıtlamıştır." : "لقد ثبت من خلال التعامل مع الحالات التي تعاني من أمراض نفسية أن الرقية الشرعية تساعد على الاستقرار النفسي."
                      },
                      {
                        num: 3,
                        defaultTitle: isTr ? "Fiziksel Rahatsızlıkların Tedavisi" : "علاج الحالات الصحية",
                        defaultDesc: isTr ? "Deneyimlerle sabit ki, şer'i rukye bazı organik hastalıkların tedavisine ve ağrıların hafifletilmesine katkıda bulunur." : "لقد ثبت من خلال التجربة أن الرقية الشرعية تساهم في علاج بعض الأمراض العضوية وتخفيف الآلام كسبب للشفاء بإذن الله."
                      },
                      {
                        num: 4,
                        defaultTitle: isTr ? "Kişisel ve Ailevi Korunma" : "تحصين النفس والاهل",
                        defaultDesc: isTr ? "Şer'i rukye, Allah'ın izniyle kişinin kendisini, ailesini ve malını iç ve dış kötülüklerden korumanın önemli bir sebebi ve aracıdır." : "تعتبر الرقية الشرعية سبباً وعاملاً مهماً في تحصين النفس والأهل والمال من الشرور الداخلية والخارجية بإذن الله تعالى."
                      },
                    ].map((item) => (
                      <div key={item.num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2.5">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">كرت العلاج {item.num}</span>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-secondary mb-1">العنوان</label>
                          <input
                            value={getVal("services", "treat_section", `treat${item.num}Title`, item.defaultTitle)}
                            onChange={(e) => setVal("services", "treat_section", `treat${item.num}Title`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-semibold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                          <textarea
                            rows={2}
                            value={getVal("services", "treat_section", `treat${item.num}Desc`, item.defaultDesc)}
                            onChange={(e) => setVal("services", "treat_section", `treat${item.num}Desc`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Services Overview (3 Services & Features) */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">4</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم ماذا بعد الاستشارة الأولية والخدمات الثلاث</h2>
                      <p className="text-xs text-text-secondary mt-0.5">تفاصيل كروت الخدمات الثلاثة وميزات كل خدمة (3 نقاط لكل منها)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("services", "overview")}
                    disabled={isSaving === "services_overview"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "services_overview" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم الخدمات الثلاث
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان القسم</label>
                      <input
                        value={getVal("services", "overview", "afterConsultTitle", isTr ? "İlk Danışmanlıktan Sonra Ne Olur?" : "ماذا بعد الاستشارة الأولية؟")}
                        onChange={(e) => setVal("services", "overview", "afterConsultTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-primary mb-1.5">وصف القسم</label>
                      <input
                        value={getVal("services", "overview", "afterConsultDesc", isTr ? "Danışma seansındaki detaylı değerlendirmeye göre, tedavi planınızın bir parçası olarak aşağıdaki hizmetlerden birine yönlendirileceksiniz" : "بناءً على التقييم الدقيق في الجلسة الاستشارية، سيتم العمل معك وتوجيهك لإحدى الخدمات التالية لتكون جزءاً من خطتك العلاجية الكاملة")}
                        onChange={(e) => setVal("services", "overview", "afterConsultDesc", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">تسمية عنوان قائمة الميزات في الكروت</label>
                    <input
                      value={getVal("services", "overview", "serviceFeatures", isTr ? "Hizmet Özellikleri:" : "ميزات الخدمة:")}
                      onChange={(e) => setVal("services", "overview", "serviceFeatures", e.target.value)}
                      className="w-full max-w-xs px-3.5 py-2 rounded-xl border border-border text-xs"
                    />
                  </div>

                  {/* 3 Dynamic Services Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                    {/* Service 1 */}
                    <div className="p-5 bg-gray-50/80 rounded-2xl border border-border/80 space-y-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">الخدمة 1: التشخيص بالرقية</span>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">عنوان الخدمة</label>
                        <input
                          value={getVal("services", "overview", "svc1Title", isTr ? "Rukye ile Teşhis" : "التشخيص بالرقية")}
                          onChange={(e) => setVal("services", "overview", "svc1Title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                        <textarea
                          rows={2}
                          value={getVal("services", "overview", "svc1Desc", isTr ? "Hastalık türünü yüksek doğrulukla belirlemek için belirtilerin gözlemlenmesi ve rukye okunmasını içeren uzman seans." : "جلسة متخصصة لقراءة الرقية ومراقبة الأعراض لتحديد نوع الإصابة بدقة عالية (روحية، نفسية، جسدية).")}
                          onChange={(e) => setVal("services", "overview", "svc1Desc", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white resize-y"
                        />
                      </div>
                      <div className="space-y-2 pt-1 border-t border-border/60">
                        <label className="block text-[11px] font-bold text-text-primary">ميزات الخدمة (3 نقاط):</label>
                        <input
                          placeholder="الميزة 1"
                          value={getVal("services", "overview", "svc1F1", isTr ? "Durumunuza özel uzman rukye okuması" : "قراءة رقية متخصصة لحالتك")}
                          onChange={(e) => setVal("services", "overview", "svc1F1", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                        <input
                          placeholder="الميزة 2"
                          value={getVal("services", "overview", "svc1F2", isTr ? "Hastalık türünün doğru tespiti" : "تحديد نوع الإصابة بشكل دقيق")}
                          onChange={(e) => setVal("services", "overview", "svc1F2", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                        <input
                          placeholder="الميزة 3"
                          value={getVal("services", "overview", "svc1F3", isTr ? "Uygun tedavinin başlatılması" : "البدء في تسليم العلاج الملائم")}
                          onChange={(e) => setVal("services", "overview", "svc1F3", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Service 2 */}
                    <div className="p-5 bg-gray-50/80 rounded-2xl border border-border/80 space-y-3">
                      <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">الخدمة 2: العلاج بإشراف خاص</span>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">عنوان الخدمة</label>
                        <input
                          value={getVal("services", "overview", "svc2Title", isTr ? "Özel Gözetimli Tedavi" : "العلاج بإشراف خاص")}
                          onChange={(e) => setVal("services", "overview", "svc2Title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                        <textarea
                          rows={2}
                          value={getVal("services", "overview", "svc2Desc", isTr ? "Zorlu vakalar için düğüm çözme ve doğrudan rukye seansları ile sürekli desteği içeren kişiye özel tedavi programı." : "برنامج علاجي مخصص للتعامل مع الحالات المستعصية يتضمن استخراج العقد وجلسات الرقية المباشرة مع دعم مستمر.")}
                          onChange={(e) => setVal("services", "overview", "svc2Desc", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white resize-y"
                        />
                      </div>
                      <div className="space-y-2 pt-1 border-t border-border/60">
                        <label className="block text-[11px] font-bold text-text-primary">ميزات الخدمة (3 نقاط):</label>
                        <input
                          placeholder="الميزة 1"
                          value={getVal("services", "overview", "svc2F1", isTr ? "7/24 doğrudan iletişim" : "الاتصال المباشر على مدار الساعة")}
                          onChange={(e) => setVal("services", "overview", "svc2F1", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                        <input
                          placeholder="الميزة 2"
                          value={getVal("services", "overview", "svc2F2", isTr ? "Sınırsız ilaç ve tedavi temini" : "تأمين الأدوية والعلاجات دون قيود")}
                          onChange={(e) => setVal("services", "overview", "svc2F2", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                        <input
                          placeholder="الميزة 3"
                          value={getVal("services", "overview", "svc2F3", isTr ? "Sınırsız tedavi ve rukye seansları" : "جلسات علاجية ورقية دون قيود")}
                          onChange={(e) => setVal("services", "overview", "svc2F3", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                      </div>
                    </div>

                    {/* Service 3 */}
                    <div className="p-5 bg-gray-50/80 rounded-2xl border border-border/80 space-y-3">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">الخدمة 3: الكورس العلاجي عن بعد</span>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">عنوان الخدمة</label>
                        <input
                          value={getVal("services", "overview", "svc3Title", isTr ? "Uzaktan Tedavi Kursu" : "الكورس العلاجي عن بعد")}
                          onChange={(e) => setVal("services", "overview", "svc3Title", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-sm font-semibold bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                        <textarea
                          rows={2}
                          value={getVal("services", "overview", "svc3Desc", isTr ? "Seyahat edemeyen hastalar için açık adımlar ve bilimsel yöntemlerle bireysel destek, rehberlik ve yönlendirme içeren sistematik tedavi kursu." : "كورس علاجي منهجي مخصص للحالات التي لا يمكنها السفر، مع توفير دعم وإرشاد وتوجيه ذاتي بخطوات واضحة وطرق علمية.")}
                          onChange={(e) => setVal("services", "overview", "svc3Desc", e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white resize-y"
                        />
                      </div>
                      <div className="space-y-2 pt-1 border-t border-border/60">
                        <label className="block text-[11px] font-bold text-text-primary">ميزات الخدمة (3 نقاط):</label>
                        <input
                          placeholder="الميزة 1"
                          value={getVal("services", "overview", "svc3F1", isTr ? "Evde sistematik bireysel tedavi" : "علاج ذاتي منهجي منزلي")}
                          onChange={(e) => setVal("services", "overview", "svc3F1", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                        <input
                          placeholder="الميزة 2"
                          value={getVal("services", "overview", "svc3F2", isTr ? "Periyodik takip ve rehberlik" : "متابعة وإرشاد على فترات")}
                          onChange={(e) => setVal("services", "overview", "svc3F2", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                        <input
                          placeholder="الميزة 3"
                          value={getVal("services", "overview", "svc3F3", isTr ? "Aile için koruma ve güvenlik programları" : "برامج وقائية وحماية للأسرة")}
                          onChange={(e) => setVal("services", "overview", "svc3F3", e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Program Infographic */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">5</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم الإنفوجرافيك التوضيحي للبرنامج</h2>
                      <p className="text-xs text-text-secondary mt-0.5">عنوان قسم الإنفوجرافيك بصفحة الخدمات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("services", "infographic")}
                    disabled={isSaving === "services_infographic"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "services_infographic" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم الإنفوجرافيك
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان قسم الإنفوجرافيك</label>
                  <input
                    value={getVal("services", "infographic", "infographicTitle", isTr ? "Kapsamlı Tedavi Programı" : "البرنامج العلاجي الشامل لإستخراج العقد")}
                    onChange={(e) => setVal("services", "infographic", "infographicTitle", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                  />
                </div>
              </div>

              {/* 6. Final CTA */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">6</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم الدعوة الختامية وزر التسجيل (Final CTA)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">البطاقة السفلية التشجيعية بصفحة الخدمات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("services", "cta")}
                    disabled={isSaving === "services_cta"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "services_cta" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم الدعوة
                  </button>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي للبطاقة</label>
                      <input
                        value={getVal("services", "cta", "ctaTitle", isTr ? "Tereddüt Etmeyin, Şifa Bir Adımla Başlar" : "لا تتردد، فالشفاء يبدأ بخطوة")}
                        onChange={(e) => setVal("services", "cta", "ctaTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر الإجراء (Button Text)</label>
                      <input
                        value={getVal("services", "cta", "ctaButton", isTr ? "Başvurunuzu Yapın" : "سجل حالتك للبدء الآن")}
                        onChange={(e) => setVal("services", "cta", "ctaButton", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف التحفيزي</label>
                      <textarea
                        rows={2}
                        value={getVal("services", "cta", "ctaDesc", isTr ? "Sesli danışmanlık, durumunuzu doğru anlamanın ve Allah'ın izniyle size özel şifa yolculuğuna başlamanın anahtarıdır — rastgele harcamalar olmadan." : "الاستشارة الصوتية هي المفتاح للتعرف على حالتك بدقة والبدء بمسار العلاج الشافي والمخصص لك بإذن الله دون تكاليف عشوائية.")}
                        onChange={(e) => setVal("services", "cta", "ctaDesc", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: COURSES PAGE (100% Matching /courses) */}
          {/* ========================================================================= */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              {/* 1. Courses Program & Hero */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">ترويسة ونبذة البرنامج التدريبي</h2>
                      <p className="text-xs text-text-secondary mt-0.5">الشارة، العنوان الرئيسي، الوصف الترحيبي، وتفاصيل نبذة البرنامج</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("courses", "program")}
                    disabled={isSaving === "courses_program"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "courses_program" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الترويسة والنبذة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الشارة العلوية (Badge)</label>
                    <input
                      value={getVal("courses", "program", "badge", isTr ? "Eğitim Programı Hakkında" : "عن البرنامج التدريبي")}
                      onChange={(e) => setVal("courses", "program", "badge", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي للترويسة</label>
                    <input
                      value={getVal("courses", "program", "heroTitle", isTr ? "Rukye ve Terapist Yetiştirme Eğitimi" : "تدريب وتأهيل الرقاة والمعالجين")}
                      onChange={(e) => setVal("courses", "program", "heroTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف في الترويسة</label>
                    <textarea
                      rows={2}
                      value={getVal("courses", "program", "heroDesc", isTr ? "Kur'an ve Sünnet doğrultusunda yetkin terapistler yetiştirmeyi amaçlayan yoğun program." : "برنامج متخصص ومكثف يهدف إلى إعداد وتأهيل معالجين متمكنين وفق الكتاب والسنة، مع تدريب عملي دقيق.")}
                      onChange={(e) => setVal("courses", "program", "heroDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان قسم النبذة</label>
                    <input
                      value={getVal("courses", "program", "aboutTitle", isTr ? "Eğitim Programı Hakkında" : "عن البرنامج التدريبي")}
                      onChange={(e) => setVal("courses", "program", "aboutTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">شرح وتفاصيل البرنامج الكامل</label>
                    <textarea
                      rows={3}
                      value={getVal("courses", "program", "programDesc", isTr ? "Düğüm çözme ve şer'i rukye esaslarına dayalı kapsamlı eğitim programı." : "برنامج شامل يتضمن تدريباً عملياً على إعداد البرامج العلاجية باستخدام الزيوت العشبية لاستخراج العقد والأسحار وطرد الشيطان من الجسد لجميع الإصابات الروحية، والتعامل مع مختلف الحالات المستعصية، ضمن ضوابط شرعية وأخلاقية دقيقة.")}
                      onChange={(e) => setVal("courses", "program", "programDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Courses Features (5 Features) */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">مميزات البرنامج الشامل (5 مميزات)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">عناوين وتفاصيل بطاقات المميزات الخمس</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("courses", "features")}
                    disabled={isSaving === "courses_features"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "courses_features" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ المميزات
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان قسم المميزات</label>
                    <input
                      value={getVal("courses", "features", "title", isTr ? "Kapsamlı Programın Avantajları" : "مميزات البرنامج الشامل")}
                      onChange={(e) => setVal("courses", "features", "title", e.target.value)}
                      className="w-full max-w-md px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {[
                      { num: 1, defaultTitle: isTr ? "Kapsamlı Yeterlilik" : "تأهيل متكامل", defaultDesc: isTr ? "Doğru metodoloji ile tam bilimsel ve pratik yeterlilik." : "تأهيل علمي وعملي متكامل وفق منهجية صحيحة." },
                      { num: 2, defaultTitle: isTr ? "Tedavi Programları" : "البرامج العلاجية", defaultDesc: isTr ? "Bitkisel sistem ve tedavi programları hazırlama teknikleri eğitimi." : "تعليم فنيات إعداد البرامج العلاجية والمنظومة العشبية." },
                      { num: 3, defaultTitle: isTr ? "Şer'i Esaslar" : "ضوابط شرعية", defaultDesc: isTr ? "Şer'i rukye kuralları ve terapist ahlakının detaylı incelenmesi." : "دراسة دقيقة لضوابط الرقية الشرعية وأخلاقيات المعالج." },
                      { num: 4, defaultTitle: isTr ? "Zorlu Vakalar" : "الحالات المعقدة", defaultDesc: isTr ? "Zorlu ve ağır vakalarla başa çıkma yöntemleri üzerine yoğunlaşma." : "التركيز والتدريب على كيفية التعامل مع الحالات الصعبة والمستعصية." },
                      { num: 5, defaultTitle: isTr ? "Yetkili İcazet" : "إجازة معتمدة", defaultDesc: isTr ? "Merkezden resmi onaylı icazet ve Şeyh Seyfullah Ebu Amir'in doğrudan gözetimi." : "منح إجازة رسمية معتمدة من المركز وإشراف مباشر من الشيخ سيف الله أبو عامر." },
                    ].map((feat) => (
                      <div key={feat.num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2">
                        <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">ميزة {feat.num}</span>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-secondary mb-1">العنوان</label>
                          <input
                            value={getVal("courses", "features", `feat${feat.num}Title`, feat.defaultTitle)}
                            onChange={(e) => setVal("courses", "features", `feat${feat.num}Title`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-border text-xs font-semibold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-text-secondary mb-1">الوصف</label>
                          <textarea
                            rows={2}
                            value={getVal("courses", "features", `feat${feat.num}Desc`, feat.defaultDesc)}
                            onChange={(e) => setVal("courses", "features", `feat${feat.num}Desc`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Golden Feature Box */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center">3</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">صندوق الميزة الذهبية والحصرية (Golden Box)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">شارة، عنوان، وصف، وبنود المتابعة المستمرة الأربعة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("courses", "golden")}
                    disabled={isSaving === "courses_golden"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "courses_golden" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الميزة الذهبية
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الشارة (Badge)</label>
                    <input
                      value={getVal("courses", "golden", "badge", isTr ? "Özel ve Ayrıcalıklı Özellik" : "الميزة الذهبية والحصرية")}
                      onChange={(e) => setVal("courses", "golden", "badge", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("courses", "golden", "title", isTr ? "İcazet Sonrası Sürekli Takip 🎓" : "متابعة مستمرة بعد الإجازة 🎓")}
                      onChange={(e) => setVal("courses", "golden", "title", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-amber-700"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف التفصيلي</label>
                    <textarea
                      rows={2}
                      value={getVal("courses", "golden", "description", isTr ? "Sahadaki yeterliliği garanti altına almak için 3 ay boyunca doğrudan süpervizyon sağlanır." : "حرصًا منا على اكتمال التأهيل وضمان الجاهزية الميدانية، لا يُترك الراقي دون توجيه بعد حصوله على الإجازة الشرعية، بل يستمر الإشراف المباشر لمدة ثلاثة أشهر كاملة.")}
                      onChange={(e) => setVal("courses", "golden", "description", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <p className="text-xs font-bold text-text-primary mb-2.5">البنود الأربعة:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { num: 1, defaultVal: isTr ? "Sahadaki vakaların takibi" : "متابعة الحالات التي يعالجها الراقي في الميدان" },
                        { num: 2, defaultVal: isTr ? "Sürekli bilimsel ve pratik rehberlik" : "تقديم التوجيه العلمي والعملي المستمر والدائم" },
                        { num: 3, defaultVal: isTr ? "Saha hatalarını düzeltme ve yetkinliği artırma" : "تصحيح الأخطاء الميدانية وتعزيز التمكن" },
                        { num: 4, defaultVal: isTr ? "Zor sorulara doğrudan cevaplar" : "الإجابة المباشرة عن كافة الاستفسارات الصعبة" },
                      ].map((item) => (
                        <div key={item.num} className="p-3 bg-gray-50/80 rounded-xl border border-border/80">
                          <label className="block text-[11px] font-semibold text-text-secondary mb-1">بند {item.num}</label>
                          <input
                            value={getVal("courses", "golden", `item${item.num}`, item.defaultVal)}
                            onChange={(e) => setVal("courses", "golden", `item${item.num}`, e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-border text-xs bg-white font-medium"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Notes & CTA */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">4</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم التنويه الهام والدعوة والدعاء الختامي</h2>
                      <p className="text-xs text-text-secondary mt-0.5">التنبيه الطبي والشرعي، دعوة الاستفسار والتسجيل، والدعاء</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("courses", "notes_cta")}
                    disabled={isSaving === "courses_notes_cta"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "courses_notes_cta" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ التنويه والدعوة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان التنويه المهم</label>
                    <input
                      value={getVal("courses", "notes_cta", "notesTitle", isTr ? "Önemli Şer'i ve Tıbbi Uyarı" : "تنويه شرعي وطبي مهم")}
                      onChange={(e) => setVal("courses", "notes_cta", "notesTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-amber-800"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص التنويه</label>
                    <textarea
                      rows={2}
                      value={getVal("courses", "notes_cta", "notesDesc", isTr ? "Şer'i rukye bir vesiledir; şifa yalnızca Allah'tandır. Tıbbi tedavilerin yerini tutmaz." : "نؤكد بشكل قاطع أن الرقية الشرعية هي (سببٌ من الأسباب) والله هو الشافي وحده، وهي لا تُغني أبداً عن الأخذ بالأسباب الطبية والتوجه للمختصين عند الحاجة.")}
                      onChange={(e) => setVal("courses", "notes_cta", "notesDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان دعوة التسجيل</label>
                    <input
                      value={getVal("courses", "notes_cta", "ctaTitle", isTr ? "Daha Fazla Bilgi ve Kayıt İçin" : "هل تود معرفة المزيد والتسجيل؟")}
                      onChange={(e) => setVal("courses", "notes_cta", "ctaTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر التواصل / التسجيل</label>
                    <input
                      value={getVal("courses", "notes_cta", "ctaButton", isTr ? "Danışmak İçin İletişime Geçin" : "تواصل معنا للاستفسار")}
                      onChange={(e) => setVal("courses", "notes_cta", "ctaButton", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف التحفيزي</label>
                    <input
                      value={getVal("courses", "notes_cta", "ctaDesc", isTr ? "Gelecek dönem tarihleri ve kayıt şartları hakkında bilgi almak için iletişime geçin." : "استفسر الآن عن مواعيد الدورة القادمة، شروط الالتحاق، وآلية التسجيل المعتمدة عبر قنواتنا الرسمية.")}
                      onChange={(e) => setVal("courses", "notes_cta", "ctaDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عبارة الدعاء أسفل الصفحة</label>
                    <input
                      value={getVal("courses", "notes_cta", "doaText", isTr ? "Allah'tan herkes için kabul ve muvaffakiyet dileriz 🌿" : "نسأل الله القبول والتوفيق والسداد للجميع 🌿")}
                      onChange={(e) => setVal("courses", "notes_cta", "doaText", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: TREATMENT JOURNEY (100% Matching /treatment-journey) */}
          {/* ========================================================================= */}
          {activeTab === "journey" && (
            <div className="space-y-6">
              {/* 1. Journey Hero */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">ترويسة صفحة الرحلة العلاجية</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان والوصف الترحيبي</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("treatment_journey", "hero")}
                    disabled={isSaving === "treatment_journey_hero"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "treatment_journey_hero" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الترويسة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("treatment_journey", "hero", "heroTitle", isTr ? "Tedavi Yolculuğunuz Nasıl İlerler?" : "الرحلة العلاجية")}
                      onChange={(e) => setVal("treatment_journey", "hero", "heroTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف</label>
                    <textarea
                      rows={2}
                      value={getVal("treatment_journey", "hero", "heroDesc", isTr ? "İlk danışmanlıktan tam şifaya kadar adım adım tedavi süreci." : "منهجية علاجية متكاملة تبدأ بالتقييم الصحيح وتمر بالرقية واستخراج العقد وتختتم بالتحصين والمتابعة")}
                      onChange={(e) => setVal("treatment_journey", "hero", "heroDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Timeline Steps (7 Steps) */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">المراحل السبعة للرحلة العلاجية (7 خطوات كاملة)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">المخطط الزمني الكامل لرحلة المريض من التسجيل حتى الشفاء والتحصين</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("treatment_journey", "steps")}
                    disabled={isSaving === "treatment_journey_steps"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "treatment_journey_steps" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ المراحل السبعة
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      num: 1,
                      defaultTitle: isTr ? "1- Başvuru Kaydı" : "1- تسجيل الطلب",
                      defaultDesc: isTr ? "Talebinizi kaydedin, resepsiyon görevlimiz detayları açıklamak için sizinle iletişime geçsin." : "سجل طلبك وسيقوم موظف الاستقبال بالتواصل معك لشرح تفاصيل العلاج بإشراف المعالج وبشكل خاص وهذا الإجراء مهم لنا لنقدم لك أفضل خدمة ممكنة بدون عشوائية."
                    },
                    {
                      num: 2,
                      defaultTitle: isTr ? "2- Danışmanlık Randevusu" : "2- حجز موعد استشارة",
                      defaultDesc: isTr ? "İletişim sonrası randevunuz ayarlanır ve detaylar iletilir; belirlenen saatte terapistle doğrudan görüşürsünüz." : "بعد التواصل معك سيقوم الموظف بحجز موعد استشارة لك ويرسل لك جميع التفاصيل بالموعد وستتواصل مع المعالج بشكل مباشر في الموعد المحدد بدون تأخير أو تأجيل."
                    },
                    {
                      num: 3,
                      defaultTitle: isTr ? "3- Sesli Danışmanlık" : "3- الاستشارة الصوتية",
                      defaultDesc: isTr ? "Google Meet üzerinden yapılan görüşmede durumunuz değerlendirilir, uygun tedavi planı ve şartları sunulur." : "هي عبارة عن مكالمة صوتية بينك وبين الراقي وتكون عبر برنامج google meet تشرح من خلالها المشكلة بشكل مفصل وسيقوم الراقي بتقييم حالتك وإرشادك للخطة العلاجية المناسبة لك كما سيقوم بتزويدك بشروط العلاج وتكاليفه."
                    },
                    {
                      num: 4,
                      defaultTitle: isTr ? "4- Teşhis Seansı ve Tedavinin Teslimi" : "4- جلسة التشخيص واستلام العلاج",
                      defaultDesc: isTr ? "Rukye okunarak durum netleştirilir, tedavi teslim edilir ve istifrağ seanslarına kadar telefonla takip edilir." : "بعد جلسة الاستشارة ستنتقل لجلسة التشخيص وهي عبارة عن جلسة تتم فيها قراءة الرقية الشرعية للتأكد من الحالة الروحية ثم نقوم بتسليم العلاج ونتابع حالتك عبر الهاتف حتى تصل لمرحلة جلسات الاستفراغ."
                    },
                    {
                      num: 5,
                      defaultTitle: isTr ? "5- Tedavinin Uygulanması" : "5- بعد استلامك العلاج! أين تطبق العلاج",
                      defaultDesc: isTr ? "Tedavi evinizde uygulanır, terapist sesli ve görüntülü aramalarla düzenli takip ve destek sağlar." : "يكون استخدام العلاج في منزلك وسيتواصل معك الراقي بشكل دوري ليتابع حالتك عبر الهاتف ومكالمات فيديو ورسائل صوتية وكتابية وسيقدم لك الدعم بشكل مستمر خلال هذه الفترة بإذن الله."
                    },
                    {
                      num: 6,
                      defaultTitle: isTr ? "6- İstifrağ ve Düğüm Çözme Seansları" : "6- جلسات الاستفراغ",
                      defaultDesc: isTr ? "Program bitiminde seanslar başlar; terapist sürekli rehberlik ve destek sunar." : "بعد انتهاء مدة البرنامج ستبدأ جلسات الاستفراغ وتكون اما مباشره في مكان سكنك او عبر مكالمات فيديو او رسائل كتابية او صوتية و سيقوم الراقي بتقديم التوجيه المستمر والإرشاد الدائم والسند في هذه الجلسات."
                    },
                    {
                      num: 7,
                      defaultTitle: isTr ? "7- Kapanış Rukye Seansları" : "7- جلسات الرقية الختامية",
                      defaultDesc: isTr ? "Düğümler çıkarıldıktan sonra hastanın evinde doğrudan yüz yüze kapanış rukye seansları uygulanır." : "بعد انتهاء من استخراج العقد ستكون جلسات الرقية حصريا مباشرة وذلك من أجل تحقيق أكبر فائدة للمريض والتعامل مع الحالة بكل احترافية وتكون الجلسات في منزل خاص بالمريض ويزوره الراقي."
                    },
                  ].map((step) => (
                    <div key={step.num} className="p-4 bg-gray-50/80 rounded-2xl border border-border/80 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                          {step.num}
                        </span>
                        <label className="text-xs font-bold text-text-primary">عنوان الخطوة {step.num}</label>
                      </div>
                      <input
                        value={getVal("treatment_journey", "steps", `step${step.num}Title`, step.defaultTitle)}
                        onChange={(e) => setVal("treatment_journey", "steps", `step${step.num}Title`, e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-border text-sm font-semibold bg-white"
                      />
                      <div>
                        <label className="block text-[11px] font-semibold text-text-secondary mb-1">شرح وتفاصيل الخطوة</label>
                        <textarea
                          rows={2}
                          value={getVal("treatment_journey", "steps", `step${step.num}Desc`, step.defaultDesc)}
                          onChange={(e) => setVal("treatment_journey", "steps", `step${step.num}Desc`, e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-border text-xs bg-white resize-y leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Journey CTA */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">3</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">قسم الدعوة الختامية لصفحة الرحلة</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان، الوصف، وأزرار الحجز والخدمات</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("treatment_journey", "cta")}
                    disabled={isSaving === "treatment_journey_cta"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "treatment_journey_cta" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ قسم الدعوة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("treatment_journey", "cta", "ctaTitle", isTr ? "İyileşme Yolculuğunuza Başlayın" : "ابدأ رحلتك نحو التعافي")}
                      onChange={(e) => setVal("treatment_journey", "cta", "ctaTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف</label>
                    <input
                      value={getVal("treatment_journey", "cta", "ctaDesc", isTr ? "İlk adım en önemlisidir. Durumunuzu kaydedin, her adımda yanınızdayız." : "الخطوة الأولى هي الأهم. سجّل حالتك وسنكون معك في كل خطوة بإذن الله")}
                      onChange={(e) => setVal("treatment_journey", "cta", "ctaDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر حجز الحالة</label>
                    <input
                      value={getVal("treatment_journey", "cta", "ctaBook", isTr ? "Randevu Al" : "سجّل حالتك")}
                      onChange={(e) => setVal("treatment_journey", "cta", "ctaBook", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر التعرف على الخدمات</label>
                    <input
                      value={getVal("treatment_journey", "cta", "ctaServices", isTr ? "Hizmetlerimizi İnceleyin" : "تعرّف على خدماتنا")}
                      onChange={(e) => setVal("treatment_journey", "cta", "ctaServices", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: FAQ PAGE */}
          {/* ========================================================================= */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              {/* FAQ Hero */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">ترويسة ودعوة صفحة الأسئلة الشائعة</h2>
                      <p className="text-xs text-text-secondary mt-0.5">العنوان، الوصف، والبطاقة الختامية أسفل الأسئلة</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("faq", "hero")}
                    disabled={isSaving === "faq_hero"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "faq_hero" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ ترويسة ودعوة الأسئلة
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العنوان الرئيسي</label>
                    <input
                      value={getVal("faq", "hero", "heroTitle", isTr ? "Sıkça Sorulan Sorular" : "الأسئلة الشائعة")}
                      onChange={(e) => setVal("faq", "hero", "heroTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">الوصف الترحيبي</label>
                    <textarea
                      rows={2}
                      value={getVal("faq", "hero", "heroDesc", isTr ? "Hizmetlerimiz, seanslar ve süreç hakkında en çok merak edilenler." : "نجيب على أبرز التساؤلات والاستفسارات ويمكنكم الحصول على المزيد من خلال تسجيل حالتكم حيث سيجيب موظف الاستقبال على جميع أسئلتكم بإذن الله هدفنا تقديم خدمة مميزة لكم حتى في استفساراتكم والشفافية أهم أهدافنا")}
                      onChange={(e) => setVal("faq", "hero", "heroDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">عنوان دعوة لم تجد إجابة؟</label>
                    <input
                      value={getVal("faq", "hero", "ctaTitle", isTr ? "Sorunuza Cevap Bulamadınız mı?" : "لم تجد إجابة لسؤالك؟")}
                      onChange={(e) => setVal("faq", "hero", "ctaTitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">وصف الدعوة</label>
                    <input
                      value={getVal("faq", "hero", "ctaDesc", isTr ? "Bizimle doğrudan iletişime geçin, yardımcı olmaktan mutluluk duyarız." : "تواصل معنا مباشرة وسنسعد بالإجابة على جميع استفساراتك")}
                      onChange={(e) => setVal("faq", "hero", "ctaDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر اتصل بنا</label>
                    <input
                      value={getVal("faq", "hero", "ctaContact", isTr ? "İletişime Geçin" : "اتصل بنا")}
                      onChange={(e) => setVal("faq", "hero", "ctaContact", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص زر سجّل حالتك</label>
                    <input
                      value={getVal("faq", "hero", "ctaBook", isTr ? "Randevu Al" : "سجّل حالتك")}
                      onChange={(e) => setVal("faq", "hero", "ctaBook", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-accent"
                    />
                  </div>
                </div>
              </div>

              {/* FAQ Database Bank */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">بنك الأسئلة الشائعة الفعلي ({faqsList.length} سؤال)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">الأسئلة المعروضة في صفحة الأسئلة وأسفل الصفحات</p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenNewFaq}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all shadow-sm self-end sm:self-auto"
                  >
                    <Plus size={15} /> إضافة سؤال جديد
                  </button>
                </div>

                {isLoadingFaqs ? (
                  <div className="py-12 text-center">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                  </div>
                ) : faqsList.length === 0 ? (
                  <div className="py-12 text-center text-text-secondary">لا توجد أسئلة شائعة مسجلة حالياً</div>
                ) : (
                  <div className="divide-y divide-border">
                    {faqsList.map((f, i) => (
                      <div key={f.id} className="py-4 flex items-start justify-between gap-4 group">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <p className="font-bold text-text-primary text-sm flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                              {i + 1}
                            </span>
                            {f.question}
                          </p>
                          <p className="text-xs text-text-secondary leading-relaxed ps-7">{f.answer}</p>
                          {f.question_tr && (
                            <div className="mt-2 ps-7 pt-2 border-t border-dashed border-border/70 text-xs">
                              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded me-2">الترجمة التركية:</span>
                              <span className="font-semibold text-text-primary">{f.question_tr}</span>
                              <p className="text-text-muted mt-0.5">{f.answer_tr}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditFaq(f)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-text-secondary hover:text-primary transition-colors"
                            title="تعديل"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteFaq(f.id)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"
                            title="حذف"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: GLOBAL / HEADER / FOOTER */}
          {/* ========================================================================= */}
          {activeTab === "global" && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">1</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">إعدادات الهيدر والشعار العلوي</h2>
                      <p className="text-xs text-text-secondary mt-0.5">اسم المركز والعبارة المرافقة للشعار في أعلى الموقع</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("global", "header")}
                    disabled={isSaving === "global_header"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "global_header" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الهيدر
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">اسم الموقع المختصر في الهيدر</label>
                    <input
                      value={getVal("global", "header", "siteNameShort", isTr ? "Ruqya Şifa" : "مركز الرقية بكلام الرحمن")}
                      onChange={(e) => setVal("global", "header", "siteNameShort", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-primary mb-1.5">العبارة التوضيحية المرافقة للشعار</label>
                    <input
                      value={getVal("global", "header", "siteNameSubtitle", isTr ? "Manevi Şifa Merkezi" : "لرد كيد الشيطان")}
                      onChange={(e) => setVal("global", "header", "siteNameSubtitle", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">2</span>
                    <div>
                      <h2 className="text-lg font-bold text-text-primary">إعدادات ونصوص الفوتر (تذييل الموقع)</h2>
                      <p className="text-xs text-text-secondary mt-0.5">البسملة ونبذة عن المركز أسفل الموقع</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSaveSection("global", "footer")}
                    disabled={isSaving === "global_footer"}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-light transition-all disabled:opacity-50 self-end sm:self-auto"
                  >
                    {isSaving === "global_footer" ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                    حفظ الفوتر
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نص البسملة أو الشعار الافتتاحي أسفل الفوتر</label>
                    <input
                      value={getVal("global", "footer", "basmala", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ")}
                      onChange={(e) => setVal("global", "footer", "basmala", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold text-primary"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-text-primary mb-1.5">نبذة مختصرة عن المركز أسفل الفوتر</label>
                    <textarea
                      rows={2}
                      value={getVal("global", "footer", "aboutDesc", isTr ? "Kur'an ve Sünnet ışığında manevi tedavi merkezi. Kur'an-ı Kerim ve Peygamberimizin sünnetiyle şifaya vesile olmaya çalışıyoruz." : "مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم. نسعى لمساعدة المرضى على التعافي بإذن الله من خلال العلاج بكتاب الله وسنة رسوله ﷺ.")}
                      onChange={(e) => setVal("global", "footer", "aboutDesc", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border text-sm resize-y leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ Modal (Dual Language: Arabic + Turkish) */}
      <Modal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
        title={editingFaq ? "تعديل السؤال الشائع (عربي وتركي)" : "إضافة سؤال شائع جديد (عربي وتركي)"}
      >
        <form onSubmit={handleSaveFaqSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
          {/* Arabic Section */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-border space-y-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md inline-block">النسخة العربية (الأساسية)</span>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">نص السؤال بالعربية *</label>
              <input
                required
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white font-bold"
                placeholder="مثال: هل يمكن حضور الجلسات بشكل مباشر في المركز؟"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">نص الإجابة بالعربية *</label>
              <textarea
                required
                rows={3}
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white resize-y leading-relaxed"
                placeholder="اكتب الإجابة الشافية والدقيقة بالعربية..."
              />
            </div>
          </div>

          {/* Turkish Section */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md inline-block">الترجمة باللغة التركية (Türkçe - اختياري)</span>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Soru (السؤال بالتركي)</label>
              <input
                value={faqForm.question_tr}
                onChange={(e) => setFaqForm({ ...faqForm, question_tr: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white font-medium"
                placeholder="Örnek: Seanslara merkezde doğrudan katılmak mümkün mü?"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">Cevap (الإجابة بالتركي)</label>
              <textarea
                rows={3}
                value={faqForm.answer_tr}
                onChange={(e) => setFaqForm({ ...faqForm, answer_tr: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white resize-y leading-relaxed"
                placeholder="Türkçe detaylı cevabı buraya yazın..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-primary mb-1.5">ترتيب العرض</label>
            <input
              type="number"
              min="1"
              value={faqForm.display_order}
              onChange={(e) => setFaqForm({ ...faqForm, display_order: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              dir="ltr"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border mt-3">
            <button
              type="button"
              onClick={() => setShowFaqModal(false)}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSavingFaq}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all disabled:opacity-50"
            >
              {isSavingFaq ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {editingFaq ? "حفظ التعديل" : "إضافة السؤال"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
