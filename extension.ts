import * as vscode from 'vscode';
import * as https from 'https';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('lain.checkForUpdates', async () => {
        const currentVersion = context.extension.packageJSON.version;
        
        try {
            const latestVersion = await getLatestGitHubVersion('Haymawon/lain_theme');
            
            if (isNewerVersion(latestVersion, currentVersion)) {
                const action = await vscode.window.showInformationMessage(
                    `Lain theme v${latestVersion} is available! (current: v${currentVersion})`,
                    'Download', 'Remind Later'
                );
                if (action === 'Download') {
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/Haymawon/lain_theme/releases/latest'));
                }
            } else {
                vscode.window.showInformationMessage(`Lain theme is up to date (v${currentVersion})`);
            }
        } catch (err) {
            vscode.window.showErrorMessage('Failed to check for updates');
        }
    });
    
    context.subscriptions.push(disposable);
}

async function getLatestGitHubVersion(repo: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(`https://api.github.com/repos/${repo}/releases/latest`, {
            headers: { 'User-Agent': 'Lain-Theme-Extension' }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.tag_name?.replace(/^v/, '') || '0.0.0');
                } catch { reject(); }
            });
        }).on('error', reject);
    });
}

function isNewerVersion(latest: string, current: string): boolean {
    const toNum = (v: string) => v.split('.').map(n => parseInt(n) || 0);
    const [l1, l2, l3] = toNum(latest);
    const [c1, c2, c3] = toNum(current);
    return l1 > c1 || (l1 === c1 && l2 > c2) || (l1 === c1 && l2 === c2 && l3 > c3);
}