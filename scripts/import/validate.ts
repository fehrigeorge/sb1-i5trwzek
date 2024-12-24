import { readFileSync } from 'fs';

function validateJson(filename: string) {
  try {
    const content = readFileSync(filename, 'utf-8');
    const firstFewLines = content.split('\n').slice(0, 5).join('\n');
    console.log('First few lines of file:');
    console.log(firstFewLines);
    console.log('\nFile size:', content.length, 'bytes');
    
    // Try parsing a small sample
    const sample = JSON.parse(content.slice(0, 1000) + ']');
    console.log('\nJSON structure looks valid');
    
  } catch (error) {
    console.error('Validation failed:', error);
    process.exit(1);
  }
}

// Run validation
const [,, filename] = process.argv;
if (!filename) {
  console.error('Usage: tsx scripts/import/validate.ts <filename>');
  process.exit(1);
}

validateJson(filename);