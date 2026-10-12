const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  'src/features',
  'src/components',
  'src/pages',
  'src/layouts'
];

const REPLACEMENTS = [
  // 1. Font Sizes (px to standard or semantic rem tokens)
  { regex: /(?<!-)text-\[9px\]/g, replacement: 'text-micro' },
  { regex: /(?<!-)text-\[10px\]/g, replacement: 'text-tiny' },
  { regex: /(?<!-)text-\[10\.5px\]/g, replacement: 'text-tiny' },
  { regex: /(?<!-)text-\[11px\]/g, replacement: 'text-small' },
  { regex: /(?<!-)text-\[12px\]/g, replacement: 'text-xs' },
  { regex: /(?<!-)text-\[13px\]/g, replacement: 'text-sm' },
  { regex: /(?<!-)text-\[14px\]/g, replacement: 'text-sm' },
  { regex: /(?<!-)text-\[15px\]/g, replacement: 'text-base' },
  { regex: /(?<!-)text-\[16px\]/g, replacement: 'text-base' },
  { regex: /(?<!-)text-\[18px\]/g, replacement: 'text-lg' },
  { regex: /(?<!-)text-\[20px\]/g, replacement: 'text-xl' },
  { regex: /(?<!-)text-\[24px\]/g, replacement: 'text-2xl' },
  
  // 2. Colors -> Theme tokens
  { regex: /bg-\[\#002D5E\]/g, replacement: 'bg-dark-surface' },
  { regex: /bg-\[\#001C3D\]/g, replacement: 'bg-dark-bg' },
  { regex: /text-\[\#0840A8\]/g, replacement: 'text-primary-dark' },
  { regex: /text-\[\#0077D4\]/g, replacement: 'text-primary' },
  { regex: /text-\[\#00C2E0\]/g, replacement: 'text-secondary' },
  { regex: /border-\[\#0840A8\]/g, replacement: 'border-primary-dark' },
  { regex: /border-\[\#0077D4\]/g, replacement: 'border-primary' },
  { regex: /border-\[\#00C2E0\]/g, replacement: 'border-secondary' },
  { regex: /divide-\[\#0840A8\]/g, replacement: 'divide-primary-dark' },
  { regex: /divide-\[\#0077D4\]/g, replacement: 'divide-primary' },
  { regex: /divide-\[\#00C2E0\]/g, replacement: 'divide-secondary' },
  { regex: /ring-\[\#0840A8\]/g, replacement: 'ring-primary-dark' },
  { regex: /ring-\[\#0077D4\]/g, replacement: 'ring-primary' },
  { regex: /ring-\[\#00C2E0\]/g, replacement: 'ring-secondary' },
  { regex: /from-\[\#0077D4\]/g, replacement: 'from-primary' },
  { regex: /to-\[\#00C2E0\]/g, replacement: 'to-secondary' },
  { regex: /bg-\[\#F4F9FF\]/g, replacement: 'bg-light-surface' },
  { regex: /bg-\[\#E5F7FF\]/g, replacement: 'bg-light-accent' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  for (const { regex, replacement } of REPLACEMENTS) {
    content = content.replace(regex, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      processFile(filePath);
    }
  }
}

const basePath = __dirname;
DIRECTORIES.forEach(dir => {
  walkDir(path.join(basePath, dir));
});

console.log('Centralization script completed successfully!');
