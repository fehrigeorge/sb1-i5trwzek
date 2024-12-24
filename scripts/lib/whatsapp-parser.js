import { parseISO, isValid } from 'date-fns';

const MESSAGE_PATTERN = /^\[(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})\] (.+?): (.+)$/;
const SYSTEM_MESSAGE_PATTERN = /^\[(\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2})\] (.+)$/;

function parseWhatsAppDate(dateStr) {
  // Convert WhatsApp date format to ISO
  const [date, time] = dateStr.split(', ');
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}T${time}Z`;
}

export function parseWhatsAppMessage(line) {
  // Try parsing as regular message
  const match = line.match(MESSAGE_PATTERN);
  if (match) {
    const [, timestamp, name, message] = match;
    const isoTimestamp = parseWhatsAppDate(timestamp);
    
    if (!isValid(parseISO(isoTimestamp))) {
      return null;
    }

    return {
      name,
      message: message.trim(),
      timestamp: isoTimestamp
    };
  }

  // Try parsing as system message
  const systemMatch = line.match(SYSTEM_MESSAGE_PATTERN);
  if (systemMatch) {
    const [, timestamp, message] = systemMatch;
    const isoTimestamp = parseWhatsAppDate(timestamp);

    if (!isValid(parseISO(isoTimestamp))) {
      return null;
    }

    return {
      name: 'System',
      message: message.trim(),
      timestamp: isoTimestamp
    };
  }

  return null;
}

export function parseWhatsAppChat(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const messages = [];
  let currentMessage = '';
  let currentMessageData = null;

  for (const line of lines) {
    // Check if line starts a new message
    const messageData = parseWhatsAppMessage(line);

    if (messageData) {
      // Save previous message if exists
      if (currentMessageData) {
        messages.push({
          ...currentMessageData,
          message: currentMessage.trim()
        });
      }
      // Start new message
      currentMessageData = messageData;
      currentMessage = messageData.message;
    } else if (currentMessageData) {
      // Append to current message for multi-line messages
      currentMessage += '\n' + line;
    }
  }

  // Add final message
  if (currentMessageData) {
    messages.push({
      ...currentMessageData,
      message: currentMessage.trim()
    });
  }

  return messages;
}