-- ============================================================================
-- Employee Management System (EMS) — Supabase Seed Data
-- ============================================================================

-- Clean existing seed data
DELETE FROM accounts WHERE email NOT IN ('justintolentino66@gmail.com', 'strwbrryshortc4ke@gmail.com');
DELETE FROM employees WHERE email NOT IN ('justintolentino66@gmail.com', 'strwbrryshortc4ke@gmail.com');

-- 1. Insert Department
INSERT INTO departments (department_id, name, description)
VALUES ('DEP-ENG', 'Engineering', 'Software Engineering and Product Development')
ON CONFLICT (department_id) DO NOTHING;

-- 2. Insert Employees
INSERT INTO employees (
  employee_id, first_name, middle_name, last_name, job_title, department_id,
  email, phone, address, gender, civil_status, emergency_number, leave_balance, employment_status
) VALUES
  -- Department Manager: Justin Tolentino
  (
    '24-0501-01', 'Justin', '', 'Tolentino', 'Engineering Manager', 'DEP-ENG',
    'justintolentino66@gmail.com', '+63 917 123 4567', 'Makati City, Metro Manila',
    'Male', 'Single', '+63 918 765 4321', 15, 'Active'
  ),

  -- Employee: Strawberry Shortcake (Pending Activation)
  (
    '24-1042-01', 'Strawberry', '', 'Shortcake', 'Software Developer', 'DEP-ENG',
    'strwbrryshortc4ke@gmail.com', '+63 919 234 5678', 'Quezon City, Metro Manila',
    'Female', 'Single', '+63 920 876 5432', 15, 'Active'
  )
ON CONFLICT (employee_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name;

-- 3. Insert Accounts
INSERT INTO accounts (
  employee_id, email, password, role, activation_status, activated_at
) VALUES
  -- Manager: Justin Tolentino (Active)
  (
    '24-0501-01', 'justintolentino66@gmail.com', 'Manager2026!', 'Manager', 'Active', NOW()
  ),

  -- Employee: Strawberry Shortcake (Pending activation via /activate)
  (
    '24-1042-01', 'strwbrryshortc4ke@gmail.com', NULL, 'Employee', 'Pending', NULL
  )
ON CONFLICT (email) DO UPDATE SET
  employee_id = EXCLUDED.employee_id,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  activation_status = EXCLUDED.activation_status;
