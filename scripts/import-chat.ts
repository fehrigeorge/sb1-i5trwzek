import { parseJsonFile } from './import/json-parser';
import { createParticipant } from './import/participant';
import { importMessages } from './import/messages';

async function importChat(filename: string, participantName: string) {
  try {
    console.log(`Starting import for ${participantName} from ${filename}`);
    
    // Parse and validate JSON file
    console.log('Parsing JSON file...');
    const messages = parseJsonFile(filename);
    console.log(`Successfully loaded ${messages.length} messages`);

    // Create participant
    console.log('Creating participant...');
    const participant = await createParticipant(participantName, messages);
    console.log(`Created participant ${participantName} with ID: ${participant.id}`);

    // Import messages
    console.log('Importing messages...');
    const stats = await importMessages(participant.id, messages);

    // Print summary
    console.log('\nImport Summary:');
    console.log(`Total messages: ${stats.total}`);
    console.log(`Successfully imported: ${stats.success}`);
    console.log(`Failed to import: ${stats.failed}`);

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

// Handle command line arguments
const [,, filename, name] = process.argv;

if (!filename || !name) {
  console.error('Usage: tsx scripts/import-chat.ts <filename> <participant_name>');
  process.exit(1);
}

importChat(filename, name)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });