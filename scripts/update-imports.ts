import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function updateImports(dir: string) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stats = statSync(filePath);
    
    if (stats.isDirectory()) {
      updateImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = readFileSync(filePath, 'utf8');
      
      if (content.includes("import { cn } from '@/lib/utils'")) {
        content = content.replace(
          "import { cn } from '@/lib/utils'",
          "import { cn } from '@/shared/helpers'"
        );
        writeFileSync(filePath, content);
        console.log(`Updated imports in ${filePath}`);
      }
    }
  });
}

// Start from src directory
updateImports(join(__dirname, '../src'));