import type { Metadata } from "next";
import {
  Shield,
  Award,
  Users,
  Globe,
  BookOpen,
  Heart,
  CheckCircle,
  Target,
  Eye,
} from "lucide-react";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "تعرف على مركز الرقية بكلام الرحمن لرد كيد الشيطان — تأسس عام 2017 في إسطنبول. رؤيتنا ورسالتنا وفريق العمل.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            مركز متخصص في الرقية الشرعية والعلاج بالقرآن الكريم تأسس عام 2017 في
            إسطنبول، نقدم خدماتنا لجميع أنحاء العالم عبر الإنترنت
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">
                قصتنا
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mt-2 mb-6">
                رحلة بدأت بإيمان ونية صادقة
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  تأسس مركز الرقية بكلام الرحمن لرد كيد الشيطان عام 2017 في مدينة
                  إسطنبول التركية، انطلاقاً من إيمان عميق بأن القرآن الكريم شفاء لما
                  في الصدور وهدى ورحمة للمؤمنين.
                </p>
                <p>
                  بدأنا بتقديم خدمات الرقية الشرعية المباشرة، ثم توسعنا لتقديم
                  الاستشارات والعلاج عن بُعد لتصل خدماتنا إلى المحتاجين في أكثر من
                  20 دولة حول العالم.
                </p>
                <p>
                  نجمع بين الأصالة الشرعية والمنهج العلمي المنظم في التشخيص والعلاج،
                  مع الالتزام التام بالكتاب والسنة في جميع أساليب العلاج.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 lg:p-12 border border-border">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "2017", label: "سنة التأسيس" },
                  { value: "+1000", label: "حالة تم علاجها" },
                  { value: "+20", label: "دولة حول العالم" },
                  { value: "+7", label: "سنوات خبرة" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">رؤيتنا</h3>
              <p className="text-gray-100 leading-relaxed">
                أن نكون المرجع الأول في العالم العربي والإسلامي لتقديم خدمات الرقية
                الشرعية الموثوقة وفق منهج علمي شرعي متكامل، والوصول إلى كل محتاج
                أينما كان.
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-8 text-white">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">رسالتنا</h3>
              <p className="text-gray-100 leading-relaxed">
                تقديم خدمات الرقية الشرعية والعلاج بالقرآن والسنة بأعلى مستوى من
                المهنية والأمانة، مع تثقيف المجتمع حول أهمية التحصين والعلاج
                الشرعي وكيفية الوقاية من الأمراض الروحية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              ما يميّزنا
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              نلتزم بأعلى معايير الجودة والأمانة في تقديم خدماتنا
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield size={24} />,
                title: "منهج شرعي صحيح",
                desc: "نلتزم بالكتاب والسنة في جميع أساليب العلاج والرقية بعيداً عن الخرافات والبدع",
              },
              {
                icon: <Award size={24} />,
                title: "خبرة طويلة",
                desc: "فريق من المعالجين ذوي الخبرة الطويلة في مجال الرقية الشرعية والعلاج الروحي",
              },
              {
                icon: <Globe size={24} />,
                title: "خدمات عالمية",
                desc: "نقدم خدماتنا عبر الإنترنت للمحتاجين في أكثر من 20 دولة حول العالم",
              },
              {
                icon: <BookOpen size={24} />,
                title: "تثقيف ونشر العلم",
                desc: "نهتم بنشر المعرفة الشرعية الصحيحة حول الرقية والتحصين من خلال المقالات والدورات",
              },
              {
                icon: <Heart size={24} />,
                title: "متابعة مستمرة",
                desc: "نتابع كل حالة حتى التعافي التام بإذن الله مع برنامج علاجي متكامل",
              },
              {
                icon: <Users size={24} />,
                title: "سرية تامة",
                desc: "نحافظ على سرية بيانات المرضى ونتعامل بمنتهى الخصوصية والاحترام",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              قيمنا
            </h2>
          </div>
          <div className="space-y-4">
            {[
              "الإخلاص والتقوى في العمل وابتغاء وجه الله تعالى",
              "الالتزام بالمنهج الشرعي الصحيح المستند للكتاب والسنة",
              "الأمانة والصدق في التعامل مع المرضى وذويهم",
              "التطوير المستمر والاستفادة من التقنيات الحديثة",
              "المهنية والاحترافية في تقديم الخدمات",
              "السرية التامة والحفاظ على خصوصية المرضى",
            ].map((value, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-bg hover:bg-primary/5 transition-colors"
              >
                <CheckCircle
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <p className="text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
