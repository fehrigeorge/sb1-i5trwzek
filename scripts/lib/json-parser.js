import { readFileSync } from 'fs';
import { parseWhatsAppChat } from './whatsapp-parser.js';

export function parseJsonFile(filename) {
  try {
    console.log('Reading file...');
    const content = readFileSync(filename, 'utf-8');
    console.log(`File size: ${content.length} bytes`);

    // First try parsing as WhatsApp chat format
    try {
      console.log('Attempting to parse as WhatsApp chat...');
      const messages = parseWhatsAppChat(content);
      if (messages.length > 0) {
        console.log(`Successfully parsed ${messages.length} WhatsApp messages`);
        return messages;
      }
    } catch (err) {
      console.log('Not a WhatsApp chat format, trying JSON...');
    }

    // Fall back to JSON parsing
    console.log('Parsing JSON...');
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid format: root must be an array');
    }

    const messages = data.map((msg, index) => {
      if (!msg || typeof msg !== 'object') {
        throw new Error(`Message ${index} is not an object`);
      }

      const name = String(msg.name || '').trim();
      const message = String(msg.message || '').trim();
      const timestamp = String(msg.timestamp || '').trim();

      if (!name) throw new Error(`Message ${index} has invalid name`);
      if (!message) throw new Error(`Message ${index} has invalid message`);
      if (!timestamp.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
        throw new Error(`Message ${index} has invalid timestamp`);
      }

      return { name, message, timestamp };
    });

    console.log(`Successfully parsed ${messages.length} messages`);
    return messages;

  } catch (error) {
    console.error('Failed to parse file:', error);
    throw error;
  }
}