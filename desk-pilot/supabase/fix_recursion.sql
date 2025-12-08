-- Fix specific infinite recursion issues in RLS policies

-- 1. Create a secure function to read the current user's metadata 
-- This function runs with "SECURITY DEFINER" privileges, bypassing RLS to avoid the loop.
CREATE OR REPLACE FUNCTION get_my_data()
RETURNS TABLE (role user_role, company_id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT role, company_id FROM users WHERE id = auth.uid();
END;
$$;

-- 2. Fix "HR can view company members" on users table
DROP POLICY IF EXISTS "HR can view company members" ON users;

CREATE POLICY "HR can view company members"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.role = 'hr' 
    AND viewer.company_id = users.company_id
  )
);

-- 3. Fix "HR view company logs" on session_logs table
-- (This also queried users, which was recursive)
DROP POLICY IF EXISTS "HR view company logs" ON session_logs;

CREATE POLICY "HR view company logs"
ON session_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.role = 'hr' 
    AND viewer.company_id = session_logs.company_id
  )
);

-- 4. Fix Companies "Users view their own company"
-- This queried 'users' table directly. Safer to use the function.
DROP POLICY IF EXISTS "Users view their own company" ON companies;

CREATE POLICY "Users view their own company"
ON companies FOR SELECT
USING (
  id IN (SELECT company_id FROM get_my_data()) OR 
  hr_owner_id = auth.uid()
);
