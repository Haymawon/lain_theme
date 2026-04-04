const fs = require('fs');
const path = require('path');
const colors = require('../src/colors.js');

const THEMES = {
  dark:         { def: colors.dark,         nameSuffix: 'Dark' },
  light:        { def: colors.light,        nameSuffix: 'Light' },
  highContrast: { def: colors.highContrast, nameSuffix: 'High Contrast' }
};

const OUT_DIR = path.join(__dirname, '../themes');
const FILE_MAP = {
  dark:         'lain-dark.json',
  light:        'lain-light.json',
  highContrast: 'lain-high-contrast.json'
};

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

for (const [key, { def, nameSuffix }] of Object.entries(THEMES)) {
  const theme = {
    name: `Lain (${nameSuffix})`,
    type: key === 'highContrast' ? 'hc' : (key === 'dark' ? 'vs-dark' : 'vs'),
    colors: { ...def.ui },
    tokenColors: def.tokens
  };
  const outPath = path.join(OUT_DIR, FILE_MAP[key]);
  fs.writeFileSync(outPath, JSON.stringify(theme, null, 2));
  console.log(`✓ ${FILE_MAP[key]} built — ${nameSuffix} theme ready.`);
}
console.log('All themes compiled. Present day, present time.');
