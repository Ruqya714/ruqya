import { createClient } from "@/lib/supabase/server";

export interface ServiceTr {
  name_tr?: string;
  description_tr?: string;
}

export interface HealerTr {
  display_name_tr?: string;
  title_tr?: string;
  specialization_tr?: string;
}

export interface FaqTr {
  question_tr?: string;
  answer_tr?: string;
}

/**
 * Server-side helper to fetch Turkish translations map for an entity
 */
export async function getI18nTranslationsMap<T extends object>(
  entity: "services" | "healers" | "faqs"
): Promise<Record<string, T>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", `i18n:${entity}:tr`)
      .maybeSingle();

    if (data?.value) {
      try {
        return JSON.parse(data.value) as Record<string, T>;
      } catch {
        return {};
      }
    }
  } catch (err) {
    console.error(`Error fetching i18n map for ${entity}:`, err);
  }
  return {};
}

/**
 * Server-side helper to save / update Turkish translation for a specific entity ID
 */
export async function saveI18nTranslation(
  entity: "services" | "healers" | "faqs",
  id: string,
  dataTr: Record<string, any>
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const key = `i18n:${entity}:tr`;

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id, value")
      .eq("key", key)
      .maybeSingle();

    let currentMap: Record<string, any> = {};
    if (existing?.value) {
      try {
        currentMap = JSON.parse(existing.value);
      } catch {
        currentMap = {};
      }
    }

    currentMap[id] = {
      ...(currentMap[id] || {}),
      ...dataTr,
    };

    if (existing) {
      await supabase
        .from("site_settings")
        .update({ value: JSON.stringify(currentMap), updated_at: new Date().toISOString() })
        .eq("id", existing.id);
    } else {
      await supabase.from("site_settings").insert({
        key,
        value: JSON.stringify(currentMap),
      });
    }

    return true;
  } catch (err) {
    console.error(`Error saving i18n translation for ${entity}:${id}:`, err);
    return false;
  }
}

/**
 * Server-side helper to remove an entity ID from translations
 */
export async function deleteI18nTranslation(
  entity: "services" | "healers" | "faqs",
  id: string
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const key = `i18n:${entity}:tr`;

    const { data: existing } = await supabase
      .from("site_settings")
      .select("id, value")
      .eq("key", key)
      .maybeSingle();

    if (existing?.value) {
      try {
        const currentMap = JSON.parse(existing.value);
        delete currentMap[id];
        await supabase
          .from("site_settings")
          .update({ value: JSON.stringify(currentMap), updated_at: new Date().toISOString() })
          .eq("id", existing.id);
      } catch {
        // ignore
      }
    }
    return true;
  } catch (err) {
    console.error(`Error deleting i18n translation for ${entity}:${id}:`, err);
    return false;
  }
}
