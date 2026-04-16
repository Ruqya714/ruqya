const fs = require('fs');
const path = require('path');

const arPath = path.join(process.cwd(), 'messages', 'ar.json');
const trPath = path.join(process.cwd(), 'messages', 'tr.json');

const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

// 1. Add Infographic translation to Services
arData.Services.infographicTitle = "البرنامج العلاجي الشامل";
arData.Services.infographicDesc = "نظرة شاملة على التسلسل العلاجي المتبع في المركز";

trData.Services.infographicTitle = "Kapsamlı Tedavi Programı";
trData.Services.infographicDesc = "Merkezin uyguladığı tedavi sürecine kapsamlı bir bakış";

// 2. Translate Courses for TR
trData.Courses = {
  "heroTitle": "Rukye ve Şifacıların Eğitimi ve Niteliklendirilmesi",
  "heroDesc": "Kapsamlı ve uzmanlaşmış bir program; Kur'an ve Sünnet'e uygun, pratik eğitimle donatılmış uzman şifacılar yetiştirmeyi amaçlar.",
  "aboutProgram": "Eğitim Programı Hakkında",
  "programDesc": "Tüm ruhsal hastalıklarda (büyü, musallat vb.) bitkisel yağlar kullanarak düğümleri çözme ve bedenden cinleri çıkarma, zor durumlarla başa çıkma pratiği içeren ve tamamen şer'i ve ahlaki sınırları gözeten kapsamlı bir program.",
  "featuresTitle": "Kapsamlı Programın Özellikleri",
  "feat1Title": "Kapsamlı Niteliklendirme",
  "feat1Desc": "Doğru metodolojiye göre bütünleşik bilimsel ve pratik yetkinlik kazanma.",
  "feat2Title": "Tedavi Programları",
  "feat2Desc": "Terapötik programları ve bitkisel sistemleri hazırlama tekniklerinin öğretimi.",
  "feat3Title": "Şer'i Sınırlar",
  "feat3Desc": "Şer'i rukye kurallarının ve terapist ahlakının dikkatlice incelenmesi.",
  "feat4Title": "Karmaşık Vakalar",
  "feat4Desc": "Zor ve karmaşık vakalarla nasıl başa çıkılacağına odaklanma ve pratik staj.",
  "feat5Title": "Onaylı İcazet",
  "feat5Desc": "Şeyh Seyfullah Ebu Amir'in gözetiminde, merkezden resmi ve onaylı icazet verilmesi.",
  "goldenFeatureBadge": "Altın ve Özel Avantaj",
  "goldenTitle": "İcazet Sonrası Sürekli Danışmanlık 🎓",
  "goldenDesc": "Eğitimin eksiksiz olmasını ve sahada tam hazır bulunuşluğu sağlamaya verdiğimiz önemden dolayı, rukye alan öğrenci icazetini aldıktan sonra yalnız bırakılmaz. Bizzat doğrudan rehberlik ve gözetim tam üç ay boyunca devam eder.",
  "goldenItems": [
    "Öğrencinin sahada tedavi ettiği vakaların takibi",
    "Sürekli bilimsel ve pratik rehberlik sağlanması",
    "Saha hatalarının düzeltilmesi ve ustalaşmanın geliştirilmesi",
    "Gerekli tüm zor soruların doğrudan cevaplanması"
  ],
  "notesTitle": "Önemli Şer'i ve Tıbbi Uyarı",
  "notesDesc": "Şunu kesin olarak vurguluyoruz ki, Şer'i Rukye sadece (sebeplerden bir sebeptir) ve Şifa veren yalnızca Allah'tır. Rukye, tıbbi sebeplere başvurmanın ve gerektiğinde uzman hekimlere yönelmenin asla yerini tutamaz.",
  "ctaTitle": "Daha Fazla Bilgi Edinmek ve Kayıt Olmak İster misiniz?",
  "ctaDesc": "Gelecek kurs tarihleri, kayıt koşulları ve onaylı kayıt yöntemleri hakkında resmi iletişim kanallarımızdan hemen bilgi alın.",
  "ctaContact": "Bilgi Almak İçin İletişime Geçin",
  "doa": "Allah'tan herkes için kabul, başarı ve doğruluk dileriz 🌿"
};

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2), 'utf8');
fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');
console.log('JSON files patched for Courses and Services infographic.');

// Modify services/page.tsx
const svcPath = path.join(process.cwd(), 'src/app/[locale]/(public)/services/page.tsx');
let content = fs.readFileSync(svcPath, 'utf8');

content = content.replace(
  '<h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">البرنامج العلاجي الشامل</h2>',
  '<h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">{t("infographicTitle")}</h2>'
);

content = content.replace(
  '<p className="text-text-secondary text-lg">نظرة شاملة على التسلسل العلاجي المتبع في المركز</p>',
  '<p className="text-text-secondary text-lg">{t("infographicDesc")}</p>'
);

fs.writeFileSync(svcPath, content, 'utf8');
console.log('Services page updated.');
