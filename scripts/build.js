const fs = require('fs');
const path = require('path');
const colors = require('../src/colors.js');

// ----------------------------------------------------------------------
//  Generates VS Code theme files from the color definitions above.
// ----------------------------------------------------------------------

const THEMES = {
  dark:         { def: colors.dark,         nameSuffix: 'Dark' },
  light:        { def: colors.light,        nameSuffix: 'Light' },
  highContrast: { def: colors.highContrast, nameSuffix: 'High Contrast' }
};

const OUTPUT_DIR = path.join(__dirname, '..', 'themes');
const FILENAME_MAP = {
  dark:         'lain-dark.json',
  light:        'lain-light.json',
  highContrast: 'lain-high-contrast.json'
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

for (const [key, { def, nameSuffix }] of Object.entries(THEMES)) {
  const themeJson = {
    name: `Lain (${nameSuffix})`,
    type: key === 'highContrast' ? 'hc' : key,
    colors: { ...def.ui },
    tokenColors: def.tokens
  };

  const outPath = path.join(OUTPUT_DIR, FILENAME_MAP[key]);
  fs.writeFileSync(outPath, JSON.stringify(themeJson, null, 2));
  console.log(`✨  Generated: ${outPath}`);
}

console.log('\nAll themes built.');
