-- Allow authenticated users to insert their own session logs
CREATE POLICY "Users can insert own logs"
ON session_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);
