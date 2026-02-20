const fs=require('fs'),path=require('path');
function luminance(r,g,b){
	let [rs,gs,bs]=[r/255,g/255,b/255].map(c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4));
	return 0.2126*rs+0.7152*gs+0.0722*bs;
}
function contrast(hex1,hex2){
	let [r1,g1,b1]=hex1.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16));
	let [r2,g2,b2]=hex2.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16));
	let l1=luminance(r1,g1,b1),l2=luminance(r2,g2,b2);
	let lighter=Math.max(l1,l2),darker=Math.min(l1,l2);
	return (lighter+0.05)/(darker+0.05);
}
function validate(file){
	let theme=JSON.parse(fs.readFileSync(file));
	let bg=theme.colors['editor.background'];
	let fg=theme.colors['editor.foreground'];
	let ratio=contrast(bg,fg);
	console.log(`${path.basename(file)}: contrast ${ratio.toFixed(2)} ${ratio>=4.5?'✅':'❌'}`);
	// check a few more
	let checks=[
		['editorLineNumber.foreground',bg],
		['editorCursor.foreground',bg],
		['editor.selectionBackground',bg],
	];
	checks.forEach(([key,bgColor])=>{
		let col=theme.colors[key];
		if(col){
			let r=contrast(col,bgColor||bg);
			console.log(`  ${key}: ${r.toFixed(2)} ${r>=3?'✅':'❌'}`);
		}
	});
}
// run on all themes
const themeDir=path.join(__dirname,'..','themes');
fs.readdirSync(themeDir).filter(f=>f.endsWith('.json')).forEach(f=>validate(path.join(themeDir,f)));