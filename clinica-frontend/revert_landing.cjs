const fs = require('fs');
const path = require('path');

const FILES_TO_REVERT = [
  'src/pages/LandingPage.tsx',
  'src/components/common/Navbar.tsx',
  'src/components/common/MobileDrawer.tsx',
  'src/components/common/Footer.tsx',
  'src/components/common/FloatingWhatsApp.tsx',
  'src/features/landing/components/AppointmentModal.tsx',
  'src/features/landing/components/ArticlesSection.tsx',
  'src/features/landing/components/BeforeAfterSection.tsx',
  'src/features/landing/components/DoctorsShowcaseSection.tsx',
  'src/features/landing/components/FacilitiesSection.tsx',
  'src/features/landing/components/FAQSection.tsx',
  'src/features/landing/components/HeroSection.tsx',
  'src/features/landing/components/PreFooterCtaSection.tsx',
  'src/features/landing/components/SpecialtiesSection.tsx'
];

// These replacements precisely undo what we did earlier
const REVERTS = [
  // Backgrounds
  { regex: /bg-white dark:bg-\[\#002D5E\]/g, replacement: 'bg-[#002D5E]' },
  { regex: /bg-\[\#F4F9FF\] dark:bg-\[\#001C3D\]/g, replacement: 'bg-[#001C3D]' },
  { regex: /bg-\[\#E5F7FF\] dark:bg-\[\#0840A8\]\/30/g, replacement: 'bg-[#0840A8]/30' },
  { regex: /bg-\[\#E5F7FF\] dark:bg-\[\#0840A8\]\/40/g, replacement: 'bg-[#0840A8]/40' },
  { regex: /hover:bg-\[\#E5F7FF\] dark:hover:bg-\[\#0840A8\]\/30/g, replacement: 'hover:bg-[#0840A8]/30' },
  
  // Texts
  { regex: /text-\[\#0840A8\] dark:text-white/g, replacement: 'text-white' },
  { regex: /text-\[\#0077D4\] dark:text-\[\#00C2E0\]/g, replacement: 'text-[#00C2E0]' },
  { regex: /text-\[\#0077D4\] dark:text-blue-200/g, replacement: 'text-blue-200' },
  { regex: /text-\[\#002D5E\] dark:text-slate-200/g, replacement: 'text-slate-200' },
  { regex: /text-emerald-600 dark:text-emerald-400/g, replacement: 'text-emerald-400' },
  { regex: /text-sky-600 dark:text-sky-400/g, replacement: 'text-sky-400' },
  { regex: /text-amber-600 dark:text-amber-300/g, replacement: 'text-amber-300' },
  { regex: /text-\[\#0077D4\] dark:text-cyan-100/g, replacement: 'text-cyan-100' },
  { regex: /text-\[\#0077D4\] dark:text-blue-100/g, replacement: 'text-blue-100' },
  { regex: /text-\[\#0840A8\] dark:text-blue-50/g, replacement: 'text-blue-50' },
  
  // Borders
  { regex: /border-\[\#0840A8\]\/15 dark:border-\[\#00C2E0\]/g, replacement: 'border-[#00C2E0]' },
  { regex: /border-\[\#0840A8\]\/15 dark:border-\[\#0840A8\]/g, replacement: 'border-[#0840A8]' },
  { regex: /border-\[\#0840A8\]\/15 dark:border-\[\#0077D4\]/g, replacement: 'border-[#0077D4]' },
  { regex: /divide-\[\#0840A8\]\/15 dark:divide-\[\#0840A8\]/g, replacement: 'divide-[#0840A8]' },
  { regex: /divide-\[\#0840A8\]\/15 dark:divide-\[\#00C2E0\]/g, replacement: 'divide-[#00C2E0]' },
  { regex: /border-\[\#0840A8\]\/15 dark:border-white/g, replacement: 'border-white' },

  // Shadows
  { regex: /shadow-sm dark:shadow-\[\#001C3D\]\/50/g, replacement: 'shadow-[#001C3D]/50' },
];

const basePath = '/home/brayan/Documentos/Proyectos/Clinica dental/Software/clinica-frontend';

FILES_TO_REVERT.forEach(relativePath => {
  const filePath = path.join(basePath, relativePath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Also let's clean up any weird combinations that might have occurred
    // like text-[#0077D4]/90 dark:text-blue-200/90
    content = content.replace(/text-\[\#0077D4\](\/[0-9]+)? dark:text-blue-200(\/[0-9]+)?/g, (match, p1, p2) => {
       return 'text-blue-200' + (p2 || '');
    });
    content = content.replace(/text-\[\#0077D4\](\/[0-9]+)? dark:text-blue-100(\/[0-9]+)?/g, (match, p1, p2) => {
       return 'text-blue-100' + (p2 || '');
    });
    content = content.replace(/text-\[\#0840A8\](\/[0-9]+)? dark:text-blue-50(\/[0-9]+)?/g, (match, p1, p2) => {
       return 'text-blue-50' + (p2 || '');
    });
    content = content.replace(/text-\[\#0077D4\](\/[0-9]+)? dark:text-cyan-100(\/[0-9]+)?/g, (match, p1, p2) => {
       return 'text-cyan-100' + (p2 || '');
    });
    content = content.replace(/text-\[\#0077D4\](\/[0-9]+)? dark:text-\[\#00C2E0\](\/[0-9]+)?/g, (match, p1, p2) => {
       return 'text-[#00C2E0]' + (p2 || '');
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
