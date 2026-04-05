/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/helpers";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setArticles(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (id: string, current: boolean) => {
    const update: Record<string, unknown> = { is_published: !current };
    if (!current) update.published_at = new Date().toISOString();
    await supabase.from("articles").update(update).eq("id", id);
    load();
  };

  const deleteArticle = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    await supabase.from("articles").delete().eq("id", id);
    load();
  };

  const catLabel: Record<string, string> = { article: "مقال", healing_story: "قصة شفاء", announcement: "إعلان" };
  const catVariant: Record<string, "primary" | "accent" | "info"> = { article: "primary", healing_story: "accent", announcement: "info" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة المقالات</h1>
          <p className="text-text-secondary text-sm mt-1">{articles.length} مقال</p>
        </div>
        <Link href="/admin/articles/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all">
          <Plus size={16} /> مقال جديد
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-gray-50/50">
              <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary">العنوان</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary hidden sm:table-cell">التصنيف</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary">الحالة</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary hidden md:table-cell">التاريخ</th>
              <th className="text-start px-4 py-3 text-xs font-semibold text-text-secondary">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="py-12 text-center"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-text-secondary">لا توجد مقالات حالياً</td></tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-text-primary max-w-xs truncate">{a.title}</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><Badge variant={catVariant[a.category] || "default"}>{catLabel[a.category] || a.category}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={a.is_published ? "success" : "default"}>{a.is_published ? "منشور" : "مسودة"}</Badge></td>
                  <td className="px-4 py-3 text-xs text-text-muted hidden md:table-cell">{formatDate(a.published_at || a.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/articles/${a.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-primary transition-colors"><Pencil size={14} /></Link>
                      <button onClick={() => togglePublish(a.id, a.is_published)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary transition-colors" title={a.is_published ? "إلغاء النشر" : "نشر"}>
                        {a.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => deleteArticle(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
