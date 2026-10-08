import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load .env.local if present
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...values] = trimmed.split("=");
    if (key && values.length > 0) {
      const val = values.join("=").trim().replace(/^["']|["']$/g, "");
      process.env[key.trim()] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing Supabase credentials!");
  console.error(
    "Please make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Starting Supabase Seeding according to EMS Final Plan v2...\n");

  // 1. Department
  console.log("1. Seeding Department...");
  const { error: deptError } = await supabase.from("departments").upsert([
    {
      department_id: "DEP-ENG",
      name: "Engineering",
      description: "Software Engineering and Product Development",
    },
  ]);
  if (deptError) {
    console.error("⚠️ Failed to upsert department:", deptError.message);
  } else {
    console.log("✅ Department (Engineering) seeded.");
  }

  // 2. Employees
  console.log("2. Seeding Employees...");
  const employees = [
    {
      employee_id: "24-0501-01",
      first_name: "James",
      middle_name: "Edward",
      last_name: "Rivera",
      job_title: "Engineering Manager",
      department_id: "DEP-ENG",
      email: "james.rivera@company.com",
      phone: "+63 917 123 4567",
      address: "123 Tech Hub Ave, Makati City",
      gender: "Male",
      civil_status: "Married",
      emergency_number: "+63 918 765 4321",
      leave_balance: 15,
      employment_status: "Active",
    },
    {
      employee_id: "24-1042-01",
      first_name: "Mark",
      middle_name: "Anthony",
      last_name: "Spencer",
      job_title: "Software Developer",
      department_id: "DEP-ENG",
      email: "mark.spencer@company.com",
      phone: "+63 919 234 5678",
      address: "45 Silicon Lane, Quezon City",
      gender: "Male",
      civil_status: "Single",
      emergency_number: "+63 920 876 5432",
      leave_balance: 11,
      employment_status: "Active",
    },
    {
      employee_id: "24-1042-02",
      first_name: "Sarah",
      middle_name: "Marie",
      last_name: "Jenkins",
      job_title: "Frontend Developer",
      department_id: "DEP-ENG",
      email: "sarah.jenkins@company.com",
      phone: "+63 917 345 6789",
      address: "78 Coral St, Pasig City",
      gender: "Female",
      civil_status: "Single",
      emergency_number: "+63 918 654 3210",
      leave_balance: 14,
      employment_status: "Active",
    },
    {
      employee_id: "24-1042-03",
      first_name: "David",
      middle_name: "Lee",
      last_name: "Chen",
      job_title: "QA Engineer",
      department_id: "DEP-ENG",
      email: "david.chen@company.com",
      phone: "+63 919 456 7890",
      address: "12 Horizon Tower, Taguig City",
      gender: "Male",
      civil_status: "Married",
      emergency_number: "+63 920 543 2109",
      leave_balance: 12,
      employment_status: "Active",
    },
    {
      employee_id: "24-1042-04",
      first_name: "Alex",
      middle_name: "Jordan",
      last_name: "Mercer",
      job_title: "UI/UX Designer",
      department_id: "DEP-ENG",
      email: "alex.mercer@company.com",
      phone: "+63 917 567 8901",
      address: "89 Pioneer Way, Mandaluyong City",
      gender: "Non-Binary",
      civil_status: "Single",
      emergency_number: "+63 918 432 1098",
      leave_balance: 15,
      employment_status: "Active",
    },
  ];

  const { error: empError } = await supabase.from("employees").upsert(employees, {
    onConflict: "employee_id",
  });
  if (empError) {
    console.error("⚠️ Failed to upsert employees:", empError.message);
  } else {
    console.log("✅ 5 Employees successfully seeded.");
  }

  // 3. Accounts
  console.log("3. Seeding User Accounts...");
  const accounts = [
    {
      employee_id: "24-0501-01",
      email: "james.rivera@company.com",
      password: "Manager2026!",
      role: "Manager",
      activation_status: "Active",
      activated_at: "2026-01-15T08:00:00Z",
    },
    {
      employee_id: "24-1042-01",
      email: "mark.spencer@company.com",
      password: null, // Pending activation by user on /activate
      role: "Employee",
      activation_status: "Pending",
      activated_at: null,
    },
    {
      employee_id: "24-1042-02",
      email: "sarah.jenkins@company.com",
      password: "Employee2026!",
      role: "Employee",
      activation_status: "Active",
      activated_at: "2026-02-01T09:00:00Z",
    },
    {
      employee_id: "24-1042-03",
      email: "david.chen@company.com",
      password: "Employee2026!",
      role: "Employee",
      activation_status: "Active",
      activated_at: "2026-02-01T09:00:00Z",
    },
    {
      employee_id: "24-1042-04",
      email: "alex.mercer@company.com",
      password: "Employee2026!",
      role: "Employee",
      activation_status: "Active",
      activated_at: "2026-02-01T09:00:00Z",
    },
  ];

  const { error: accError } = await supabase.from("accounts").upsert(accounts, {
    onConflict: "email",
  });
  if (accError) {
    console.error("⚠️ Failed to upsert accounts:", accError.message);
  } else {
    console.log("✅ User Accounts successfully created and synced with Supabase!");
  }

  console.log("\n🎉 Seeding finished!");
}

seed().catch((err) => {
  console.error("Unhandled error during seeding:", err);
  process.exit(1);
});
