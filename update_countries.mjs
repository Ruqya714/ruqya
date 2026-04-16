import fs from 'fs';
import path from 'path';

const COUNTRY_CODES = [
  { code: "+90", ar: "تركيا", tr: "Türkiye" },
  { code: "+966", ar: "السعودية", tr: "Suudi Arabistan" },
  { code: "+971", ar: "الإمارات", tr: "Birleşik Arap Emirlikleri" },
  { code: "+965", ar: "الكويت", tr: "Kuveyt" },
  { code: "+974", ar: "قطر", tr: "Katar" },
  { code: "+973", ar: "البحرين", tr: "Bahreyn" },
  { code: "+968", ar: "عمان", tr: "Umman" },
  { code: "+962", ar: "الأردن", tr: "Ürdün" },
  { code: "+970", ar: "فلسطين", tr: "Filistin" },
  { code: "+961", ar: "لبنان", tr: "Lübnan" },
  { code: "+964", ar: "العراق", tr: "Irak" },
  { code: "+20", ar: "مصر", tr: "Mısır" },
  { code: "+212", ar: "المغرب", tr: "Fas" },
  { code: "+213", ar: "الجزائر", tr: "Cezayir" },
  { code: "+216", ar: "تونس", tr: "Tunus" },
  { code: "+218", ar: "ليبيا", tr: "Libya" },
  { code: "+249", ar: "السودان", tr: "Sudan" },
  { code: "+967", ar: "اليمن", tr: "Yemen" },
  { code: "+963", ar: "سوريا", tr: "Suriye" },
  { code: "+1", ar: "أمريكا/كندا", tr: "ABD/Kanada" },
  { code: "+44", ar: "بريطانيا", tr: "İngiltere" },
  { code: "+49", ar: "ألمانيا", tr: "Almanya" },
  { code: "+33", ar: "فرنسا", tr: "Fransa" },
  { code: "+31", ar: "هولندا", tr: "Hollanda" },
  { code: "+46", ar: "السويد", tr: "İsveç" },
  { code: "+60", ar: "ماليزيا", tr: "Malezya" },
  { code: "+62", ar: "إندونيسيا", tr: "Endonezya" },
  { code: "+92", ar: "باكستان", tr: "Pakistan" },
  { code: "+91", ar: "الهند", tr: "Hindistan" },
];

function updateLocale(fileName, langKey) {
  const filePath = path.join(process.cwd(), 'messages', fileName);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  if (!data.countries) {
    data.countries = {};
  }
  
  // also add missing FAQs or other generic texts here temporarily?
  // I will just add countries for now
  COUNTRY_CODES.forEach(c => {
    // extract key e.g. "+90" -> "c_90", "+1" -> "c_1"
    const key = `c_${c.code.replace('+', '')}`;
    data.countries[key] = c[langKey];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

updateLocale('ar.json', 'ar');
updateLocale('tr.json', 'tr');
console.log('Translations updated!');
