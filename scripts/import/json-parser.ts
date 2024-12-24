import { readFileSync } from 'fs';
import type { ChatMessage } from './types';

function cleanJsonString(str: string): string {
  // Remove any BOM characters
  str = str.replace(/^\uFEFF/, '');
  
  // Remove any control characters except newlines and tabs
  str = str.replace(/[\x00-\x09\x0B-\x1F\x7F-\x9F]/g, '');

  // Fix common JSON issues
  str = str.replace(/,(\s*[\]}])/g, '$1'); // Remove trailing commas
  str = str.replace(/\\/g, '\\\\'); // Escape backslashes
  str = str.replace(/\u0000/g, ''); // Remove null bytes
  str = str.replace(/([^\\])"([^"]*?)"/g, '$1"$2"'); // Fix unescaped quotes
  
  // Ensure array brackets
  str = str.trim();
  if (!str.startsWith('[')) str = '[' + str;
  if (!str.endsWith(']')) str = str + ']';

  return str;
}

function validateMessage(msg: any, index: number): ChatMessage {
  if (!msg || typeof msg !== 'object') {
    throw new Error(`Message ${index} is not an object`);
  }

  // Clean and validate fields
  const name = String(msg.name || '').trim();
  const message = String(msg.message || '').trim();
  const timestamp = String(msg.timestamp || '').trim();

  if (!name) {
    throw new Error(`Message ${index} has invalid name`);
  }

  if (!message) {
    throw new Error(`Message ${index} has invalid message`);
  }

  if (!timestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
    throw new Error(`Message ${index} has invalid timestamp`);
  }

  return { name, message, timestamp };
}

export function parseJsonFile(filename: string): ChatMessage[] {
  try {
    console.log('Reading file...');
    const content = readFileSync(filename, 'utf-8');
    console.log(`File size: ${content.length} bytes`);

    console.log('Cleaning JSON...');
    const cleanContent = cleanJsonString(content);

    console.log('Parsing JSON...');
    let data: any[];
    try {
      data = JSON.parse(cleanContent);
    } catch (error) {
      console.error('JSON parse error:', error);
      // Try parsing in chunks
      console.log('Attempting to parse in chunks...');
      const lines = cleanContent.split('\n');
      data = [];
      let chunk = '';
      
      for (let i = 0; i < lines.length; i++) {
        chunk += lines[i] + '\n';
        if ((i + 1) % 1000 === 0 || i === lines.length - 1) {
          try {
            const partialData = JSON.parse(`[${chunk.replace(/^\[|\]$/g, '')}]`);
            data.push(...partialData);
            chunk = '';
          } catch (e) {
            console.warn(`Warning: Skipping invalid chunk near line ${i}`);
          }
        }
      }
    }

    if (!Array.isArray(data)) {
      throw new Error('Invalid JSON format: root must be an array');
    }

    console.log(`Validating ${data.length} messages...`);
    const messages: ChatMessage[] = [];
    let skipped = 0;

    for (let i = 0; i < data.length; i++) {
      try {
        messages.push(validateMessage(data[i], i));
      } catch (error) {
        skipped++;
        if (skipped <= 5) {
          console.warn(`Warning: ${error.message}`);
        }
      }
    }

    if (skipped > 0) {
      console.warn(`Skipped ${skipped} invalid messages`);
    }

    console.log(`Successfully parsed ${messages.length} valid messages`);
    return messages;

  } catch (error) {
    console.error('Failed to parse JSON file:', error);
    throw error;
  }
}