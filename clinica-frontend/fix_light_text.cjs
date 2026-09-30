const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  'src/features',
  'src/components',
  'src/pages'
];

const REPLACEMENTS = [
  // text-blue-100
  { regex: /(?<!dark:)text-blue-100\b(?!\/)/g, replacement: 'text-[#0077D4] dark:text-blue-100' },
  { regex: /(?<!dark:)text-blue-100\/([0-9]+)/g, replacement: 'text-[#0077D4]/$1 dark:text-blue-100/$1' },
  // text-blue-50
  { regex: /(?<!dark:)text-blue-50\b(?!\/)/g, replacement: 'text-[#0840A8] dark:text-blue-50' },
  { regex: /(?<!dark:)text-blue-50\/([0-9]+)/g, replacement: 'text-[#0840A8]/$1 dark:text-blue-50/$1' },
  // text-cyan-100
  { regex: /(?<!dark:)text-cyan-100\b(?!\/)/g, replacement: 'text-[#0077D4] dark:text-cyan-100' },
  { regex: /(?<!dark:)text-cyan-100\/([0-9]+)/g, replacement: 'text-[#0077D4]/$1 dark:text-cyan-100/$1' },
  // text-[#00C2E0]
  { regex: /(?<!dark:)text-\[\#00C2E0\]\/([0-9]+)/g, replacement: 'text-[#0077D4]/$1 dark:text-[#00C2E0]/$1' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of REPLACEMENTS) {
    content = content.replace(regex, replacement);
  }

  // Also let's fix double prefixes if any
  content = content.replace(/text-\[\#0077D4\] dark:text-\[\#0077D4\]/g, 'text-[#0077D4]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated text colors in ${filePath}`);
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
    } else if (filePath.endsWith('.tsx') && !filePath.includes('DashboardSidebar') && !filePath.includes('SettingsModal') && !filePath.includes('DashboardHeader')) {
      processFile(filePath);
    }
  }
}

const basePath = '/home/brayan/Documentos/Proyectos/Clinica dental/Software/clinica-frontend';
DIRECTORIES.forEach(dir => {
  walkDir(path.join(basePath, dir));
});
