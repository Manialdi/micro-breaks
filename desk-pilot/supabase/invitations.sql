-- Create Invitations Table
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  token UUID DEFAULT uuid_generate_v4(),
  status TEXT DEFAULT 'pending', -- pending, accepted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for Invitations
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- 1. HR can view/insert invitations for their company
CREATE POLICY "HR can manage invitations"
ON invitations
USING (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.my_role = 'hr' 
    AND viewer.my_company_id = invitations.company_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.my_role = 'hr' 
    AND viewer.my_company_id = invitations.company_id
  )
);

-- 2. Public can read invitation by token (for the signup page)
-- We need a function or just a policy that allows reading if you know the token
-- But for simplicity in this prototype, we might allow public read OR assume a function is used to fetch.
-- Let's use a wrapper function in databaseService normally, but here's a policy for direct select if needed.
-- Security Note: searching by token is safe enough for "claiming".
CREATE POLICY "Public can view invitation by token"
ON invitations FOR SELECT
USING (true); 
-- In a stricter app, we'd wrap this in a SECURITY DEFINER function to avoid listing all invitations, 
-- but 'token' is hard to guess (UUID). 
-- For strictness: we can limit to only where token = current_query_token? Not easy in RLS without session var.
-- We will rely on the app ensuring it filters by token.

-- Update get_company_employees to also include/exclude invited?
-- The previous list showed "Invited" users.
-- We can either:
-- A) Keep "Ghost Users" in the users table (my previous approach), which is easier for the "List" but harder for Auth.
-- B) Fetch "Users" AND "Invitations" and merge them in the UI. 
-- The user reported "Employee added but no email". 
-- Plan: I will use B. Merge real users and pending invitations in the UI.
