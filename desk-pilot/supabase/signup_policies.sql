-- Enable INSERT policies for Signup Flow

-- 1. Allow authenticated users to insert their own profile in 'public.users'
CREATE POLICY "Users can insert their own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- 2. Allow authenticated users (HR) to create a company
CREATE POLICY "Authenticated users can create companies"
ON companies FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- 3. Allow authenticated users to insert memberships (for themselves)
CREATE POLICY "Users can insert their own membership"
ON memberships FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 4. Allow HR to update their own Company (to link hr_owner_id if needed, or if policies blocked it)
CREATE POLICY "HR can update their company"
ON companies FOR UPDATE
USING (auth.uid() = hr_owner_id);
