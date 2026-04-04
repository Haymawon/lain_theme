# Lain Theme

Serial Experiments Lain inspired theme for VS Code.  
Dark, light, and high-contrast variants.

---

## Preview

### Dark
![Dark preview](assets/preview-dark.png)

### Light
![Light preview](assets/preview-light.png)

### High Contrast
![High contrast preview](assets/preview-hc.png)

## Installation

### Install from VSIX file (no build required)

Download `lain-theme-2.3.0.vsix` and run:

```bash
code --install-extension lain-theme-2.3.0.vsix
```

Restart VS Code and select the theme via File > Preferences > Color Theme (Ctrl+K Ctrl+T).


# Build from source
Prerequisites: Node.js (v14 or later), Git.

```bash
git clone https://github.com/Haymawon/lain_theme.git
cd lain_theme
npm install          # installs @vscode/vsce
node build.js        # generates theme JSON files in themes/
node validate.js     # (optional) checks contrast ratios
npx vsce package     # creates lain-theme-2.3.0.vsix
```
Then install the .vsix as shown above.

### Verify contrast (optional)
```bash
node validate.js
```
Manual theme generation (without packaging)
```bash
node build.js
```
Themes are written to themes/lain-dark.json, themes/lain-light.json, themes/lain-high-contrast.json. Copy them manually if needed.

### Recommended settings
Add to settings.json:
```
json
{
  "workbench.colorTheme": "Lain (Dark)",
  "editor.fontFamily": "Fira Code, Consolas, monospace",
  "editor.fontLigatures": true
}
```
License
[AGPL-3.0 License.](https://github.com/Haymawon/lain_theme/blob/main/LICENSE)
