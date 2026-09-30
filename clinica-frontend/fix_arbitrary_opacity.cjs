const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  'src/features',
  'src/components',
  'src/pages'
];

const REPLACEMENTS = [
  // Remove opacity modifier from arbitrary colors
  { regex: /text-\[\#0077D4\]\/[0-9]+/g, replacement: 'text-[#0077D4]' },
  { regex: /text-\[\#0840A8\]\/[0-9]+/g, replacement: 'text-[#0840A8]' },
  { regex: /text-\[\#00C2E0\]\/[0-9]+/g, replacement: 'text-[#00C2E0]' },
  { regex: /text-\[\#001C3D\]\/[0-9]+/g, replacement: 'text-[#001C3D]' },
  { regex: /text-\[\#002D5E\]\/[0-9]+/g, replacement: 'text-[#002D5E]' },
  { regex: /text-\[\#F4F9FF\]\/[0-9]+/g, replacement: 'text-[#F4F9FF]' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of REPLACEMENTS) {
    content = content.replace(regex, replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed opacity modifiers in ${filePath}`);
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
    } else if (filePath.endsWith('.tsx')) {
      processFile(filePath);
    }
  }
}

const basePath = '/home/brayan/Documentos/Proyectos/Clinica dental/Software/clinica-frontend';
DIRECTORIES.forEach(dir => {
  walkDir(path.join(basePath, dir));
});
