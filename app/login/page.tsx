"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthBackground } from "../components/AuthBackground";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <AuthBackground>
      <div className="flex items-center justify-center min-h-screen">
        {/* Shift form left of centre so it sits in the grey zone */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-5 w-full px-8"
          style={{ maxWidth: 380, marginRight: "20%" }}
        >
          {/* ── Title ── */}
          <div className="w-full bg-black rounded-full py-3 px-6 text-center shadow-lg shadow-black/20">
            <span className="text-white text-3xl font-bold tracking-wide">
              Login
            </span>
          </div>

          {/* ── Email ── */}
          <label className="w-full">
            <span className="sr-only">Email</span>
            <div className="w-full bg-black rounded-full flex items-center px-5 py-4 gap-3 shadow-md shadow-black/15 focus-within:ring-2 focus-within:ring-white/20 transition">
              <MailIcon />
              <input
                id="login-email"
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/55"
              />
            </div>
          </label>

          {/* ── Password ── */}
          <label className="w-full">
            <span className="sr-only">Password</span>
            <div className="w-full bg-black rounded-full flex items-center px-5 py-4 gap-3 shadow-md shadow-black/15 focus-within:ring-2 focus-within:ring-white/20 transition">
              <LockIcon />
              <input
                id="login-password"
                type={showPwd ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white text-base outline-none flex-1 placeholder:text-white/55"
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
          </label>

          {/* ── Links row ── */}
          <div className="w-full flex items-center justify-between px-1 text-sm">
            <Link
              href="/activate"
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              First time?{" "}
              <span className="font-semibold underline underline-offset-2">
                Activate account
              </span>
            </Link>
            <Link
              href="/forgot-password"
              id="forgot-password-link"
              className="text-slate-600 hover:text-slate-900 underline underline-offset-2 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* ── Submit ── */}
          <button
            id="login-submit"
            type="submit"
            className="bg-black text-white text-xl font-bold py-3 px-14 rounded-full flex items-center gap-3 shadow-lg shadow-black/25 hover:bg-neutral-900 active:scale-95 transition-all"
          >
            Login
            <ArrowCircleIcon />
          </button>
        </form>
      </div>
    </AuthBackground>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-white">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ArrowCircleIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
      <path d="M8 12h8M13 8l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
