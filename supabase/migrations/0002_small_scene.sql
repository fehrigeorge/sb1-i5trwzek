/*
  # Seed chat data

  1. Data Changes
    - Add more participants with realistic names and avatars
    - Add sample chat messages with realistic conversations
    - Update timestamps to show recent activity
    - Use proper UUID for system messages

  2. Changes
    - Insert participants with Unsplash avatar URLs
    - Insert messages with realistic conversation flow
    - Set varying timestamps for natural conversation pacing
    - Add system participant with fixed UUID
*/

-- Insert system participant
INSERT INTO participants (id, name, last_active) VALUES
  ('00000000-0000-0000-0000-000000000000', 'System', now());

-- Insert more participants with avatars
INSERT INTO participants (id, name, last_active, avatar_url) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Emma Wilson', now() - interval '5 minutes', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
  ('55555555-5555-5555-5555-555555555555', 'James Chen', now() - interval '15 minutes', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'),
  ('66666666-6666-6666-6666-666666666666', 'Sofia Rodriguez', now() - interval '30 minutes', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80');

-- Insert conversation with Emma Wilson
INSERT INTO messages (participant_id, sender_id, message, timestamp) VALUES
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Hey! Just wanted to check in about the project timeline', now() - interval '30 minutes'),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Sure! We are on track for the deadline', now() - interval '28 minutes'),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Great to hear! Do we need to schedule a review meeting?', now() - interval '25 minutes'),
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', 'Yes, that would be helpful. How about tomorrow at 2 PM?', now() - interval '23 minutes'),
  ('44444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'Perfect, I''ll send a calendar invite', now() - interval '20 minutes');

-- Insert conversation with James Chen
INSERT INTO messages (participant_id, sender_id, message, timestamp) VALUES
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Hi James, have you reviewed the latest design updates?', now() - interval '2 hours'),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Yes, I have some feedback. The color scheme looks great', now() - interval '1 hour 55 minutes'),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'But I think we should adjust the spacing in the header', now() - interval '1 hour 54 minutes'),
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', 'Thanks for the feedback! I''ll make those adjustments', now() - interval '1 hour 50 minutes');

-- Insert conversation with Sofia Rodriguez
INSERT INTO messages (participant_id, sender_id, message, timestamp) VALUES
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Hello! Quick question about the API documentation', now() - interval '45 minutes'),
  ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'Hi Sofia! What would you like to know?', now() - interval '43 minutes'),
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Are we using OpenAPI for the new endpoints?', now() - interval '40 minutes'),
  ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', 'Yes, all new endpoints will have OpenAPI specs', now() - interval '38 minutes'),
  ('66666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'Perfect, thanks for confirming!', now() - interval '35 minutes');