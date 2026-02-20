const fs=require('fs'),path=require('path');
const colors=require('../src/colors.js');

// let's generate themes, ugly but works
function build(){
	const themes={
		dark:colors.dark,
		light:colors.light,
		highContrast:colors.highContrast
	};
	// map internal names to desired filenames
	const nameMap = {
		dark: 'dark',
		light: 'light',
		highContrast: 'high-contrast'
	};
	for(let [name,def] of Object.entries(themes)){
		let themeJson={
			name:`Lain (${name==='highContrast'?'High Contrast':name.charAt(0).toUpperCase()+name.slice(1)})`,
			type:name==='highContrast'?'hc':name,
			colors:{},
			tokenColors:[]
		};
		// map ui colors
		Object.assign(themeJson.colors,def.ui);
		// token colors
		themeJson.tokenColors=def.tokens;
		// write file with mapped name
		let outPath=path.join(__dirname,'..','themes',`lain-theme-${nameMap[name]}.json`);
		fs.writeFileSync(outPath,JSON.stringify(themeJson,null,4));
		console.log(`wrote ${outPath}`);
	}
}
build();