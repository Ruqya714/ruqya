"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/helpers";
import { TipTapEditor } from "@/components/ui";
import { Save, ArrowRight, Eye, Image as ImageIcon, Trash2 } from "lucide-react";

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "article",
    is_published: false,
    locale: "ar",
  });

  const loadArticle = useCallback(async () => {
    if (isNew) return;
    const { data } = await supabase.from("articles").select("*").eq("id", id).single();
    if (data) {
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        cover_image: data.cover_image || "",
        category: data.category || "article",
        is_published: data.is_published || false,
        locale: data.locale || "ar",
      });
    }
    setIsLoading(false);
  }, [id, isNew, supabase]);

  useEffect(() => { loadArticle(); }, [loadArticle]);

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: isNew ? generateSlug(title) : form.slug });
  };

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        cover_image: form.cover_image || null,
        category: form.category,
        is_published: publish ? true : form.is_published,
        published_at: publish ? new Date().toISOString() : undefined,
        author_id: user?.id,
        locale: form.locale,
      };

      if (isNew) {
        await supabase.from("articles").insert(payload);
      } else {
        await supabase.from("articles").update(payload).eq("id", id);
      }

      router.push("/admin/articles");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `articles/${fileName}`;

      const { error } = await supabase.storage.from('public_images').upload(filePath, file);

      if (error) {
        alert('حدث خطأ أثناء رفع الصورة');
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('public_images').getPublicUrl(filePath);
      setForm({ ...form, cover_image: publicUrl });
    } catch (err) {
      alert('حدث خطأ أثناء الرفع');
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/articles")} className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary transition-colors">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-bold text-text-primary">{isNew ? "مقال جديد" : "تعديل المقال"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!form.is_published && (
            <button onClick={() => handleSave(true)} disabled={isSaving || !form.title} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 disabled:opacity-50 transition-all">
              <Eye size={16} /> نشر
            </button>
          )}
          <button onClick={() => handleSave(false)} disabled={isSaving || !form.title} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-all">
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            حفظ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-1.5">العنوان *</label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="عنوان المقال"
            />
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-1.5">المقتطف</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="وصف مختصر للمقال..."
            />
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-1.5">المحتوى</label>
            <div className="min-h-[400px]">
              <TipTapEditor
                content={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-4">صورة الغلاف</h3>
            <div className="space-y-4">
              {form.cover_image ? (
                <div className="relative rounded-lg overflow-hidden border border-border group">
                  <img src={form.cover_image} alt="صورة الغلاف" className="w-full h-40 object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button onClick={() => setForm({ ...form, cover_image: "" })} className="p-2 bg-white text-red-500 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg hover:bg-gray-50 hover:border-primary/50 cursor-pointer transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-muted">
                    <ImageIcon size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">اضغط لرفع صورة العرض</p>
                    <p className="text-xs mt-1">PNG, JPG, WEBP</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-4">إعدادات المقال</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">الرابط (slug)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">التصنيف</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="article">مقال</option>
                  <option value="healing_story">قصة شفاء</option>
                  <option value="announcement">إعلان</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">لغة المقال</label>
                <select
                  value={(form as any).locale || 'ar'}
                  onChange={(e) => setForm({ ...form, locale: e.target.value } as any)}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="ar">العربية (Arabic)</option>
                  <option value="tr">التركية (Turkish)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="accent-primary"
                />
                <label htmlFor="published" className="text-sm">منشور</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
