-- Enable HR to invite employees (Insert into users and memberships)

-- 1. Allow HR to insert new users (role='employee') for their own company
-- We use the get_my_data() helper to verify the executing user is an HR of the target company.
CREATE POLICY "HR can insert employees"
ON users FOR INSERT
WITH CHECK (
  role = 'employee' AND
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.my_role = 'hr' 
    AND viewer.my_company_id = users.company_id
  )
);

-- 2. Allow HR to insert memberships for these new employees
CREATE POLICY "HR can insert employee memberships"
ON memberships FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM get_my_data() AS viewer
    WHERE viewer.my_role = 'hr' 
    AND viewer.my_company_id = memberships.company_id
  )
);
