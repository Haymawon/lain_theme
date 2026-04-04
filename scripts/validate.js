const fs = require('fs');
const path = require('path');

const WCAG_NORMAL = 4.5;
const WCAG_LARGE = 3.0;

function parseColor(color) {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    let r, g, b;
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0,2), 16);
      g = parseInt(hex.slice(2,4), 16);
      b = parseInt(hex.slice(4,6), 16);
    } else {
      throw new Error(`Unknown hex format: ${color}`);
    }
    return [r, g, b];
  }
  const rgba = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/i);
  if (rgba) {
    return [parseInt(rgba[1]), parseInt(rgba[2]), parseInt(rgba[3])];
  }
  throw new Error(`Unsupported color format: ${color}`);
}

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const comp = c / 255;
    return comp <= 0.03928 ? comp / 12.92 : Math.pow((comp + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(c1, c2) {
  const [r1,g1,b1] = parseColor(c1);
  const [r2,g2,b2] = parseColor(c2);
  const l1 = luminance(r1,g1,b1);
  const l2 = luminance(r2,g2,b2);
  const light = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (light + 0.05) / (dark + 0.05);
}

function testPair(fg, bg, label, required = WCAG_NORMAL) {
  const ratio = contrast(fg, bg);
  const ok = ratio >= required;
  console.log(`  ${label}: ${ratio.toFixed(2)} ${ok ? '✔' : '✘'}${!ok ? ` (need ${required})` : ''}`);
  return ok;
}

function validate(file) {
  console.log(`\n${path.basename(file)}`);
  const theme = JSON.parse(fs.readFileSync(file));
  const bg = theme.colors['editor.background'];
  const fg = theme.colors['editor.foreground'];
  if (!bg || !fg) return console.warn('  missing editor bg/fg');
  console.log(`  bg: ${bg}  fg: ${fg}`);
  testPair(fg, bg, 'text');
  const checks = [
    ['editor.lineNumber.foreground', bg],
    ['editorCursor.foreground', bg],
    ['editor.selectionBackground', bg, WCAG_LARGE],
    ['list.activeSelectionBackground', bg, WCAG_LARGE],
    ['statusBar.foreground', theme.colors['statusBar.background']]
  ];
  for (const [key, bgColor, min = WCAG_NORMAL] of checks) {
    const col = theme.colors[key];
    if (col && bgColor) testPair(col, bgColor, key, min);
  }
}

const themeDir = path.join(__dirname, '../themes');
if (!fs.existsSync(themeDir)) {
  console.error('❌ themes/ missing. Run `node build.js` first.');
  process.exit(1);
}
const files = fs.readdirSync(themeDir).filter(f => f.endsWith('.json'));
if (!files.length) console.warn('⚠️ No theme JSONs found.');
else files.forEach(f => validate(path.join(themeDir, f)));
