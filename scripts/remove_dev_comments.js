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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(full);
    }
  });
  return results;
}

const files = walk('src');
console.log(`Processing developer comments in ${files.length} source files...`);

let modifiedFiles = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let changed = false;

  const newLines = lines.map((line) => {
    let l = line;

    // Check if line contains Sl, Phase or API counts in comments
    if (/(?:\/\/|\/\*|\*).*?(?:Sl\s*\d+|Phase\s*\d+|\b\d+\s*APIs?\b)/i.test(l)) {
      // 1. Remove bracketed (Sl ...) / (Phase ...)
      l = l.replace(/\s*\((?:Sl|Phase)[^)]*\)/gi, '');

      // 2. Remove "Sl 15 modal" -> "modal", "for Sl 15" -> ""
      l = l.replace(/\b(?:for\s+)?Sl\s*\d+(?:\s*modal)?/gi, (match) => {
        if (/modal/i.test(match)) return 'modal';
        return '';
      });

      // 3. Remove "Create Sl 44 or Update Sl 53" -> "Create or Update"
      l = l.replace(/Create\s+Sl\s*\d+\s+or\s+Update\s+Sl\s*\d+/gi, 'Create or Update');

      // 4. Remove generic Sl/Phase/APIs occurrences in comments
      l = l.replace(/\b(?:Sl|Phase)\s*[\d\s–,:-]+/gi, '');
      l = l.replace(/\b\d+\s*APIs?\b/gi, '');

      // 5. Clean up any trailing comment formatting leftovers like "// :" or "//  -" or empty trailing "//"
      l = l.replace(/\/\/\s*:\s*/g, '// ');
      l = l.replace(/\/\/\s*-\s*$/g, '');
      l = l.replace(/\/\/\s*$/g, '');
      l = l.replace(/\s+$/, '');

      changed = true;
    }

    return l;
  });

  if (changed) {
    fs.writeFileSync(file, newLines.join('\n'), 'utf8');
    modifiedFiles++;
  }
});

console.log(`Updated comments in ${modifiedFiles} files.`);
