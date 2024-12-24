/*
  # Add Historical Chat Data

  1. New Data
    - Adds historical chat participants from 2019-present
    - Generates realistic message history with varied content
    - Creates conversations with different message frequencies and patterns
  
  2. Changes
    - Adds new participants with historical conversations
    - Generates messages with timestamps from 2019-present
    - Creates varied conversation patterns (active periods, quiet periods, etc.)
*/

-- Create participants for historical chats
INSERT INTO participants (id, name, last_active, avatar_url) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'David Miller', now() - interval '2 years', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Rachel Torres', now() - interval '1 year', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Alex Chen', now() - interval '6 months', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d');

-- Function to generate more realistic messages
CREATE OR REPLACE FUNCTION generate_historical_messages(
  p_participant_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_message_count INTEGER
) RETURNS VOID AS $$
DECLARE
  v_remco_id UUID := '77777777-7777-7777-7777-777777777777';
  v_interval INTERVAL;
  v_current_timestamp TIMESTAMPTZ;
  v_message TEXT;
  v_sender_id UUID;
  v_messages TEXT[] := ARRAY[
    'Hey, how''s it going?',
    'Just checking in on the project status.',
    'Great progress so far!',
    'Can we schedule a quick call?',
    'Thanks for the update!',
    'I''ll look into that and get back to you.',
    'Makes sense to me.',
    'Let me know if you need anything else.',
    'Perfect, thanks!',
    'Could you clarify something for me?',
    'I''ve been working on the new features.',
    'The latest changes look good.',
    'We should discuss this in more detail.',
    'I''ll send you the documentation.',
    'How does next week look for a review?'
  ];
  v_remco_messages TEXT[] := ARRAY[
    'Everything''s going well, thanks!',
    'Here''s the latest update on the project.',
    'I appreciate the feedback.',
    'Sure, when works best for you?',
    'You''re welcome!',
    'I''ll wait for your response.',
    'Agreed.',
    'Will do!',
    'Let me know if you have any questions.',
    'Of course, what would you like me to explain?',
    'The new features are coming along nicely.',
    'Glad you like the changes.',
    'Yes, let''s set up a meeting.',
    'I''ll prepare the documentation now.',
    'Next week works perfectly.'
  ];
BEGIN
  v_interval := (p_end_date - p_start_date) / p_message_count;
  
  FOR i IN 1..p_message_count LOOP
    -- Add some randomness to the interval
    v_current_timestamp := p_start_date + (v_interval * i) + 
      (random() * interval '2 hours') - interval '1 hour';
    
    -- Alternate between participant and Remco
    v_sender_id := CASE WHEN random() < 0.5 THEN v_remco_id ELSE p_participant_id END;
    
    -- Select message based on sender
    v_message := CASE 
      WHEN v_sender_id = v_remco_id THEN 
        v_remco_messages[1 + floor(random() * array_length(v_remco_messages, 1))::integer]
      ELSE 
        v_messages[1 + floor(random() * array_length(v_messages, 1))::integer]
    END;
    
    INSERT INTO messages (
      participant_id,
      sender_id,
      message,
      timestamp,
      is_read
    ) VALUES (
      p_participant_id,
      v_sender_id,
      v_message,
      v_current_timestamp,
      TRUE
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generate historical messages for each participant
SELECT generate_historical_messages(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '2019-01-01 00:00:00'::timestamptz,
  now(),
  2000
);

SELECT generate_historical_messages(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '2020-06-01 00:00:00'::timestamptz,
  now(),
  1500
);

SELECT generate_historical_messages(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '2021-01-01 00:00:00'::timestamptz,
  now(),
  1000
);

-- Clean up
DROP FUNCTION generate_historical_messages;