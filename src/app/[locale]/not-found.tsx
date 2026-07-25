import Link from "next/link";
import { 
  Compass, 
  Home, 
  BookOpen, 
  Calendar, 
  Phone, 
  Sparkles, 
} from "lucide-react";

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F2923] via-[#163830] to-[#0A1D18] text-white relative overflow-hidden font-sans py-12 px-4 sm:px-6 selection:bg-[#D4AF37] selection:text-black">
      {/* Background Glow */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl w-full mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D4AF37] text-sm font-medium mb-8 shadow-inner">
          <Sparkles size={16} className="text-[#D4AF37]" />
          <span>مركز الرقية بكلام الرحمن | Ruqya Center</span>
        </div>

        {/* 404 Title */}
        <div className="relative mb-6">
          <h1 className="text-8xl sm:text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-[#D4AF37] select-none">
            404
          </h1>
          <div className="absolute -bottom-2 start-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full" />
        </div>

        {/* Message */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
          الصفحة غير موجودة | Sayfa Bulunamadı
        </h2>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10 font-light">
          عذراً، لم نتمكن من العثور على الصفحة المطلوبة. Aradığınız sayfa kaldırılmış veya değiştirilmiş olabilir.
        </p>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 text-start">
          <Link
            href="/"
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 backdrop-blur-md shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Home size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">الرئيسية</h3>
            <p className="text-xs text-gray-400">Ana Sayfa</p>
          </Link>

          <Link
            href="/services"
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 backdrop-blur-md shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-[#D4AF37] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">الخدمات العلاجية</h3>
            <p className="text-xs text-gray-400">Hizmetlerimiz</p>
          </Link>

          <Link
            href="/blog"
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 backdrop-blur-md shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">المدونة والمقالات</h3>
            <p className="text-xs text-gray-400">Makaleler</p>
          </Link>

          <Link
            href="/booking"
            className="group p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 backdrop-blur-md shadow-lg hover:-translate-y-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Calendar size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">حجز استشارة</h3>
            <p className="text-xs text-gray-400">Randevu Al</p>
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B89628] text-black font-bold text-base hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto"
          >
            <Home size={18} />
            الرئيسية | Ana Sayfa
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-base backdrop-blur-md transition-all duration-300 w-full sm:w-auto"
          >
            <Phone size={18} className="text-[#D4AF37]" />
            الدعم الفني | İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}
