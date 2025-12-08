-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TYPE user_role AS ENUM ('hr', 'employee');
CREATE TYPE user_status AS ENUM ('active', 'invited', 'pending');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  company_id UUID, -- Circular dependency with companies, handled with FK later or allow null initially
  status user_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Companies Table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  hr_owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add Foreign Key for users.company_id now that companies exists
ALTER TABLE users 
ADD CONSTRAINT fk_users_company 
FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- 3. Memberships Table
CREATE TYPE membership_status AS ENUM ('active', 'invited');

CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status membership_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Exercises Table
CREATE TYPE exercise_difficulty AS ENUM ('basic', 'medium', 'complex');

CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  difficulty exercise_difficulty DEFAULT 'basic',
  description TEXT,
  gif_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. SessionLogs Table
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source TEXT DEFAULT 'manual',
  duration_seconds INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Exercises: Publicly readable for authenticated users
CREATE POLICY "Exercises are viewable by everyone" 
ON exercises FOR SELECT 
USING (auth.role() = 'authenticated');

-- Companies: HR can view their own company (assuming they are linked via hr_owner_id or users table)
-- Simplification: Users can view the company they belong to.
CREATE POLICY "Users view their own company"
ON companies FOR SELECT
USING (
  id IN (SELECT company_id FROM users WHERE users.id = auth.uid()) OR 
  hr_owner_id = auth.uid()
);

-- Users: 
-- 1. Users can view themselves.
-- 2. HR can view users in their company.
CREATE POLICY "Users can view themselves"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "HR can view company members"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users AS viewer
    WHERE viewer.id = auth.uid() 
    AND viewer.role = 'hr' 
    AND viewer.company_id = users.company_id
  )
);

-- Logs:
-- 1. Users view own logs.
-- 2. HR views company logs.
CREATE POLICY "Users view own logs"
ON session_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "HR view company logs"
ON session_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users AS viewer
    WHERE viewer.id = auth.uid() 
    AND viewer.role = 'hr' 
    AND viewer.company_id = session_logs.company_id
  )
);

-- Helper function to handle new user signup (example trigger)
-- This assumes Supabase Auth creates a user in auth.users, and we trigger a copy to public.users
-- Skipped for now as we are mocking auth in the simple app, but good to note for real DB.
