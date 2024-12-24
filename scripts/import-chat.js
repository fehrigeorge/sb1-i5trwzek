import { validateFile } from './lib/file-validator.js';
import { parseJsonFile } from './lib/json-parser.js';
import { createParticipant } from './lib/participant.js';
import { importMessages } from './lib/messages.js';
import { handleError } from './lib/error-handler.js';
import { supabase } from './lib/supabase.js';

async function importChat(filename, participantName) {
  try {
    console.log(`Starting import for ${participantName} from ${filename}`);
    
    // Validate file
    validateFile(filename);
    
    // Parse and validate JSON
    console.log('Parsing JSON file...');
    const messages = await parseJsonFile(filename);
    console.log(`Successfully loaded ${messages.length} messages`);

    // Create participant
    console.log('Creating participant...');
    const participant = await createParticipant(supabase, participantName, messages);
    console.log(`Created participant ${participantName} with ID: ${participant.id}`);

    // Import messages
    console.log('Importing messages...');
    const stats = await importMessages(supabase, participant.id, messages);

    // Print summary
    console.log('\nImport Summary:');
    console.log(`Total messages: ${stats.total}`);
    console.log(`Successfully imported: ${stats.success}`);
    console.log(`Failed to import: ${stats.failed}`);
    if (stats.retries > 0) {
      console.log(`Retries: ${stats.retries}`);
    }

  } catch (error) {
    handleError(error);
  }
}

// Handle command line arguments
const [,, filename, name] = process.argv;

if (!filename || !name) {
  console.error('Usage: node import-chat.js <filename> <participant_name>');
  process.exit(1);
}

importChat(filename, name);