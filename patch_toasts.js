const fs = require('fs');
const path = require('path');

const arPath = path.join(process.cwd(), 'messages', 'ar.json');
const trPath = path.join(process.cwd(), 'messages', 'tr.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

arData.Blog.copySuccess = "تم نسخ رابط المقال بنجاح";
arData.Blog.copyError = "تعذر نسخ الرابط";
arData.Blog.shareShort = "مشاركة المقال";
arData.Blog.copyShort = "نسخ الرابط";

trData.Blog.copySuccess = "Makale bağlantısı başarıyla kopyalandı";
trData.Blog.copyError = "Bağlantı kopyalanamadı";
trData.Blog.shareShort = "Makaleyi Paylaş";
trData.Blog.copyShort = "Bağlantıyı Kopyala";

fs.writeFileSync(arPath, JSON.stringify(arData, null, 2), 'utf8');
fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');

console.log("Patched ShareArticleButtons translations");
