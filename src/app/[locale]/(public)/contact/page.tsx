import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/ui/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: t("heroTitle"),
    description: t("heroDesc"),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*");
  
  const settings: Record<string, string> = {};
  if (data) {
    data.forEach((s) => { settings[s.key] = s.value; });
  }

  const formatPhone = (phone: string) => phone.replace(/[^0-9+]/g, '');

  const contactItems = [
    { icon: <Phone size={20} />, label: t("phone"), value: settings.phone || "+90 537 859 88 50", href: `tel:${formatPhone(settings.phone || "+905378598850")}`, dir: "ltr" as const },
    { icon: <MessageCircle size={20} />, label: t("whatsapp"), value: settings.whatsapp || "+90 537 859 88 50", href: `https://wa.me/${formatPhone(settings.whatsapp || "+905378598850").replace('+', '')}`, dir: "ltr" as const },
    { icon: <Mail size={20} />, label: t("email"), value: settings.email || "ruqya714@gmail.com", href: `mailto:${settings.email || "ruqya714@gmail.com"}`, dir: "ltr" as const },
    { icon: <MapPin size={20} />, label: t("address"), value: locale === 'tr' ? t("addressValue") : (settings.address || t("addressValue")), dir: "rtl" as const },
    { icon: <Clock size={20} />, label: t("workHours"), value: t("workHoursValue"), dir: "rtl" as const },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 start-20 w-96 h-96 rounded-full bg-primary-light blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">{t("heroDesc")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">{t("infoTitle")}</h2>
              {contactItems.map((item, i) => {
                const innerContent = (
                  <>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-sm text-text-secondary mt-0.5" dir={item.dir}>{item.value}</p>
                    </div>
                  </>
                );

                if (item.href) {
                  return (
                    <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border hover:border-primary/50 hover:shadow-sm transition-all group cursor-pointer w-full">
                      {innerContent}
                    </a>
                  );
                }

                return (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border transition-colors group">
                    {innerContent}
                  </div>
                );
              })}
            </div>

            {/* Contact form */}
            <div className="md:col-span-1 lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
