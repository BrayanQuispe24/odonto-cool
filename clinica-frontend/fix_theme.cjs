const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  'src/features',
  'src/components',
  'src/pages'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix hovers
  content = content.replace(/hover:bg-\[\#E5F7FF\] dark:bg-\[\#0840A8\]\//g, 'hover:bg-[#E5F7FF] dark:hover:bg-[#0840A8]/');
  
  // Fix double borders
  content = content.replace(/dark:border-\[\#0840A8\]\/15 dark:border-\[\#/g, 'dark:border-[\#');
  content = content.replace(/border-\[\#0840A8\]\/15 dark:border-\[\#0840A8\]\/15/g, 'border-[#0840A8]/15');
  
  // Also hover:bg-white dark:bg-[#002D5E] -> hover:bg-white dark:hover:bg-[#002D5E] 
  // Wait, I only replaced bg-[#002D5E], so if there was hover:bg-[#002D5E], it became hover:bg-white dark:bg-[#002D5E]
  content = content.replace(/hover:bg-white dark:bg-\[\#002D5E\]/g, 'hover:bg-white dark:hover:bg-[#002D5E]');
  content = content.replace(/hover:bg-\[\#F4F9FF\] dark:bg-\[\#001C3D\]/g, 'hover:bg-[#F4F9FF] dark:hover:bg-[#001C3D]');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${filePath}`);
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
