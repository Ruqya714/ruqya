const fs = require('fs');
const path = require('path');

// 1. Fix Contact Page Address
const contactPath = path.join(process.cwd(), 'src/app/[locale]/(public)/contact/page.tsx');
let contactContent = fs.readFileSync(contactPath, 'utf8');
contactContent = contactContent.replace(
  /value: settings.address \|\| t\("addressValue"\)/g,
  `value: locale === 'tr' ? t("addressValue") : (settings.address || t("addressValue"))`
);
// Also phone input translation fix
// The placeholder doesn't come from t()? Let's check contact form.
// Actually ContactForm is a separate component `src/components/ui/ContactForm.tsx`.
fs.writeFileSync(contactPath, contactContent, 'utf8');

// 2. Fix Footer Address
const footerPath = path.join(process.cwd(), 'src/components/layout/Footer.tsx');
let footerContent = fs.readFileSync(footerPath, 'utf8');
// Footer uses `useTranslations` so we can do `const locale = useLocale();`
if (!footerContent.includes('const locale = useLocale();')) {
  footerContent = footerContent.replace(
    /import \{ useTranslations \} from "next-intl";/,
    `import { useTranslations, useLocale } from "next-intl";`
  );
  footerContent = footerContent.replace(
    /const t = useTranslations\("Footer"\);/,
    `const t = useTranslations("Footer");\n  const locale = useLocale();`
  );
}
// Replace settings.address
footerContent = footerContent.replace(
  /\{settings.address \|\| t\("location"\)\}/g,
  `{locale === 'tr' ? t("location") : (settings.address || t("location"))}`
);
fs.writeFileSync(footerPath, footerContent, 'utf8');

// 3. Fix Single Blog Article Page
const blogSlugPath = path.join(process.cwd(), 'src/app/[locale]/(public)/blog/[slug]/page.tsx');
let blogContent = fs.readFileSync(blogSlugPath, 'utf8');
// Add getTranslations, change params to { locale: string, slug: string }
if (!blogContent.includes('getTranslations')) {
  blogContent = blogContent.replace(
    /import \{ formatDate \}/,
    `import { formatDate } from "@/lib/helpers";\nimport { getTranslations } from "next-intl/server";`
  );
}
blogContent = blogContent.replace(
  /params: Promise<\{ slug: string \}>;/g,
  `params: Promise<{ locale: string, slug: string }>;`
);
blogContent = blogContent.replace(
  /const \{ slug \} = await params;(\s+)const decodedSlug/g,
  `const { locale, slug } = await params;$1const t = await getTranslations({ locale, namespace: "Blog" });$1const decodedSlug`
);

// Replace hardcoded article, etc.
blogContent = blogContent.replace(
  /const categoryLabels: Record<string, string> = \{[\s\S]*?\};/,
  `const categoryLabels: Record<string, string> = {
    article: t("article"),
    healing_story: t("healingStory"),
    announcement: t("announcement"),
  };`
);

// Fix Back to Articles
blogContent = blogContent.replace(
  /العودة للمقالات/g,
  `{t("backToArticles") || "العودة للمقالات"}`
);
// Fix share article
blogContent = blogContent.replace(
  /<span className="text-sm font-semibold text-text-primary">مشاركة المقال:<\/span>/g,
  `<span className="text-sm font-semibold text-text-primary">{t("shareArticle") || "مشاركة المقال:"}</span>`
);
// Fix browse more
blogContent = blogContent.replace(
  /تصفح المزيد من المقالات/g,
  `{t("browseMore") || "تصفح المزيد من المقالات"}`
);
// Pass locale to formatDate
blogContent = blogContent.replace(
  /\{formatDate\(article.published_at \|\| article.created_at\)\}/g,
  `{formatDate(article.published_at || article.created_at, locale)}`
);

fs.writeFileSync(blogSlugPath, blogContent, 'utf8');

// 4. Update JSON files for new Blog entries
const arPath = path.join(process.cwd(), 'messages', 'ar.json');
const trPath = path.join(process.cwd(), 'messages', 'tr.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

arData.Blog.backToArticles = "العودة للمقالات";
arData.Blog.shareArticle = "مشاركة المقال:";
arData.Blog.browseMore = "تصفح المزيد من المقالات";
arData.Blog.missingArticle = "مقال غير موجود";

trData.Blog.backToArticles = "Makalelere Dön";
trData.Blog.shareArticle = "Makaleyi Paylaş:";
trData.Blog.browseMore = "Daha Fazla Makale İncele";
trData.Blog.missingArticle = "Makale Bulunamadı";

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2), 'utf8');
fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');

console.log("Patched contact, footer, and blog slug");
