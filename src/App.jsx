import { fetchExamData } from "./gemini";
import { useState, useEffect, useMemo } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #faf8f4;
  --surface: #ffffff;
  --surface2: #f4f1eb;
  --border: rgba(0,0,0,0.08);
  --border2: rgba(0,0,0,0.14);
  --text: #1a1814;
  --text2: #6b6560;
  --text3: #a09890;
  --accent: #e8622a;
  --accent-light: #fdf0ea;
  --accent-border: rgba(232,98,42,0.25);
  --green: #2a7a4b;
  --green-bg: #edf7f1;
  --red: #c0392b;
  --red-bg: #fdf0ee;
  --amber: #b45309;
  --amber-bg: #fef3e2;
  --blue: #1d4ed8;
  --blue-bg: #eff6ff;
  --r: 10px;
  --r-lg: 16px;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
}
body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.6; min-height: 100vh; }

.app { max-width: 1080px; margin: 0 auto; padding: 0 20px 80px; }

/* NAV */
.nav { display: flex; align-items: center; justify-content: space-between; padding: 20px 0 0; margin-bottom: 36px; }
.logo { display: flex; align-items: baseline; gap: 8px; }
.logo-name { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 600; color: var(--text); letter-spacing: -0.02em; }
.logo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-bottom: 3px; }
.nav-tabs { display: flex; background: var(--surface2); border-radius: 10px; padding: 3px; gap: 2px; }
.nav-tab { padding: 7px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; color: var(--text2); cursor: pointer; transition: all .15s; border: none; background: transparent; font-family: 'DM Sans', sans-serif; }
.nav-tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow); }
.nav-tab:hover:not(.active) { color: var(--text); }

/* HERO */
.hero { margin-bottom: 32px; }
.hero-title { font-family: 'Fraunces', serif; font-size: 36px; font-weight: 500; color: var(--text); letter-spacing: -0.02em; line-height: 1.2; margin-bottom: 8px; }
.hero-title em { font-style: italic; color: var(--accent); }
.hero-sub { font-size: 15px; color: var(--text2); max-width: 480px; }

/* STATS ROW */
.stats-row { display: flex; gap: 10px; margin-bottom: 28px; flex-wrap: wrap; }
.stat-pill { display: flex; align-items: center; gap: 6px; background: var(--surface); border: 0.5px solid var(--border2); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: var(--text2); box-shadow: var(--shadow); }
.stat-num { font-weight: 600; color: var(--text); font-size: 13px; }

/* SEARCH + FILTERS */
.controls { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; align-items: center; }
.search-wrap { flex: 1; min-width: 200px; position: relative; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 15px; pointer-events: none; }
.search-input { width: 100%; padding: 10px 12px 10px 36px; background: var(--surface); border: 0.5px solid var(--border2); border-radius: var(--r); font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; box-shadow: var(--shadow); transition: border-color .15s; }
.search-input:focus { border-color: var(--accent); }
.search-input::placeholder { color: var(--text3); }
.filter-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.filter-pill { padding: 7px 14px; border-radius: 20px; border: 0.5px solid var(--border2); background: var(--surface); color: var(--text2); font-size: 12px; font-weight: 500; cursor: pointer; transition: all .15s; font-family: 'DM Sans', sans-serif; box-shadow: var(--shadow); }
.filter-pill:hover { border-color: var(--accent-border); color: var(--text); }
.filter-pill.active { background: var(--accent); border-color: var(--accent); color: #fff; }

/* URGENCY SECTIONS */
.section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text3); margin-bottom: 10px; display: flex; align-items: center; gap: 8px; }
.section-label::after { content: ''; flex: 1; height: 0.5px; background: var(--border); }
.urgency-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

/* EXAM CARDS */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; margin-bottom: 28px; }
.exam-card { background: var(--surface); border: 0.5px solid var(--border2); border-radius: var(--r-lg); padding: 1.1rem 1.25rem; cursor: pointer; transition: all .18s; box-shadow: var(--shadow); position: relative; overflow: hidden; }
.exam-card:hover { box-shadow: var(--shadow-md); border-color: rgba(0,0,0,0.18); transform: translateY(-1px); }
.exam-card.saved { border-color: var(--accent-border); }
.exam-card-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; border-radius: 16px 0 0 16px; }
.exam-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.exam-name { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 500; color: var(--text); letter-spacing: -0.01em; line-height: 1.3; }
.exam-full { font-size: 11px; color: var(--text3); margin-top: 1px; }
.save-btn { width: 30px; height: 30px; border-radius: 8px; border: 0.5px solid var(--border2); background: var(--surface2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all .15s; flex-shrink: 0; font-size: 14px; }
.save-btn:hover { border-color: var(--accent-border); background: var(--accent-light); }
.save-btn.saved { background: var(--accent); border-color: var(--accent); }
.stream-tag { display: inline-flex; align-items: center; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 4px; margin-bottom: 10px; }
.tag-engg { background: var(--blue-bg); color: var(--blue); }
.tag-med { background: var(--green-bg); color: var(--green); }
.tag-mgmt { background: var(--amber-bg); color: var(--amber); }
.tag-law { background: #f5f0ff; color: #5b21b6; }
.tag-design { background: #fdf0ea; color: #9a3412; }
.tag-general { background: var(--surface2); color: var(--text2); }
.deadlines-list { display: flex; flex-direction: column; gap: 5px; }
.deadline-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 5px 8px; border-radius: 6px; background: var(--surface2); }
.deadline-type { font-size: 11px; color: var(--text2); font-weight: 500; }
.deadline-date { font-size: 11px; font-weight: 600; }
.date-urgent { color: var(--red); }
.date-soon { color: var(--amber); }
.date-ok { color: var(--green); }
.date-past { color: var(--text3); text-decoration: line-through; }
.days-badge { font-size: 10px; padding: 1px 6px; border-radius: 3px; font-weight: 600; }
.badge-urgent { background: var(--red-bg); color: var(--red); }
.badge-soon { background: var(--amber-bg); color: var(--amber); }
.badge-ok { background: var(--green-bg); color: var(--green); }
.badge-past { background: var(--surface2); color: var(--text3); }
.exam-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 0.5px solid var(--border); }
.official-link { font-size: 11px; color: var(--accent); text-decoration: none; font-weight: 500; }
.official-link:hover { text-decoration: underline; }
.next-deadline { font-size: 11px; color: var(--text3); }

/* TRACKER */
.tracker-empty { text-align: center; padding: 60px 20px; }
.tracker-empty-icon { font-size: 36px; margin-bottom: 12px; }
.tracker-empty-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 500; color: var(--text); margin-bottom: 6px; }
.tracker-empty-sub { font-size: 14px; color: var(--text2); }
.tracker-card { background: var(--surface); border: 0.5px solid var(--border2); border-radius: var(--r-lg); margin-bottom: 10px; box-shadow: var(--shadow); overflow: hidden; }
.tracker-card-head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; }
.tracker-exam-name { font-family: 'Fraunces', serif; font-size: 16px; font-weight: 500; color: var(--text); flex: 1; }
.tracker-count { font-size: 11px; color: var(--text3); }
.tracker-chevron { font-size: 12px; color: var(--text3); transition: transform .2s; }
.tracker-chevron.open { transform: rotate(180deg); }
.tracker-body { border-top: 0.5px solid var(--border); }
.tracker-deadline-row { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-bottom: 0.5px solid var(--border); }
.tracker-deadline-row:last-child { border-bottom: none; }
.tracker-dl-left { flex: 1; }
.tracker-dl-type { font-size: 13px; font-weight: 500; color: var(--text); }
.tracker-dl-date { font-size: 12px; color: var(--text2); margin-top: 1px; }
.countdown { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 500; text-align: right; min-width: 60px; }
.countdown.urgent { color: var(--red); }
.countdown.soon { color: var(--amber); }
.countdown.ok { color: var(--green); }
.countdown.past { color: var(--text3); font-size: 14px; }
.countdown-label { font-size: 10px; color: var(--text3); text-align: right; font-family: 'DM Sans', sans-serif; }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(26,24,20,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 100; padding: 20px; }
@media (min-width: 600px) { .modal-overlay { align-items: center; } }
.modal { background: var(--surface); border-radius: 20px 20px 20px 20px; width: 100%; max-width: 560px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: slideUp .2s ease; }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.modal-head { padding: 20px 20px 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.modal-exam-name { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 500; color: var(--text); letter-spacing: -0.02em; }
.modal-exam-full { font-size: 13px; color: var(--text2); margin-top: 2px; }
.modal-close { width: 32px; height: 32px; border-radius: 8px; border: 0.5px solid var(--border2); background: var(--surface2); display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 16px; color: var(--text2); flex-shrink: 0; }
.modal-section { padding: 0 20px 16px; }
.modal-section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text3); margin-bottom: 10px; }
.modal-deadline-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; background: var(--surface2); margin-bottom: 6px; }
.modal-dl-type { font-size: 13px; font-weight: 500; color: var(--text); }
.modal-dl-date { font-size: 12px; color: var(--text2); margin-top: 2px; }
.modal-save-btn { width: 100%; padding: 13px; background: var(--accent); color: #fff; border: none; border-radius: var(--r); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500; cursor: pointer; margin: 4px 20px 20px; width: calc(100% - 40px); display: block; transition: opacity .15s; }
.modal-save-btn:hover { opacity: 0.9; }
.modal-save-btn.saved-state { background: var(--surface2); color: var(--text2); }

.no-results { text-align: center; padding: 48px 20px; color: var(--text2); font-size: 14px; }
.no-results-title { font-family: 'Fraunces', serif; font-size: 18px; color: var(--text); margin-bottom: 6px; }

.fade-in { animation: fadeIn .3s ease both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
`;

// ── DATA ──────────────────────────────────────────────────────────────────────
const EXAMS = [
  {
    id: 1, name: "JEE Main", full: "Joint Entrance Examination Main",
    stream: "engineering", color: "#1d4ed8",
    link: "https://jeemain.nta.nic.in/",
    about: "National level entrance for NITs, IIITs and GFTIs. Conducted twice a year by NTA.",
    deadlines: [
      { type: "Session 1 — Application open", date: "2025-11-01" },
      { type: "Session 1 — Last date to apply", date: "2025-11-30" },
      { type: "Session 1 — Exam", date: "2026-01-22" },
      { type: "Session 1 — Result", date: "2026-02-12" },
      { type: "Session 2 — Application open", date: "2026-02-15" },
      { type: "Session 2 — Last date to apply", date: "2026-03-15" },
      { type: "Session 2 — Exam", date: "2026-04-02" },
    ]
  },
  {
    id: 2, name: "JEE Advanced", full: "Joint Entrance Examination Advanced",
    stream: "engineering", color: "#1d4ed8",
    link: "https://jeeadv.ac.in",
    about: "Gateway to IITs. Only top 2.5 lakh JEE Main qualifiers are eligible.",
    deadlines: [
      { type: "Registration opens", date: "2026-04-25" },
      { type: "Registration closes", date: "2026-05-05" },
      { type: "Exam day", date: "2026-05-25" },
      { type: "Result declaration", date: "2026-06-10" },
      { type: "Architecture Aptitude Test", date: "2026-06-14" },
    ]
  },
  {
    id: 3, name: "NEET UG", full: "National Eligibility cum Entrance Test",
    stream: "medical", color: "#2a7a4b",
    link: "https://neet.nta.nic.in",
    about: "Single national entrance for MBBS, BDS and AYUSH admissions across India.",
    deadlines: [
      { type: "Application form out", date: "2026-02-07" },
      { type: "Last date to apply", date: "2026-03-10" },
      { type: "Admit card", date: "2026-04-28" },
      { type: "Exam", date: "2026-05-04" },
      { type: "Result", date: "2026-06-15" },
      { type: "Counselling round 1", date: "2026-07-01" },
    ]
  },
  {
    id: 4, name: "CAT", full: "Common Admission Test",
    stream: "management", color: "#b45309",
    link: "https://iimcat.ac.in",
    about: "Premier MBA entrance conducted by IIMs. Score accepted by 1200+ B-schools.",
    deadlines: [
      { type: "Registration opens", date: "2026-08-01" },
      { type: "Registration closes", date: "2026-09-14" },
      { type: "Admit card download", date: "2026-10-27" },
      { type: "Exam", date: "2026-11-30" },
      { type: "Result", date: "2027-01-05" },
    ]
  },
  {
    id: 5, name: "CUET UG", full: "Common University Entrance Test",
    stream: "general", color: "#6b7280",
    link: "https://cuet.nta.nic.in/",
    about: "Central entrance for 250+ universities including DU, JNU, BHU and more.",
    deadlines: [
      { type: "Application form", date: "2026-03-01" },
      { type: "Last date to apply", date: "2026-03-31" },
      { type: "Exam window", date: "2026-05-15" },
      { type: "Result", date: "2026-06-30" },
    ]
  },
  {
    id: 6, name: "CLAT", full: "Common Law Admission Test",
    stream: "law", color: "#5b21b6",
    link: "https://consortiumofnlus.ac.in",
    about: "National entrance for the 23 National Law Universities across India.",
    deadlines: [
      { type: "Application opens", date: "2026-01-01" },
      { type: "Application closes", date: "2026-04-15" },
      { type: "Admit card", date: "2026-05-01" },
      { type: "Exam", date: "2026-05-11" },
      { type: "Result", date: "2026-06-01" },
      { type: "Counselling begins", date: "2026-06-15" },
    ]
  },
  {
    id: 7, name: "NIFT", full: "National Institute of Fashion Technology",
    stream: "design", color: "#9a3412",
    link: "https://admissions.nift.ac.in",
    about: "Entrance for fashion design, textile design and fashion management programmes.",
    deadlines: [
      { type: "Application form", date: "2025-12-14" },
      { type: "Last date to apply", date: "2026-01-10" },
      { type: "Written exam", date: "2026-02-08" },
      { type: "Situation Test / GD-PI", date: "2026-03-20" },
      { type: "Result", date: "2026-04-10" },
    ]
  },
  {
    id: 8, name: "SNAP", full: "Symbiosis National Aptitude Test",
    stream: "management", color: "#b45309",
    link: "https://www.snaptest.org",
    about: "Entrance for MBA programmes at 16 Symbiosis institutes including SIBM Pune.",
    deadlines: [
      { type: "Registration opens", date: "2026-08-10" },
      { type: "Last date to register", date: "2026-11-24" },
      { type: "Exam — Test 1", date: "2026-12-13" },
      { type: "Exam — Test 2", date: "2026-12-20" },
      { type: "Exam — Test 3", date: "2027-01-04" },
    ]
  },
  {
    id: 9, name: "BITSAT", full: "BITS Admission Test",
    stream: "engineering", color: "#1d4ed8",
    link: "https://www.bitsadmission.com",
    about: "Online entrance for BITS Pilani, Goa and Hyderabad campuses.",
    deadlines: [
      { type: "Application opens", date: "2026-01-10" },
      { type: "Application closes", date: "2026-03-31" },
      { type: "Exam window", date: "2026-05-20" },
      { type: "Result", date: "2026-06-10" },
      { type: "Admissions close", date: "2026-07-01" },
    ]
  },
  {
    id: 10, name: "AIAPGET", full: "All India AYUSH PG Entrance Test",
    stream: "medical", color: "#2a7a4b",
    link: "https://aaccc.gov.in/pg-counselling/",
    about: "Entrance for PG programmes in Ayurveda, Yoga, Unani, Siddha and Homeopathy.",
    deadlines: [
      { type: "Application form", date: "2026-03-15" },
      { type: "Last date", date: "2026-04-10" },
      { type: "Exam", date: "2026-05-18" },
      { type: "Result", date: "2026-06-20" },
    ]
  },
  {
    id: 11, name: "XAT", full: "Xavier Aptitude Test",
    stream: "management", color: "#b45309",
    link: "https://xatonline.in",
    about: "Conducted by XLRI Jamshedpur. Accepted by 160+ institutes including XLRI, XIM.",
    deadlines: [
      { type: "Registration opens", date: "2026-07-15" },
      { type: "Registration closes", date: "2026-11-30" },
      { type: "Exam", date: "2027-01-05" },
      { type: "Result", date: "2027-01-31" },
    ]
  },
  {
    id: 12, name: "NID DAT", full: "National Institute of Design — Design Aptitude Test",
    stream: "design", color: "#9a3412",
    link: "https://admissions.nid.edu",
    about: "Entrance for B.Des and M.Des programmes at NID campuses across India.",
    deadlines: [
      { type: "Application opens", date: "2025-11-01" },
      { type: "Application closes", date: "2025-12-15" },
      { type: "Prelims exam", date: "2026-01-18" },
      { type: "Studio test / Interview", date: "2026-03-10" },
      { type: "Final result", date: "2026-04-15" },
    ]
  },
];

const STREAMS = [
  { id: "all", label: "All streams" },
  { id: "engineering", label: "Engineering" },
  { id: "medical", label: "Medical" },
  { id: "management", label: "Management" },
  { id: "law", label: "Law" },
  { id: "design", label: "Design" },
  { id: "general", label: "General" },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function parseDate(str) { return new Date(str + "T00:00:00"); }
function today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function daysFrom(dateStr) {
  const diff = parseDate(dateStr) - today();
  return Math.ceil(diff / 86400000);
}
function fmtDate(dateStr) {
  return parseDate(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function urgencyClass(days) {
  if (days < 0) return "past";
  if (days <= 7) return "urgent";
  if (days <= 30) return "soon";
  return "ok";
}
function nextDeadline(exam) {
  const upcoming = exam.deadlines.filter(d => daysFrom(d.date) >= 0);
  return upcoming.length ? upcoming[0] : null;
}
function streamColor(stream) {
  return { engineering: "tag-engg", medical: "tag-med", management: "tag-mgmt", law: "tag-law", design: "tag-design", general: "tag-general" }[stream] || "tag-general";
}

// ── COMPONENTS ────────────────────────────────────────────────────────────────
function DaysChip({ days }) {
  const cls = urgencyClass(days);
  const label = days < 0 ? "done" : days === 0 ? "today" : `${days}d`;
  return <span className={`days-badge badge-${cls}`}>{label}</span>;
}

function DeadlineRow({ d, compact }) {
  const days = daysFrom(d.date);
  const cls = urgencyClass(days);
  return (
    <div className="deadline-row">
      <span className="deadline-type">{d.type}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span className={`deadline-date date-${cls}`}>{fmtDate(d.date)}</span>
        <DaysChip days={days} />
      </div>
    </div>
  );
}

function ExamCard({ exam, saved, onSave, onClick }) {
  const next = nextDeadline(exam);
  const upcoming = exam.deadlines.filter(d => daysFrom(d.date) >= 0).slice(0, 3);
  const past = exam.deadlines.filter(d => daysFrom(d.date) < 0);

  return (
    <div className={`exam-card fade-in ${saved ? "saved" : ""}`} onClick={onClick}>
      <div className="exam-card-accent" style={{ background: exam.color }} />
      <div className="exam-top">
        <div style={{ paddingLeft: 8 }}>
          <div className="exam-name">{exam.name}</div>
          <div className="exam-full">{exam.full}</div>
        </div>
        <button className={`save-btn ${saved ? "saved" : ""}`} onClick={e => { e.stopPropagation(); onSave(exam.id); }}
          title={saved ? "Remove from tracker" : "Save to tracker"}>
          {saved ? "★" : "☆"}
        </button>
      </div>
      <span className={`stream-tag ${streamColor(exam.stream)}`}>{exam.stream.charAt(0).toUpperCase() + exam.stream.slice(1)}</span>
      <div className="deadlines-list">
        {upcoming.length === 0
          ? <div style={{ fontSize: 12, color: "var(--text3)", padding: "4px 8px" }}>All deadlines passed</div>
          : upcoming.map((d, i) => <DeadlineRow key={i} d={d} />)
        }
      </div>
      <div className="exam-footer">
        <a className="official-link" href={exam.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
          Official site ↗
        </a>
        {past.length > 0 && <span className="next-deadline">{past.length} deadline{past.length > 1 ? "s" : ""} passed</span>}
      </div>
    </div>
  );
}

function ExamModal({ exam, saved, onSave, onClose }) {
  if (!exam) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-exam-name">{exam.name}</div>
            <div className="modal-exam-full">{exam.full}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {exam.about && (
          <div className="modal-section">
            <div className="modal-section-title">About</div>
            <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>{exam.about}</div>
          </div>
        )}

        <div className="modal-section">
          <div className="modal-section-title">All deadlines</div>
          {exam.deadlines.map((d, i) => {
            const days = daysFrom(d.date);
            const cls = urgencyClass(days);
            return (
              <div key={i} className="modal-deadline-row">
                <div>
                  <div className="modal-dl-type">{d.type}</div>
                  <div className="modal-dl-date">{fmtDate(d.date)}</div>
                </div>
                <DaysChip days={days} />
              </div>
            );
          })}
        </div>

        <button
          className={`modal-save-btn ${saved ? "saved-state" : ""}`}
          onClick={() => onSave(exam.id)}
        >
          {saved ? "✓ Saved to your tracker" : "Save to my tracker"}
        </button>
      </div>
    </div>
  );
}

function TrackerView({ saved, exams, onSave }) {
  const [open, setOpen] = useState({});
  const savedExams = exams.filter(e => saved.includes(e.id));

  if (savedExams.length === 0) return (
    <div className="tracker-empty fade-in">
      <div className="tracker-empty-icon">📌</div>
      <div className="tracker-empty-title">Nothing saved yet</div>
      <div className="tracker-empty-sub">Go to Browse and star the exams you're applying to</div>
    </div>
  );

  const allDeadlines = savedExams.flatMap(e =>
    e.deadlines.map(d => ({ ...d, examName: e.name, examId: e.id, days: daysFrom(d.date) }))
  ).filter(d => d.days >= 0).sort((a, b) => a.days - b.days);

  return (
    <div className="fade-in">
      {/* Countdown strip */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">
          <span className="urgency-dot" style={{ background: "var(--red)" }} />
          Coming up
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {allDeadlines.slice(0, 4).map((d, i) => {
            const cls = urgencyClass(d.days);
            return (
              <div key={i} style={{ background: "var(--surface)", border: "0.5px solid var(--border2)", borderRadius: "var(--r-lg)", padding: "14px 16px", minWidth: 160, flex: 1, boxShadow: "var(--shadow)" }}>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{d.examName}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>{d.type}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 500, color: `var(--${cls === "past" ? "text3" : cls === "urgent" ? "red" : cls === "soon" ? "amber" : "green"})` }}>
                    {d.days}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>days left</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{fmtDate(d.date)}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-exam breakdown */}
      <div className="section-label">
        <span className="urgency-dot" style={{ background: "var(--text3)" }} />
        All saved exams
      </div>
      {savedExams.map(exam => {
        const isOpen = open[exam.id];
        return (
          <div key={exam.id} className="tracker-card">
            <div className="tracker-card-head" onClick={() => setOpen(o => ({ ...o, [exam.id]: !o[exam.id] }))}>
              <span className={`stream-tag ${streamColor(exam.stream)}`} style={{ marginBottom: 0 }}>{exam.stream.charAt(0).toUpperCase() + exam.stream.slice(1)}</span>
              <span className="tracker-exam-name">{exam.name}</span>
              <span className="tracker-count">{exam.deadlines.filter(d => daysFrom(d.date) >= 0).length} upcoming</span>
              <span className={`tracker-chevron ${isOpen ? "open" : ""}`}>▼</span>
            </div>
            {isOpen && (
              <div className="tracker-body">
                {exam.deadlines.map((d, i) => {
                  const days = daysFrom(d.date);
                  const cls = urgencyClass(days);
                  const colors = { urgent: "var(--red)", soon: "var(--amber)", ok: "var(--green)", past: "var(--text3)" };
                  return (
                    <div key={i} className="tracker-deadline-row">
                      <div className="tracker-dl-left">
                        <div className="tracker-dl-type" style={{ color: days < 0 ? "var(--text3)" : "var(--text)", textDecoration: days < 0 ? "line-through" : "none" }}>{d.type}</div>
                        <div className="tracker-dl-date">{fmtDate(d.date)}</div>
                      </div>
                      <div>
                        <div className={`countdown ${cls}`} style={{ color: colors[cls] }}>
                          {days < 0 ? "done" : days === 0 ? "today" : days}
                        </div>
                        {days >= 0 && <div className="countdown-label">{days === 0 ? "" : "days left"}</div>}
                      </div>
                    </div>
                  );
                })}
                <div style={{ padding: "10px 16px", borderTop: "0.5px solid var(--border)" }}>
                  <button onClick={() => onSave(exam.id)} style={{ fontSize: 12, color: "var(--red)", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    Remove from tracker
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [dynamicExams, setDynamicExams] = useState([]);
  const [tab, setTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState("all");
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem("admitsync_saved") || "[]"); } catch { return []; }
  });
  const [modal, setModal] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
  if (!search) return;

  const timeout = setTimeout(async () => {
    try {
      const query = search.toLowerCase();

      const exists =
        EXAMS.some(e => e.name.toLowerCase().includes(query)) ||
        dynamicExams.some(e => e.name.toLowerCase().includes(query));

      if (exists) return;

      setLoadingAI(true);

      const result = await fetchExamData(search);

      if (result) {
        setDynamicExams(prev => [
          ...prev,
          {
            ...result,
            id: Date.now(),
            color: "#6b7280",
          },
        ]);
      }

      setLoadingAI(false);
    } catch (err) {
      console.error("AI error:", err);
      setLoadingAI(false);
    }
  }, 800);

  return () => clearTimeout(timeout);
}, [search]);

  // // useEffect(() => {
  // //   if (!search) return;

  //   console.log("🔥 Search:", search);

  //   const timeout = setTimeout(async () => {
  //     try {
  //       const query = search.toLowerCase();

  //       const exists =
  //         EXAMS.some(e => e.name.toLowerCase().includes(query)) ||
  //         dynamicExams.some(e => e.name.toLowerCase().includes(query));

  //       if (exists) return;

  //       const result = await fetchExamData(search);

  //       console.log("✅ AI Result:", result);

  //       if (!result) return;

  //       setDynamicExams(prev => [
  //         ...prev,
  //         {
  //           ...result,
  //           id: Date.now(),
  //           color: "#6b7280",
  //         },
  //       ]);
  //     } catch (err) {
  //       console.error("❌ Error:", err);
  //     }
  //   }, 800);

  //   return () => clearTimeout(timeout);
  // }, [search]);

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     const fetchExam = async () => {
  //       // don't trigger for short queries
  //       if (search.trim().length < 4) return;

  //       const query = search.toLowerCase();

  //       // check if exam already exists (static + dynamic)
  //       const alreadyExists =
  //         EXAMS.some(e => e.name.toLowerCase().includes(query)) ||
  //         dynamicExams.some(e => e.name.toLowerCase().includes(query));

  //       if (alreadyExists) return;

  //       try {
  //         const result = await fetchExamData(search);

  //         if (!result) return;

  //         setDynamicExams(prev => [
  //           ...prev,
  //           {
  //             ...result,
  //             id: Date.now(),
  //             color: "#6b7280",
  //           },
  //         ]);
  //       } catch (error) {
  //         console.error("Error fetching exam:", error);
  //       }
  //     };

  //     fetchExam();
  //   }, 800); // debounce delay

  //   return () => clearTimeout(handler);
  // }, [search, dynamicExams]);

  const toggleSave = (id) => setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const allExams = [...EXAMS, ...dynamicExams];
  const filtered = useMemo(() => {
    return allExams.filter(e => {
      const matchStream = stream === "all" || e.stream === stream;
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.full.toLowerCase().includes(q) || e.stream.toLowerCase().includes(q);
      return matchStream && matchSearch;
    });
  }, [search, stream, dynamicExams]);

  const urgent = filtered.filter(e => { const n = nextDeadline(e); return n && daysFrom(n.date) <= 14; });
  const upcoming = filtered.filter(e => { const n = nextDeadline(e); return n && daysFrom(n.date) > 14; });
  const past = filtered.filter(e => !nextDeadline(e));

  const totalUpcoming = EXAMS.reduce((acc, e) => acc + e.deadlines.filter(d => daysFrom(d.date) >= 0).length, 0);

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="logo">
            <span className="logo-name">AdmitSync</span>
            <div className="logo-dot" />
          </div>
          <div className="nav-tabs">
            <button className={`nav-tab ${tab === "browse" ? "active" : ""}`} onClick={() => setTab("browse")}>Browse</button>
            <button className={`nav-tab ${tab === "tracker" ? "active" : ""}`} onClick={() => setTab("tracker")}>
              My Tracker {saved.length > 0 && <span style={{ background: "var(--accent)", color: "#fff", borderRadius: "10px", padding: "0 6px", fontSize: 10, marginLeft: 4 }}>{saved.length}</span>}
            </button>
          </div>
        </nav>

        {tab === "browse" && (
          <>
            <div className="hero">
              <h1 className="hero-title">Every deadline,<br /><em>one place.</em></h1>
              <p className="hero-sub">Track entrance exams and college deadlines across engineering, medical, management, law and design.</p>
            </div>

            <div className="stats-row">
              <div className="stat-pill"><span className="stat-num">{EXAMS.length}</span> exams tracked</div>
              <div className="stat-pill"><span className="stat-num">{totalUpcoming}</span> upcoming deadlines</div>
              <div className="stat-pill"><span className="stat-num">{saved.length}</span> saved by you</div>
            </div>

            <div className="controls">
              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search exams — JEE, NEET, CAT…" />
              </div>
              <div className="filter-pills">
                {STREAMS.map(s => (
                  <button key={s.id} className={`filter-pill ${stream === s.id ? "active" : ""}`} onClick={() => setStream(s.id)}>{s.label}</button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="no-results">
                <div className="no-results-title">
                  {loadingAI ? "Fetching information..." : "No exams found"}
                </div>
                <div>
                  {loadingAI
                    ? "Getting latest exam details for you..."
                    : ""}
                </div>
                <div></div>
              </div>
            ) : (
              <>
                {urgent.length > 0 && (
                  <>
                    <div className="section-label"><span className="urgency-dot" style={{ background: "var(--red)" }} />Deadline within 14 days</div>
                    <div className="cards-grid">{urgent.map(e => <ExamCard key={e.id} exam={e} saved={saved.includes(e.id)} onSave={toggleSave} onClick={() => setModal(e)} />)}</div>
                  </>
                )}
                {upcoming.length > 0 && (
                  <>
                    <div className="section-label"><span className="urgency-dot" style={{ background: "var(--green)" }} />Upcoming</div>
                    <div className="cards-grid">{upcoming.map(e => <ExamCard key={e.id} exam={e} saved={saved.includes(e.id)} onSave={toggleSave} onClick={() => setModal(e)} />)}</div>
                  </>
                )}
                {past.length > 0 && (
                  <>
                    <div className="section-label"><span className="urgency-dot" style={{ background: "var(--text3)" }} />All deadlines passed</div>
                    <div className="cards-grid">{past.map(e => <ExamCard key={e.id} exam={e} saved={saved.includes(e.id)} onSave={toggleSave} onClick={() => setModal(e)} />)}</div>
                  </>
                )}
              </>
            )}
          </>
        )}

        {tab === "tracker" && (
          <>
            <div className="hero">
              <h1 className="hero-title">Your <em>tracker.</em></h1>
              <p className="hero-sub">All the exams you're watching, sorted by what's due first.</p>
            </div>
            <TrackerView saved={saved} exams={EXAMS} onSave={toggleSave} />
          </>
        )}

        {modal && <ExamModal exam={modal} saved={saved.includes(modal.id)} onSave={id => toggleSave(id)} onClose={() => setModal(null)} />}
      </div>
    </>
  );
}
