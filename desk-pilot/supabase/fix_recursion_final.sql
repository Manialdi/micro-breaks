-- FIX INFINITE RECURSION IN RLS POLICIES

-- 1. Helper Function: Get My Company ID (Security Definer to bypass RLS)
-- We only fetch company_id, avoiding the role check which might query users again if we aren't careful.
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public -- Secure search path
AS $$
BEGIN
  RETURN (SELECT company_id FROM users WHERE id = auth.uid());
END;
$$;

-- 2. RESET POLICIES on USERS table
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view themselves" ON users;
DROP POLICY IF EXISTS "HR can view company members" ON users;
DROP POLICY IF EXISTS "HR can insert employees" ON users;

-- 3. APPLY SAFE POLICIES

-- A. INSERT: Critical for Signup. Simple ID check.
CREATE POLICY "Users can insert their own profile" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = id);

-- B. UPDATE: Critical for Signup (linking company). Simple ID check.
CREATE POLICY "Users can update their own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- C. SELECT (Self): Simple ID check.
CREATE POLICY "Users can view themselves" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- D. SELECT (HR view members):
-- BREAK THE LOOP: Use auth.jwt() to check role, so we don't query the table we are protecting.
CREATE POLICY "HR can view company members" 
ON users FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
  AND
  company_id = get_my_company_id()
);

-- E. INSERT (HR add employees):
CREATE POLICY "HR can insert employees" 
ON users FOR INSERT 
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
  AND
  company_id = get_my_company_id()
);


-- 4. FIX MEMBERSHIPS & INVITATIONS (Use the same safe pattern)

-- Memberships
DROP POLICY IF EXISTS "HR view company memberships" ON memberships;
CREATE POLICY "HR view company memberships" 
ON memberships FOR SELECT 
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
  AND
  company_id = get_my_company_id()
);

DROP POLICY IF EXISTS "HR can insert employee memberships" ON memberships;
CREATE POLICY "HR can insert employee memberships" 
ON memberships FOR INSERT 
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
  AND
  company_id = get_my_company_id()
);


-- Invitations
DROP POLICY IF EXISTS "HR can manage invitations" ON invitations;
CREATE POLICY "HR can manage invitations" 
ON invitations
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
  AND
  company_id = get_my_company_id()
)
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'hr'
  AND
  company_id = get_my_company_id()
);
