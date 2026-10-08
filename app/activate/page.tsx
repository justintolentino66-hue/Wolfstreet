"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackground } from "../components/AuthBackground";
import { supabase } from "../lib/supabase";
import { sendActivationEmail } from "../lib/email";

// Helper to generate a friendly, secure temporary password
function generateTempPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Ems#${randomPart}26`;
}

export default function ActivatePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "info"; text: string } | null>(null);
  const [successData, setSuccessData] = useState<{
    email: string;
    employeeId: string;
    tempPassword?: string;
    simulated?: boolean;
  } | null>(null);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      // 1. Offline fallback if Supabase URL is not present
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        if (cleanEmail === "strwbrryshortc4ke@gmail.com") {
          const tempPwd = generateTempPassword();
          await sendActivationEmail({
            to_name: "Strawberry Shortcake",
            to_email: cleanEmail,
            employee_id: "24-1042-01",
            password: tempPwd,
          });
          setSuccessData({
            email: cleanEmail,
            employeeId: "24-1042-01",
            tempPassword: tempPwd,
            simulated: true,
          });
          return;
        }
      }

      // 2. Query Supabase accounts table by email
      const { data: account, error: queryError } = await supabase
        .from("accounts")
        .select("*, employees(*)")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (queryError) {
        throw new Error(queryError.message);
      }

      if (!account) {
        setMessage({
          type: "error",
          text: "No account found matching this company email. Please contact your manager.",
        });
        setLoading(false);
        return;
      }

      // 3. Check if account is already activated
      if (account.activation_status === "Active") {
        setMessage({
          type: "info",
          text: "This account has already been activated. You can proceed to sign in with your password.",
        });
        setLoading(false);
        return;
      }

      // 4. Generate new temporary password
      const newPassword = generateTempPassword();

      // 5. Update password and activation status in Supabase
      const { error: updateError } = await supabase
        .from("accounts")
        .update({
          password: newPassword,
          activation_status: "Active",
          activated_at: new Date().toISOString(),
        })
        .eq("email", cleanEmail);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // 6. Send credentials email via EmailJS
      const employeeName =
        account.employees && typeof account.employees === "object"
          ? `${account.employees.first_name || ""} ${account.employees.last_name || ""}`.trim()
          : cleanEmail.split("@")[0];

      const emailResult = await sendActivationEmail({
        to_name: employeeName || "Employee",
        to_email: cleanEmail,
        employee_id: account.employee_id,
        password: newPassword,
      });

      setSuccessData({
        email: cleanEmail,
        employeeId: account.employee_id,
        tempPassword: newPassword,
        simulated: emailResult.simulated,
      });
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Failed to activate account.";
      setMessage({ type: "error", text: errMessage });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthBackground>
      <div className="flex items-center justify-center min-h-screen py-10">
        {/* Container positioned in the grey zone */}
        <div
          className="flex flex-col items-center gap-5 w-full px-8"
          style={{ maxWidth: 420, marginRight: "18%" }}
        >
          {/* ── Title ── */}
          <div className="w-full bg-black rounded-full py-3 px-6 text-center shadow-lg shadow-black/20">
            <span className="text-white text-2xl font-bold tracking-wide">
              Account Activation
            </span>
          </div>

          {successData ? (
            /* ── Success Card after email is sent ── */
            <div className="w-full bg-white/95 backdrop-blur rounded-2xl p-6 text-center shadow-xl border border-slate-200/80 flex flex-col gap-4 items-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircledIcon />
              </div>

              <div className="flex flex-col gap-1">
                <h2 className="text-slate-900 font-bold text-xl">
                  Activation Email Sent!
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We sent an email with your <strong className="text-slate-800">Employee ID</strong> and <strong className="text-slate-800">Password</strong> to:
                </p>
                <div className="font-semibold text-slate-800 text-sm bg-slate-100 py-1.5 px-3 rounded-lg mt-1 inline-block border border-slate-200">
                  {successData.email}
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Please check your inbox (and spam folder). Use the provided credentials to sign into the system.
              </p>

              {/* Development helper badge */}
              {successData.simulated && successData.tempPassword && (
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-left text-xs text-amber-900 mt-1">
                  <div className="font-bold flex items-center justify-between text-amber-800">
                    <span>Developer Preview</span>
                    <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">EmailJS Test</span>
                  </div>
                  <div className="mt-1.5 space-y-0.5 font-mono text-[11px]">
                    <div>ID: <strong>{successData.employeeId}</strong></div>
                    <div>Password: <strong>{successData.tempPassword}</strong></div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-2 w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-neutral-800 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Login</span>
                <ArrowRightIcon />
              </button>
            </div>
          ) : (
            /* ── Email-only Activation Form ── */
            <form
              onSubmit={handleActivate}
              className="flex flex-col items-center gap-5 w-full"
            >
              <p className="text-slate-600 text-sm text-center px-2">
                Enter your registered company email. We will send your Employee ID and password to your inbox.
              </p>

              {/* ── Company Email Only ── */}
              <div className="w-full flex flex-col gap-1.5">
                <label
                  htmlFor="activate-email"
                  className="text-slate-600 text-sm pl-4 font-medium"
                >
                  Company email:
                </label>
                <div className="w-full bg-black rounded-full flex items-center px-5 py-4 gap-3 shadow-md shadow-black/15 focus-within:ring-2 focus-within:ring-white/20 transition">
                  <MailIcon />
                  <input
                    id="activate-email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/50"
                  />
                </div>
              </div>

              {/* ── Sign In Link ── */}
              <div className="w-full px-1 text-right text-sm">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2"
                >
                  Already activated? Sign in
                </Link>
              </div>

              {/* ── Feedback Message ── */}
              {message && (
                <div
                  className={`w-full p-3.5 rounded-2xl text-center text-sm font-medium ${
                    message.type === "info"
                      ? "bg-sky-100 text-sky-800 border border-sky-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {message.text}
                  {message.type === "info" && (
                    <div className="mt-2">
                      <Link
                        href="/login"
                        className="inline-block bg-sky-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-sky-900 transition"
                      >
                        Go to Login
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* ── Submit Button ── */}
              <button
                id="activate-submit"
                type="submit"
                disabled={loading}
                className="bg-black text-white text-xl font-bold py-3.5 px-12 rounded-full flex items-center gap-3 shadow-lg shadow-black/25 hover:bg-neutral-900 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? "Sending..." : "Activate"}
                <ArrowCircleIcon />
              </button>
            </form>
          )}
        </div>
      </div>
    </AuthBackground>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
      <path d="M8 12h8M13 8l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckCircledIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
