-- Create a function to get message stats efficiently
CREATE OR REPLACE FUNCTION get_message_stats(remco_id UUID)
RETURNS TABLE (
  participant_id UUID,
  total_count BIGINT,
  last_message JSONB
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH message_counts AS (
    SELECT 
      m.participant_id,
      COUNT(*) as count,
      JSONB_BUILD_OBJECT(
        'message', last_message.message,
        'timestamp', last_message.timestamp,
        'sender_id', last_message.sender_id
      ) as last_message
    FROM messages m
    LEFT JOIN LATERAL (
      SELECT message, timestamp, sender_id
      FROM messages m2
      WHERE m2.participant_id = m.participant_id
      ORDER BY timestamp DESC
      LIMIT 1
    ) last_message ON true
    WHERE m.participant_id != remco_id
    GROUP BY 
      m.participant_id,
      last_message.message,
      last_message.timestamp,
      last_message.sender_id
  )
  SELECT 
    mc.participant_id,
    mc.count as total_count,
    mc.last_message
  FROM message_counts mc;
END;
$$;