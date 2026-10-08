import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || "").trim().replace(/^['"]|['"]$/g, "");
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

import { WebSocket } from "ws";

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: { transport: WebSocket },
});

async function run() {
  console.log("🔄 Updating database accounts and employees...");

  // 1. Delete old demo accounts
  const oldEmails = [
    "james.rivera@company.com",
    "mark.spencer@company.com",
    "sarah.jenkins@company.com",
    "david.chen@company.com",
    "alex.mercer@company.com",
  ];
  const { error: delAccError } = await supabase
    .from("accounts")
    .delete()
    .in("email", oldEmails);

  if (delAccError) {
    console.error("Error deleting accounts:", delAccError.message);
  } else {
    console.log("✅ Cleared old demo accounts");
  }

  // 2. Delete old employees
  const oldEmpIds = ["24-1042-02", "24-1042-03", "24-1042-04"];
  const { error: delEmpError } = await supabase
    .from("employees")
    .delete()
    .in("employee_id", oldEmpIds);

  if (delEmpError) {
    console.error("Error deleting employees:", delEmpError.message);
  } else {
    console.log("✅ Cleared old demo employees");
  }

  // 3. Insert new Employees
  const newEmployees = [
    {
      employee_id: "24-0501-01",
      first_name: "Justin",
      middle_name: "",
      last_name: "Tolentino",
      job_title: "Engineering Manager",
      department_id: "DEP-ENG",
      email: "justintolentino66@gmail.com",
      phone: "+63 917 123 4567",
      address: "Makati City, Metro Manila",
      gender: "Male",
      civil_status: "Single",
      emergency_number: "+63 918 765 4321",
      leave_balance: 15,
      employment_status: "Active",
    },
    {
      employee_id: "24-1042-01",
      first_name: "Strawberry",
      middle_name: "",
      last_name: "Shortcake",
      job_title: "Software Developer",
      department_id: "DEP-ENG",
      email: "strwbrryshortc4ke@gmail.com",
      phone: "+63 919 234 5678",
      address: "Quezon City, Metro Manila",
      gender: "Female",
      civil_status: "Single",
      emergency_number: "+63 920 876 5432",
      leave_balance: 15,
      employment_status: "Active",
    },
  ];

  const { error: empError } = await supabase.from("employees").upsert(newEmployees);
  if (empError) {
    console.error("❌ Failed to insert employees:", empError.message);
  } else {
    console.log("✅ Inserted 2 employees (Justin Tolentino & Strawberry Shortcake)");
  }

  // 4. Insert new Accounts
  const newAccounts = [
    {
      employee_id: "24-0501-01",
      email: "justintolentino66@gmail.com",
      password: "Manager2026!",
      role: "Manager",
      activation_status: "Active",
      activated_at: new Date().toISOString(),
    },
    {
      employee_id: "24-1042-01",
      email: "strwbrryshortc4ke@gmail.com",
      password: null,
      role: "Employee",
      activation_status: "Pending", // Ready for /activate test!
      activated_at: null,
    },
  ];

  const { error: accError } = await supabase.from("accounts").upsert(newAccounts);
  if (accError) {
    console.error("❌ Failed to insert accounts:", accError.message);
  } else {
    console.log("✅ Inserted 2 accounts");
  }

  // 5. Verify data
  const { data: accounts } = await supabase.from("accounts").select("email, role, activation_status, employee_id");
  console.log("\n📊 Current Database Accounts in Supabase:");
  console.table(accounts);
}

run();
