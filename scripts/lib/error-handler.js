export function handleError(error) {
  console.error('\nError:', formatError(error));
  process.exit(1);
}

function formatError(error) {
  if (error.code === 'ENOENT') {
    return `File not found: ${error.path}\nPlease provide the correct path to your JSON file.`;
  }

  if (error.message.includes('JSON')) {
    return `Invalid JSON format: ${error.message}\nPlease ensure your file contains valid JSON data.`;
  }

  return error.message;
}