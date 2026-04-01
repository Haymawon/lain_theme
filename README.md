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

---

## Install

Go to Extensions

Click ⋯ (top right)

Click Install from VSIX

Select the .vsix file

---
# Build from source

## 1. Open a terminal and clone the repo:

```bash
git clone https://github.com/Haymawon/lain_theme.git
cd lain_theme
```
## 2. Get the packaging tool
The only thing you need from npm is @vscode/vsce. Install it locally:

```bash
npm install
```
This adds it to node_modules. No need for global installs.

## 3. Generate the actual theme files
The real color definitions are in src/colors.js. Running the build script turns that into three theme JSONs inside themes/.

```bash
npm run build
```
You’ll see output like:

```text
✨  Generated: .../themes/lain-dark.json
✨  Generated: .../themes/lain-light.json
✨  Generated: .../themes/lain-high-contrast.json
If you want, you can also run node build.js directly.
```

## 4. (Optional) Check contrast
There’s a validator that makes sure text is readable. Run it if you care about accessibility:

```bash
npm run validate
```
It spits out contrast ratios and tells you if anything fails.

## 5. Package it
Now turn it into a .vsix file:

```bash
npm run package
```
This runs vsce package under the hood. You’ll end up with something like lain-theme-2.0.0.vsix in the current folder.

## 6. Install the theme in VS Code
From the same directory, run:

```bash
code --install-extension lain-theme-2.0.0.vsix
```
Restart VS Code, then go to File > Preferences > Color Theme and pick one of the Lain themes.
