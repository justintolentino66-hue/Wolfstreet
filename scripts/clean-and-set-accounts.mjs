import { createClient } from "@supabase/supabase-js";
import { WebSocket } from "ws";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    env[match[1]] = (match[2] || "").trim().replace(/^['"]|['"]$/g, "");
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
  realtime: { transport: WebSocket },
});

async function main() {
  const oldEmails = [
    "james.rivera@company.com",
    "mark.spencer@company.com",
    "sarah.jenkins@company.com",
    "david.chen@company.com",
    "alex.mercer@company.com",
  ];

  // Disable old accounts so they cannot be logged into
  for (const email of oldEmails) {
    const { error } = await supabase
      .from("accounts")
      .update({
        password: null,
        activation_status: "Pending",
        email: `disabled_${Date.now()}_${email}`,
      })
      .eq("email", email);

    if (error) {
      console.log(`Failed to disable ${email}:`, error.message);
    } else {
      console.log(`Disabled old account: ${email}`);
    }
  }

  // Ensure Justin Tolentino is Manager and Active
  await supabase
    .from("accounts")
    .update({
      password: "Manager2026!",
      role: "Manager",
      activation_status: "Active",
      activated_at: new Date().toISOString(),
    })
    .eq("email", "justintolentino66@gmail.com");

  // Ensure Strwbrryshortc4ke@gmail.com is Employee and Pending
  await supabase
    .from("accounts")
    .update({
      password: null,
      role: "Employee",
      activation_status: "Pending",
      activated_at: null,
    })
    .eq("email", "strwbrryshortc4ke@gmail.com");

  // Fetch only non-disabled accounts
  const { data: accounts } = await supabase
    .from("accounts")
    .select("employee_id, email, role, activation_status")
    .not("email", "like", "disabled_%");

  console.log("\n✅ Active Accounts in System:");
  console.table(accounts);
}

main();
