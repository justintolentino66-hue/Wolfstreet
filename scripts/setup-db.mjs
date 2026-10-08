/**
 * setup-db.mjs
 * Seeds the Supabase database using the REST API directly via fetch().
 * Works on Node.js 18+ without the realtime/WebSocket dependency.
 */

import fs from "fs";
import path from "path";

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf-8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const [key, ...vals] = trimmed.split("=");
    if (key && vals.length > 0)
      process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
  });
}

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const API_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!BASE_URL || !API_KEY) {
  console.error("❌ Missing credentials in .env.local");
  process.exit(1);
}

const HEADERS = {
  "Content-Type": "application/json",
  "apikey": API_KEY,
  "Authorization": `Bearer ${API_KEY}`,
  "Prefer": "resolution=merge-duplicates",
};

async function rest(table, rows) {
  const res = await fetch(`${BASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(rows),
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* plain text */ }
  return { ok: res.ok, status: res.status, body: json ?? text };
}

async function run() {
  console.log("🔌 Connecting to:", BASE_URL);

  // ── Test connection ──────────────────────────────────────────────────────
  const testRes = await fetch(`${BASE_URL}/rest/v1/departments?select=department_id&limit=1`, {
    headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}` },
  });

  if (testRes.status === 404 || !testRes.ok) {
    const body = await testRes.text();
    if (body.includes("relation") || body.includes("does not exist") || testRes.status === 404) {
      console.log("\n⚠️  Tables not found in your Supabase database.\n");
      console.log("📋 Please run the schema SQL first:");
      console.log("   1. Open: https://supabase.com/dashboard/project/vjibdosoxamxcbucxfcu/sql/new");
      console.log("   2. Paste the contents of  supabase/schema.sql");
      console.log("   3. Click RUN");
      console.log("   4. Come back and run:  node scripts/setup-db.mjs\n");
    } else {
      console.error("❌ Connection error:", testRes.status, body);
    }
    process.exit(0);
  }

  console.log("✅ Connection OK — tables found.\n");
  console.log("🌱 Seeding data...\n");

  // ── 1. Department ──────────────────────────────────────────────────────────
  process.stdout.write("1. Department... ");
  const r1 = await rest("departments", [{
    department_id: "DEP-ENG",
    name: "Engineering",
    description: "Software Engineering and Product Development",
  }]);
  console.log(r1.ok ? "✅" : `❌ ${JSON.stringify(r1.body)}`);

  // ── 2. Employees ──────────────────────────────────────────────────────────
  process.stdout.write("2. Employees... ");
  const r2 = await rest("employees", [
    {
      employee_id: "24-0501-01", first_name: "Justin", middle_name: "", last_name: "Tolentino",
      job_title: "Engineering Manager", department_id: "DEP-ENG",
      email: "justintolentino66@gmail.com", phone: "+63 917 123 4567",
      address: "Makati City, Metro Manila", gender: "Male", civil_status: "Single",
      emergency_number: "+63 918 765 4321", leave_balance: 15, employment_status: "Active",
    },
    {
      employee_id: "24-1042-01", first_name: "Strawberry", middle_name: "", last_name: "Shortcake",
      job_title: "Software Developer", department_id: "DEP-ENG",
      email: "strwbrryshortc4ke@gmail.com", phone: "+63 919 234 5678",
      address: "Quezon City, Metro Manila", gender: "Female", civil_status: "Single",
      emergency_number: "+63 920 876 5432", leave_balance: 15, employment_status: "Active",
    },
  ]);
  console.log(r2.ok ? "✅ 2 employees" : `❌ ${JSON.stringify(r2.body)}`);

  // ── 3. Accounts ──────────────────────────────────────────────────────────
  process.stdout.write("3. Accounts... ");
  const r3 = await rest("accounts", [
    {
      employee_id: "24-0501-01", email: "justintolentino66@gmail.com",
      password: "Manager2026!", role: "Manager",
      activation_status: "Active", activated_at: "2026-01-15T08:00:00Z",
    },
    {
      employee_id: "24-1042-01", email: "strwbrryshortc4ke@gmail.com",
      password: null, role: "Employee",
      activation_status: "Pending", activated_at: null,
    },
  ]);
  console.log(r3.ok ? "✅ 2 accounts" : `❌ ${JSON.stringify(r3.body)}`);

  console.log("\n🎉 Done!\n");
  console.log("📋 Credentials:");
  console.log("   Manager : justintolentino66@gmail.com  → Manager2026!");
  console.log("   Employee: strwbrryshortc4ke@gmail.com  → needs /activate first\n");
}

run().catch((e) => { console.error("Error:", e); process.exit(1); });
