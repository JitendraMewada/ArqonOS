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
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // standardizing cards
    content = content.replace(/rounded-3xl/g, 'rounded-xl');
    content = content.replace(/rounded-2xl/g, 'rounded-xl');
    
    // standardizing main icon sizing if used as a generic icon container, be careful not to break avatars
    // w-10 h-10 to w-8 h-8
    // Since some are avatars, let's look for known icon containers. Or just let the user see the manual updates.
    
    // badge radiuses: Replace rounded-full in badges
    content = content.replace(/px-2 py-1 rounded-full/g, 'px-2 py-1 rounded-md');
    content = content.replace(/px-3 py-1 rounded-full/g, 'px-3 py-1 rounded-md');
    content = content.replace(/px-1\.5 py-0\.5 rounded-full/g, 'px-1.5 py-0.5 rounded-md');
    
    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
