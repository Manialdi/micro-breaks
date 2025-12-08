-- Allow employees to view profiles of other users in the same company (for Leaderboard names)
CREATE POLICY "Employees can view company coworkers"
ON users FOR SELECT
USING (
  auth.uid() = id -- Can see self
  OR 
  (company_id = (SELECT company_id FROM users WHERE id = auth.uid()) AND role = 'employee') -- Can see other employees in same company
);

-- Allow employees to view session logs of the company (for Leaderboard stats)
CREATE POLICY "Employees can view company logs"
ON session_logs FOR SELECT
USING (
  company_id = (SELECT company_id FROM users WHERE id = auth.uid())
);
