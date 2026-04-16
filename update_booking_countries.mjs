import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/app/[locale]/(public)/booking/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace COUNTRY_CODES array
const newArray = `const COUNTRY_CODES = [
  { code: "+90", flag: "🇹🇷" },
  { code: "+966", flag: "🇸🇦" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+965", flag: "🇰🇼" },
  { code: "+974", flag: "🇶🇦" },
  { code: "+973", flag: "🇧🇭" },
  { code: "+968", flag: "🇴🇲" },
  { code: "+962", flag: "🇯🇴" },
  { code: "+970", flag: "🇵🇸" },
  { code: "+961", flag: "🇱🇧" },
  { code: "+964", flag: "🇮🇶" },
  { code: "+20", flag: "🇪🇬" },
  { code: "+212", flag: "🇲🇦" },
  { code: "+213", flag: "🇩🇿" },
  { code: "+216", flag: "🇹🇳" },
  { code: "+218", flag: "🇱🇾" },
  { code: "+249", flag: "🇸🇩" },
  { code: "+967", flag: "🇾🇪" },
  { code: "+963", flag: "🇸🇾" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+31", flag: "🇳🇱" },
  { code: "+46", flag: "🇸🇪" },
  { code: "+60", flag: "🇲🇾" },
  { code: "+62", flag: "🇮🇩" },
  { code: "+92", flag: "🇵🇰" },
  { code: "+91", flag: "🇮🇳" },
];`;

content = content.replace(/const COUNTRY_CODES = \[(?:[\s\S]*?)\];/, newArray);

// Add useTranslations for countries
// Look for: const t = useTranslations("Booking");
content = content.replace(
  /const t = useTranslations\("Booking"\);/,
  `const t = useTranslations("Booking");\n  const tCountries = useTranslations("countries");`
);

// Look for rendering logic
// {cc.code} {cc.country} -> {cc.code} {tCountries(\`c_\${cc.code.replace('+', '')}\`)} {cc.flag}
content = content.replace(
  /\{cc.code\} \{cc.country\}/g,
  `{cc.code} {tCountries(\`c_\${cc.code.replace('+', '')}\` as any)} {cc.flag}`
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('booking/page.tsx updated!');
