import { existsSync } from 'fs';
import { extname } from 'path';

export function validateFile(filePath) {
  // Check if file exists
  if (!existsSync(filePath)) {
    throw new Error(
      `File not found: ${filePath}\n` +
      'Please provide the correct path to your JSON file.'
    );
  }

  // Check file extension
  const ext = extname(filePath).toLowerCase();
  if (ext !== '.json') {
    throw new Error(
      `Invalid file type: ${ext}\n` +
      'Please provide a .json file.'
    );
  }

  return true;
}