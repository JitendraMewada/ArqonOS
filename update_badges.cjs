const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src/pages/workspace/b2b', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/rounded-full/g, function(match, offset, string) {
       const snippet = string.substring(Math.max(0, offset - 100), offset + 50);
       if (snippet.toLowerCase().includes('avatar') || snippet.includes('user') || snippet.includes('img') || snippet.includes('w-2 h-2') || snippet.includes('w-2.5 h-2.5') || snippet.includes('w-3 h-3') || snippet.includes('w-1.5 h-1.5')) {
           return 'rounded-full'; // ignore
       }
       // Also skip if it's explicitly a circle shape like in timeline steps (w-8 h-8 rounded-full border-2 border-slate-200)
       if (snippet.includes('step') || snippet.includes('Timeline')) {
         return 'rounded-full';
       }
       return 'rounded-md';
    });
    
    // Also change w-12 h-12 -> w-8 h-8, w-10 h-10 -> w-8 h-8 for standard icon containers
    content = content.replace(/w-12 h-12 rounded-xl/g, 'w-8 h-8 rounded-lg');
    content = content.replace(/w-10 h-10 rounded-xl/g, 'w-8 h-8 rounded-lg');
    content = content.replace(/w-10 h-10 rounded-lg/g, 'w-8 h-8 rounded-lg');

    // And change w-5 h-5 and w-6 h-6 to w-4 h-4 for general lucide icons (avoid modifying svg elements themselves if any, but most are Lucide)
    // Actually we can just do a replace for className="[^"]*(w-5 h-5|w-6 h-6)[^"]*"
    content = content.replace(/className="([^"]*)(w-5 h-5|w-6 h-6)([^"]*)"/g, 'className="$1w-4 h-4$3"');

    // and `className={cn("... w-5 h-5 ...")}`
    content = content.replace(/"([^"]*)(w-5 h-5|w-6 h-6)([^"]*)"/g, '"$1w-4 h-4$3"');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
