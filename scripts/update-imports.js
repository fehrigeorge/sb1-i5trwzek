const fs = require('fs');
const path = require('path');

function updateImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      updateImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace import
      if (content.includes("import { cn } from '@/lib/utils'")) {
        content = content.replace(
          "import { cn } from '@/lib/utils'",
          "import { cn } from '@/shared/helpers'"
        );
        fs.writeFileSync(filePath, content);
        console.log(`Updated imports in ${filePath}`);
      }
    }
  });
}

updateImports('./src');