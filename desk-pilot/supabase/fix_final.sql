-- 1. Helper Function to bypass recursion (Security Definer)
-- Renamed output parameters to avoid "ambiguous column" error with table columns
DROP FUNCTION IF EXISTS get_my_data() CASCADE;

CREATE OR REPLACE FUNCTION get_my_data()
RETURNS TABLE (my_role user_role, my_company_id UUID) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY SELECT users.role, users.company_id FROM users WHERE users.id = auth.uid();
END;
$$;

-- 2. RESET POLICIES (Drop existing to be clean)
DROP POLICY IF EXISTS "Users can view themselves" ON users;
DROP POLICY IF EXISTS "HR can view company members" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users view their own company" ON companies;
DROP POLICY IF EXISTS "Authenticated users can create companies" ON companies;
DROP POLICY IF EXISTS "HR can update their company" ON companies;
DROP POLICY IF EXISTS "Users can insert their own membership" ON memberships;
DROP POLICY IF EXISTS "Users view self memberships" ON memberships;
DROP POLICY IF EXISTS "HR view company memberships" ON memberships;

-- 3. USERS TABLE POLICIES
-- View: Self + HR viewing their company members (Safe version)
CREATE POLICY "Users can view themselves" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "HR can view company members" ON users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.my_role = 'hr' 
    AND viewer.my_company_id = users.company_id
  )
);

-- Insert: Allow user to create their own profile (Critical for Signup)
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Update: Allow user to update their own profile (Critical for linking Company later)
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- 4. COMPANIES TABLE POLICIES
-- View: Members of the company OR the HR owner
CREATE POLICY "Users view their own company" ON companies FOR SELECT 
USING (
  id IN (SELECT my_company_id FROM get_my_data()) OR 
  hr_owner_id = auth.uid()
);

-- Insert: Authenticated users can create a company
CREATE POLICY "Authenticated users can create companies" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Update: HR Owner can update
CREATE POLICY "HR can update their company" ON companies FOR UPDATE USING (hr_owner_id = auth.uid());

-- 5. MEMBERSHIPS TABLE POLICIES
-- Insert: User can join
CREATE POLICY "Users can insert their own membership" ON memberships FOR INSERT WITH CHECK (auth.uid() = user_id);

-- View: Self + HR
CREATE POLICY "Users view self memberships" ON memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "HR view company memberships" ON memberships FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.my_role = 'hr' 
    AND viewer.my_company_id = memberships.company_id
  )
);
