import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged, signOut, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc, onSnapshot, updateDoc,
  collection, query, where, orderBy,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, firestore, functions } from "../../firebase";

import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp,
  ChevronDown, Copy, Check, X, LogOut, Lock,
  User, Edit3, Smartphone, ShieldCheck, CircleDollarSign,
  AlertCircle, Loader2, Landmark, CreditCard, Clock,
  CalendarDays, BarChart3, Activity, Banknote, Hexagon,
  CheckCircle2, XCircle, Timer, ChevronRight, Wifi, Hourglass,
} from "lucide-react";

const REFERRAL_BASE = "https://xnxxlivepussyhub.vercel.app";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #05070d;
    --s1:       #090c15;
    --s2:       #0d1120;
    --s3:       #111729;
    --border:   #1a2035;
    --border2:  #222d45;
    --muted:    #334060;
    --subtle:   #5a6d8f;
    --text:     #e8edf8;
    --dim:      #8a9ab8;
    --green:    #00e5a0;
    --green2:   #00c88c;
    --gdim:     rgba(0,229,160,.07);
    --gbdr:     rgba(0,229,160,.18);
    --blue:     #4d9fff;
    --bdim:     rgba(77,159,255,.07);
    --bbdr:     rgba(77,159,255,.18);
    --purple:   #9d7bff;
    --pdim:     rgba(157,123,255,.07);
    --pbdr:     rgba(157,123,255,.18);
    --amber:    #ffb547;
    --adim:     rgba(255,181,71,.07);
    --abdr:     rgba(255,181,71,.18);
    --red:      #ff5471;
    --rdim:     rgba(255,84,113,.07);
    --rbdr:     rgba(255,84,113,.18);
    --teal:     #22d3ee;
    --tdim:     rgba(34,211,238,.07);
    --tbdr:     rgba(34,211,238,.18);
  }

  html, body, #root {
    min-height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Cabinet Grotesk', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  .mono { font-family: 'JetBrains Mono', monospace; }

  /* GRID BG */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .app::before {
    content: '';
    position: fixed; inset: 0;
    background-image: radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0);
    background-size: 32px 32px;
    opacity: .35;
    pointer-events: none; z-index: 0;
  }
  .app::after {
    content: '';
    position: fixed; top: -30%; left: 30%;
    width: 60vw; height: 60vh;
    background: radial-gradient(ellipse, rgba(77,159,255,.06) 0%, transparent 65%);
    pointer-events: none; z-index: 0;
  }

  /* NAV */
  nav {
    position: sticky; top: 0; z-index: 30;
    height: 58px;
    background: rgba(5,7,13,.88);
    backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border);
    padding: 0 20px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-l { display: flex; align-items: center; gap: 10px; }
  .nav-logo {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--purple) 100%);
    display: grid; place-items: center;
    box-shadow: 0 0 20px rgba(77,159,255,.3);
  }
  .nav-brand { font-size: .95rem; font-weight: 800; letter-spacing: .03em; }
  .nav-brand em { font-style: normal; color: var(--blue); }
  .nav-r { display: flex; align-items: center; gap: 8px; }
  .nav-av {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    border: 2px solid var(--border2);
    cursor: pointer; outline: none;
    display: grid; place-items: center;
    font-size: .7rem; font-weight: 800; color: #fff;
    font-family: 'Cabinet Grotesk', sans-serif;
    transition: box-shadow .2s, transform .15s;
  }
  .nav-av:hover {
    box-shadow: 0 0 0 4px var(--bdim), 0 0 20px rgba(77,159,255,.3);
    transform: scale(1.06);
  }

  /* PAGE */
  .page {
    flex: 1; position: relative; z-index: 1;
    padding: 28px 18px 80px;
    max-width: 660px; margin: 0 auto; width: 100%;
    display: flex; flex-direction: column; gap: 24px;
  }

  /* ANIMATIONS */
  .a1 { animation: rise .55s .03s both cubic-bezier(.16,1,.3,1); }
  .a2 { animation: rise .55s .1s  both cubic-bezier(.16,1,.3,1); }
  .a3 { animation: rise .55s .17s both cubic-bezier(.16,1,.3,1); }
  .a4 { animation: rise .55s .24s both cubic-bezier(.16,1,.3,1); }
  .a5 { animation: rise .55s .31s both cubic-bezier(.16,1,.3,1); }
  @keyframes rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* SECTION LABEL */
  .sec-label {
    display: flex; align-items: center; gap: 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .15em;
    color: var(--muted); text-transform: uppercase;
    margin-bottom: 10px;
  }
  .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* CARD BASE */
  .card {
    background: var(--s1);
    border: 1px solid var(--border);
    border-radius: 18px;
    position: relative; overflow: hidden;
    box-shadow: 0 1px 0 rgba(255,255,255,.03) inset;
  }
  .card-shine {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    pointer-events: none;
  }

  /* ── HERO ── */
  .hero { padding: 22px 22px 20px; }
  .hero-shine { background: linear-gradient(90deg, transparent, var(--blue) 40%, var(--purple) 70%, transparent); opacity: .4; }
  .hero-glow-blob {
    position: absolute; top: -60px; right: -60px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(77,159,255,.09) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .hero-name { font-size: 1.75rem; font-weight: 900; letter-spacing: -.04em; line-height: 1.1; }
  .hero-name em { font-style: normal; color: var(--blue); }
  .hero-chips { display: flex; gap: 6px; margin-top: 12px; flex-wrap: wrap; }
  .chip {
    display: flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 99px;
    font-family: 'JetBrains Mono', monospace;
    font-size: .63rem; border: 1px solid;
  }
  .chip-blue   { color: var(--blue);   background: var(--bdim); border-color: var(--bbdr); }
  .chip-purple { color: var(--purple); background: var(--pdim); border-color: var(--pbdr); }
  .hero-date-box { text-align: right; flex-shrink: 0; }
  .hero-date-lbl { font-family: 'JetBrains Mono', monospace; font-size: .6rem; color: var(--muted); margin-bottom: 4px; }
  .hero-date-val { font-family: 'JetBrains Mono', monospace; font-size: .75rem; color: var(--dim); }

  .hero-divider { height: 1px; background: var(--border); margin: 18px 0; }

  .ref-row {
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 12px; padding: 10px 14px;
  }
  .ref-url {
    font-family: 'JetBrains Mono', monospace; font-size: .72rem;
    color: var(--subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    flex: 1;
  }
  .ref-url em { font-style: normal; color: var(--blue); }
  .btn-copy {
    flex-shrink: 0; display: flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 8px;
    background: var(--bdim); color: var(--blue);
    border: 1px solid var(--bbdr);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .78rem; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    transition: background .15s, transform .12s;
  }
  .btn-copy:hover { transform: translateY(-1px); background: rgba(77,159,255,.12); }
  .btn-copy.copied { background: var(--gdim); color: var(--green); border-color: var(--gbdr); }

  /* ── PENDING WITHDRAWAL BANNER ── */
  .pending-wd-banner {
    display: flex; align-items: flex-start; gap: 12px;
    background: var(--adim); border: 1px solid var(--abdr);
    border-radius: 12px; padding: 12px 14px;
    margin-top: 14px;
    animation: rise .4s cubic-bezier(.16,1,.3,1) both;
  }
  .pending-wd-banner-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    background: rgba(255,181,71,.12); border: 1px solid var(--abdr);
    display: grid; place-items: center; color: var(--amber);
  }
  .pending-wd-banner-body { flex: 1; min-width: 0; }
  .pending-wd-banner-title {
    font-size: .84rem; font-weight: 700; color: var(--amber);
    margin-bottom: 3px;
  }
  .pending-wd-banner-detail {
    font-family: 'JetBrains Mono', monospace; font-size: .62rem; color: var(--subtle);
    line-height: 1.6;
  }
  .pending-wd-banner-detail em { font-style: normal; color: var(--amber); }

  /* ── WALLET + TX LINKED ── */
  .wallet-tx-block {
    display: flex; flex-direction: column;
    border: 1px solid var(--border); border-radius: 20px;
    overflow: hidden;
    background: var(--s1);
    box-shadow: 0 1px 0 rgba(255,255,255,.03) inset;
    position: relative;
  }
  .wallet-tx-block-shine {
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--green) 40%, var(--teal) 70%, transparent);
    opacity: .5; pointer-events: none; z-index: 1;
  }

  /* WALLET SECTION inside block */
  .wallet-inner { padding: 20px 20px 18px; }
  .wallet-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .wallet-left { display: flex; flex-direction: column; gap: 4px; }
  .wallet-eyebrow {
    display: flex; align-items: center; gap: 6px;
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    letter-spacing: .12em; color: var(--muted); text-transform: uppercase;
  }
  .wallet-balance {
    font-size: 2.4rem; font-weight: 900; letter-spacing: -.05em; line-height: 1;
    color: var(--green);
  }
  .wallet-balance-currency {
    font-size: .95rem; font-weight: 600; opacity: .5; margin-right: 2px;
  }
  .wallet-updated {
    font-family: 'JetBrains Mono', monospace; font-size: .58rem; color: var(--muted);
    margin-top: 2px;
  }
  .wallet-right { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
  .wallet-icon-circle {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--gdim); border: 1px solid var(--gbdr);
    display: grid; place-items: center; color: var(--green);
  }
  .btn-withdraw {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px;
    background: var(--green); color: #051a0f;
    border: none;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .82rem; font-weight: 800;
    cursor: pointer; white-space: nowrap;
    transition: opacity .15s, transform .12s, box-shadow .15s;
    box-shadow: 0 4px 18px rgba(0,229,160,.25);
  }
  .btn-withdraw:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
  .btn-withdraw:disabled { opacity: .3; cursor: not-allowed; transform: none; box-shadow: none; }

  /* pending state for withdraw button */
  .btn-withdraw-pending {
    display: flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 10px;
    background: var(--adim); color: var(--amber);
    border: 1px solid var(--abdr);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .82rem; font-weight: 800;
    cursor: not-allowed; white-space: nowrap;
    opacity: .85;
  }

  .wallet-metrics {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    margin-top: 16px; gap: 8px;
  }
  .wm-item {
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 12px; padding: 10px 12px;
    display: flex; flex-direction: column; gap: 5px;
  }
  .wm-label {
    display: flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace; font-size: .57rem;
    letter-spacing: .08em; color: var(--muted); text-transform: uppercase;
  }
  .wm-value { font-family: 'JetBrains Mono', monospace; font-size: .84rem; font-weight: 500; }

  /* TX SECTION inside block */
  .tx-divider-line { height: 1px; background: var(--border); }

  .tx-toolbar {
    padding: 12px 20px;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .tx-toolbar-l {
    display: flex; align-items: center; gap: 8px;
    font-size: .84rem; font-weight: 700; color: var(--dim);
  }
  .tx-count-pill {
    font-family: 'JetBrains Mono', monospace; font-size: .63rem;
    color: var(--blue); background: var(--bdim); border: 1px solid var(--bbdr);
    border-radius: 6px; padding: 2px 8px;
  }
  .date-pick {
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 8px; padding: 5px 10px;
    font-family: 'JetBrains Mono', monospace; font-size: .7rem; color: var(--dim);
    outline: none; color-scheme: dark; cursor: pointer;
    transition: border-color .15s;
  }
  .date-pick:focus { border-color: var(--blue); }

  .tx-list { display: flex; flex-direction: column; }

  .tx-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 13px 20px;
    border-top: 1px solid var(--border);
    transition: background .1s;
    cursor: default;
  }
  .tx-row:hover { background: rgba(255,255,255,.015); }

  .tx-icon-wrap {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--s2); border: 1px solid var(--border);
    display: grid; place-items: center; flex-shrink: 0;
    color: var(--subtle); margin-top: 1px;
  }
  .tx-body { flex: 1; min-width: 0; }
  .tx-method {
    font-size: .9rem; font-weight: 700;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 3px;
  }
  .tx-time {
    font-family: 'JetBrains Mono', monospace; font-size: .65rem; color: var(--muted);
  }
  .tx-pills {
    display: flex; align-items: center; gap: 5px; margin-top: 6px; flex-wrap: wrap;
  }
  .pill {
    display: flex; align-items: center; gap: 4px;
    font-family: 'JetBrains Mono', monospace; font-size: .57rem;
    letter-spacing: .04em; padding: 2px 7px; border-radius: 5px; border: 1px solid;
  }
  .pill-green  { color: var(--green);  background: var(--gdim); border-color: var(--gbdr); }
  .pill-red    { color: var(--red);    background: var(--rdim); border-color: var(--rbdr); }
  .pill-amber  { color: var(--amber);  background: var(--adim); border-color: var(--abdr); }
  .pill-blue   { color: var(--blue);   background: var(--bdim); border-color: var(--bbdr); }
  .pill-muted  { color: var(--muted);  background: transparent; border-color: var(--border); }

  .tx-right { text-align: right; flex-shrink: 0; min-width: 88px; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
  .tx-comm-label { font-family: 'JetBrains Mono', monospace; font-size: .58rem; color: var(--muted); }
  .tx-comm-val { font-family: 'JetBrains Mono', monospace; font-size: .9rem; }
  .tx-comm-val.earned { color: var(--green); }
  .tx-comm-val.nil    { color: var(--muted); }
  .tx-bal-trail {
    font-family: 'JetBrains Mono', monospace; font-size: .58rem; color: var(--muted);
    display: flex; align-items: center; gap: 3px;
  }
  .tx-bal-trail span { color: var(--subtle); }

  .tx-empty {
    padding: 44px 20px; text-align: center;
    font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: var(--muted);
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }

  .skel-list { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
  .skel {
    height: 11px; border-radius: 6px;
    background: linear-gradient(90deg, var(--border) 0%, var(--s2) 50%, var(--border) 100%);
    background-size: 200% 100%;
    animation: shim 1.4s ease infinite;
  }
  @keyframes shim { to { background-position: -200% 0; } }

  /* ── STATS GRID ── */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .stat-card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 16px; padding: 14px 16px 13px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .15s;
    cursor: default;
    box-shadow: 0 1px 0 rgba(255,255,255,.02) inset;
  }
  .stat-card:hover { border-color: var(--border2); transform: translateY(-2px); }
  .stat-accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-label {
    display: flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace; font-size: .58rem;
    letter-spacing: .09em; color: var(--muted); text-transform: uppercase;
    margin-bottom: 8px;
  }
  .stat-value {
    font-size: 1.5rem; font-weight: 900; letter-spacing: -.04em; line-height: 1;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .stat-value.sm { font-size: 1.15rem; }
  .stat-sub {
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    color: var(--muted); margin-top: 5px;
  }
  .c-green  { color: var(--green); }
  .c-blue   { color: var(--blue); }
  .c-amber  { color: var(--amber); }
  .c-red    { color: var(--red); }
  .c-purple { color: var(--purple); }
  .c-teal   { color: var(--teal); }

  /* ── MODAL ── */
  @keyframes fdin { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn {
    from { opacity: 0; transform: scale(.94) translateY(18px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes shimmerSlide {
    from { background-position: 200% center; }
    to   { background-position: -200% center; }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1); opacity: .6; }
    100% { transform: scale(1.55); opacity: 0; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes progressFill {
    from { width: 0%; }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 80; }
    to   { stroke-dashoffset: 0; }
  }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(2,4,10,.92);
    backdrop-filter: blur(20px) saturate(160%);
    display: grid; place-items: center; padding: 16px;
    animation: fdin .2s ease both;
  }

  .wd-modal {
    width: 100%; max-width: 440px;
    background: var(--s1);
    border: 1px solid var(--border2);
    border-radius: 24px; overflow: hidden;
    box-shadow:
      0 40px 100px rgba(0,0,0,.75),
      0 0 0 1px rgba(255,255,255,.05),
      0 0 60px rgba(0,229,160,.04);
    animation: popIn .35s cubic-bezier(.16,1,.3,1) both;
    position: relative;
  }

  /* hero gradient banner */
  .wd-hero {
    position: relative;
    background: linear-gradient(160deg, #071a12 0%, #090c15 55%, #0b0e1d 100%);
    padding: 22px 22px 20px;
    overflow: hidden;
  }
  .wd-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 80% 0%, rgba(0,229,160,.12) 0%, transparent 65%);
    pointer-events: none;
  }
  .wd-hero-top {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 16px;
  }
  .wd-hero-label-row {
    display: flex; align-items: center; gap: 8px;
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    letter-spacing: .14em; color: rgba(0,229,160,.5); text-transform: uppercase;
  }
  .wd-hero-label-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: pulseRing 1.8s ease-out infinite;
    position: relative;
  }
  .wd-hero-label-dot::after {
    content: '';
    position: absolute; inset: -3px; border-radius: 50%;
    border: 1px solid var(--green);
    animation: pulseRing 1.8s ease-out infinite;
  }
  .wd-close {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.08);
    color: var(--subtle); cursor: pointer;
    display: grid; place-items: center;
    transition: background .15s, color .15s;
    flex-shrink: 0;
  }
  .wd-close:hover { background: rgba(255,255,255,.1); color: var(--text); }

  .wd-balance-display {
    display: flex; flex-direction: column; gap: 4px;
  }
  .wd-balance-currency {
    font-family: 'JetBrains Mono', monospace;
    font-size: .7rem; color: rgba(0,229,160,.5);
    letter-spacing: .08em;
  }
  .wd-balance-num {
    font-size: 2.6rem; font-weight: 900; letter-spacing: -.05em; line-height: 1;
    color: var(--green);
    text-shadow: 0 0 40px rgba(0,229,160,.25);
  }
  .wd-balance-sub {
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    color: rgba(0,229,160,.35); margin-top: 2px;
  }

  /* destination chip */
  .wd-dest-chip {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 7px 12px; border-radius: 10px;
    background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.09);
    margin-top: 14px;
  }
  .wd-dest-chip-icon {
    width: 26px; height: 26px; border-radius: 7px;
    background: var(--gdim); border: 1px solid var(--gbdr);
    display: grid; place-items: center; color: var(--green); flex-shrink: 0;
  }
  .wd-dest-chip-info { display: flex; flex-direction: column; gap: 1px; }
  .wd-dest-chip-label { font-family: 'JetBrains Mono', monospace; font-size: .55rem; letter-spacing: .1em; color: var(--muted); text-transform: uppercase; }
  .wd-dest-chip-val { font-size: .84rem; font-weight: 700; }
  .wd-dest-chip-val.no-phone { color: var(--red); font-size: .78rem; }

  /* body */
  .wd-body { padding: 18px 22px; display: flex; flex-direction: column; gap: 16px; }

  /* amount section */
  .wd-amount-section { display: flex; flex-direction: column; gap: 8px; }
  .wd-amount-header {
    display: flex; align-items: center; justify-content: space-between;
  }
  .wd-amount-lbl {
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    letter-spacing: .12em; color: var(--muted); text-transform: uppercase;
  }
  .wd-avail-lbl {
    font-family: 'JetBrains Mono', monospace; font-size: .6rem; color: var(--green);
  }

  /* big amount input */
  .wd-amount-input-wrap {
    display: flex; align-items: center; gap: 0;
    background: var(--bg);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    transition: border-color .15s, box-shadow .15s;
    overflow: hidden;
  }
  .wd-amount-input-wrap:focus-within {
    border-color: var(--green);
    box-shadow: 0 0 0 3px rgba(0,229,160,.1);
  }
  .wd-amount-input-wrap.wrap-error {
    border-color: var(--red);
    box-shadow: 0 0 0 3px rgba(255,84,113,.09);
  }
  .wd-cur-label {
    padding: 0 14px 0 16px;
    font-family: 'JetBrains Mono', monospace; font-size: .8rem;
    color: var(--subtle); flex-shrink: 0; white-space: nowrap;
    border-right: 1px solid var(--border);
    height: 52px; display: flex; align-items: center;
  }
  .wd-num-input {
    flex: 1; background: transparent; border: none; outline: none;
    font-family: 'JetBrains Mono', monospace; font-size: 1.35rem; font-weight: 500;
    color: var(--text); padding: 0 14px;
    height: 52px;
  }
  .wd-num-input::placeholder { color: var(--muted); }
  .wd-max-btn {
    padding: 0 14px; height: 52px;
    font-family: 'JetBrains Mono', monospace; font-size: .62rem;
    color: var(--subtle); background: var(--s2);
    border: none; border-left: 1px solid var(--border);
    cursor: pointer; white-space: nowrap; flex-shrink: 0;
    transition: color .15s, background .15s;
  }
  .wd-max-btn:hover { color: var(--green); background: var(--gdim); }

  .wd-field-msg {
    font-family: 'JetBrains Mono', monospace; font-size: .63rem;
    display: flex; align-items: center; gap: 5px;
  }
  .wd-field-msg.err { color: var(--red); }
  .wd-field-msg.hint { color: var(--muted); }

  /* quick presets */
  .wd-presets { display: flex; gap: 6px; flex-wrap: wrap; }
  .wd-preset {
    padding: 5px 12px; border-radius: 8px;
    background: var(--s2); border: 1px solid var(--border2);
    font-family: 'JetBrains Mono', monospace; font-size: .68rem; color: var(--subtle);
    cursor: pointer; transition: all .12s;
    white-space: nowrap;
  }
  .wd-preset:hover { border-color: var(--gbdr); color: var(--green); background: var(--gdim); }
  .wd-preset.active { border-color: var(--green); color: var(--green); background: var(--gdim); }

  /* balance bar */
  .wd-balance-bar-wrap {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px;
  }
  .wd-bar-labels { display: flex; justify-content: space-between; align-items: center; }
  .wd-bar-lbl { font-family: 'JetBrains Mono', monospace; font-size: .6rem; color: var(--muted); }
  .wd-bar-val { font-family: 'JetBrains Mono', monospace; font-size: .72rem; }
  .wd-bar-track {
    height: 6px; background: var(--border); border-radius: 99px; overflow: hidden;
  }
  .wd-bar-fill {
    height: 100%; border-radius: 99px;
    background: linear-gradient(90deg, var(--green), var(--teal));
    transition: width .3s cubic-bezier(.16,1,.3,1);
    box-shadow: 0 0 8px rgba(0,229,160,.4);
  }
  .wd-bar-fill.over { background: linear-gradient(90deg, var(--red), #ff8a5a); box-shadow: 0 0 8px rgba(255,84,113,.4); }
  .wd-bar-remainder { display: flex; justify-content: space-between; align-items: center; }
  .wd-bar-rem-lbl { font-family: 'JetBrains Mono', monospace; font-size: .58rem; color: var(--muted); }
  .wd-bar-rem-val { font-family: 'JetBrains Mono', monospace; font-size: .7rem; }

  /* footer */
  .wd-foot { padding: 0 22px 20px; display: flex; flex-direction: column; gap: 8px; }

  .btn-wd-submit {
    width: 100%; padding: 14px; border: none; border-radius: 14px;
    background: var(--green); color: #041209;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .95rem; font-weight: 900;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .15s, transform .12s, box-shadow .15s;
    box-shadow: 0 6px 28px rgba(0,229,160,.3);
    position: relative; overflow: hidden;
  }
  .btn-wd-submit::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,.18) 50%, transparent 100%);
    background-size: 200% 100%;
    opacity: 0; transition: opacity .2s;
  }
  .btn-wd-submit:hover:not(:disabled)::after { opacity: 1; animation: shimmerSlide 1s ease; }
  .btn-wd-submit:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,229,160,.38); }
  .btn-wd-submit:disabled { opacity: .3; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-wd-submit:active:not(:disabled) { transform: scale(.98); }

  .btn-wd-cancel {
    width: 100%; padding: 12px; border: 1px solid var(--border2); border-radius: 14px;
    background: transparent; color: var(--muted);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .88rem; font-weight: 700;
    cursor: pointer; transition: color .15s, border-color .15s;
  }
  .btn-wd-cancel:hover { color: var(--subtle); border-color: var(--border2); }

  /* result screens */
  .wd-result {
    padding: 36px 24px 28px;
    display: flex; flex-direction: column; align-items: center; gap: 0; text-align: center;
  }
  .wd-result-icon-wrap {
    position: relative; width: 72px; height: 72px;
    display: grid; place-items: center; margin-bottom: 20px;
  }
  .wd-result-ring {
    position: absolute; inset: 0; border-radius: 50%;
    border: 2px solid; opacity: .25;
  }
  .wd-result-ring.success { border-color: var(--green); }
  .wd-result-ring.failure { border-color: var(--red); }
  .wd-result-icon-bg {
    width: 56px; height: 56px; border-radius: 50%;
    display: grid; place-items: center;
  }
  .wd-result-icon-bg.success {
    background: var(--gdim); border: 1px solid var(--gbdr);
    color: var(--green);
    box-shadow: 0 0 30px rgba(0,229,160,.15);
  }
  .wd-result-icon-bg.failure {
    background: var(--rdim); border: 1px solid var(--rbdr);
    color: var(--red);
  }
  .wd-result-title {
    font-size: 1.25rem; font-weight: 900; letter-spacing: -.03em;
    margin-bottom: 8px;
  }
  .wd-result-amount {
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.6rem; font-weight: 500; color: var(--green);
    letter-spacing: -.02em; margin-bottom: 10px;
    animation: countUp .4s .1s cubic-bezier(.16,1,.3,1) both;
  }
  .wd-result-msg {
    font-family: 'JetBrains Mono', monospace; font-size: .68rem;
    color: var(--muted); line-height: 1.75; max-width: 290px;
    margin-bottom: 22px;
  }
  .wd-result-dest {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 10px;
    background: var(--s2); border: 1px solid var(--border);
    font-family: 'JetBrains Mono', monospace; font-size: .72rem; color: var(--subtle);
    margin-bottom: 20px;
  }
  .wd-result-btns { display: flex; gap: 8px; width: 100%; }

  /* ── DRAWER ── */
  .overlay-backdrop { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,.75); backdrop-filter: blur(12px); animation: fdin .18s ease both; }
  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: min(360px,94vw); z-index: 51;
    background: var(--s1); border-left: 1px solid var(--border);
    display: flex; flex-direction: column;
    animation: slideIn .3s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0); opacity: 1; }
  }
  .dr-head { padding: 15px 18px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .dr-title { font-family: 'JetBrains Mono', monospace; font-size: .65rem; letter-spacing: .14em; color: var(--subtle); }
  .dr-close-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: var(--s2); border: 1px solid var(--border);
    color: var(--muted); cursor: pointer; display: grid; place-items: center;
    transition: color .15s;
  }
  .dr-close-btn:hover { color: var(--text); }

  .dr-body { flex: 1; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 6px; }

  .dr-profile-strip {
    display: flex; align-items: center; gap: 12px;
    padding: 14px 15px; background: var(--s2); border: 1px solid var(--border);
    border-radius: 14px; margin-bottom: 6px;
  }
  .dr-avatar {
    width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--blue), var(--purple));
    display: grid; place-items: center; font-size: .95rem; font-weight: 800; color: #fff;
    font-family: 'Cabinet Grotesk', sans-serif;
    box-shadow: 0 0 0 4px var(--bdim);
  }
  .dr-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
  .dr-name { font-size: .95rem; font-weight: 800; letter-spacing: -.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dr-email { font-family: 'JetBrains Mono', monospace; font-size: .62rem; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dr-role-chip {
    display: inline-block; margin-top: 3px;
    font-family: 'JetBrains Mono', monospace; font-size: .56rem; padding: 2px 8px;
    border-radius: 99px; background: var(--bdim); color: var(--blue); border: 1px solid var(--bbdr);
    width: fit-content;
  }

  .acc-item { border: 1px solid var(--border); border-radius: 13px; overflow: hidden; background: var(--s2); }
  .acc-trigger {
    width: 100%; background: none; border: none; color: var(--text);
    display: flex; align-items: center; gap: 10px; padding: 12px 14px;
    cursor: pointer; text-align: left; transition: background .1s;
  }
  .acc-trigger:hover { background: rgba(255,255,255,.025); }
  .acc-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--bg); border: 1px solid var(--border);
    display: grid; place-items: center; flex-shrink: 0;
    color: var(--subtle);
  }
  .acc-meta { flex: 1; }
  .acc-title { font-size: .84rem; font-weight: 700; }
  .acc-sub   { font-family: 'JetBrains Mono', monospace; font-size: .6rem; color: var(--muted); margin-top: 1px; }
  .acc-chevron { flex-shrink: 0; color: var(--muted); transition: transform .2s; }
  .acc-chevron.open { transform: rotate(180deg); }
  .acc-content { padding: 14px; border-top: 1px solid var(--border); animation: accIn .2s cubic-bezier(.16,1,.3,1) both; }
  @keyframes accIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

  .info-table { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .info-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 13px; border-bottom: 1px solid var(--border); }
  .info-row:last-child { border-bottom: none; }
  .info-k { font-size: .8rem; color: var(--subtle); }
  .info-v { font-family: 'JetBrains Mono', monospace; font-size: .7rem; color: var(--subtle); text-align: right; max-width: 58%; word-break: break-all; }

  .form-stack { display: flex; flex-direction: column; gap: 10px; }
  .form-label { display: block; font-family: 'JetBrains Mono', monospace; font-size: .6rem; letter-spacing: .1em; color: var(--muted); margin-bottom: 4px; text-transform: uppercase; }
  .form-input {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; padding: 9px 12px;
    font-family: 'JetBrains Mono', monospace; font-size: .8rem; color: var(--text);
    outline: none; transition: border-color .15s, box-shadow .15s;
  }
  .form-input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(77,159,255,.1); }

  .btn-primary {
    width: 100%; padding: 10px; border: none; border-radius: 9px;
    background: var(--blue); color: #fff;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .84rem; font-weight: 800;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: opacity .15s, transform .12s;
    box-shadow: 0 4px 18px rgba(77,159,255,.22);
  }
  .btn-primary:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  .btn-secondary {
    width: 100%; padding: 10px; border: 1px solid var(--border2); border-radius: 9px;
    background: var(--s1); color: var(--subtle);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .84rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transition: opacity .15s;
  }
  .btn-secondary:hover:not(:disabled) { opacity: .8; }
  .btn-secondary:disabled { opacity: .4; cursor: not-allowed; }

  .btn-destructive {
    width: 100%; padding: 10px; border: 1px solid var(--rbdr); border-radius: 9px;
    background: var(--rdim); color: var(--red);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: .84rem; font-weight: 700;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity .15s;
  }
  .btn-destructive:hover { opacity: .8; }

  .feedback {
    padding: 9px 12px; border-radius: 9px;
    font-family: 'JetBrains Mono', monospace; font-size: .68rem; line-height: 1.5;
    display: flex; align-items: flex-start; gap: 7px;
    animation: fdin .18s ease both;
  }
  .feedback-ok  { background: var(--gdim); border: 1px solid var(--gbdr); color: var(--green); }
  .feedback-err { background: var(--rdim); border: 1px solid var(--rbdr); color: var(--red); }

  .nav-live {
    display: flex; align-items: center; gap: 5px;
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    letter-spacing: .1em; color: var(--muted);
  }
  .nav-live-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 5px var(--green);
    animation: livePulse 2.4s ease-in-out infinite;
  }
  @keyframes livePulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .35; }
  }

  @keyframes flashGreen {
    0%   { color: var(--green); }
    100% { color: inherit; }
  }
  .flash { animation: flashGreen .6s ease both; }
  .splash { min-height: 100vh; display: grid; place-items: center; }
  .splash-inner { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .splash-txt { font-family: 'JetBrains Mono', monospace; font-size: .7rem; color: var(--muted); letter-spacing: .1em; }

  @media(min-width: 580px) {
    nav { padding: 0 26px; }
    .page { padding: 32px 26px 80px; }
    .drawer { width: 375px; }
  }
`;

/* ── UTILS ── */
const fmt = (ts) => {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-KE", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};
const fmtDate = (s) => s ? new Date(s).toLocaleDateString("en-KE", { month: "short", day: "numeric" }) : "—";

const PAY_ICON = { mpesa: Smartphone, cash: Banknote, card: CreditCard, bank: Landmark };
const PayIcon = ({ method, ...props }) => {
  const Icon = PAY_ICON[(method || "").toLowerCase()] ?? CreditCard;
  return <Icon {...props} />;
};

const initials = (n) => (n || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
const todayNairobi = () => new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

const dayBounds = (dateStr) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - 3 * 3600 * 1000);
  return [start, new Date(start.getTime() + 24 * 3600 * 1000)];
};

const statusInfo = (s = "") => {
  if (s === "APPROVED" || s.includes("COMPLETED")) return { cls: "pill-green", icon: CheckCircle2, label: s === "APPROVED" ? "APPROVED" : "DONE" };
  if (s === "FAILED"   || s.includes("FAILED"))    return { cls: "pill-red",   icon: XCircle,      label: "FAILED" };
  if (s === "PENDING")                             return { cls: "pill-amber",  icon: Timer,        label: "PENDING" };
  return                                                  { cls: "pill-muted",  icon: Timer,        label: s || "—" };
};

const typeInfo = (t = "") => {
  if (t === "CREDIT")     return { cls: "pill-green",  label: "CREDIT" };
  if (t === "DEBIT")      return { cls: "pill-red",    label: "DEBIT" };
  if (t === "WITHDRAWAL") return { cls: "pill-amber",  label: "WITHDRAWAL" };
  return                         { cls: "pill-muted",  label: t || "—" };
};

const compact = (n) => {
  const num = Number(n);
  if (isNaN(num)) return "—";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000)     return (num / 1_000).toFixed(1) + "K";
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
};

const kes = (n) => {
  const num = Number(n ?? 0);
  return isNaN(num) ? "—" : `KES ${num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const isToday = (dateVal) => {
  if (!dateVal) return false;
  try {
    const d = dateVal?.toDate ? dateVal.toDate() : new Date(dateVal);
    return d.toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" }) === todayNairobi();
  } catch { return false; }
};

const isThisWeek = (weekStr) => {
  if (!weekStr) return false;
  const d = new Date();
  const day = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((day - yearStart) / 86400000) + 1) / 7);
  return weekStr === `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

const isThisMonth = (monthStr) => monthStr === todayNairobi().substring(0, 7);

/* ── ACCORDION ── */
function AccSection({ id, openId, onToggle, icon: Icon, title, sub, children }) {
  const open = openId === id;
  return (
    <div className="acc-item">
      <button className="acc-trigger" onClick={() => onToggle(id)}>
        <div className="acc-icon"><Icon size={15} /></div>
        <div className="acc-meta">
          <div className="acc-title">{title}</div>
          <div className="acc-sub">{sub}</div>
        </div>
        <ChevronDown size={15} className={`acc-chevron${open ? " open" : ""}`} />
      </button>
      {open && <div className="acc-content">{children}</div>}
    </div>
  );
}

/* ── SPINNER ── */
const Spin = ({ size = 16, style = {} }) => (
  <Loader2 size={size} style={{ animation: "rot .65s linear infinite", ...style }} />
);

/* ── WITHDRAW MODAL ── */
const MIN_WITHDRAWAL = 100;

function WithdrawModal({ availableBalance, phoneNumber, onClose, onSuccess }) {
  const [amount,  setAmount]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [step,    setStep]    = useState("form");
  const [errMsg,  setErrMsg]  = useState("");

  const numAmount  = parseFloat(amount) || 0;
  const remaining  = availableBalance - numAmount;
  const hasPhone   = !!phoneNumber;
  const pct        = availableBalance > 0 ? Math.min(100, (numAmount / availableBalance) * 100) : 0;
  const isOver     = numAmount > availableBalance;

  const presets = (() => {
    const half    = Math.floor(availableBalance / 2);
    const quarter = Math.floor(availableBalance / 4);
    const opts = [500, 1000, 2000, 5000].filter(v => v <= availableBalance && v >= MIN_WITHDRAWAL);
    if (!opts.includes(half) && half >= MIN_WITHDRAWAL && half !== availableBalance) opts.push(half);
    return [...new Set(opts)].sort((a, b) => a - b).slice(0, 4);
  })();

  const setPreset = (v) => { setAmount(v.toString()); setError(""); };

  const validate = () => {
    if (!amount || isNaN(numAmount))   return "Please enter an amount.";
    if (numAmount < MIN_WITHDRAWAL)    return `Minimum withdrawal is KES ${MIN_WITHDRAWAL}.`;
    if (numAmount > availableBalance)  return "Amount exceeds your available balance.";
    return "";
  };

  const handleSubmit = async () => {
    const ve = validate();
    if (ve) { setError(ve); return; }
    setLoading(true);
    try {
      const withdrawFunds = httpsCallable(functions, "withdraw");
      await withdrawFunds({ amount: numAmount });
      setStep("success");
      onSuccess?.();
    } catch (e) {
      setErrMsg(e?.message ?? "Something went wrong. Please try again.");
      setStep("error");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !loading && onClose()}>
      <div className="wd-modal">

        {/* ── SUCCESS ── */}
        {step === "success" && (
          <div className="wd-result">
            <div className="wd-result-icon-wrap">
              <div className="wd-result-ring success" />
              <div className="wd-result-icon-bg success">
                <CheckCircle2 size={26} strokeWidth={1.8} />
              </div>
            </div>
            <div className="wd-result-title">Request Submitted</div>
            <div className="wd-result-amount">{kes(numAmount)}</div>
            {/* ── UPDATED SUCCESS MESSAGE ── */}
            <div className="wd-result-msg">
              Your withdrawal request has been sent for admin approval.
              You will receive the funds on M-Pesa once the request is approved.
            </div>
            {phoneNumber && (
              <div className="wd-result-dest">
                <Smartphone size={13} color="var(--green)" />
                {phoneNumber}
              </div>
            )}
            <div className="wd-result-btns">
              <button className="btn-wd-submit" onClick={onClose}>Done</button>
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {step === "error" && (
          <div className="wd-result">
            <div className="wd-result-icon-wrap">
              <div className="wd-result-ring failure" />
              <div className="wd-result-icon-bg failure">
                <XCircle size={26} strokeWidth={1.8} />
              </div>
            </div>
            <div className="wd-result-title">Request Failed</div>
            <div className="wd-result-msg">{errMsg}</div>
            <div className="wd-result-btns">
              <button className="btn-wd-cancel" style={{ flex: 1 }} onClick={onClose}>Close</button>
              <button className="btn-wd-submit" style={{ flex: 2 }} onClick={() => setStep("form")}>
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        {step === "form" && (
          <>
            <div className="wd-hero">
              <div className="wd-hero-top">
                <div className="wd-hero-label-row">
                  <div className="wd-hero-label-dot" />
                  Withdraw Funds
                </div>
                <button className="wd-close" onClick={onClose} disabled={loading}>
                  <X size={13} />
                </button>
              </div>

              <div className="wd-balance-display">
                <div className="wd-balance-currency">Available balance · KES</div>
                <div className="wd-balance-num">
                  {availableBalance.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="wd-balance-sub">Min. withdrawal KES {MIN_WITHDRAWAL}</div>
              </div>

              <div className="wd-dest-chip">
                <div className="wd-dest-chip-icon">
                  <Smartphone size={13} />
                </div>
                <div className="wd-dest-chip-info">
                  <span className="wd-dest-chip-label">Sending to M-Pesa</span>
                  <span className={`wd-dest-chip-val${!hasPhone ? " no-phone" : ""}`}>
                    {hasPhone ? phoneNumber : "No phone number — add in Profile"}
                  </span>
                </div>
              </div>
            </div>

            <div className="wd-body">
              <div className="wd-amount-section">
                <div className="wd-amount-header">
                  <span className="wd-amount-lbl">Enter Amount</span>
                  <span className="wd-avail-lbl">{kes(availableBalance)} available</span>
                </div>

                <div className={`wd-amount-input-wrap${error ? " wrap-error" : ""}`}>
                  <span className="wd-cur-label">KES</span>
                  <input
                    className="wd-num-input"
                    type="number" min={MIN_WITHDRAWAL} max={availableBalance} step="1"
                    placeholder="0"
                    value={amount}
                    onChange={e => { setAmount(e.target.value); setError(""); }}
                    disabled={loading}
                    autoFocus
                  />
                  <button
                    className="wd-max-btn"
                    onClick={() => setPreset(availableBalance)}
                    disabled={loading}
                  >
                    MAX
                  </button>
                </div>

                {error
                  ? <div className="wd-field-msg err"><AlertCircle size={11} /> {error}</div>
                  : <div className="wd-field-msg hint">Minimum: KES {MIN_WITHDRAWAL.toLocaleString()}</div>
                }
              </div>

              {presets.length > 0 && (
                <div className="wd-presets">
                  {presets.map(v => (
                    <button
                      key={v}
                      className={`wd-preset${numAmount === v ? " active" : ""}`}
                      onClick={() => setPreset(v)}
                      disabled={loading}
                    >
                      {v >= 1000 ? `${v / 1000}K` : v}
                    </button>
                  ))}
                </div>
              )}

              {numAmount > 0 && (
                <div className="wd-balance-bar-wrap">
                  <div className="wd-bar-labels">
                    <span className="wd-bar-lbl">Withdrawing</span>
                    <span className="wd-bar-val" style={{ color: isOver ? "var(--red)" : "var(--green)" }}>
                      {kes(numAmount)}
                    </span>
                  </div>
                  <div className="wd-bar-track">
                    <div
                      className={`wd-bar-fill${isOver ? " over" : ""}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="wd-bar-remainder">
                    <span className="wd-bar-rem-lbl">Remaining after</span>
                    <span className="wd-bar-rem-val" style={{ color: isOver ? "var(--red)" : "var(--subtle)" }}>
                      {isOver ? "⚠ Insufficient" : kes(remaining)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="wd-foot">
              <button
                className="btn-wd-submit"
                onClick={handleSubmit}
                disabled={loading || !hasPhone || numAmount < MIN_WITHDRAWAL || numAmount > availableBalance}
              >
                {loading
                  ? <><Spin size={15} /> Processing…</>
                  : <><ArrowUpRight size={16} /> Withdraw {numAmount >= MIN_WITHDRAWAL && !isOver ? kes(numAmount) : ""}</>
                }
              </button>
              <button className="btn-wd-cancel" onClick={onClose} disabled={loading}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
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
        name: name.trim(), phoneNumber: phone.trim(),
      });
      setMsg({ t: "ok", s: "Profile updated successfully." });
      onUpdated?.({ ...emp, name: name.trim(), phoneNumber: phone.trim() });
    } catch (e) { setMsg({ t: "err", s: e.message }); }
    finally { setSaving(false); }
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
    } finally { setPassLoad(false); }
  };

  return (
    <>
      <div className="overlay-backdrop" onClick={e => e.target === e.currentTarget && onClose()} />
      <aside className="drawer">
        <div className="dr-head">
          <span className="dr-title">PROFILE</span>
          <button className="dr-close-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="dr-body">
          <div className="dr-profile-strip">
            <div className="dr-avatar">{initials(emp?.name)}</div>
            <div className="dr-info">
              <div className="dr-name">{emp?.name ?? "—"}</div>
              <div className="dr-email">{user?.email}</div>
              <span className="dr-role-chip">{emp?.role ?? "—"}</span>
            </div>
          </div>

          <AccSection id="info" openId={openSection} onToggle={toggle}
            icon={ShieldCheck} title="Account Info" sub="Role, ref code, status">
            <div className="info-table">
              {[
                ["Role",            emp?.role],
                ["Ref Code",        emp?.refCode],
                ["Commission Rate", emp?.commisionRate != null ? `${(emp.commisionRate * 100).toFixed(0)}%` : "—"],
                ["M-Pesa Number",   emp?.phoneNumber ?? "Not set"],
                ["Status",          emp?.isActive ? "Active ✓" : "Inactive"],
                ["Joined",          fmt(emp?.createdAt)],
              ].map(([k, v]) => (
                <div className="info-row" key={k}>
                  <span className="info-k">{k}</span>
                  <span className="info-v" style={
                    k === "Status" && emp?.isActive ? { color: "var(--green)" } :
                    k === "M-Pesa Number" && !emp?.phoneNumber ? { color: "var(--red)" } : {}
                  }>{v ?? "—"}</span>
                </div>
              ))}
            </div>
          </AccSection>

          <AccSection id="edit" openId={openSection} onToggle={toggle}
            icon={Edit3} title="Edit Details" sub="Name, phone number">
            <div className="form-stack">
              <div>
                <label className="form-label">Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="form-label">M-Pesa Phone Number</label>
                <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="254..." />
              </div>
              {msg && (
                <div className={`feedback feedback-${msg.t === "ok" ? "ok" : "err"}`}>
                  {msg.t === "ok" ? <Check size={12} /> : <X size={12} />} {msg.s}
                </div>
              )}
              <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? <><Spin size={13} style={{ borderTopColor: "#fff", borderColor: "rgba(255,255,255,.3)" }} /> Saving…</> : "Save Changes"}
              </button>
            </div>
          </AccSection>

          <AccSection id="pass" openId={openSection} onToggle={toggle}
            icon={Lock} title="Change Password" sub="Update your credentials">
            <div className="form-stack">
              <div>
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="min 6 chars" />
              </div>
              {pmsg && (
                <div className={`feedback feedback-${pmsg.t === "ok" ? "ok" : "err"}`}>
                  {pmsg.t === "ok" ? <Check size={12} /> : <X size={12} />} {pmsg.s}
                </div>
              )}
              <button className="btn-secondary" onClick={changePass} disabled={passLoad}>
                {passLoad ? <><Spin size={13} /> Updating…</> : "Update Password"}
              </button>
            </div>
          </AccSection>

          <AccSection id="session" openId={openSection} onToggle={toggle}
            icon={LogOut} title="Session" sub="Sign out of this device">
            <button className="btn-destructive" onClick={onLogout}>
              <LogOut size={14} /> Sign out
            </button>
          </AccSection>

          <div style={{ height: 8 }} />
        </div>
      </aside>
    </>
  );
}

/* ── STAT CARD ── */
function StatCard({ label, value, sub, colorClass, accentColor, icon: Icon, small }) {
  const num = Number(value);
  const display = compact(value);
  const full = !isNaN(num) ? num.toLocaleString("en-KE") : String(value);
  return (
    <div className="stat-card">
      <div className="stat-accent-bar" style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }} />
      <div className="stat-label">
        {Icon && <Icon size={11} />}
        {label}
      </div>
      <div className={`stat-value${small ? " sm" : ""} ${colorClass}`} title={full}>{display}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
}

/* ── WALLET + TX LINKED BLOCK ── */
function WalletTxBlock({ wallet, txs, txLoad, selectedDate, onDateChange, onWithdraw, pendingWithdrawal }) {
  const balance = wallet?.availableBalance ?? 0;
  const earned  = wallet?.totalEarned      ?? 0;
  const failed  = wallet?.totalFailed      ?? 0;
  const pending = wallet?.totalPending     ?? 0;
  const canWithdraw = balance >= MIN_WITHDRAWAL && !pendingWithdrawal;

  const filteredTxs = (() => {
    const [start, end] = dayBounds(selectedDate);
    return txs.filter(tx => {
      if (!tx.timestamp) return false;
      const d = tx.timestamp.toDate ? tx.timestamp.toDate() : new Date(tx.timestamp);
      return d >= start && d < end;
    });
  })();

  return (
    <div className="wallet-tx-block">
      <div className="wallet-tx-block-shine" />

      {/* WALLET */}
      <div className="wallet-inner">
        <div className="wallet-top">
          <div className="wallet-left">
            <div className="wallet-eyebrow">
              <Wallet size={11} /> Available Balance
            </div>
            <div className="wallet-balance">
              <span className="wallet-balance-currency">KES</span>
              {balance.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {wallet?.updatedAt && (
              <div className="wallet-updated">updated {fmt(wallet.updatedAt)}</div>
            )}
          </div>
          <div className="wallet-right">
            <div className="wallet-icon-circle">
              <CircleDollarSign size={20} />
            </div>
            {/* ── WITHDRAW BUTTON: normal vs pending state ── */}
            {pendingWithdrawal ? (
              <div className="btn-withdraw-pending" title="A withdrawal is already awaiting admin approval">
                <Hourglass size={14} />
                Pending…
              </div>
            ) : (
              <button
                className="btn-withdraw"
                onClick={onWithdraw}
                disabled={!canWithdraw}
                title={!canWithdraw ? `Minimum balance to withdraw is KES ${MIN_WITHDRAWAL}` : "Withdraw funds"}
              >
                <ArrowUpRight size={14} />
                Withdraw
              </button>
            )}
          </div>
        </div>

        {/* ── PENDING WITHDRAWAL BANNER ── */}
        {pendingWithdrawal && (
          <div className="pending-wd-banner">
            <div className="pending-wd-banner-icon">
              <Hourglass size={14} />
            </div>
            <div className="pending-wd-banner-body">
              <div className="pending-wd-banner-title">Withdrawal Pending Approval</div>
              <div className="pending-wd-banner-detail">
                <em>{kes(pendingWithdrawal.amount)}</em> requested on {fmt(pendingWithdrawal.requestedAt)}
                {" · "}awaiting admin approval. You can make another request once this is processed.
              </div>
            </div>
          </div>
        )}

        <div className="wallet-metrics">
          <div className="wm-item">
            <div className="wm-label"><TrendingUp size={10} color="var(--green)" />Earned</div>
            <div className="wm-value c-green">{compact(earned)}</div>
          </div>
          <div className="wm-item">
            <div className="wm-label"><Clock size={10} color="var(--amber)" />In Flight</div>
            <div className="wm-value c-amber">{compact(pending)}</div>
          </div>
          <div className="wm-item">
            <div className="wm-label"><XCircle size={10} color="var(--red)" />Lost</div>
            <div className="wm-value c-red">{compact(failed)}</div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="tx-divider-line" />

      {/* TRANSACTIONS */}
      <div className="tx-toolbar">
        <div className="tx-toolbar-l">
          <Activity size={14} style={{ color: "var(--blue)" }} />
          Activity
          {!txLoad && <span className="tx-count-pill">{filteredTxs.length} entries</span>}
        </div>
        <input
          type="date" className="date-pick"
          value={selectedDate} max={todayNairobi()}
          onChange={e => onDateChange(e.target.value)}
        />
      </div>

      <div className="tx-list">
        {txLoad ? (
          <div className="skel-list">
            {[100, 76, 88, 62].map((w, i) => (
              <div key={i} className="skel" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : filteredTxs.length === 0 ? (
          <div className="tx-empty">
            <CalendarDays size={24} style={{ opacity: .3 }} />
            No transactions on {fmtDate(selectedDate)}
          </div>
        ) : filteredTxs.map(tx => {
          const isWithdrawal = tx.type === "WITHDRAWAL";
          const isCompleted  = tx.status?.includes("COMPLETED");
          const isApproved   = tx.status === "APPROVED";
          const isFailed     = tx.status === "FAILED" || tx.status?.includes("FAILED");
          const isPending    = tx.status === "PENDING";

          const { cls: statusCls, icon: StatusIcon, label: statusLabel } = statusInfo(tx.status);
          const { cls: typeCls, label: typeLabel } = typeInfo(tx.type);
          const commRate = tx.commissionRate != null ? `${(tx.commissionRate * 100).toFixed(0)}% rate` : null;

          // Withdrawal rows get a distinct icon color based on status
          const wdIconColor = isApproved ? "var(--green)" : isFailed ? "var(--red)" : "var(--amber)";

          return (
            <div className="tx-row" key={tx.id}>
              <div className="tx-icon-wrap" style={isWithdrawal ? {
                background: isApproved ? "var(--gdim)" : isFailed ? "var(--rdim)" : "var(--adim)",
                borderColor: isApproved ? "var(--gbdr)" : isFailed ? "var(--rbdr)" : "var(--abdr)",
                color: wdIconColor,
              } : {}}>
                {isWithdrawal
                  ? <ArrowUpRight size={15} />
                  : <PayIcon method={tx.paymentMethod} size={15} />
                }
              </div>

              <div className="tx-body">
                <div className="tx-method" style={isWithdrawal ? { color: "var(--text)" } : {}}>
                  {isWithdrawal ? "Withdrawal" : (tx.paymentMethod ?? "—")}
                </div>
                <div className="tx-time">{fmt(tx.timestamp ?? tx.processedAt)}</div>
                <div className="tx-pills">
                  {/* Type pill */}
                  {tx.type && (
                    <span className={`pill ${typeCls}`}>{typeLabel}</span>
                  )}
                  {/* Status pill */}
                  <span className={`pill ${statusCls}`}>
                    <StatusIcon size={9} /> {statusLabel}
                  </span>
                  {/* Commission rate pill — only for non-withdrawal rows */}
                  {!isWithdrawal && commRate && (
                    <span className="pill pill-muted">{commRate}</span>
                  )}
                  {/* M-Pesa destination pill for withdrawals */}
                  {isWithdrawal && tx.refCode && (
                    <span className="pill pill-muted">
                      <Smartphone size={9} /> {tx.refCode}
                    </span>
                  )}
                </div>
              </div>

              <div className="tx-right">
                {isWithdrawal ? (
                  <>
                    <div className="tx-comm-label">amount</div>
                    <div className="tx-comm-val" style={{
                      color: isApproved ? "var(--red)" : isFailed ? "var(--muted)" : "var(--amber)",
                      textDecoration: isFailed ? "line-through" : "none",
                    }}>
                      {isApproved || isPending ? `-${kes(tx.amount)}` : kes(tx.amount)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tx-comm-label">commission</div>
                    {isCompleted
                      ? <div className="tx-comm-val earned">+KES {tx.commission ?? "—"}</div>
                      : <div className="tx-comm-val nil">—</div>
                    }
                  </>
                )}
                {tx.newWalletBalance != null && (
                  <div className="tx-bal-trail">
                    <span>{compact(tx.previousWalletBalance ?? 0)}</span>
                    <ChevronRight size={10} />
                    <span style={{
                      color: isWithdrawal
                        ? (isApproved ? "var(--red)" : isFailed ? "var(--muted)" : "var(--amber)")
                        : (isCompleted ? "var(--green)" : "var(--subtle)"),
                    }}>
                      {compact(tx.newWalletBalance)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard() {
  const navigate = useNavigate();

  const [user,              setUser]              = useState(null);
  const [emp,               setEmp]               = useState(null);
  const [dashboard,         setDashboard]         = useState(null);
  const [wallet,            setWallet]            = useState(null);
  const [txs,               setTxs]               = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [txLoad,            setTxLoad]            = useState(true);
  const [showDrawer,        setShowDrawer]        = useState(false);
  const [showWithdraw,      setShowWithdraw]      = useState(false);
  const [selectedDate,      setSelectedDate]      = useState(todayNairobi());
  const [copied,            setCopied]            = useState(false);
  // ── NEW: pending withdrawal state ──
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null); // null = none, object = the pending doc

  // Inject styles
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = styles + `@keyframes rot { to { transform: rotate(360deg); } }`;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Auth → attach real-time listeners for emp, dashboard, wallet
  useEffect(() => {
    let unsubEmp = () => {}, unsubDash = () => {}, unsubWallet = () => {};

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      unsubEmp(); unsubDash(); unsubWallet();

      if (!u) { setLoading(false); navigate("/auth"); return; }
      setUser(u);

      let initialBatch = 3;
      const done = () => { if (--initialBatch === 0) setLoading(false); };

      unsubEmp = onSnapshot(
        doc(firestore, "employees", u.uid),
        (snap) => { if (snap.exists()) setEmp(snap.data()); done(); },
        () => done()
      );

      unsubDash = onSnapshot(
        doc(firestore, "employee_dashboard", u.uid),
        (snap) => { if (snap.exists()) setDashboard(snap.data()); done(); },
        () => done()
      );

      unsubWallet = onSnapshot(
        doc(firestore, "wallet", u.uid),
        (snap) => { if (snap.exists()) setWallet(snap.data()); done(); },
        () => done()
      );
    });

    return () => { unsubAuth(); unsubEmp(); unsubDash(); unsubWallet(); };
  }, [navigate]);

  // Real-time transactions listener
  useEffect(() => {
    if (!user) return;
    setTxLoad(true);
    const q = query(
      collection(firestore, "wallet_transactions"),
      where("employeeId", "==", user.uid),
      orderBy("timestamp", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setTxs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setTxLoad(false);
      },
      () => {
        const fallbackUnsub = onSnapshot(
          collection(firestore, "wallet_transactions"),
          (snap) => {
            setTxs(
              snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .filter(t => t.employeeId === user.uid)
                .sort((a, b) => (b.timestamp?.toDate?.() ?? 0) - (a.timestamp?.toDate?.() ?? 0))
            );
            setTxLoad(false);
          }
        );
        return fallbackUnsub;
      }
    );
    return () => unsub();
  }, [user]);

  // ── NEW: Real-time listener for pending withdraw_requests ──
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(firestore, "withdraw_requests"),
      where("employeeId", "==", user.uid),
      where("status", "==", "PENDING")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          // Take the most recently created pending request
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          docs.sort((a, b) => (b.requestedAt?.toDate?.() ?? 0) - (a.requestedAt?.toDate?.() ?? 0));
          setPendingWithdrawal(docs[0]);
        } else {
          setPendingWithdrawal(null);
        }
      },
      () => {
        // If the query fails (e.g. missing index), fall back to no pending state
        setPendingWithdrawal(null);
      }
    );

    return () => unsub();
  }, [user]);

  const logout = async () => { await signOut(auth); navigate("/auth"); };

  const refUrl = emp?.refCode ? `${REFERRAL_BASE}?ref=${emp.refCode}` : null;

  const copyRefLink = async () => {
    if (!refUrl) return;
    try { await navigator.clipboard.writeText(refUrl); }
    catch {
      const el = document.createElement("textarea");
      el.value = refUrl; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWithdrawSuccess = () => {
    // Wallet balance + pending request both update automatically via onSnapshot listeners
    setShowWithdraw(false);
  };

  if (loading) return (
    <div className="splash">
      <div className="splash-inner">
        <Spin size={22} style={{ color: "var(--blue)" }} />
        <p className="splash-txt">loading…</p>
      </div>
    </div>
  );

  if (!user) return null;

  const todayCommission = isToday(dashboard?.commissionTodayDate)        ? dashboard?.commissionToday    ?? 0 : 0;
  const weekCommission  = isThisWeek(dashboard?.commissionThisWeekDate)  ? dashboard?.commissionThisWeek ?? 0 : 0;
  const monthCommission = isThisMonth(dashboard?.commissionThisMonthDate)? dashboard?.commissionThisMonth ?? 0 : 0;

  return (
    <div className="app">

      {/* Only show withdraw modal if there is no pending withdrawal */}
      {showWithdraw && !pendingWithdrawal && (
        <WithdrawModal
          availableBalance={wallet?.availableBalance ?? 0}
          phoneNumber={emp?.phoneNumber}
          onClose={() => setShowWithdraw(false)}
          onSuccess={handleWithdrawSuccess}
        />
      )}

      {showDrawer && (
        <ProfileDrawer
          emp={emp} user={user}
          onClose={() => setShowDrawer(false)}
          onUpdated={setEmp}
          onLogout={logout}
        />
      )}

      <nav>
        <div className="nav-l">
          <div className="nav-logo">
            <Hexagon size={16} color="#fff" strokeWidth={1.5} />
          </div>
          <span className="nav-brand">EMP<em>.</em>PORTAL</span>
        </div>
        <div className="nav-r">
          <button className="nav-av" onClick={() => setShowDrawer(true)} title="Profile">
            {initials(emp?.name)}
          </button>
        </div>
      </nav>

      <div className="page">

        {/* HERO */}
        <div className="card hero a1">
          <div className="card-shine hero-shine" />
          <div className="hero-glow-blob" />
          <div className="hero-row">
            <div>
              <h1 className="hero-name">Hello, <em>{emp?.name ?? "Employee"}</em></h1>
              <div className="hero-chips">
                <span className="chip chip-blue">
                  <User size={10} /> {emp?.role ?? "—"}
                </span>
                <span className="chip chip-purple">
                  <Activity size={10} /> ref {emp?.refCode ?? "—"}
                </span>
              </div>
            </div>
            <div className="hero-date-box">
              <div className="hero-date-lbl">today</div>
              <div className="hero-date-val">
                {new Date().toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}
              </div>
            </div>
          </div>
          {refUrl && (
            <>
              <div className="hero-divider" />
              <div className="ref-row">
                <span className="ref-url">
                  xnxxlivepussyhub.vercel.app?ref=<em>{emp.refCode}</em>
                </span>
                <button className={`btn-copy${copied ? " copied" : ""}`} onClick={copyRefLink}>
                  {copied
                    ? <><Check size={12} /> Copied!</>
                    : <><Copy size={12} /> Copy Link</>
                  }
                </button>
              </div>
            </>
          )}
        </div>

        {/* WALLET + TRANSACTIONS */}
        <div className="a2">
          <div className="sec-label"><Wallet size={11} /> Wallet & Activity</div>
          <WalletTxBlock
            wallet={wallet}
            txs={txs}
            txLoad={txLoad}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onWithdraw={() => setShowWithdraw(true)}
            pendingWithdrawal={pendingWithdrawal}
          />
        </div>

        {/* COMMISSION STATS */}
        <div className="a3">
          <div className="sec-label"><BarChart3 size={11} /> Commission Earnings</div>
          <div className="stats-grid">
            {[
              { label: "Today",      value: todayCommission,                      cls: "c-green",  accent: "var(--green)",  icon: TrendingUp,        sub: new Date().toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" }) },
              { label: "This Week",  value: weekCommission,                       cls: "c-teal",   accent: "var(--teal)",   icon: CalendarDays,      sub: "7-day window" },
              { label: "This Month", value: monthCommission,                      cls: "c-blue",   accent: "var(--blue)",   icon: Activity,          sub: new Date().toLocaleDateString("en-KE", { month: "long" }) },
              { label: "All Time",   value: dashboard?.totalCommissionEarned ?? 0, cls: "c-purple", accent: "var(--purple)", icon: CircleDollarSign,  sub: "total earned" },
            ].map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} sub={s.sub} colorClass={s.cls} accentColor={s.accent} icon={s.icon} />
            ))}
          </div>
        </div>

        {/* SALES STATS */}
        <div className="a4">
          <div className="sec-label"><Activity size={11} /> Sales Activity</div>
          <div className="stats-grid">
            {[
              { label: "Successful", value: dashboard?.successfulSalesCount    ?? 0, cls: "c-green",  accent: "var(--green)",  icon: CheckCircle2,  sub: `${kes(dashboard?.totalCommissionEarned   ?? 0)} earned` },
              { label: "Failed",     value: dashboard?.failedSalesCount        ?? 0, cls: "c-red",    accent: "var(--red)",    icon: XCircle,       sub: `${kes(dashboard?.totalFailedCommission   ?? 0)} lost` },
              { label: "Pending",    value: dashboard?.pendingSalesCount       ?? 0, cls: "c-amber",  accent: "var(--amber)",  icon: Timer,         sub: `${kes(dashboard?.totalPendingCommission  ?? 0)} in flight` },
              { label: "Avg. Amount",value: dashboard?.averageTransactionAmount ?? 0, cls: "c-blue",  accent: "var(--blue)",   icon: BarChart3,     sub: `${kes(dashboard?.totalTransactionVolume  ?? 0)} volume`, small: true },
            ].map((s, i) => (
              <StatCard key={i} label={s.label} value={s.value} sub={s.sub} colorClass={s.cls} accentColor={s.accent} icon={s.icon} small={s.small} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}