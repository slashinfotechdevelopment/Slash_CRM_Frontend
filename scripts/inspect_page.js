const fs = require('fs');

const file = process.argv[2];
if (!file) {
  console.log('Provide file path');
  process.exit(1);
}

const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
console.log('File:', file, 'Lines:', lines.length);

// Look for tabs
const tabMatch = content.match(/tabDefs[^=]*=\s*\[([\s\S]*?)\];/);
if (tabMatch) {
  console.log('--- Tabs ---');
  console.log(tabMatch[1].trim());
}

// Look for FormModal or Modal
const modals = content.match(/<FormModal[\s\S]*?title="([^"]+)"/g);
if (modals) {
  console.log('--- Modals ---');
  modals.forEach(m => {
    const t = m.match(/title="([^"]+)"/);
    if (t) console.log(t[1]);
  });
}
