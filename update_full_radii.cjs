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

walkDir('./src/pages/workspace', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/rounded-full/g, function(match, offset, string) {
       const snippet = string.substring(Math.max(0, offset - 100), offset + 50);
       
       if (snippet.toLowerCase().includes('avatar') || snippet.includes('user') || snippet.includes('img') || snippet.includes('w-2 ') || snippet.includes('w-3 ') || snippet.includes('w-2.5 ') || snippet.includes('w-1.5 ')) {
           return 'rounded-full'; // ignore
       }
       if (snippet.includes('step') || snippet.includes('Timeline') || snippet.includes('dot') || snippet.includes('w-4 h-4') || snippet.includes('indicator') || snippet.includes('status')) {
         // badges with status dot? Wait, "bg-green-500 rounded-full" is usually a dot if it has w-2 h-2, which is caught above.
         // If "status" is in word, could be a badge.
       }
       
       // Anything that's text like text-xs, text-[10px], px-2, py-1, usually is a badge
       if (snippet.includes('text-xs') || snippet.includes('text-[10px]') || snippet.includes('px-')) {
         return 'rounded-md';
       }

       return 'rounded-md';
    });
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated full radii in', filePath);
    }
  }
});
