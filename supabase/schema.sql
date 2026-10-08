-- ============================================================================
-- Employee Management System (EMS) — Supabase Schema
-- Matches EMS_Final_Plan_v2.md
-- ============================================================================

-- Enable pgcrypto for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  department_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
  employee_id TEXT PRIMARY KEY, -- Format: 24-XXXX-XX
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  department_id TEXT REFERENCES departments(department_id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  gender TEXT,
  civil_status TEXT,
  emergency_number TEXT,
  leave_balance INT DEFAULT 15,
  avatar_url TEXT DEFAULT '/avatar.jpg',
  employment_status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Accounts Table (Auth & Activation)
-- Flow: Activation -> Login -> (Forgot Password) -> Update Credentials -> Login
-- Managers are pre-activated; Employees start as 'Pending' until first activation.
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id TEXT REFERENCES employees(employee_id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password TEXT, -- Password set by employee on activation, or pre-seeded
  role TEXT NOT NULL CHECK (role IN ('Employee', 'Manager')),
  activation_status TEXT NOT NULL CHECK (activation_status IN ('Pending', 'Active')),
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

-- 5. Public read policies (or customize per auth requirements)
CREATE POLICY "Allow public read on departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public read on employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Allow public read on accounts" ON accounts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on accounts" ON accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on accounts" ON accounts FOR UPDATE USING (true);
CREATE POLICY "Allow public insert on employees" ON employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on employees" ON employees FOR UPDATE USING (true);
