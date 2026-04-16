const fs = require('fs');
const path = require('path');

const arPath = path.join(process.cwd(), 'messages', 'ar.json');
const trPath = path.join(process.cwd(), 'messages', 'tr.json');

const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

const itemsAr = {
  "q1": "كيف يمكنني البدء بالعلاج بإشراف خاص",
  "a1": "قم بتسجيل حالتك وسيتواصل معك موظف الاستقبال لتقييم حالتك ثم تقوم بالتواصل مع الراقي المشرف عبر مكالمة استشارية للتعرف على حالتك بشكل مفصل ومن هناك ستكون تفاصيل الرحلة واضحة بإذن الله",
  "q2": "هل يتم علاج الحالة بشكل كامل عن بعد",
  "a2": "نحن نركز على المريض الذي لديه إمكانية السفر لمكان إقامة الراقي وذلك لضمان تقديم الخدمة على أكمل وجه كما أننا وفرنا كورساً علاجياً عن بعد للحالات التي لا يمكنها السفر ولكن بدعم وإرشاد محدود",
  "q3": "هل يمكن زيارة المركز مباشر للتشخيص والعلاج بدون استشارة أولية",
  "a3": "هناك أسباب عدة لعدم استقبالنا للمرضى للقراءة والتشخيص بشكل مباشر إلا بعد حجز موعد استشارة صوتية:\n1. للتأكد من جدية المريض والتزامه.\n2. لفهم سبب اتصالهم بنا وضرورة التعرف على حالتهم الصحية.\n3. ليعرف المريض إمكانيته المادية لدفع تكاليف علاجه.\n4. لتوضيح شروط العلاج في المركز، حيث قد لا تناسب جميع الحالات.\n5. لتحديد ما إذا كان المريض مؤهلاً للعلاج عن بعد أم يحتاج إلى حضور مباشر من بداية العلاج إلى نهايته.",
  "q4": "كم تكاليف العلاج",
  "a4": "بسبب اختلاف تكلفة العلاج من مريض لآخر لا يمكن عرض سعر ثابت أو تقريبي للخدمة دون معرفة تفاصيل عن حالة المريض لأن التكلفة تعتمد على نوع الخدمة العلاجية المناسبة للمشكلة التي تعاني منها فنحن نريد أن نقدم لك خدمة مخصصة ومناسبة لحالتك وأن نضمن لك الجودة والفعالية في العلاج ولهذا السبب فإننا نطلب منك حجز موعد لمكالمة استشارية قبل بدء العلاج ففي هذه المكالمة سنستمع إلى حالتك ونسألك بعض الأسئلة لفهم المشكلة بشكل أفضل ثم سنحدد التكلفة المناسبة لحالتك ونخبرك بها وإذا كنت راضيا عن التكلفة فسنحجز لك موعدًا لبدء التشخيص والعلاج . نرجو أن تكون قد فهمت سبب عدم إمكانية تحديد السعر الثابت أو التقريبي لتكلفة العلاج لأن السعر يختلف من مريض لآخر لأن التكلفة تختلف حسب نوع المشكلة التي تريد أن نعالجها لك وأيضاً الزمن اللازم لتحقيق أهدافك من العلاج وكمية المواد العلاجية وعدد الأفراد المصابين الذين يحتاجون للعلاج."
};

const itemsTr = {
  "q1": "Özel gözetim altında tedaviye nasıl başlayabilirim?",
  "a1": "Durumunuzu kaydedin, resepsiyon görevlisi durumunuzu değerlendirmek için sizinle iletişime geçecek, ardından durumunuzu ayrıntılı olarak anlamak için danışman hoca ile bir görüşme yapacaksınız ve o andan itibaren inşallah tedavi yolculuğunuzun ayrıntıları netleşecektir.",
  "q2": "Hastanın tedavisi tamamen uzaktan yapılıyor mu?",
  "a2": "Hizmeti mükemmel bir şekilde sunabilmek için hocanın bulunduğu yere seyahat etme imkanı olan hastalara odaklanıyoruz. Bununla birlikte, seyahat edemeyen durumlar için sınırlı destek ve rehberlik içeren uzaktan bir tedavi kursu da sağladık.",
  "q3": "Ön danışmanlık olmadan tanı ve tedavi için merkezi doğrudan ziyaret edebilir miyim?",
  "a3": "Randevu alıp sesli danışmanlık yapmadan hastaları doğrudan teşhis için kabul etmememizin birkaç nedeni var:\n1. Hastanın ciddiyetini ve kararlılığını teyit etmek için.\n2. Bizimle iletişime geçme nedenlerini anlamak ve sağlık durumlarını bilme gerekliliği.\n3. Hastanın tedavi masraflarını karşılama mali gücünü bilmesi için.\n4. Her duruma uygun olmayabileceği için merkezdeki tedavi şartlarını netleştirmek için.\n5. Hastanın uzaktan tedavi için uygun olup olmadığını veya tedavinin başından sonuna kadar şahsen gelmesinin gerekip gerekmediğini belirlemek için.",
  "q4": "Tedavi masrafları ne kadar?",
  "a4": "Tedavi maliyeti her hastaya göre değiştiğinden, hastanın durumu hakkında detayları bilmeden hizmet için sabit veya yaklaşık bir fiyat sunmak mümkün değildir; çünkü maliyet, yaşadığınız soruna uygun tedavi hizmetinin türüne bağlıdır. Size özel ve durumunuza uygun bir hizmet sunmak, tedavide kalite ve etkinliği garanti etmek istiyoruz. Bu nedenle, tedaviye başlamadan önce bir danışma görüşmesi için randevu almanızı istiyoruz. Bu görüşmede durumunuzu dinleyecek ve sorunu daha iyi anlamak için size bazı sorular soracağız. Ardından durumunuz için uygun maliyeti belirleyip size bildireceğiz. Eğer maliyeti kabul ederseniz, teşhis ve tedaviye başlamak için size bir ziyaret randevusu ayarlayacağız. Tedavi maliyeti için sabit veya yaklaşık bir fiyat belirleyememizin nedenini anladığınızı umuyoruz; çünkü hastanın durumu, çözülmesini istediğiniz sorunun türüne, tedavi hedeflerinize ulaşmak için gereken süreye, tedavi malzemelerinin miktarına ve tedaviye ihtiyaç duyan bireylerin sayısına göre değişiklik gösterir."
};

arData.FAQ.items = itemsAr;
trData.FAQ.items = itemsTr;

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2), 'utf8');
fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');

// Now patch faq/page.tsx
const pagePath = path.join(process.cwd(), 'src/app/[locale]/(public)/faq/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// replace getTranslations code
pageContent = pageContent.replace(/const HARDCODED_FAQS = \[[\s\S]*?\];/, `
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return {
    title: t("heroTitle"),
    description: t("heroDesc")
  };
}
`);

// The function FAQPage() doesn't need to be async anymore if we don't fetch settings, but let's keep it async since params is promised
pageContent = pageContent.replace(/export default async function FAQPage\(\) \{[\s\S]*?return <FAQContent faqs=\{HARDCODED_FAQS\} \/>;\n\}/, `
export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ.items" });
  
  const faqs = [
    { id: "1", question: t("q1"), answer: t("a1") },
    { id: "2", question: t("q2"), answer: t("a2") },
    { id: "3", question: t("q3"), answer: t("a3") },
    { id: "4", question: t("q4"), answer: t("a4") }
  ];

  return <FAQContent faqs={faqs as any} />;
}`);

// remove metadata since it's hardcoded at the top
pageContent = pageContent.replace(/export const metadata: Metadata = \{[\s\S]*?\};/, '');


fs.writeFileSync(pagePath, pageContent, 'utf8');
console.log('FAQ translation patched.');

