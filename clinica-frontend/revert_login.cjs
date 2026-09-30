const fs = require('fs');
const path = require('path');

const FILES_TO_REVERT = [
  'src/layouts/AuthLayout.tsx',
  'src/features/auth/components/LoginForm.tsx',
  'src/features/auth/pages/LoginPage.tsx'
];

const REVERTS = [
  // Backgrounds
  { regex: /bg-white dark:bg-\[\#002D5E\]/g, replacement: 'bg-[#002D5E]' },
  { regex: /bg-\[\#F4F9FF\] dark:bg-\[\#001C3D\]/g, replacement: 'bg-[#001C3D]' },
  
  // Texts
  { regex: /text-\[\#0840A8\] dark:text-white/g, replacement: 'text-white' },
  { regex: /text-\[\#0077D4\] dark:text-\[\#00C2E0\]/g, replacement: 'text-[#00C2E0]' },
  { regex: /text-\[\#0840A8\]\/60 dark:placeholder:text-white\/50/g, replacement: 'placeholder:text-white/50' },
  
  // Borders
  { regex: /border-\[\#0840A8\]\/15 dark:border-\[\#00C2E0\]/g, replacement: 'border-[#00C2E0]' },
  { regex: /border-\[\#0840A8\]\/15 dark:border-\[\#0840A8\]/g, replacement: 'border-[#0840A8]' },
  { regex: /border-white dark:border-\[\#002D5E\]/g, replacement: 'border-[#002D5E]' },
];

const basePath = '/home/brayan/Documentos/Proyectos/Clinica dental/Software/clinica-frontend';

FILES_TO_REVERT.forEach(relativePath => {
  const filePath = path.join(basePath, relativePath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Custom specific cleans
    content = content.replace(/text-\[\#0840A8\](\/[0-9]+)? dark:text-white(\/[0-9]+)?/g, (match, p1, p2) => {
       return 'text-white' + (p2 || '');
    });

    for (const { regex, replacement } of REVERTS) {
      content = content.replace(regex, replacement);
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Reverted dual-theme in ${filePath}`);
    }
  }
});
