"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { normalizePagePath } from "@/lib/cms";

export interface SaveCmsSectionInput {
  pageName: string;
  sectionKey: string;
  locale: "ar" | "tr";
  contentJson: Record<string, any>;
}

export interface SavePageSeoInput {
  pagePath: string;
  locale: "ar" | "tr";
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

/**
 * Revalidates the page routes for both Arabic and Turkish versions
 */
function revalidatePagePaths(pageNameOrPath: string) {
  const pathMap: Record<string, string> = {
    home: "/",
    "/": "/",
    about: "/about",
    "/about": "/about",
    services: "/services",
    "/services": "/services",
    courses: "/courses",
    "/courses": "/courses",
    treatment_journey: "/treatment-journey",
    "treatment-journey": "/treatment-journey",
    "/treatment-journey": "/treatment-journey",
    blog: "/blog",
    "/blog": "/blog",
    faq: "/faq",
    "/faq": "/faq",
    contact: "/contact",
    "/contact": "/contact",
    booking: "/booking",
    "/booking": "/booking",
    privacy_policy: "/privacy-policy",
    "privacy-policy": "/privacy-policy",
    "/privacy-policy": "/privacy-policy",
    terms_of_service: "/terms-of-service",
    "terms-of-service": "/terms-of-service",
    "/terms-of-service": "/terms-of-service",
  };

  const route = pathMap[pageNameOrPath] || `/${pageNameOrPath.replace(/^\//, "")}`;

  if (pageNameOrPath === "global" || route === "/global") {
    try {
      revalidatePath("/[locale]", "layout");
      revalidatePath("/", "layout");
      revalidatePath("/tr", "layout");
      revalidatePath("/");
      revalidatePath("/tr");
    } catch (err) {
      console.error("Global revalidation error:", err);
    }
    return;
  }

  try {
    revalidatePath(`/[locale]${route === "/" ? "" : route}`, "page");
    revalidatePath(`/[locale]${route === "/" ? "" : route}`, "layout");
    revalidatePath(route);
    revalidatePath(`/tr${route === "/" ? "" : route}`);
  } catch (err) {
    console.error("Revalidation error:", err);
  }
}

/**
 * Server Action: Save CMS Section Content & Instant Cache Invalidation
 */
export async function saveCmsSectionAction(input: SaveCmsSectionInput) {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    const { pageName, sectionKey, locale, contentJson } = input;
    const loc = locale === "tr" ? "tr" : "ar";

    // 1. Try saving into site_content table
    try {
      await supabase.from("site_content").upsert(
        {
          page_name: pageName,
          section_key: sectionKey,
          locale: loc,
          content_json: contentJson,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_name,section_key,locale" }
      );
    } catch {
      // Table doesn't exist or not migrated yet
    }

    // 2. Also save to site_settings for guaranteed compatibility
    const settingsKey = `cms:${pageName}:${sectionKey}:${loc}`;
    const stringified = JSON.stringify(contentJson);

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", settingsKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value: stringified, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({
        key: settingsKey,
        value: stringified,
      });
    }

    // Revalidate Next.js cache for the modified page
    revalidatePagePaths(pageName);

    return { success: true, message: "تم حفظ المحتوى وتحديث الموقع بنجاح" };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ أثناء حفظ المحتوى" };
  }
}

/**
 * Server Action: Save Page SEO Metadata & Instant Cache Invalidation
 */
export async function savePageSeoAction(input: SavePageSeoInput) {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    const { pagePath, locale, metaTitle, metaDescription, metaKeywords, ogImageUrl, canonicalUrl } = input;
    const normPath = normalizePagePath(pagePath);
    const loc = locale === "tr" ? "tr" : "ar";

    // 1. Try saving into pages_seo table
    try {
      await supabase.from("pages_seo").upsert(
        {
          page_path: normPath,
          locale: loc,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords || null,
          og_image_url: ogImageUrl || null,
          canonical_url: canonicalUrl || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "page_path,locale" }
      );
    } catch {
      // Table doesn't exist yet
    }

    // 2. Save into site_settings
    const settingsKey = `seo:${normPath}:${loc}`;
    const seoPayload = {
      title: metaTitle,
      description: metaDescription,
      keywords: metaKeywords || "",
      og_image_url: ogImageUrl || "",
      canonical_url: canonicalUrl || "",
    };

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", settingsKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value: JSON.stringify(seoPayload), updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({
        key: settingsKey,
        value: JSON.stringify(seoPayload),
      });
    }

    // Revalidate Next.js cache
    revalidatePagePaths(normPath);

    return { success: true, message: "تم حفظ إعدادات الـ SEO وتحديث محركات البحث بنجاح" };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ أثناء حفظ إعدادات الـ SEO" };
  }
}

/**
 * Server Action: Load all CMS sections for a given locale (for admin panel)
 */
export async function loadAllCmsSectionsAction(locale: "ar" | "tr") {
  try {
    const supabase = await createClient();
    const loc = locale === "tr" ? "tr" : "ar";
    const result: Record<string, Record<string, any>> = {};

    // 1. Try site_content
    const { data: dedicatedData, error } = await supabase
      .from("site_content")
      .select("page_name, section_key, content_json")
      .eq("locale", loc);

    if (!error && dedicatedData && dedicatedData.length > 0) {
      dedicatedData.forEach((row) => {
        if (!result[row.page_name]) result[row.page_name] = {};
        result[row.page_name][row.section_key] = row.content_json;
      });
      return { success: true, data: result };
    }

    // 2. Try site_settings
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("key, value")
      .like("key", `cms:%:${loc}`);

    if (settingsData) {
      settingsData.forEach((row) => {
        const parts = row.key.split(":");
        if (parts.length === 4) {
          const pageName = parts[1];
          const sectionKey = parts[2];
          try {
            if (!result[pageName]) result[pageName] = {};
            result[pageName][sectionKey] = JSON.parse(row.value);
          } catch {
            // ignore
          }
        }
      });
    }

    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message, data: {} };
  }
}

/**
 * Server Action: Load all SEO entries for a given locale (for admin panel)
 */
export async function loadAllPagesSeoAction(locale: "ar" | "tr") {
  try {
    const supabase = await createClient();
    const loc = locale === "tr" ? "tr" : "ar";
    const result: Record<string, SavePageSeoInput> = {};

    // 1. Try pages_seo
    const { data: seoRows, error } = await supabase
      .from("pages_seo")
      .select("*")
      .eq("locale", loc);

    if (!error && seoRows && seoRows.length > 0) {
      seoRows.forEach((row) => {
        result[row.page_path] = {
          pagePath: row.page_path,
          locale: loc,
          metaTitle: row.meta_title || "",
          metaDescription: row.meta_description || "",
          metaKeywords: row.meta_keywords || "",
          ogImageUrl: row.og_image_url || "",
          canonicalUrl: row.canonical_url || "",
        };
      });
      return { success: true, data: result };
    }

    // 2. Try site_settings
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("key, value")
      .like("key", `seo:%:${loc}`);

    if (settingsData) {
      settingsData.forEach((row) => {
        const parts = row.key.split(":");
        if (parts.length === 3) {
          const pagePath = parts[1];
          try {
            const parsed = JSON.parse(row.value);
            result[pagePath] = {
              pagePath: pagePath,
              locale: loc,
              metaTitle: parsed.title || "",
              metaDescription: parsed.description || "",
              metaKeywords: parsed.keywords || "",
              ogImageUrl: parsed.og_image_url || "",
              canonicalUrl: parsed.canonical_url || "",
            };
          } catch {
            // ignore
          }
        }
      });
    }

    return { success: true, data: result };
  } catch (err: any) {
    return { success: false, error: err.message, data: {} };
  }
}

import { getI18nTranslationsMap, saveI18nTranslation, deleteI18nTranslation, FaqTr, ServiceTr, HealerTr } from "@/lib/i18n-db";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  question_tr?: string;
  answer_tr?: string;
  display_order: number;
}

/**
 * Server Action: Fetch All FAQs (with optional locale merging or full dual data for admin)
 */
export async function fetchFaqsAction(locale?: "ar" | "tr") {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("id, question, answer, display_order")
      .order("display_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    const trMap = await getI18nTranslationsMap<FaqTr>("faqs");
    const faqs = (data || []).map((f) => {
      const tr = trMap[f.id] || {};
      return {
        ...f,
        question: locale === "tr" ? (tr.question_tr || f.question) : f.question,
        answer: locale === "tr" ? (tr.answer_tr || f.answer) : f.answer,
        question_tr: tr.question_tr || "",
        answer_tr: tr.answer_tr || "",
      };
    });

    return { success: true, data: faqs };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/**
 * Server Action: Save / Update FAQ item with Turkish translation
 */
export async function saveFaqAction(item: {
  id?: string;
  question: string;
  answer: string;
  question_tr?: string;
  answer_tr?: string;
  display_order?: number;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    const payload = {
      question: item.question,
      answer: item.answer,
      display_order: item.display_order ?? 1,
    };

    let savedId = item.id;
    if (item.id) {
      const { error } = await supabase.from("faqs").update(payload).eq("id", item.id);
      if (error) throw error;
    } else {
      const { data: inserted, error } = await supabase.from("faqs").insert(payload).select("id").single();
      if (error) throw error;
      savedId = inserted?.id;
    }

    if (savedId && (item.question_tr !== undefined || item.answer_tr !== undefined)) {
      await saveI18nTranslation("faqs", savedId, {
        question_tr: item.question_tr || "",
        answer_tr: item.answer_tr || "",
      });
    }

    revalidatePagePaths("faq");
    return { success: true, message: "تم حفظ السؤال بنجاح" };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ أثناء حفظ السؤال" };
  }
}

/**
 * Server Action: Delete FAQ item
 */
export async function deleteFaqAction(id: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;

    await deleteI18nTranslation("faqs", id);

    revalidatePagePaths("faq");
    return { success: true, message: "تم حذف السؤال بنجاح" };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ أثناء حذف السؤال" };
  }
}

/**
 * Server Action: Fetch Services with Turkish I18n
 */
export async function fetchServicesI18nAction(locale?: "ar" | "tr") {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    const trMap = await getI18nTranslationsMap<ServiceTr>("services");
    const services = (data || []).map((s) => {
      const tr = trMap[s.id] || {};
      return {
        ...s,
        name: locale === "tr" ? (tr.name_tr || s.name) : s.name,
        description: locale === "tr" ? (tr.description_tr || s.description) : s.description,
        name_tr: tr.name_tr || "",
        description_tr: tr.description_tr || "",
      };
    });

    return { success: true, data: services };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/**
 * Server Action: Save Service with Turkish I18n
 */
export async function saveServiceWithI18nAction(payload: {
  id?: string;
  name: string;
  description: string;
  name_tr?: string;
  description_tr?: string;
  price: number | null;
  min_days_delay: number | null;
  max_days_limit: number | null;
  duration_minutes: number;
  display_order: number;
  is_active: boolean;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    const dbPayload = {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      min_days_delay: payload.min_days_delay,
      max_days_limit: payload.max_days_limit,
      duration_minutes: payload.duration_minutes,
      display_order: payload.display_order,
      is_active: payload.is_active,
    };

    let savedId = payload.id;
    if (payload.id) {
      const { error } = await supabase.from("services").update(dbPayload).eq("id", payload.id);
      if (error) throw error;
    } else {
      const { data: inserted, error } = await supabase.from("services").insert(dbPayload).select("id").single();
      if (error) throw error;
      savedId = inserted?.id;
    }

    if (savedId && (payload.name_tr !== undefined || payload.description_tr !== undefined)) {
      await saveI18nTranslation("services", savedId, {
        name_tr: payload.name_tr || "",
        description_tr: payload.description_tr || "",
      });
    }

    revalidatePagePaths("booking");
    revalidatePagePaths("services");
    return { success: true, message: "تم حفظ باقة الاستشارة بنجاح" };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ أثناء حفظ الخدمة" };
  }
}

/**
 * Server Action: Fetch Healers with Turkish I18n
 */
export async function fetchHealersI18nAction(locale?: "ar" | "tr") {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("healers")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message, data: [] };
    }

    const trMap = await getI18nTranslationsMap<HealerTr>("healers");
    const healers = (data || []).map((h) => {
      const tr = trMap[h.id] || {};
      return {
        ...h,
        display_name: locale === "tr" ? (tr.display_name_tr || h.display_name) : h.display_name,
        title: locale === "tr" ? (tr.title_tr || h.title) : h.title,
        specialization: locale === "tr" ? (tr.specialization_tr || h.specialization) : h.specialization,
        display_name_tr: tr.display_name_tr || "",
        title_tr: tr.title_tr || "",
        specialization_tr: tr.specialization_tr || "",
      };
    });

    return { success: true, data: healers };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

/**
 * Server Action: Save Healer with Turkish I18n
 */
export async function saveHealerWithI18nAction(payload: {
  id: string;
  display_name: string;
  title: string;
  specialization?: string;
  experience_years?: number | null;
  photo_url?: string;
  display_name_tr?: string;
  title_tr?: string;
  specialization_tr?: string;
}) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "غير مصرح لك بإجراء هذه العملية" };
    }

    const dbPayload = {
      display_name: payload.display_name,
      title: payload.title,
      specialization: payload.specialization || null,
      experience_years: payload.experience_years ?? null,
      photo_url: payload.photo_url || null,
    };

    const { error } = await supabase.from("healers").update(dbPayload).eq("id", payload.id);
    if (error) throw error;

    if (payload.display_name_tr !== undefined || payload.title_tr !== undefined || payload.specialization_tr !== undefined) {
      await saveI18nTranslation("healers", payload.id, {
        display_name_tr: payload.display_name_tr || "",
        title_tr: payload.title_tr || "",
        specialization_tr: payload.specialization_tr || "",
      });
    }

    revalidatePagePaths("about");
    return { success: true, message: "تم حفظ بيانات المعالج بنجاح" };
  } catch (err: any) {
    return { success: false, error: err.message || "حدث خطأ أثناء حفظ المعالج" };
  }
}

