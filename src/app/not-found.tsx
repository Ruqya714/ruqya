import Link from "next/link";
import "./globals.css";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] px-4">
          <div className="text-center max-w-md">
            <p className="text-7xl font-bold text-[#2d6a4f] mb-4">404</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">الصفحة غير موجودة</h1>
            <p className="text-gray-500 mb-8">عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها. ربما تم نقلها أو حذفها.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2d6a4f] text-white font-medium hover:bg-[#3a7d5f] transition-colors"
            >
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
