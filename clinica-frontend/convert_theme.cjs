const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  'src/features',
  'src/components',
  'src/pages'
];

const REPLACEMENTS = [
  // Backgrounds
  { regex: /(?<!dark:)bg-\[\#002D5E\]/g, replacement: 'bg-white dark:bg-[#002D5E]' },
  { regex: /(?<!dark:)bg-\[\#001C3D\]/g, replacement: 'bg-[#F4F9FF] dark:bg-[#001C3D]' },
  { regex: /(?<!dark:)bg-\[\#0840A8\]\/30/g, replacement: 'bg-[#E5F7FF] dark:bg-[#0840A8]/30' },
  { regex: /(?<!dark:)bg-\[\#0840A8\]\/40/g, replacement: 'bg-[#E5F7FF] dark:bg-[#0840A8]/40' },
  
  // Texts
  // For text-white, it's tricky because text-white is used inside buttons that are always blue.
  // We need to be careful with text-white. Let's not blindly replace text-white everywhere.
  // text-[#00C2E0] -> text-[#0077D4] dark:text-[#00C2E0]
  { regex: /(?<!dark:)text-\[\#00C2E0\]/g, replacement: 'text-[#0077D4] dark:text-[#00C2E0]' },
  { regex: /(?<!dark:)text-blue-200\/([0-9]+)/g, replacement: 'text-[#0077D4]/$1 dark:text-blue-200/$1' },
  { regex: /(?<!dark:)text-blue-200(?!\/)/g, replacement: 'text-[#0077D4] dark:text-blue-200' },
  { regex: /(?<!dark:)text-slate-200/g, replacement: 'text-[#002D5E] dark:text-slate-200' },
  { regex: /(?<!dark:)text-emerald-400/g, replacement: 'text-emerald-600 dark:text-emerald-400' },
  { regex: /(?<!dark:)text-sky-400/g, replacement: 'text-sky-600 dark:text-sky-400' },
  { regex: /(?<!dark:)text-amber-300/g, replacement: 'text-amber-600 dark:text-amber-300' },
  
  // Borders
  { regex: /(?<!dark:)border-\[\#00C2E0\]\/([0-9]+)/g, replacement: 'border-[#0840A8]/15 dark:border-[#00C2E0]/$1' },
  { regex: /(?<!dark:)border-\[\#0840A8\]\/([0-9]+)/g, replacement: 'border-[#0840A8]/15 dark:border-[#0840A8]/$1' },
  { regex: /(?<!dark:)border-\[\#0077D4\]\/([0-9]+)/g, replacement: 'border-[#0840A8]/15 dark:border-[#0077D4]/$1' },
  { regex: /(?<!dark:)divide-\[\#0840A8\]\/([0-9]+)/g, replacement: 'divide-[#0840A8]/15 dark:divide-[#0840A8]/$1' },
  { regex: /(?<!dark:)divide-\[\#00C2E0\]\/([0-9]+)/g, replacement: 'divide-[#0840A8]/15 dark:divide-[#00C2E0]/$1' },
  
  // Shadows
  { regex: /(?<!dark:)shadow-\[\#001C3D\]\/50/g, replacement: 'shadow-sm dark:shadow-[#001C3D]/50' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // We should be careful with text-white. We can replace it when it's part of a block with bg-[#002D5E] 
  // Let's do a pass where we find text-white inside classNames that have bg-white dark:bg-[#002D5E]
  // But regex for this is complex. Let's stick to the safe ones first, and manually replace text-white 
  // where needed, or we can replace it everywhere EXCEPT buttons? Too complex.
  // Actually, many text-white are just text-[#0840A8] dark:text-white. 
  // Maybe we can replace `text-white` with `text-[#0840A8] dark:text-white`, but only if it's not inside `from-[#0077D4]` etc?
  
  // Apply all replacements
  for (const { regex, replacement } of REPLACEMENTS) {
    content = content.replace(regex, replacement);
  }

  // Handle text-white safely: 
  // Find instances of `text-white` that are NOT preceded by `dark:` and NOT followed by something that implies it's a button.
  // But even cards have `text-white`. In cards, we DO want `text-[#0840A8] dark:text-white`.
  // Let's replace `text-white` but maybe we can revert it for buttons?
  // Buttons usually have `bg-teal-main`, `bg-[#0077D4]`, `from-[#0077D4]`.
  // Better approach: regex that targets text-white only if the class string doesn't contain a primary bg color.
  // Since we can't easily do that with simple regex, we'll write a custom function for class strings.

  content = content.replace(/className="([^"]+)"/g, (match, classStr) => {
    // If the class string contains button-like colors, don't replace text-white
    const isButton = /bg-teal-main|bg-gradient|from-\[\#002D5E\]|from-\[\#0077D4\]|bg-\[\#0840A8\]/.test(classStr) && !classStr.includes('text-[#0840A8]');
    
    // Also, if it already has dark:text-white, don't touch text-white
    if (!classStr.includes('dark:text-white') && !isButton) {
      classStr = classStr.replace(/(?<!dark:)text-white/g, 'text-[#0840A8] dark:text-white');
    }
    
    // If it has bg-[#001C3D], we also replace text-white
    if (classStr.includes('dark:bg-[#001C3D]') || classStr.includes('dark:bg-[#002D5E]')) {
      classStr = classStr.replace(/(?<!dark:)text-white/g, 'text-[#0840A8] dark:text-white');
    }

    return `className="${classStr}"`;
  });
  
  content = content.replace(/className=\{`([^`]+)`\}/g, (match, classStr) => {
    const isButton = /bg-teal-main|bg-gradient|from-\[\#002D5E\]|from-\[\#0077D4\]|bg-\[\#0840A8\]/.test(classStr) && !classStr.includes('text-[#0840A8]');
    if (!classStr.includes('dark:text-white') && !isButton) {
      classStr = classStr.replace(/(?<!dark:)text-white/g, 'text-[#0840A8] dark:text-white');
    }
    return `className={\`${classStr}\`}`;
  });

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
    } else if (filePath.endsWith('.tsx') && !filePath.includes('DashboardSidebar') && !filePath.includes('SettingsModal') && !filePath.includes('DashboardHeader')) {
      processFile(filePath);
    }
  }
}

const basePath = '/home/brayan/Documentos/Proyectos/Clinica dental/Software/clinica-frontend';
DIRECTORIES.forEach(dir => {
  walkDir(path.join(basePath, dir));
});
