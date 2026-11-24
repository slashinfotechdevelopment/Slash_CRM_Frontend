/**
 * Hex Color Check Script
 * Fails if any hard-coded hex color appears in any .tsx file under src/features/
 */

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

const targetDir = path.resolve('src/features');
const files = walk(targetDir);
const hexRegex = /#[0-9a-fA-F]{3,8}\b/g;

let violations = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const matches = line.match(hexRegex);
    if (matches) {
      console.error(`[HEX ERROR] ${file}:${idx + 1} - Found: ${matches.join(', ')}`);
      console.error(`  > ${line.trim()}`);
      violations += matches.length;
    }
  });
});

if (violations > 0) {
  console.error(`\nFailed: Found ${violations} hard-coded hex color(s) in src/features (*.tsx).`);
  process.exit(1);
} else {
  console.log(`Passed: 0 hard-coded hex colors found across ${files.length} .tsx files in src/features.`);
  process.exit(0);
}
