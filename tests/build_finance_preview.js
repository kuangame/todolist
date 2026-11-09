/* 把財務總覽示範頁包成單檔，方便不經 GitHub Pages 直接開啟。 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function buildStandalone() {
  const css = fs.readFileSync(path.join(root, 'css/finance_overview.css'), 'utf8');
  const demo = fs.readFileSync(path.join(root, 'js/finance_demo.js'), 'utf8');
  const ui = fs.readFileSync(path.join(root, 'js/finance_overview.js'), 'utf8');
  return '<!DOCTYPE html>\n'
    + '<html lang="zh-TW">\n'
    + '<head>\n'
    + '<meta charset="UTF-8">\n'
    + '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '<title>財務總覽示範（非本人財務）</title>\n'
    + '<link rel="preconnect" href="https://fonts.googleapis.com">\n'
    + '<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">\n'
    + '<style>\n'
    + ':root{--bg:#05060b;--surface:rgba(140,150,255,0.045);--border:rgba(255,255,255,0.10);--border-dim:rgba(255,255,255,0.055);--accent:#8b93ff;--accent-dim:rgba(139,147,255,0.10);--text:#eef1fb;--text-2:#b3bdd6;--text-3:#7480a0;--pos:#2ee88a;--neg:#f55d6b;--warn:#f7b731;--mono:"Fira Code","SF Mono",monospace;--ui:Syne,-apple-system,sans-serif;}\n'
    + '*{box-sizing:border-box;margin:0;padding:0;}body{font-family:var(--ui);background:linear-gradient(160deg,#0a0a12 0%,#050509 55%,#020203 100%) fixed;color:var(--text);min-height:100vh;padding:28px 16px 60px;} .container{max-width:1000px;margin:0 auto;} .preview-note{margin-bottom:14px;color:var(--text-2);font-size:14px;line-height:1.6;}\n'
    + css + '\n</style>\n</head>\n<body>\n<div class="container">\n'
    + '<p class="preview-note">這是財務總覽的獨立示範頁，與 Dashboard 的「財務總覽」使用同一份虛構資料。示範資料，非本人財務。</p>\n'
    + '<div id="tab-finance"></div>\n</div>\n<script>\n' + demo + '\n</script>\n<script>\n' + ui + '\n</script>\n</body>\n</html>\n';
}

function writeStandalone() {
  const out = path.join(root, 'preview/finance_overview_standalone.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buildStandalone());
  return out;
}

module.exports = { buildStandalone: buildStandalone, writeStandalone: writeStandalone };

if (require.main === module) {
  const out = writeStandalone();
  process.stdout.write(out + '\n');
}
