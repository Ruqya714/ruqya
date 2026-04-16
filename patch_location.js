const fs = require('fs');
const path = require('path');

const trPath = path.join(process.cwd(), 'messages', 'tr.json');
const trData = JSON.parse(fs.readFileSync(trPath, 'utf8'));

// Fixing Contact page
if (trData.Contact) {
  trData.Contact.addressValue = "İstanbul / Türkiye";
}

// Fixing Footer
if (trData.Footer) {
  trData.Footer.location = "İstanbul / Türkiye";
  // The Footer shows: t("basmala") which says "بسم الله الرحمن الرحيم"
  if (trData.Footer.basmala) {
    trData.Footer.basmala = "Bismillahirrahmanirrahim";
  }
}

// Write back
fs.writeFileSync(trPath, JSON.stringify(trData, null, 2), 'utf8');
console.log('tr.json patched with location data.');
