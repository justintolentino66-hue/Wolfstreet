"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-[#f1f3f9] text-slate-800 font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="w-64 bg-[#111319] text-white flex flex-col justify-between shrink-0 shadow-xl z-20">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-indigo-500/30">
              W
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide leading-tight">EMS Portal</h2>
              <p className="text-xs text-white/50">Employee Workspace</p>
            </div>
          </div>

          {/* User brief */}
          <div className="p-5 flex items-center gap-3 bg-white/[0.03] border-b border-white/5">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-indigo-500/40 shrink-0">
              <Image
                src="/avatar.jpg"
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Mark Spencer</p>
              <p className="text-xs text-indigo-400 font-mono truncate">24-1042-01</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            <SidebarItem
              icon={<HomeIcon />}
              label="Dashboard"
              active={activeTab === "dashboard"}
              onClick={() => setActiveTab("dashboard")}
            />
            <SidebarItem
              icon={<TasksIcon />}
              label="Tasks"
              badge="4"
              active={activeTab === "tasks"}
              onClick={() => setActiveTab("tasks")}
            />
            <SidebarItem
              icon={<BellIcon />}
              label="Announcements"
              badge="2"
              active={activeTab === "announcements"}
              onClick={() => setActiveTab("announcements")}
            />
            <SidebarItem
              icon={<CalendarIcon />}
              label="Attendance (DTR)"
              active={activeTab === "attendance"}
              onClick={() => setActiveTab("attendance")}
            />
            <SidebarItem
              icon={<FileTextIcon />}
              label="Leave Request"
              active={activeTab === "leave"}
              onClick={() => setActiveTab("leave")}
            />
            <SidebarItem
              icon={<UserIcon />}
              label="Profile"
              active={activeTab === "profile"}
              onClick={() => setActiveTab("profile")}
            />
          </nav>
        </div>

        {/* Logout bottom */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-sm text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition font-medium"
          >
            <LogoutIcon />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-18 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Welcome back, Mark!
            </h1>
            <p className="text-xs text-slate-500">
              Here is your daily activity and schedule for today.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-slate-700 block">July 2026</span>
              <span className="text-[11px] text-emerald-600 font-medium">● Status: On-duty</span>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition active:scale-95">
              Clock Out
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Assigned Tasks"
              value="12"
              subtitle="4 pending review"
              accent="indigo"
              icon={<TasksIcon />}
            />
            <StatCard
              title="Pending Progress"
              value="3"
              subtitle="2 due this week"
              accent="amber"
              icon={<ClockIcon />}
            />
            <StatCard
              title="Completed Tasks"
              value="9"
              subtitle="+2 completed yesterday"
              accent="emerald"
              icon={<CheckCircleIcon />}
            />
            <StatCard
              title="Monthly Attendance"
              value="94%"
              subtitle="26 present · 2 late"
              accent="sky"
              icon={<CalendarIcon />}
            />
          </div>

          {/* Two-column layout: Tasks & Announcements */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Active Tasks */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Current Tasks</h3>
                  <span className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                    View All Tasks →
                  </span>
                </div>
                <div className="space-y-3">
                  <TaskRow
                    title="Implement DTR Clock In/Out verification"
                    dept="Engineering"
                    deadline="July 24, 2026"
                    status="In Progress"
                    statusColor="bg-amber-100 text-amber-800"
                  />
                  <TaskRow
                    title="Update system security policy documentation"
                    dept="Compliance"
                    deadline="July 27, 2026"
                    status="To Do"
                    statusColor="bg-slate-100 text-slate-700"
                  />
                  <TaskRow
                    title="Prepare monthly leave quota report"
                    dept="Operations"
                    deadline="July 30, 2026"
                    status="Completed"
                    statusColor="bg-emerald-100 text-emerald-800"
                  />
                </div>
              </div>
            </div>

            {/* Right 1 Col: Announcements */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">Announcements</h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
                    New
                  </span>
                </div>
                <div className="space-y-4">
                  <AnnouncementItem
                    title="Mid-Year Performance Review Schedule"
                    date="July 18, 2026"
                    summary="All employees must finalize their self-appraisals by end of month."
                  />
                  <AnnouncementItem
                    title="System Scheduled Maintenance"
                    date="July 20, 2026"
                    summary="The EMS portal will be offline on Sunday from 02:00 AM to 05:00 AM."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── UI Components ──────────────────────────────────────────────────────── */

function SidebarItem({
  icon,
  label,
  badge,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
          : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="shrink-0">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-bold ${
            active ? "bg-white text-indigo-700" : "bg-white/10 text-slate-300"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-slate-100 text-slate-700">{icon}</div>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function TaskRow({
  title,
  dept,
  deadline,
  status,
  statusColor,
}: {
  title: string;
  dept: string;
  deadline: string;
  status: string;
  statusColor: string;
}) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-xs text-slate-500">
          {dept} · Due {deadline}
        </p>
      </div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${statusColor}`}>
        {status}
      </span>
    </div>
  );
}

function AnnouncementItem({
  title,
  date,
  summary,
}: {
  title: string;
  date: string;
  summary: string;
}) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span>HR Department</span>
        <span>{date}</span>
      </div>
      <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{summary}</p>
    </div>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
