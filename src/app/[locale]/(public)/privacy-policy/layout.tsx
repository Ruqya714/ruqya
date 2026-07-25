import type { Metadata } from "next";
import { getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Gizlilik Politikası" : "سياسة الخصوصية",
    description: isTr
      ? "Ruqya Center kişisel verilerin korunması ve gizlilik politikası."
      : "سياسة الخصوصية وحماية بيانات المستفيدين والمرضى في مركز الرقية الشرعية.",
    alternates: getPageAlternates(locale, "/privacy-policy"),
  };
}

export default async function PrivacyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";

  return (
    <>
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <h2 className="sr-only">{isTr ? "Ruqya Center Gizlilik Politikası ve Kişisel Veri Korunması" : "سياسة الخصوصية وحماية بيانات المرضى والمستفيدين"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Kişisel Verilerin Korunması ve Gizlilik Standartları" : "معايير السرية التامة وحماية البيانات الشخصية والعلاجية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center olarak hastalarımızın, danışanlarımızın ve site ziyaretçilerimizin özel hayatının gizliliğine ve kişisel verilerinin korunmasına en yüksek seviyede önem veriyoruz. Tüm manevi teşhis görüşmeleri, randevu kayıtları ve kişisel bilgiler son derece gizli tutulmakta olup 6698 sayılı KVKK ilkelerine tam uygun olarak işlenmektedir."
            : "نلتزم في مركز الرقية بكلام الرحمن التزاماً كاملاً بحماية خصوصية كافة المرضى والمستفيدين من خدماتنا. نضمن السرية التامة للمعلومات الاستشارية والمحاضر العلاجية والسجلات المرضية وعدم إفشائها أو مشاركتها مع أي جهة كانت تحت أي ظرف من الظروف."}
        </p>
      </div>
      {children}
    </>
  );
}
