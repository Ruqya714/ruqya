"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export default function ShareArticleButtons({ title }: { title: string }) {
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy link
      handleCopy();
    }
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      toast("تم نسخ رابط المقال بنجاح", "success");
    } catch (err) {
      toast("تعذر نسخ الرابط", "error");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShare}
        className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
        title="مشاركة المقال"
        aria-label="مشاركة المقال"
        type="button"
      >
        <Share2 size={18} />
      </button>
      <button
        onClick={handleCopy}
        className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors"
        title="نسخ الرابط"
        aria-label="نسخ الرابط"
        type="button"
      >
        <LinkIcon size={18} />
      </button>
    </div>
  );
}
