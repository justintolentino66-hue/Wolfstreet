"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/* ── Types ──────────────────────────────────────────────────────────────── */
type NavTab =
  | "dashboard"
  | "tasks"
  | "announcements"
  | "attendance"
  | "calendar"
  | "leave"
  | "profile";

interface EmsUser {
  name: string;
  employee_id: string;
  role: "Employee" | "Manager";
  email?: string;
}

/* ── Mock data (matches EMS_Final_Plan_v2 2026 dates) ───────────────────── */
const MOCK_TASKS = [
  {
    id: 1,
    title: "Implement DTR Clock In/Out verification",
    dept: "Engineering",
    deadline: "July 24, 2026",
    status: "In Progress",
  },
  {
    id: 2,
    title: "Update system security policy documentation",
    dept: "Compliance",
    deadline: "July 27, 2026",
    status: "To Do",
  },
  {
    id: 3,
    title: "Prepare monthly leave quota report",
    dept: "Operations",
    deadline: "July 30, 2026",
    status: "Completed",
  },
  {
    id: 4,
    title: "Review new employee onboarding materials",
    dept: "HR",
    deadline: "July 22, 2026",
    status: "Submitted",
  },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Mid-Year Performance Review Schedule",
    date: "July 18, 2026",
    summary:
      "All employees must finalize their self-appraisals by end of month.",
  },
  {
    id: 2,
    title: "System Scheduled Maintenance",
    date: "July 20, 2026",
    summary:
      "The EMS portal will be offline on Sunday from 02:00 AM to 05:00 AM.",
  },
];

const ATTENDANCE_SUMMARY = { onTime: 18, late: 2, absent: 2 };

/* ── Page ───────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<EmsUser>({
    name: "Mark Spencer",
    employee_id: "24-1042-01",
    role: "Employee",
  });
  const [now, setNow] = useState(new Date());

  /* Hydrate user from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ems_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) setCurrentUser(parsed);
      }
    } catch {
      /* silently ignore */
    }
  }, []);

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function handleClockIn() {
    setClockedIn(true);
    const t = new Date();
    setClockInTime(
      t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  }
  function handleClockOut() {
    setClockedIn(false);
    setClockInTime(null);
  }

  const firstName = currentUser.name ? currentUser.name.split(" ")[0] : "User";
  const totalTasks = MOCK_TASKS.length;
  const pendingTasks = MOCK_TASKS.filter(
    (t) => t.status === "To Do" || t.status === "In Progress"
  ).length;
  const completedTasks = MOCK_TASKS.filter(
    (t) => t.status === "Completed"
  ).length;

  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const isManager = currentUser.role === "Manager";

  return (
    /*
     * Outer wrapper — user's exact CSS spec:
     * display:flex; flex-direction:column; align-items:flex-start;
     * padding:68px 277px 95px 276px; gap:10px;
     * position:relative; width:1440px; height:1024px;
     * background:url(rrt2.jpg);
     */
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "68px 277px 95px 276px",
        gap: "10px",
        position: "relative",
        width: "1440px",
        height: "1024px",
        backgroundImage: "url(/rrt2.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minWidth: "100vw",
        minHeight: "100vh",
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg,rgba(10,12,24,0.72) 0%,rgba(14,18,40,0.62) 100%)",
          backdropFilter: "blur(1px)",
          zIndex: 0,
        }}
      />

      {/* Inner shell: sidebar + main */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "100%",
          height: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55)",
        }}
      >
        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside
          style={{
            width: "240px",
            background: "rgba(8,10,22,0.88)",
            backdropFilter: "blur(18px)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            {/* Brand */}
            <div
              style={{
                padding: "22px 20px 18px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  color: "#fff",
                  fontSize: "17px",
                  boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                  flexShrink: 0,
                }}
              >
                W
              </div>
              <div>
                <p
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "1.2",
                  }}
                >
                  EMS Portal
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>
                  {currentUser.role} Workspace
                </p>
              </div>
            </div>

            {/* Avatar strip */}
            <div
              style={{
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                gap: "11px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.025)",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(99,102,241,0.5)",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/avatar.jpg"
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentUser.name}
                </p>
                <p
                  style={{
                    color: "#818cf8",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentUser.employee_id}
                </p>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ padding: "12px 10px" }}>
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
              {!isManager && (
                <SidebarItem
                  icon={<GridCalIcon />}
                  label="Calendar"
                  active={activeTab === "calendar"}
                  onClick={() => setActiveTab("calendar")}
                />
              )}
              {isManager && (
                <SidebarItem
                  icon={<UsersIcon />}
                  label="Employees"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
              )}
              <SidebarItem
                icon={<FileTextIcon />}
                label={isManager ? "Leave Requests" : "Leave Request"}
                active={activeTab === "leave"}
                onClick={() => setActiveTab("leave")}
              />
              <SidebarItem
                icon={<UserIcon />}
                label="Profile"
                active={activeTab === "profile" && !isManager}
                onClick={() => setActiveTab("profile")}
              />
            </nav>
          </div>

          {/* Sign out */}
          <div
            style={{
              padding: "12px 10px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Link
              href="/login"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 14px",
                borderRadius: "10px",
                color: "rgba(252,165,165,0.75)",
                fontSize: "13px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <LogoutIcon />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>

        {/* ── Main ────────────────────────────────────────────────────── */}
        <main
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <header
            style={{
              padding: "0 28px",
              height: "68px",
              background: "rgba(255,255,255,0.055)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h1
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                Welcome back, {firstName}!
              </h1>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
                {dateStr}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    color: "#c7d2fe",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "monospace",
                  }}
                >
                  {timeStr}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
                  {clockedIn ? (
                    <span style={{ color: "#4ade80" }}>● On-duty</span>
                  ) : (
                    <span>○ Not clocked in</span>
                  )}
                </p>
              </div>

              {!clockedIn ? (
                <button
                  onClick={handleClockIn}
                  style={{
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "9px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
                  }}
                >
                  Clock In
                </button>
              ) : (
                <button
                  onClick={handleClockOut}
                  style={{
                    background: "linear-gradient(135deg,#f59e0b,#d97706)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "9px 18px",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
                  }}
                >
                  Clock Out
                </button>
              )}

              <button
                aria-label="Notifications"
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <BellIcon />
                <span
                  style={{
                    position: "absolute",
                    top: "7px",
                    right: "7px",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#f87171",
                    border: "1.5px solid rgba(14,18,40,0.9)",
                  }}
                />
              </button>
            </div>
          </header>

          {/* Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "22px 26px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            {/* 4 KPI Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "14px",
              }}
            >
              <StatCard
                title="Total Tasks"
                value={String(totalTasks)}
                sub="Assigned this month"
                accentColor="#6366f1"
                icon={<TasksIcon />}
                onClick={() => setActiveTab("tasks")}
              />
              <StatCard
                title="Pending"
                value={String(pendingTasks)}
                sub="To Do & In Progress"
                accentColor="#f59e0b"
                icon={<ClockIcon />}
                onClick={() => setActiveTab("tasks")}
              />
              <StatCard
                title="Completed"
                value={String(completedTasks)}
                sub="Tasks finished"
                accentColor="#22c55e"
                icon={<CheckCircleIcon />}
                onClick={() => setActiveTab("tasks")}
              />
              <StatCard
                title="Attendance"
                value={`${Math.round(
                  (ATTENDANCE_SUMMARY.onTime /
                    (ATTENDANCE_SUMMARY.onTime +
                      ATTENDANCE_SUMMARY.late +
                      ATTENDANCE_SUMMARY.absent)) *
                    100
                )}%`}
                sub="On-time rate this month"
                accentColor="#38bdf8"
                icon={<CalendarIcon />}
                onClick={() => setActiveTab("attendance")}
              />
            </div>

            {/* 3-col: Tasks | Attendance | Announcements */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 0.7fr 0.7fr",
                gap: "14px",
              }}
            >
              {/* Current Tasks */}
              <GlassCard>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
                    Current Tasks
                  </h3>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#818cf8",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    View All →
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {MOCK_TASKS.map((task) => (
                    <TaskRow key={task.id} task={task} />
                  ))}
                </div>
              </GlassCard>

              {/* Attendance Summary */}
              <GlassCard>
                <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>
                  Attendance Summary
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: "14px" }}>
                  July 2026 · Work days only
                </p>

                {clockedIn && clockInTime && (
                  <div
                    style={{
                      background: "rgba(34,197,94,0.12)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      borderRadius: "8px",
                      padding: "8px 12px",
                      marginBottom: "12px",
                      fontSize: "12px",
                      color: "#4ade80",
                    }}
                  >
                    ● Clocked in at {clockInTime}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <AttendanceStat label="On Time" value={ATTENDANCE_SUMMARY.onTime} total={22} color="#22c55e" />
                  <AttendanceStat label="Late" value={ATTENDANCE_SUMMARY.late} total={22} color="#f59e0b" />
                  <AttendanceStat label="Absent" value={ATTENDANCE_SUMMARY.absent} total={22} color="#f87171" />
                </div>
              </GlassCard>

              {/* Announcements */}
              <GlassCard>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <h3 style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>
                    Announcements
                  </h3>
                  <span
                    style={{
                      background: "rgba(99,102,241,0.2)",
                      color: "#a5b4fc",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "20px",
                    }}
                  >
                    2 New
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {MOCK_ANNOUNCEMENTS.map((a) => (
                    <AnnouncementItem key={a.id} item={a} />
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("announcements")}
                  style={{
                    marginTop: "14px",
                    width: "100%",
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    color: "#a5b4fc",
                    borderRadius: "8px",
                    padding: "8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  View All →
                </button>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function GlassCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "14px",
        padding: "18px",
      }}
    >
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  sub,
  accentColor,
  icon,
  onClick,
}: {
  title: string;
  value: string;
  sub: string;
  accentColor: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "14px",
        padding: "18px",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 600 }}>
          {title}
        </p>
        <div
          style={{
            padding: "7px",
            borderRadius: "8px",
            background: `${accentColor}22`,
            color: accentColor,
          }}
        >
          {icon}
        </div>
      </div>
      <div>
        <p style={{ color: "#fff", fontSize: "28px", fontWeight: 800, lineHeight: 1 }}>
          {value}
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginTop: "4px" }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  "To Do": { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
  "In Progress": { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  "Submitted": { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  "Completed": { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  "Overdue": { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
};

function TaskRow({ task }: { task: (typeof MOCK_TASKS)[0] }) {
  const s = STATUS_STYLE[task.status] ?? STATUS_STYLE["To Do"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            color: "#e2e8f0",
            fontSize: "12.5px",
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {task.title}
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px" }}>
          {task.dept} · Due {task.deadline}
        </p>
      </div>
      <span
        style={{
          background: s.bg,
          color: s.color,
          fontSize: "10.5px",
          fontWeight: 700,
          padding: "3px 9px",
          borderRadius: "20px",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {task.status}
      </span>
    </div>
  );
}

function AttendanceStat({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{label}</span>
        <span style={{ color, fontSize: "12px", fontWeight: 700 }}>{value} days</span>
      </div>
      <div
        style={{
          height: "5px",
          borderRadius: "3px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: "3px",
          }}
        />
      </div>
    </div>
  );
}

function AnnouncementItem({ item }: { item: (typeof MOCK_ANNOUNCEMENTS)[0] }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        borderRadius: "10px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "10.5px" }}>HR Department</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10.5px" }}>{item.date}</span>
      </div>
      <p
        style={{
          color: "#e2e8f0",
          fontSize: "12.5px",
          fontWeight: 600,
          lineHeight: 1.3,
          marginBottom: "3px",
        }}
      >
        {item.title}
      </p>
      <p
        style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "11px",
          lineHeight: 1.4,
        }}
      >
        {item.summary}
      </p>
    </div>
  );
}

/* ── Sidebar item ───────────────────────────────────────────────────────── */
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
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px 14px",
        borderRadius: "10px",
        border: "none",
        background: active ? "rgba(99,102,241,0.25)" : "transparent",
        color: active ? "#c7d2fe" : "rgba(255,255,255,0.45)",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        cursor: "pointer",
        textAlign: "left",
        marginBottom: "2px",
        boxShadow: active ? "inset 0 0 0 1px rgba(99,102,241,0.3)" : "none",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {icon}
        {label}
      </span>
      {badge && (
        <span
          style={{
            background: active ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
            color: active ? "#c7d2fe" : "rgba(255,255,255,0.4)",
            fontSize: "10px",
            fontWeight: 700,
            padding: "1px 7px",
            borderRadius: "20px",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */
function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function TasksIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function GridCalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function FileTextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
