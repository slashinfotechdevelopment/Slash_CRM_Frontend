import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.tsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src/features');
console.log(`Scanning ${files.length} .tsx files in src/features...`);

let totalFilesModified = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // 1. Text No. 402
  content = content.replace(/turnstile security log #402/g, 'turnstile security log No. 402');

  // 2. Gradients & compound Tailwind rules
  content = content.replace(/ring-\[#1E2761\]\/20/gi, 'ring-brand-primary/20');
  content = content.replace(/to-\[#1E2761\]/gi, 'to-brand-primary');
  content = content.replace(/from-\[#1E2761\] to-\[#2A3782\]/gi, 'from-brand-primary to-brand-primary-hover');
  content = content.replace(/hover:border-\[#1E2761\]\/30/gi, 'hover:border-brand-primary/30');
  content = content.replace(/focus:ring-\[#1E2761\]\/20/gi, 'focus:ring-brand-primary/20');
  content = content.replace(/focus:ring-\[#1E2761\]/gi, 'focus:ring-brand-primary');
  content = content.replace(/focus:border-\[#1E2761\]/gi, 'focus:border-brand-primary');
  content = content.replace(/hover:border-\[#1E2761\]/gi, 'hover:border-brand-primary');
  content = content.replace(/hover:text-\[#1E2761\]/gi, 'hover:text-brand-primary');
  content = content.replace(/hover:bg-\[#151B42\]/gi, 'hover:bg-brand-primary-hover');
  content = content.replace(/bg-\[#1E2761\]/gi, 'bg-brand-primary');
  content = content.replace(/text-\[#1E2761\]/gi, 'text-brand-primary');
  content = content.replace(/border-\[#1E2761\]/gi, 'border-brand-primary');
  content = content.replace(/bg-\[#F8FAFC\]/gi, 'bg-brand-canvas');

  // 3. Inline style literals
  content = content.replace(/'#6366F1'/gi, "'var(--color-info)'");
  content = content.replace(/'#3B82F6'/gi, "'var(--color-info)'");
  content = content.replace(/'#E2E8F0'/gi, "'var(--color-border)'");
  content = content.replace(/'#F1F5F9'/gi, "'var(--color-border-subtle)'");
  content = content.replace(/'#475569'/gi, "'var(--color-text-body)'");
  content = content.replace(/'#64748B'/gi, "'var(--color-text-muted)'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    totalFilesModified++;
    console.log(`Updated hex tokens in: ${file}`);
  }
});

console.log(`\nCompleted: ${totalFilesModified} files modified.`);
