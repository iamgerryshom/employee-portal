import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged, signOut, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc, getDoc, updateDoc,
  collection, query, where, getDocs, orderBy,
} from "firebase/firestore";
import { auth, firestore } from "../../firebase";

const REFERRAL_BASE = "https://xnxxlivepussyhub.vercel.app";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #080b10;
    --surface:     #0e1219;
    --surface2:    #111722;
    --border:      #1c2230;
    --border2:     #263040;
    --muted:       #3a4455;
    --text:        #e4eaf4;
    --subtle:      #68788f;
    --accent:      #4f8eff;
    --accent-glow: rgba(79,142,255,.18);
    --accent-dim:  rgba(79,142,255,.08);
    --purple:      #7b5fff;
    --green:       #3ddc84;
    --green-dim:   rgba(61,220,132,.08);
    --green-border:rgba(61,220,132,.22);
    --amber:       #f5a623;
    --amber-dim:   rgba(245,166,35,.08);
    --pink:        #e879f9;
    --pink-dim:    rgba(232,121,249,.08);
    --danger:      #ff4f6a;
    --danger-dim:  rgba(255,79,106,.08);
  }

  html, body, #root {
    min-height: 100%; background: var(--bg);
    color: var(--text); font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .mono { font-family: 'DM Mono', monospace; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  .app { min-height: 100vh; display: flex; flex-direction: column; position: relative; }

  .app::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: .22;
    pointer-events: none;
    z-index: 0;
  }
  .app::after {
    content: '';
    position: fixed; top: -20%; left: 50%; transform: translateX(-50%);
    width: 900px; height: 500px;
    background: radial-gradient(ellipse, rgba(79,142,255,.09) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  nav {
    position: sticky; top: 0; z-index: 20;
    height: 56px;
    background: rgba(8,11,16,.92);
    backdrop-filter: blur(24px) saturate(160%);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nl { display: flex; align-items: center; gap: 12px; }
  .logo {
    width: 32px; height: 32px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), var(--purple));
    display: grid; place-items: center;
    font-size: 1rem;
    box-shadow: 0 0 16px rgba(79,142,255,.32);
  }
  .brand { font-size: 1rem; font-weight: 700; letter-spacing: .04em; }
  .brand span { color: var(--accent); }
  .nav-sep { width: 1px; height: 16px; background: var(--border2); }
  .nav-sub { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--muted); }
  .nr { display: flex; align-items: center; gap: 10px; }

  .live-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 4px 12px;
    background: var(--green-dim); border: 1px solid var(--green-border);
    border-radius: 99px;
    font-family: 'DM Mono', monospace; font-size: .68rem; font-weight: 400;
    color: var(--green); letter-spacing: .08em;
  }
  .live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: blink 2.4s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .av-btn {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--purple));
    border: 2px solid var(--border2);
    cursor: pointer; outline: none;
    display: grid; place-items: center;
    font-size: .72rem; font-weight: 700; color: #fff;
    font-family: 'Syne', sans-serif;
    box-shadow: 0 0 12px rgba(79,142,255,.22);
    transition: box-shadow .2s, transform .15s;
  }
  .av-btn:hover { box-shadow: 0 0 0 4px var(--accent-dim), 0 0 18px rgba(79,142,255,.3); transform: scale(1.06); }

  .page {
    flex: 1; position: relative; z-index: 1;
    padding: 32px 20px 72px;
    max-width: 620px; margin: 0 auto; width: 100%;
    display: flex; flex-direction: column; gap: 28px;
  }

  .a1 { animation: rise .5s .04s both cubic-bezier(.22,1,.36,1); }
  .a2 { animation: rise .5s .12s both cubic-bezier(.22,1,.36,1); }
  .a3 { animation: rise .5s .20s both cubic-bezier(.22,1,.36,1); }
  .a4 { animation: rise .5s .28s both cubic-bezier(.22,1,.36,1); }
  .a5 { animation: rise .5s .36s both cubic-bezier(.22,1,.36,1); }
  @keyframes rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .hero {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px 26px;
    position: relative; overflow: hidden;
    box-shadow: 0 0 0 1px rgba(255,255,255,.02);
  }
  .hero-shimmer {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--accent) 40%, var(--purple) 70%, transparent);
    opacity: .5;
  }
  .hero-glow {
    position: absolute; top: -80px; right: -80px;
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle, rgba(79,142,255,.1) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
  .hero-eyebrow { font-family: 'DM Mono', monospace; font-size: .7rem; color: var(--muted); letter-spacing: .12em; margin-bottom: 8px; }
  .hero-name { font-size: 1.85rem; font-weight: 800; letter-spacing: -.03em; line-height: 1.1; }
  .hero-name em { font-style: normal; color: var(--accent); }
  .hero-tags { display: flex; gap: 7px; margin-top: 14px; flex-wrap: wrap; }
  .tag { font-family: 'DM Mono', monospace; font-size: .68rem; padding: 3px 10px; border-radius: 5px; border: 1px solid; }
  .tag-blue   { color: var(--accent); background: var(--accent-dim); border-color: rgba(79,142,255,.22); }
  .tag-purple { color: var(--pink);   background: var(--pink-dim);   border-color: rgba(232,121,249,.22); }
  .hero-date { text-align: right; flex-shrink: 0; }
  .hero-date-lbl { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--muted); margin-bottom: 5px; }
  .hero-date-val { font-family: 'DM Mono', monospace; font-size: .78rem; color: var(--subtle); }

  .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 13px 16px 12px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .15s; cursor: default;
    box-shadow: 0 0 0 1px rgba(255,255,255,.02);
    min-width: 0; display: flex; flex-direction: column; gap: 6px;
  }
  .stat:hover { border-color: var(--border2); transform: translateY(-2px); }
  .stat-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-lbl { font-family: 'DM Mono', monospace; font-size: .6rem; letter-spacing: .08em; color: var(--muted); text-transform: uppercase; }
  .stat-val { font-size: 1.4rem; font-weight: 800; letter-spacing: -.03em; line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stat-unit { font-size: .6rem; font-weight: 600; opacity: .4; margin-right: 1px; vertical-align: baseline; }
  .stat-sub { font-family: 'DM Mono', monospace; font-size: .6rem; color: var(--muted); }
  .c-green  { color: var(--green); }
  .c-accent { color: var(--accent); }
  .c-amber  { color: var(--amber); }
  .c-danger { color: var(--danger); }

  .sec-hd {
    font-family: 'DM Mono', monospace; font-size: .68rem;
    letter-spacing: .14em; color: var(--muted);
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .sec-hd::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .hero-ref-divider { height: 1px; background: var(--border); margin: 18px 0; }
  .ref-url-strip {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 10px 14px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .ref-strip-left { display: flex; flex-direction: column; gap: 3px; flex: 1; min-width: 0; }
  .ref-strip-lbl { font-family: 'DM Mono', monospace; font-size: .62rem; color: var(--muted); letter-spacing: .1em; }
  .ref-url-text {
    font-family: 'DM Mono', monospace; font-size: .76rem;
    color: var(--subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
  }
  .ref-url-text em { font-style: normal; color: var(--accent); }
  .btn-copy {
    flex-shrink: 0;
    display: flex; align-items: center; gap: 7px;
    padding: 7px 14px;
    background: var(--accent-dim); color: var(--accent);
    border: 1px solid rgba(79,142,255,.25); border-radius: 8px;
    font-family: 'Syne', sans-serif; font-size: .78rem; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: background .15s, color .15s, border-color .15s, transform .15s;
  }
  .btn-copy:hover { transform: translateY(-1px); background: rgba(79,142,255,.14); }
  .btn-copy.copied {
    background: var(--green-dim); color: var(--green);
    border-color: var(--green-border);
  }

  .tx-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 0 0 1px rgba(255,255,255,.02);
  }
  .tx-toolbar {
    padding: 12px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .tx-toolbar-left {
    display: flex; align-items: center; gap: 9px;
    font-size: .82rem; font-weight: 700; color: var(--subtle);
  }
  .tx-toolbar-left::before { content: ''; width: 3px; height: 14px; border-radius: 3px; background: var(--accent); box-shadow: 0 0 8px rgba(79,142,255,.5); }
  .tx-count { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(79,142,255,.16); border-radius: 4px; padding: 2px 8px; }
  .date-pick {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 5px 10px;
    font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--subtle);
    outline: none; color-scheme: dark; cursor: pointer; transition: border-color .15s;
  }
  .date-pick:focus { border-color: var(--accent); }

  .tx-row {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 18px; border-bottom: 1px solid var(--border);
    transition: background .12s;
  }
  .tx-row:last-child { border-bottom: none; }
  .tx-row:hover { background: var(--surface2); }
  .tx-ico {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--surface2); border: 1px solid var(--border);
    display: grid; place-items: center; font-size: 1rem; flex-shrink: 0;
  }
  .tx-mid { flex: 1; min-width: 0; }
  .tx-method { font-size: .88rem; font-weight: 700; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .tx-time { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--muted); }
  .tx-right { text-align: right; flex-shrink: 0; }
  .tx-comm-lbl { font-family: 'DM Mono', monospace; font-size: .68rem; color: var(--muted); margin-bottom: 3px; }
  .tx-comm { font-family: 'DM Mono', monospace; font-size: .9rem; font-weight: 400; }
  .tx-badge {
    font-family: 'DM Mono', monospace; font-size: .6rem; letter-spacing: .07em;
    padding: 2px 7px; border-radius: 4px;
    display: inline-block; margin-top: 4px;
  }
  .bd-done { background: var(--green-dim); color: var(--green); border: 1px solid rgba(61,220,132,.2); }
  .bd-fail { background: var(--danger-dim); color: var(--danger); border: 1px solid rgba(255,79,106,.2); }
  .bd-pend { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(245,166,35,.2); }
  .tx-empty { padding: 44px; text-align: center; font-family: 'DM Mono', monospace; font-size: .78rem; color: var(--muted); }

  .skel-list { padding: 14px 18px; display: flex; flex-direction: column; gap: 14px; }
  .skel { height: 12px; border-radius: 6px; background: linear-gradient(90deg, var(--border) 0%, var(--surface2) 50%, var(--border) 100%); background-size: 200% 100%; animation: shim 1.5s ease infinite; }
  @keyframes shim { to { background-position: -200% 0; } }

  .splash { min-height: 100vh; display: grid; place-items: center; }
  .splash-inner { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .spin { width: 24px; height: 24px; border: 2px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: rot .65s linear infinite; }
  @keyframes rot { to { transform: rotate(360deg); } }
  .splash-txt { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--muted); letter-spacing: .1em; }

  .overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.72); backdrop-filter: blur(10px); animation: fdin .2s ease both; }
  @keyframes fdin { from{opacity:0} to{opacity:1} }
  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(360px, 94vw); z-index: 51;
    background: var(--surface); border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    animation: slidein .3s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes slidein { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }

  .dr-nav {
    padding: 15px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .dr-title { font-family: 'DM Mono', monospace; font-size: .7rem; letter-spacing: .14em; color: var(--subtle); }
  .dr-close {
    width: 30px; height: 30px; border-radius: 8px; background: var(--surface2);
    border: 1px solid var(--border); color: var(--muted); cursor: pointer;
    display: grid; place-items: center; font-size: .82rem; transition: color .15s;
  }
  .dr-close:hover { color: var(--text); }

  .dr-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 6px; }

  /* avatar strip */
  .dr-avatar-strip {
    display: flex; align-items: center; gap: 13px;
    padding: 13px 15px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; margin-bottom: 4px;
  }
  .dr-av {
    width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--purple));
    display: grid; place-items: center;
    font-size: .95rem; font-weight: 700; color: #fff;
    box-shadow: 0 0 0 4px var(--accent-dim);
    font-family: 'Syne', sans-serif;
  }
  .dr-av-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .dr-nm { font-size: .95rem; font-weight: 800; letter-spacing: -.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dr-em { font-family: 'DM Mono', monospace; font-size: .65rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dr-role-tag {
    margin-top: 3px; font-family: 'DM Mono', monospace; font-size: .58rem;
    padding: 2px 7px; border-radius: 4px; display: inline-block;
    background: var(--accent-dim); color: var(--accent);
    border: 1px solid rgba(79,142,255,.2); width: fit-content;
  }

  /* accordion */
  .acc {
    border: 1px solid var(--border); border-radius: 12px;
    overflow: hidden; background: var(--surface2);
  }
  .acc-hd {
    width: 100%; background: none; border: none; color: var(--text);
    display: flex; align-items: center; gap: 10px;
    padding: 11px 13px; cursor: pointer; text-align: left;
    transition: background .12s;
  }
  .acc-hd:hover { background: rgba(255,255,255,.03); }
  .acc-ico {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg);
    display: grid; place-items: center; flex-shrink: 0;
    color: var(--subtle);
  }
  .acc-lbl { flex: 1; }
  .acc-lbl-title { font-size: .82rem; font-weight: 700; color: var(--text); }
  .acc-lbl-sub { font-family: 'DM Mono', monospace; font-size: .6rem; color: var(--muted); margin-top: 1px; }
  .acc-chevron {
    font-size: .7rem; color: var(--muted); flex-shrink: 0;
    width: 20px; height: 20px; display: grid; place-items: center;
    transition: transform .2s;
  }
  .acc-chevron.open { transform: rotate(180deg); }

  .acc-body {
    padding: 14px; border-top: 1px solid var(--border);
    animation: accExpand .2s cubic-bezier(.22,1,.36,1) both;
  }
  @keyframes accExpand { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }

  /* shared form/info styles */
  .info-box { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .irow { display: flex; align-items: center; justify-content: space-between; padding: 9px 13px; border-bottom: 1px solid var(--border); }
  .irow:last-child { border-bottom: none; }
  .ik { font-size: .8rem; color: var(--subtle); }
  .iv { font-family: 'DM Mono', monospace; font-size: .72rem; color: var(--subtle); text-align: right; max-width: 58%; word-break: break-all; }

  .fstack { display: flex; flex-direction: column; gap: 10px; }
  .flbl { display: block; font-family: 'DM Mono', monospace; font-size: .62rem; letter-spacing: .1em; color: var(--muted); margin-bottom: 4px; }
  .fin {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; padding: 9px 12px;
    font-family: 'DM Mono', monospace; font-size: .8rem; color: var(--text);
    outline: none; transition: border-color .15s, box-shadow .15s;
  }
  .fin:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

  .btn-pri {
    width: 100%; padding: 10px; border: none; border-radius: 9px;
    background: var(--accent); color: #fff;
    font-family: 'Syne', sans-serif; font-size: .84rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: opacity .15s, transform .15s;
    box-shadow: 0 4px 18px rgba(79,142,255,.24);
  }
  .btn-pri:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
  .btn-pri:disabled { opacity: .4; cursor: not-allowed; }

  .btn-ghost {
    width: 100%; padding: 10px; border: 1px solid var(--border2); border-radius: 9px;
    background: var(--surface2); color: var(--subtle);
    font-family: 'Syne', sans-serif; font-size: .84rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: opacity .15s, transform .15s;
  }
  .btn-ghost:hover:not(:disabled) { opacity: .85; transform: translateY(-1px); }
  .btn-ghost:disabled { opacity: .4; cursor: not-allowed; }

  .btn-danger {
    width: 100%; padding: 10px; border: 1px solid rgba(255,79,106,.22); border-radius: 9px;
    background: var(--danger-dim); color: var(--danger);
    font-family: 'Syne', sans-serif; font-size: .84rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .15s;
  }
  .btn-danger:hover { opacity: .8; }

  .mini-spin { width: 12px; height: 12px; border: 1.5px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: rot .6s linear infinite; }

  .alert { padding: 9px 12px; border-radius: 9px; font-family: 'DM Mono', monospace; font-size: .7rem; line-height: 1.5; display: flex; gap: 7px; animation: fdin .2s ease both; }
  .alert-ok  { background: var(--green-dim); border: 1px solid rgba(61,220,132,.2); color: var(--green); }
  .alert-err { background: var(--danger-dim); border: 1px solid rgba(255,79,106,.2); color: var(--danger); }

  @media(min-width:600px){
    nav { padding: 0 28px; }
    .page { padding: 36px 28px 72px; max-width: 640px; }
    .drawer { width: 380px; }
  }
`;

/* ── UTILS ── */
const fmt = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-KE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("en-KE", { month: "short", day: "numeric" }) : "—";
const MICONS = { mpesa: "📱", cash: "💵", card: "💳", bank: "🏦" };
const micon = (m) => MICONS[(m || "").toLowerCase()] ?? "💳";
const initials = (n) => (n || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const todayNairobi = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });
const dayBounds = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - 3 * 3600 * 1000);
  return [start, new Date(start.getTime() + 24 * 3600 * 1000)];
};
const statusClass = (s = "") => s.includes("COMPLETED") ? "bd-done" : s.includes("FAILED") ? "bd-fail" : "bd-pend";
const statusLabel = (s = "") => s.includes("COMPLETED") ? "DONE" : s.includes("FAILED") ? "FAILED" : "PENDING";

// Compact number formatter: 1200 → "1.2K", 1000000 → "1M"
const compact = (n) => {
  const num = Number(n);
  if (isNaN(num)) return String(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000)     return (num / 1_000).toFixed(1) + "K";
  return Number.isInteger(num) ? num.toString() : num.toFixed(1);
};

/* ── ACCORDION SECTION ── */
function AccSection({ id, openId, onToggle, icon, title, sub, children }) {
  const isOpen = openId === id;
  return (
    <div className="acc">
      <button className="acc-hd" onClick={() => onToggle(id)}>
        <div className="acc-ico">{icon}</div>
        <div className="acc-lbl">
          <div className="acc-lbl-title">{title}</div>
          <div className="acc-lbl-sub">{sub}</div>
        </div>
        <span className={`acc-chevron${isOpen ? " open" : ""}`}>▾</span>
      </button>
      {isOpen && (
        <div className="acc-body">{children}</div>
      )}
    </div>
  );
}

/* ── PROFILE DRAWER ── */
function ProfileDrawer({ emp, user, onClose, onUpdated, onLogout }) {
  const [openSection, setOpenSection] = useState(null);

  const [name,     setName]    = useState(emp?.name ?? "");
  const [phone,    setPhone]   = useState(emp?.phoneNumber ?? "");
  const [curPass,  setCurPass] = useState("");
  const [newPass,  setNewPass] = useState("");
  const [saving,   setSaving]  = useState(false);
  const [passLoad, setPassLoad]= useState(false);
  const [msg,      setMsg]     = useState(null);
  const [pmsg,     setPmsg]    = useState(null);

  const toggle = (id) => setOpenSection(prev => prev === id ? null : id);

  const saveProfile = async () => {
    if (!name.trim()) return;
    setSaving(true); setMsg(null);
    try {
      await updateDoc(doc(firestore, "employees", user.uid), {
        name: name.trim(),
        phoneNumber: phone.trim(),
      });
      setMsg({ t: "ok", s: "Profile updated." });
      onUpdated?.({ ...emp, name: name.trim(), phoneNumber: phone.trim() });
    } catch (e) {
      setMsg({ t: "err", s: e.message });
    } finally {
      setSaving(false);
    }
  };

  const changePass = async () => {
    if (!curPass || !newPass) { setPmsg({ t: "err", s: "Fill both fields." }); return; }
    if (newPass.length < 6)   { setPmsg({ t: "err", s: "Min 6 characters." }); return; }
    setPassLoad(true); setPmsg(null);
    try {
      const cred = EmailAuthProvider.credential(user.email, curPass);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPass);
      setPmsg({ t: "ok", s: "Password changed." });
      setCurPass(""); setNewPass("");
    } catch (e) {
      const map = {
        "auth/wrong-password": "Wrong current password.",
        "auth/invalid-credential": "Wrong current password.",
      };
      setPmsg({ t: "err", s: map[e.code] ?? e.message });
    } finally {
      setPassLoad(false);
    }
  };

  return (
    <>
      <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()} />
      <aside className="drawer">
        <div className="dr-nav">
          <span className="dr-title">PROFILE</span>
          <button className="dr-close" onClick={onClose}>✕</button>
        </div>

        <div className="dr-body">

          {/* Avatar strip */}
          <div className="dr-avatar-strip">
            <div className="dr-av">{initials(emp?.name)}</div>
            <div className="dr-av-info">
              <div className="dr-nm">{emp?.name ?? "—"}</div>
              <div className="dr-em">{user?.email}</div>
              <span className="dr-role-tag">{emp?.role ?? "—"}</span>
            </div>
          </div>

          {/* Account Info */}
          <AccSection
            id="info"
            openId={openSection}
            onToggle={toggle}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/><path d="M6 8h2M6 12h2M6 16h2"/>
              </svg>
            }
            title="Account Info"
            sub="Role, ref code, status"
          >
            <div className="info-box">
              {[
                ["Role",   emp?.role],
                ["Ref Code", emp?.refCode],
                ["Status", emp?.isActive ? "Active ✓" : "Inactive"],
                ["Joined", fmt(emp?.createdAt)],
              ].map(([k, v]) => (
                <div className="irow" key={k}>
                  <span className="ik">{k}</span>
                  <span
                    className="iv"
                    style={k === "Status" && emp?.isActive ? { color: "var(--green)" } : {}}
                  >
                    {v ?? "—"}
                  </span>
                </div>
              ))}
            </div>
          </AccSection>

          {/* Edit Details */}
          <AccSection
            id="edit"
            openId={openSection}
            onToggle={toggle}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            }
            title="Edit Details"
            sub="Name, phone number"
          >
            <div className="fstack">
              <div>
                <label className="flbl">name</label>
                <input
                  className="fin"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="flbl">phone</label>
                <input
                  className="fin"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="254..."
                />
              </div>
              {msg && (
                <div className={`alert alert-${msg.t === "ok" ? "ok" : "err"}`}>
                  {msg.t === "ok" ? "✓" : "✕"} {msg.s}
                </div>
              )}
              <button className="btn-pri" onClick={saveProfile} disabled={saving}>
                {saving ? <><div className="mini-spin" />Saving…</> : "Save Changes"}
              </button>
            </div>
          </AccSection>

          {/* Change Password */}
          <AccSection
            id="pass"
            openId={openSection}
            onToggle={toggle}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
            title="Change Password"
            sub="Update your credentials"
          >
            <div className="fstack">
              <div>
                <label className="flbl">current password</label>
                <input
                  className="fin"
                  type="password"
                  value={curPass}
                  onChange={e => setCurPass(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="flbl">new password</label>
                <input
                  className="fin"
                  type="password"
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="min 6 chars"
                />
              </div>
              {pmsg && (
                <div className={`alert alert-${pmsg.t === "ok" ? "ok" : "err"}`}>
                  {pmsg.t === "ok" ? "✓" : "✕"} {pmsg.s}
                </div>
              )}
              <button className="btn-ghost" onClick={changePass} disabled={passLoad}>
                {passLoad
                  ? <><div className="mini-spin" style={{ borderTopColor: "var(--subtle)" }} />Updating…</>
                  : "Update Password"
                }
              </button>
            </div>
          </AccSection>

          {/* Session */}
          <AccSection
            id="session"
            openId={openSection}
            onToggle={toggle}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            }
            title="Session"
            sub="Sign out of this device"
          >
            <button className="btn-danger" onClick={onLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </button>
          </AccSection>

          <div style={{ height: 8 }} />
        </div>
      </aside>
    </>
  );
}

/* ── STAT VALUE ── */
function StatVal({ value, className }) {
  const num = Number(value);
  const display = compact(value);
  const full = !isNaN(num) ? num.toLocaleString("en-KE") : String(value);

  return (
    <div className={`stat-val ${className}`} title={full}>
      {display}
    </div>
  );
}

/* ── DASHBOARD ── */
export default function Dashboard() {
  const navigate = useNavigate();

  const [user,         setUser]        = useState(null);
  const [emp,          setEmp]         = useState(null);
  const [empData,      setEmpData]     = useState(null);
  const [txs,          setTxs]         = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [txLoad,       setTxLoad]      = useState(true);
  const [showDrawer,   setShowDrawer]  = useState(false);
  const [selectedDate, setSelectedDate]= useState(todayNairobi());
  const [copied,       setCopied]      = useState(false);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) { setLoading(false); navigate("/auth"); return; }
      setUser(u);
      try {
        const [es, ds] = await Promise.all([
          getDoc(doc(firestore, "employees", u.uid)),
          getDoc(doc(firestore, "employee_data", u.uid)),
        ]);
        if (es.exists()) setEmp(es.data());
        if (ds.exists()) setEmpData(ds.data());
      } finally {
        setLoading(false);
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firestore, "transactions"),
      where("employeeId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    getDocs(q)
      .then(s => setTxs(s.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(() =>
        getDocs(collection(firestore, "transactions")).then(s =>
          setTxs(
            s.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(t => t.employeeId === user.uid)
              .sort((a, b) => (b.timestamp?.toDate?.() ?? 0) - (a.timestamp?.toDate?.() ?? 0))
          )
        )
      )
      .finally(() => setTxLoad(false));
  }, [user]);

  const filteredTxs = (() => {
    const [start, end] = dayBounds(selectedDate);
    return txs.filter(tx => {
      if (!tx.timestamp) return false;
      const d = tx.timestamp.toDate ? tx.timestamp.toDate() : new Date(tx.timestamp);
      return d >= start && d < end;
    });
  })();

  const logout = async () => { await signOut(auth); navigate("/auth"); };

  const refUrl = emp?.refCode ? `${REFERRAL_BASE}?ref=${emp.refCode}` : null;

  const copyRefLink = async () => {
    if (!refUrl) return;
    try {
      await navigator.clipboard.writeText(refUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = refUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return (
    <div className="splash">
      <div className="splash-inner">
        <div className="spin" />
        <p className="splash-txt">loading…</p>
      </div>
    </div>
  );

  if (!user) return null;

  const stats = [
    { lbl: "today",  val: empData?.commissionToday ?? 0,       u: "KES", cls: "c-green",  bar: "var(--green)",  sub: fmtDate(empData?.commissionTodayDate) },
    { lbl: "total",  val: empData?.totalCommissionEarned ?? 0, u: "KES", cls: "c-accent", bar: "var(--accent)", sub: "all time" },
    { lbl: "sales",  val: empData?.successfulSalesCount ?? 0,  u: "",    cls: "c-amber",  bar: "var(--amber)",  sub: "successful" },
    { lbl: "failed", val: empData?.failedSalesCount ?? 0,      u: "",    cls: "c-danger", bar: "var(--danger)", sub: "transactions" },
  ];

  return (
    <div className="app">
      {showDrawer && (
        <ProfileDrawer
          emp={emp}
          user={user}
          onClose={() => setShowDrawer(false)}
          onUpdated={setEmp}
          onLogout={logout}
        />
      )}

      <nav>
        <div className="nl">
          <div className="logo">⬡</div>
          <span className="brand">EMP<span>.</span>PORTAL</span>
          <div className="nav-sep" />
        </div>
        <div className="nr">
          <button className="av-btn" onClick={() => setShowDrawer(true)} title="Profile">
            {initials(emp?.name)}
          </button>
        </div>
      </nav>

      <div className="page">

        {/* HERO */}
        <div className="hero a1">
          <div className="hero-shimmer" />
          <div className="hero-glow" />
          <div className="hero-row">
            <div>
              <h1 className="hero-name">Hello, <em>{emp?.name ?? "Employee"}</em></h1>
              <div className="hero-tags">
                <span className="tag tag-blue">{emp?.role ?? "—"}</span>
                <span className="tag tag-purple">ref {emp?.refCode ?? "—"}</span>
              </div>
            </div>
            <div className="hero-date">
              <p className="hero-date-lbl">today</p>
              <p className="hero-date-val">
                {new Date().toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          {refUrl && (
            <>
              <div className="hero-ref-divider" />
              <div className="ref-url-strip">
                <div className="ref-strip-left">
                  <span className="ref-url-text">
                    xnxxlivepussyhub.vercel.app?ref=<em>{emp.refCode}</em>
                  </span>
                </div>
                <button className={`btn-copy${copied ? " copied" : ""}`} onClick={copyRefLink}>
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* STATS */}
        <div className="stats a2">
          {stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-bar" style={{ background: `linear-gradient(90deg, ${s.bar}, transparent)` }} />
              <div className="stat-lbl">{s.lbl}</div>
              <StatVal value={s.val} className={s.cls} />
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* TRANSACTIONS */}
        <div className="a3">
          <div className="sec-hd">transactions</div>
          <div className="tx-card">
            <div className="tx-toolbar">
              <div className="tx-toolbar-left">
                Activity
                {!txLoad && <span className="tx-count">{filteredTxs.length} shown</span>}
              </div>
              <input
                type="date"
                className="date-pick"
                value={selectedDate}
                max={todayNairobi()}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            {txLoad ? (
              <div className="skel-list">
                {[100, 75, 88, 62].map((w, i) => (
                  <div key={i} className="skel" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : filteredTxs.length === 0 ? (
              <div className="tx-empty">no transactions on {fmtDate(selectedDate)}</div>
            ) : filteredTxs.map(tx => {
              const isCompleted = tx.status?.includes("COMPLETED");
              const isFailed    = tx.status?.includes("FAILED");
              return (
                <div className="tx-row" key={tx.id}>
                  <div className="tx-ico">{micon(tx.paymentMethod)}</div>
                  <div className="tx-mid">
                    <div className="tx-method">{tx.paymentMethod ?? tx.refCode ?? "—"}</div>
                    <div className="tx-time">{fmt(tx.timestamp)}</div>
                  </div>
                  <div className="tx-right">
                    <div className="tx-comm-lbl">commission</div>
                    {isCompleted
                      ? <div className="tx-comm" style={{ color: "var(--green)" }}>+KES {tx.commission ?? "—"}</div>
                      : <div className="tx-comm" style={{ color: "var(--muted)" }}>—</div>
                    }
                    <span className={`tx-badge ${statusClass(tx.status)}`}>
                      {statusLabel(tx.status)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}