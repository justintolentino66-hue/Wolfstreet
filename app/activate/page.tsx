"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackground } from "../components/AuthBackground";

export default function ActivatePage() {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    router.push("/login");
  }

  return (
    <AuthBackground>
      <div className="flex items-center justify-center min-h-screen py-10">
        {/* Shift form left so it sits in the grey zone */}
        <form
          onSubmit={handleActivate}
          className="flex flex-col items-center gap-5 w-full px-8"
          style={{ maxWidth: 400, marginRight: "18%" }}
        >
          {/* ── Title ── */}
          <div className="w-full bg-black rounded-full py-3 px-6 text-center shadow-lg shadow-black/20">
            <span className="text-white text-2xl font-bold tracking-wide">
              Account Activation
            </span>
          </div>

          {/* ── Employee ID ── */}
          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="activate-employee-id"
              className="text-slate-600 text-sm pl-4"
            >
              Employee ID:
            </label>
            <div className="w-full bg-black rounded-full flex items-center px-5 py-4 gap-3 shadow-md shadow-black/15 focus-within:ring-2 focus-within:ring-white/20 transition">
              <IdCardIcon />
              <input
                id="activate-employee-id"
                type="text"
                required
                placeholder="24-XXXX-XX"
                pattern="24-\d{4}-\d{2}"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/50 tracking-wide"
              />
            </div>
          </div>

          {/* ── Company Email ── */}
          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="activate-email"
              className="text-slate-600 text-sm pl-4"
            >
              Company email:
            </label>
            <div className="w-full bg-black rounded-full flex items-center px-5 py-4 gap-3 shadow-md shadow-black/15 focus-within:ring-2 focus-within:ring-white/20 transition">
              <MailIcon />
              <input
                id="activate-email"
                type="email"
                required
                placeholder="@johndoe"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/50"
              />
            </div>
          </div>

          {/* ── Password ── */}
          <div className="w-full flex flex-col gap-1.5">
            <label
              htmlFor="activate-password"
              className="text-slate-600 text-sm pl-4"
            >
              Password:
            </label>
            <div className="w-full bg-black rounded-full flex items-center px-5 py-4 gap-3 shadow-md shadow-black/15 focus-within:ring-2 focus-within:ring-white/20 transition">
              <LockIcon />
              <input
                id="activate-password"
                type={showPwd ? "text" : "password"}
                required
                placeholder="Abc123@"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/50"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="text-white/50 hover:text-white/80 transition-colors focus:outline-none"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* ── Back to login ── */}
          <div className="w-full px-1 text-right text-sm">
            <Link
              href="/login"
              className="text-slate-600 hover:text-slate-900 transition-colors underline underline-offset-2"
            >
              Already activated? Sign in
            </Link>
          </div>

          {/* ── Submit (reads "Activate" per Final Plan v2) ── */}
          <button
            id="activate-submit"
            type="submit"
            className="bg-black text-white text-xl font-bold py-3 px-14 rounded-full flex items-center gap-3 shadow-lg shadow-black/25 hover:bg-neutral-900 active:scale-95 transition-all"
          >
            Activate
            <ArrowCircleIcon />
          </button>
        </form>
      </div>
    </AuthBackground>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function IdCardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="8.5" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 17c0-1.657 1.343-3 3-3s3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="9" x2="19" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
