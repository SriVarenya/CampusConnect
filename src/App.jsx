
import React, { useEffect, useMemo, useState } from "react";
import {
  GraduationCap, LayoutDashboard, Users, Megaphone, ClipboardList,
  LogOut, Plus, Search, CalendarDays, CheckCircle2, Trash2, Menu, X,
  ShieldCheck, UserRound, ArrowUpRight, LockKeyhole, BookOpen
} from "lucide-react";

const KEYS = {
  users: "cc_users",
  session: "cc_session",
  announcements: "cc_announcements",
  assignments: "cc_assignments"
};

const initialUsers = [
  { id: "admin-1", name: "Campus Administrator", email: "admin@campus.com", password: "admin123", role: "admin" },
  { id: "student-1", name: "Aarav Sharma", email: "aarav@campus.com", password: "student123", role: "student" },
  { id: "student-2", name: "Diya Reddy", email: "diya@campus.com", password: "student123", role: "student" },
  { id: "student-3", name: "Ishaan Kumar", email: "ishaan@campus.com", password: "student123", role: "student" }
];

const initialAnnouncements = [
  {
    id: 1,
    title: "Welcome to CampusConnect",
    body: "The college portal is now live. Check this space for important updates.",
    date: "2026-11-01",
    author: "Campus Admin"
  },
  {
    id: 2,
    title: "Project Review 2",
    body: "Keep your project repository and deployed application ready for verification.",
    date: "2026-11-05",
    author: "Campus Admin"
  }
];

const initialAssignments = [
  {
    id: 1,
    title: "React Fundamentals",
    subject: "Web Development",
    due: "2026-11-12",
    description: "Build a small React application using reusable components."
  },
  {
    id: 2,
    title: "Database Concepts",
    subject: "DBMS",
    due: "2026-11-16",
    description: "Prepare notes on normalization and relational database design."
  }
];

function readData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [users, setUsers] = useState(() => readData(KEYS.users, initialUsers));
  const [announcements, setAnnouncements] = useState(() => readData(KEYS.announcements, initialAnnouncements));
  const [assignments, setAssignments] = useState(() => readData(KEYS.assignments, initialAssignments));
  const [session, setSession] = useState(() => readData(KEYS.session, null));

  const [page, setPage] = useState("dashboard");
  const [authMode, setAuthMode] = useState("login");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(KEYS.announcements, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(KEYS.assignments, JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(KEYS.session, JSON.stringify(session));
    } else {
      localStorage.removeItem(KEYS.session);
    }
  }, [session]);

  function flash(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function login(email, password) {
    const found = users.find(
      user =>
        user.email.toLowerCase() === email.trim().toLowerCase() &&
        user.password === password
    );

    if (!found) {
      return { ok: false, message: "Incorrect email or password." };
    }

    setSession({
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role
    });

    setPage("dashboard");
    return { ok: true };
  }

  function signup(name, email, password) {
    if (
      users.some(
        user => user.email.toLowerCase() === email.trim().toLowerCase()
      )
    ) {
      return { ok: false, message: "This email is already registered." };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
      password,
      role: "student"
    };

    setUsers(current => [...current, newUser]);

    setSession({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });

    setPage("dashboard");
    return { ok: true };
  }

  function logout() {
    setSession(null);
    setPage("dashboard");
    setAuthMode("login");
    flash("You have been logged out.");
  }

  if (!session) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        onLogin={login}
        onSignup={signup}
      />
    );
  }

  const isAdmin = session.role === "admin";

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ...(isAdmin
      ? [{ id: "students", label: "Students", icon: Users }]
      : []),
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "assignments", label: "Assignments", icon: ClipboardList }
  ];

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={23} />
          </div>
          <div>
            <strong>CampusConnect</strong>
            <span>COLLEGE PORTAL</span>
          </div>
          <button
            className="icon-btn close-menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav>
          {navItems.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                className={`nav-link ${page === item.id ? "active" : ""}`}
                onClick={() => {
                  setPage(item.id);
                  setMobileOpen(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>

                {item.id === "announcements" && (
                  <span className="nav-count">{announcements.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">
              <ShieldCheck size={17} />
            </div>
            <strong>
              {isAdmin ? "Administrator access" : "Student workspace"}
            </strong>
            <p>
              {isAdmin
                ? "Manage your campus community."
                : "Your campus updates, all in one place."}
            </p>
          </div>

          <button className="profile-row" onClick={logout}>
            <div className="avatar">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <strong>{session.name}</strong>
              <span>{isAdmin ? "Administrator" : "Student"}</span>
            </div>
            <LogOut size={17} className="logout-icon" />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-btn menu-toggle"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span>
            <strong>
              {navItems.find(item => item.id === page)?.label || "Dashboard"}
            </strong>
          </div>

          <div className="topbar-right">
            <span className="today-label">
              <CalendarDays size={15} />
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>

            <div className="top-avatar">
              {session.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="page-content">
          {page === "dashboard" && (
            <Dashboard
              session={session}
              users={users}
              announcements={announcements}
              assignments={assignments}
              go={setPage}
            />
          )}

          {page === "students" && isAdmin && (
            <Students users={users} setUsers={setUsers} />
          )}

          {page === "announcements" && (
            <Announcements
              session={session}
              items={announcements}
              setItems={setAnnouncements}
              flash={flash}
            />
          )}

          {page === "assignments" && (
            <Assignments
              session={session}
              items={assignments}
              setItems={setAssignments}
              flash={flash}
            />
          )}
        </div>
      </main>

      {notice && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}
    </div>
  );
}

/* LOGIN AND SIGNUP MODULE */

function AuthScreen({ mode, setMode, onLogin, onSignup }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && form.name.trim().length < 2) {
      return setError("Please enter your full name.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return setError("Enter a valid email address.");
    }

    if (form.password.length < 6) {
      return setError("Password must contain at least 6 characters.");
    }

    const result =
      mode === "login"
        ? onLogin(form.email, form.password)
        : onSignup(form.name, form.email, form.password);

    if (!result.ok) {
      setError(result.message);
    }
  }

  return (
    <div className="auth-layout">
      <section className="auth-visual">
        <div className="auth-brand">
          <div className="brand-icon">
            <GraduationCap size={23} />
          </div>
          <strong>CampusConnect</strong>
        </div>

        <div className="visual-content">
          <div className="eyebrow">
            <span /> YOUR CAMPUS. CONNECTED.
          </div>

          <h1>
            One campus.
            <br />
            <em>Every connection.</em>
          </h1>

          <p>
            A simpler way to stay connected with your college community,
            announcements, and academic work.
          </p>

          <div className="visual-stats">
            <div>
              <strong>01</strong>
              <span>Stay informed</span>
            </div>
            <div>
              <strong>02</strong>
              <span>Stay organised</span>
            </div>
            <div>
              <strong>03</strong>
              <span>Stay connected</span>
            </div>
          </div>
        </div>

        <div className="visual-footer">
          CAMPUSCONNECT · STUDENT MANAGEMENT PORTAL
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-form-wrap">
          <div className="mobile-auth-brand">
            <GraduationCap size={23} /> CampusConnect
          </div>

          <div className="form-kicker">
            {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
          </div>

          <h2>
            {mode === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>

          <p className="form-subtitle">
            {mode === "login"
              ? "Enter your details to access your campus workspace."
              : "Join your college community in just a few steps."}
          </p>

          <form onSubmit={submit} className="auth-form">
            {mode === "signup" && (
              <label>
                Full name
                <div className="input-wrap">
                  <UserRound size={17} />
                  <input
                    name="name"
                    value={form.name}
                    onChange={update}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </label>
            )}

            <label>
              Email address
              <div className="input-wrap">
                <UserRound size={17} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={update}
                  placeholder="you@college.edu"
                  required
                />
              </div>
            </label>

            <label>
              Password
              <div className="input-wrap">
                <LockKeyhole size={17} />
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={update}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
            </label>

            {error && <div className="form-error">{error}</div>}

            <button className="primary-btn auth-submit">
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowUpRight size={17} />
            </button>
          </form>

          <div className="auth-switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "signup" : "login");
              }}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

          {mode === "login" && (
            <div className="demo-box">
              <div className="demo-heading">
                <ShieldCheck size={16} />
                DEMO ACCOUNTS FOR REVIEW
              </div>

              <div>
                <span>Admin</span>
                <code>admin@campus.com</code>
                <code>admin123</code>
              </div>

              <div>
                <span>Student</span>
                <code>aarav@campus.com</code>
                <code>student123</code>
              </div>
            </div>
          )}

          <p className="auth-note">
            Demo project · Data is stored in your browser's Local Storage.
          </p>
        </div>
      </section>
    </div>
  );
}

/* COMMON PAGE HEADING */

function PageHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-heading">
      <div>
        <div className="section-kicker">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

/* DASHBOARD MODULE */

function Dashboard({ session, users, announcements, assignments, go }) {
  const isAdmin = session.role === "admin";
  const students = users.filter(user => user.role === "student");

  return (
    <div className="fade-in">
      <PageHeading
        eyebrow="OVERVIEW"
        title={`Welcome, ${session.name.split(" ")[0]}!`}
        subtitle={
          isAdmin
            ? "Here's what's happening across your campus today."
            : "Here's your campus activity at a glance."
        }
        action={
          <div className="role-pill">
            <span />
            {isAdmin ? "ADMINISTRATOR" : "STUDENT"} MODULE
          </div>
        }
      />

      <div className="welcome-banner">
        <div>
          <div className="banner-tag">CAMPUSCONNECT PORTAL</div>
          <h2>
            {isAdmin
              ? "Your campus, at your fingertips."
              : "Your learning journey starts here."}
          </h2>
          <p>
            {isAdmin
              ? "Keep your campus community informed and organised."
              : "Stay on top of updates, assignments, and campus activities."}
          </p>
          <button
            className="banner-btn"
            onClick={() => go("announcements")}
          >
            Explore announcements <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="banner-art">
          <div className="art-circle">
            <GraduationCap size={76} />
          </div>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
        </div>
      </div>

      <div className="stats-grid">
        {isAdmin ? (
          <>
            <StatCard icon={Users} label="Total students" value={students.length} detail="Registered student accounts" tone="violet" />
            <StatCard icon={Megaphone} label="Announcements" value={announcements.length} detail="Campus-wide updates" tone="blue" />
            <StatCard icon={ClipboardList} label="Assignments" value={assignments.length} detail="Published assignments" tone="orange" />
            <StatCard icon={ShieldCheck} label="Portal status" value="Active" detail="All systems operational" tone="green" />
          </>
        ) : (
          <>
            <StatCard icon={Megaphone} label="Announcements" value={announcements.length} detail="College updates" tone="violet" />
            <StatCard icon={ClipboardList} label="Assignments" value={assignments.length} detail="Available assignments" tone="blue" />
            <StatCard icon={BookOpen} label="Your module" value="Student" detail="Personal learning space" tone="orange" />
          </>
        )}
      </div>

      <div className="dashboard-columns">
        <section className="content-card">
          <div className="card-heading">
            <div>
              <h3>Latest announcements</h3>
              <p>Recent news from your campus</p>
            </div>
            <button className="text-link" onClick={() => go("announcements")}>
              View all <ArrowUpRight size={15} />
            </button>
          </div>

          {announcements.slice(0, 3).map(item => (
            <div className="feed-item" key={item.id}>
              <div className="feed-icon">
                <Megaphone size={17} />
              </div>
              <div className="feed-copy">
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <span>{item.date} · {item.author}</span>
              </div>
            </div>
          ))}

          {announcements.length === 0 && <Empty text="No announcements yet." />}
        </section>

        <section className="content-card">
          <div className="card-heading">
            <div>
              <h3>Upcoming assignments</h3>
              <p>Keep track of your academic work</p>
            </div>
            <button className="text-link" onClick={() => go("assignments")}>
              View all <ArrowUpRight size={15} />
            </button>
          </div>

          {assignments.slice(0, 3).map(item => (
            <div className="assignment-mini" key={item.id}>
              <div className="assignment-dot">
                <ClipboardList size={16} />
              </div>
              <div>
                <strong>{item.title}</strong>
                <p>{item.subject}</p>
              </div>
              <span className="due-date">Due {item.due}</span>
            </div>
          ))}

          {assignments.length === 0 && <Empty text="No assignments yet." />}
        </section>
      </div>

      <div className="dashboard-footnote">
        <ShieldCheck size={16} />
        Signed in as <strong>{session.email}</strong>
        · Your data is saved locally.
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </div>
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </div>
  );
}

/* ADMIN STUDENT MANAGEMENT MODULE */

function Students({ users, setUsers }) {
  const [search, setSearch] = useState("");

  const students = useMemo(
    () =>
      users.filter(
        user =>
          user.role === "student" &&
          `${user.name} ${user.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [users, search]
  );

  return (
    <div className="fade-in">
      <PageHeading
        eyebrow="ADMIN MODULE"
        title="Student directory"
        subtitle="View and manage registered student accounts."
        action={
          <div className="role-pill">
            <Users size={14} />
            {users.filter(user => user.role === "student").length} STUDENTS
          </div>
        }
      />

      <div className="content-card table-card">
        <div className="table-toolbar">
          <div>
            <h3>All students</h3>
            <p>Registered student accounts</p>
          </div>

          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search students..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>STUDENT</th>
                <th>EMAIL ADDRESS</th>
                <th>ROLE</th>
                <th>ACCOUNT</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>
                    <div className="student-cell">
                      <div className="avatar small">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <strong>{student.name}</strong>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td><span className="table-role">Student</span></td>
                  <td>
                    <span className="status-active">
                      <span /> Active
                    </span>
                  </td>
                  <td>
                    <button
                      className="danger-icon"
                      title="Delete student"
                      onClick={() => {
                        if (window.confirm(`Delete ${student.name}?`)) {
                          setUsers(old =>
                            old.filter(user => user.id !== student.id)
                          );
                        }
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <Empty text="No students match your search." />
        )}
      </div>

      <p className="privacy-note">
        <ShieldCheck size={15} />
        Student accounts are stored in Local Storage for this demonstration.
      </p>
    </div>
  );
}

/* ANNOUNCEMENT MODULE */

function Announcements({ session, items, setItems, flash }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const isAdmin = session.role === "admin";

  function add(e) {
    e.preventDefault();

    if (!form.title.trim() || !form.body.trim()) return;

    setItems(old => [
      {
        id: Date.now(),
        title: form.title.trim(),
        body: form.body.trim(),
        date: new Date().toISOString().slice(0, 10),
        author: session.name
      },
      ...old
    ]);

    setForm({ title: "", body: "" });
    setShowForm(false);
    flash("Announcement published successfully.");
  }

  return (
    <div className="fade-in">
      <PageHeading
        eyebrow={isAdmin ? "ADMIN MODULE" : "STUDENT MODULE"}
        title="Announcements"
        subtitle="Important updates and news from your college."
        action={
          isAdmin && (
            <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
              <Plus size={17} /> New announcement
            </button>
          )
        }
      />

      {showForm && isAdmin && (
        <form className="content-card editor-card" onSubmit={add}>
          <div className="card-heading">
            <div>
              <h3>Publish an announcement</h3>
              <p>Share an update with all students.</p>
            </div>
            <button type="button" className="icon-btn" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <label>
            Title
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Announcement title"
              required
            />
          </label>

          <label>
            Message
            <textarea
              rows="3"
              value={form.body}
              onChange={e => setForm({ ...form, body: e.target.value })}
              placeholder="Write your announcement..."
              required
            />
          </label>

          <button className="primary-btn" type="submit">
            <Megaphone size={16} /> Publish announcement
          </button>
        </form>
      )}

      <div className="announcement-list">
        {items.map(item => (
          <article className="content-card announcement-card" key={item.id}>
            <div className="announcement-top">
              <div className="announcement-symbol">
                <Megaphone size={19} />
              </div>

              <div className="announcement-meta">
                <span>COLLEGE UPDATE</span>
                <time>{item.date}</time>
              </div>

              {isAdmin && (
                <button
                  className="danger-icon"
                  title="Delete announcement"
                  onClick={() => {
                    setItems(old => old.filter(x => x.id !== item.id));
                    flash("Announcement deleted.");
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <h3>{item.title}</h3>
            <p>{item.body}</p>

            <div className="posted-by">
              <div className="avatar tiny">
                {item.author.charAt(0).toUpperCase()}
              </div>
              Published by <strong>{item.author}</strong>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <Empty text="No announcements have been published yet." />
        )}
      </div>
    </div>
  );
}

/* ASSIGNMENT MODULE */

function Assignments({ session, items, setItems, flash }) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    due: "",
    description: ""
  });

  const isAdmin = session.role === "admin";

  function add(e) {
    e.preventDefault();

    setItems(old => [
      { id: Date.now(), ...form },
      ...old
    ]);

    setForm({
      title: "",
      subject: "",
      due: "",
      description: ""
    });

    setShowForm(false);
    flash("Assignment added successfully.");
  }

  return (
    <div className="fade-in">
      <PageHeading
        eyebrow={isAdmin ? "ADMIN MODULE" : "STUDENT MODULE"}
        title="Assignments"
        subtitle={
          isAdmin
            ? "Create and manage academic assignments."
            : "Your published academic tasks and deadlines."
        }
        action={
          isAdmin && (
            <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
              <Plus size={17} /> Add assignment
            </button>
          )
        }
      />

      {showForm && isAdmin && (
        <form className="content-card editor-card" onSubmit={add}>
          <div className="card-heading">
            <div>
              <h3>Create assignment</h3>
              <p>Publish a new task for students.</p>
            </div>

            <button type="button" className="icon-btn" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="form-grid">
            <label>
              Assignment title
              <input
                required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. React project"
              />
            </label>

            <label>
              Subject
              <input
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. Web Development"
              />
            </label>

            <label>
              Due date
              <input
                required
                type="date"
                value={form.due}
                onChange={e => setForm({ ...form, due: e.target.value })}
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows="3"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Assignment instructions..."
            />
          </label>

          <button className="primary-btn" type="submit">
            <Plus size={16} /> Create assignment
          </button>
        </form>
      )}

      <div className="assignment-grid">
        {items.map(item => (
          <article className="content-card assignment-card" key={item.id}>
            <div className="assignment-card-top">
              <div className="assignment-large-icon">
                <ClipboardList size={20} />
              </div>

              <span className="subject-tag">{item.subject}</span>

              {isAdmin && (
                <button
                  className="danger-icon"
                  title="Delete assignment"
                  onClick={() => {
                    setItems(old => old.filter(x => x.id !== item.id));
                    flash("Assignment deleted.");
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <h3>{item.title}</h3>
            <p>{item.description || "No additional instructions provided."}</p>

            <div className="assignment-card-footer">
              <span>
                <CalendarDays size={15} /> Due {item.due}
              </span>
              <span className="published-tag">
                <span /> Published
              </span>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <Empty text="No assignments have been added yet." />
        )}
      </div>
    </div>
  );
}

/* EMPTY STATE */

function Empty({ text }) {
  return (
    <div className="empty-state">
      <div>
        <BookOpen size={22} />
      </div>
      <p>{text}</p>
    </div>
  );
}
