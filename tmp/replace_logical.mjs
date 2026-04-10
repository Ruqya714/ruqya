import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  { regex: /\b(-?)ml-([a-zA-Z0-9_[\].-]+)\b/g, replace: '$1ms-$2' },
  { regex: /\b(-?)mr-([a-zA-Z0-9_[\].-]+)\b/g, replace: '$1me-$2' },
  { regex: /\b(-?)pl-([a-zA-Z0-9_[\].-]+)\b/g, replace: '$1ps-$2' },
  { regex: /\b(-?)pr-([a-zA-Z0-9_[\].-]+)\b/g, replace: '$1pe-$2' },
  { regex: /\btext-left\b/g, replace: 'text-start' },
  { regex: /\btext-right\b/g, replace: 'text-end' },
  { regex: /\bborder-l\b/g, replace: 'border-s' },
  { regex: /\bborder-r\b/g, replace: 'border-e' },
  { regex: /\bborder-l-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'border-s-$1' },
  { regex: /\bborder-r-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'border-e-$1' },
  { regex: /\brounded-l-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'rounded-s-$1' },
  { regex: /\brounded-r-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'rounded-e-$1' },
  { regex: /\brounded-tl-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'rounded-ss-$1' },
  { regex: /\brounded-tr-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'rounded-se-$1' },
  { regex: /\brounded-bl-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'rounded-es-$1' },
  { regex: /\brounded-br-([a-zA-Z0-9_[\].-]+)\b/g, replace: 'rounded-ee-$1' },
];

let modifiedCount = 0;

walkDir('./src', function(filePath) {
  if (!filePath.match(/\.(ts|tsx|js|jsx)$/)) return;
  
  let originalCode = fs.readFileSync(filePath, 'utf8');
  let newCode = originalCode;
  
  replacements.forEach(rep => {
    newCode = newCode.replace(rep.regex, rep.replace);
  });
  
  if (originalCode !== newCode) {
    fs.writeFileSync(filePath, newCode);
    modifiedCount++;
    console.log(`Modified: ${filePath}`);
  }
});

console.log(`Done. Modified ${modifiedCount} files.`);
