const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------------
//  Checks contrast ratios against WCAG 2.1 guidelines.
// ----------------------------------------------------------------------

const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE  = 3.0;

function parseHex(hex) {
  const match = hex.match(/[0-9a-f]{2}/gi);
  if (!match || match.length < 3) throw new Error(`Invalid hex color: ${hex}`);
  return match.map(x => parseInt(x, 16));
}

function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const comp = c / 255;
    return comp <= 0.03928 ? comp / 12.92 : Math.pow((comp + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(color1, color2) {
  const [r1, g1, b1] = parseHex(color1);
  const [r2, g2, b2] = parseHex(color2);
  const l1 = luminance(r1, g1, b1);
  const l2 = luminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function checkPair(foreground, background, label, requiredRatio = WCAG_AA_NORMAL) {
  const ratio = contrastRatio(foreground, background);
  const passed = ratio >= requiredRatio;
  const emoji = passed ? '✅' : '❌';
  console.log(`   ${label}: ${ratio.toFixed(2)} ${emoji} ${passed ? '' : `(needs ${requiredRatio.toFixed(1)})`}`);
  return passed;
}

function validateTheme(filePath) {
  console.log(`\n📄  ${path.basename(filePath)}`);
  const theme = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const bg = theme.colors['editor.background'];
  const fg = theme.colors['editor.foreground'];

  if (!bg || !fg) {
    console.warn('   ⚠️  Missing editor.background or editor.foreground');
    return;
  }

  console.log(`   Background: ${bg}`);
  console.log(`   Foreground: ${fg}`);
  checkPair(fg, bg, 'Editor text');

  // Additional checks – feel free to extend
  const checks = [
    ['editor.lineNumber.foreground', bg],
    ['editorCursor.foreground', bg],
    ['editor.selectionBackground', bg, WCAG_AA_LARGE],
    ['list.activeSelectionBackground', bg, WCAG_AA_LARGE],
    ['statusBar.foreground', theme.colors['statusBar.background']],
  ];

  for (const [key, bgColor, minRatio = WCAG_AA_NORMAL] of checks) {
    const col = theme.colors[key];
    if (col && bgColor) {
      checkPair(col, bgColor, key, minRatio);
    }
  }
}

// ----------------------------------------------------------------------
//  Run on all generated theme files
// ----------------------------------------------------------------------
const themeDir = path.join(__dirname, '..', 'themes');
if (!fs.existsSync(themeDir)) {
  console.error('❌  themes/ directory not found. Run build.js first.');
  process.exit(1);
}

const themeFiles = fs.readdirSync(themeDir).filter(f => f.endsWith('.json'));
if (themeFiles.length === 0) {
  console.warn('⚠️  No theme JSON files found in themes/');
} else {
  for (const file of themeFiles) {
    validateTheme(path.join(themeDir, file));
  }
}
