import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import FAQContent from "./faq-content";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "إجابات لأكثر الأسئلة شيوعاً حول الرقية الشرعية وخدمات مركز الرقية بكلام الرحمن",
};

export default async function FAQPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true });

  return <FAQContent faqs={faqs || []} />;
}
