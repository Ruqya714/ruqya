import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import { getServicesSchema } from "@/lib/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });
  return {
    title: t("heroTitle"),
    description: t("heroDesc"),
  };
}

export default async function ServicesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = "https://ruqyacenter.com";

  const services = [
    {
      name: isTr ? "Manevi Şifa ve Ruqya Teşhisi" : "التشخيص الروحاني المبدئي",
      description: isTr
        ? "Uzman ekibimizle manevi durum tespiti ve kişiye özel teşhis görüşmesi."
        : "تشخيص فردي متخصص لمعرفة الحالة الروحانية وتحديد خطة العلاج المناسبة.",
      url: `${baseUrl}/${locale}/services`,
    },
    {
      name: isTr ? "Kişiye Özel Ruqya Seansları" : "جلسات الرقية الشرعية المباشرة",
      description: isTr
        ? "Kur'an-ı Kerim ve Sünnet ışığında birebir manevi tedavi seansı."
        : "جلسات علاجية خاصة بآيات القرآن الكريمة والأدعية المأثورة بإشراف راقٍ مختص.",
      url: `${baseUrl}/${locale}/services`,
    },
    {
      name: isTr ? "Manevi Danışmanlık ve Takip Programı" : "برنامج المتابعة والاستشارات العلاجية",
      description: isTr
        ? "Tedavi süreci boyunca sürekli manevi rehberlik ve takip hizmeti."
        : "برنامج متابعة دورية وتقييم مستمر لمستويات التحسن وتأكيد الوقاية.",
      url: `${baseUrl}/${locale}/services`,
    },
  ];

  const servicesSchema = getServicesSchema(services, locale);

  return (
    <>
      <JsonLd data={servicesSchema} />
      {children}
    </>
  );
}
