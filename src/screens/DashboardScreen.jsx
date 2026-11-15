import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged, signOut, updatePassword,
  EmailAuthProvider, reauthenticateWithCredential,
} from "firebase/auth";
import {
  doc, onSnapshot, updateDoc, serverTimestamp,
  collection, query, where, orderBy,
} from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, firestore, functions } from "../../firebase";
import styles from "./dashboardStyles";

import {
  Wallet, ArrowUpRight, ArrowDownLeft, TrendingUp,
  ChevronDown, Copy, Check, X, LogOut, Lock,
  User, Edit3, Smartphone, ShieldCheck, CircleDollarSign,
  AlertCircle, Loader2, Landmark, CreditCard, Clock,
  CalendarDays, BarChart3, Activity, Banknote, Hexagon,
  CheckCircle2, XCircle, Timer, ChevronRight, Wifi, Hourglass,
  Users, Search, AlertTriangle, Shield,
  UserPlus, Percent, Ban, KeyRound, AtSign,
} from "lucide-react";

const REFERRAL_BASE = "https://xnxxlivepussyhub.vercel.app";

/* ─── UTILS ─── */
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
  // Use the Nairobi calendar date (same as the backend), not the browser's local date.
  const [y, m, dd] = todayNairobi().split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, dd));
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((day - yearStart) / 86400000) + 1) / 7);
  return weekStr === `${day.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};
const isThisMonth = (monthStr) => monthStr === todayNairobi().substring(0, 7);

const AVATAR_GRADIENTS = [
  ["#6366f1", "#8b5cf6"], ["#10b981", "#0ea5e9"], ["#8b5cf6", "#ec4899"],
  ["#0ea5e9", "#6366f1"], ["#f59e0b", "#ef4444"], ["#14b8a6", "#10b981"],
];
const avatarGrad = (uid = "") => {
  const idx = uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
};

const MIN_WITHDRAWAL = 100;

/* ─── SHARED SUB-COMPONENTS ─── */
const Spin = ({ size = 16, color = "var(--blue)", style = {} }) => (
  <Loader2 size={size} style={{ animation: "rot .65s linear infinite", color, ...style }} />
);

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

/* ─── WITHDRAW MODAL ─── */
function WithdrawModal({ availableBalance, phoneNumber, onClose, onSuccess }) {
  const [amount,  setAmount]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [step,    setStep]    = useState("form");
  const [errMsg,  setErrMsg]  = useState("");

  const numAmount = parseFloat(amount) || 0;
  const remaining = availableBalance - numAmount;
  const hasPhone  = !!phoneNumber;
  const pct       = availableBalance > 0 ? Math.min(100, (numAmount / availableBalance) * 100) : 0;
  const isOver    = numAmount > availableBalance;

  const presets = (() => {
    const half    = Math.floor(availableBalance / 2);
    const quarter = Math.floor(availableBalance / 4);
    const opts = [500, 1000, 2000, 5000].filter(v => v <= availableBalance && v >= MIN_WITHDRAWAL);
    if (!opts.includes(half) && half >= MIN_WITHDRAWAL && half !== availableBalance) opts.push(half);
    return [...new Set(opts)].sort((a, b) => a - b).slice(0, 4);
  })();

  const setPreset = (v) => { setAmount(v.toString()); setError(""); };
  const validate = () => {
    if (!amount || isNaN(numAmount))  return "Please enter an amount.";
    if (numAmount < MIN_WITHDRAWAL)   return `Minimum withdrawal is KES ${MIN_WITHDRAWAL}.`;
    if (numAmount > availableBalance) return "Amount exceeds your available balance.";
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
        {step === "success" && (
          <div className="wd-result">
            <div className="wd-result-icon-wrap">
              <div className="wd-result-ring success" />
              <div className="wd-result-icon-bg success"><CheckCircle2 size={26} strokeWidth={1.8} /></div>
            </div>
            <div className="wd-result-title">Request Submitted</div>
            <div className="wd-result-amount">{kes(numAmount)}</div>
            <div className="wd-result-msg">Your withdrawal request has been sent for admin approval. You will receive the funds on M-Pesa once the request is approved.</div>
            {phoneNumber && <div className="wd-result-dest"><Smartphone size={13} color="var(--green)" />{phoneNumber}</div>}
            <div className="wd-result-btns"><button className="btn-wd-submit" onClick={onClose}>Done</button></div>
          </div>
        )}
        {step === "error" && (
          <div className="wd-result">
            <div className="wd-result-icon-wrap">
              <div className="wd-result-ring failure" />
              <div className="wd-result-icon-bg failure"><XCircle size={26} strokeWidth={1.8} /></div>
            </div>
            <div className="wd-result-title">Request Failed</div>
            <div className="wd-result-msg">{errMsg}</div>
            <div className="wd-result-btns">
              <button className="btn-wd-cancel" style={{ flex: 1 }} onClick={onClose}>Close</button>
              <button className="btn-wd-submit" style={{ flex: 2 }} onClick={() => setStep("form")}>Try Again</button>
            </div>
          </div>
        )}
        {step === "form" && (
          <>
            <div className="wd-hero">
              <div className="wd-hero-top">
                <div className="wd-hero-label-row"><div className="wd-hero-label-dot" />Withdraw Funds</div>
                <button className="wd-close" onClick={onClose} disabled={loading}><X size={13} /></button>
              </div>
              <div className="wd-balance-display">
                <div className="wd-balance-currency">Available balance · KES</div>
                <div className="wd-balance-num">{availableBalance.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="wd-balance-sub">Min. withdrawal KES {MIN_WITHDRAWAL}</div>
              </div>
              <div className="wd-dest-chip">
                <div className="wd-dest-chip-icon"><Smartphone size={13} /></div>
                <div className="wd-dest-chip-info">
                  <span className="wd-dest-chip-label">Sending to M-Pesa</span>
                  <span className={`wd-dest-chip-val${!hasPhone ? " no-phone" : ""}`}>{hasPhone ? phoneNumber : "No phone number — add in Profile"}</span>
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
                  <input className="wd-num-input" type="number" min={MIN_WITHDRAWAL} max={availableBalance} step="1" placeholder="0" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} disabled={loading} autoFocus />
                  <button className="wd-max-btn" onClick={() => setPreset(availableBalance)} disabled={loading}>MAX</button>
                </div>
                {error ? <div className="wd-field-msg err"><AlertCircle size={11} />{error}</div>
                       : <div className="wd-field-msg hint">Minimum: KES {MIN_WITHDRAWAL.toLocaleString()}</div>}
              </div>
              {presets.length > 0 && (
                <div className="wd-presets">
                  {presets.map(v => (
                    <button key={v} className={`wd-preset${numAmount === v ? " active" : ""}`} onClick={() => setPreset(v)} disabled={loading}>
                      {v >= 1000 ? `${v / 1000}K` : v}
                    </button>
                  ))}
                </div>
              )}
              {numAmount > 0 && (
                <div className="wd-balance-bar-wrap">
                  <div className="wd-bar-labels">
                    <span className="wd-bar-lbl">Withdrawing</span>
                    <span className="wd-bar-val" style={{ color: isOver ? "var(--red)" : "var(--green)" }}>{kes(numAmount)}</span>
                  </div>
                  <div className="wd-bar-track"><div className={`wd-bar-fill${isOver ? " over" : ""}`} style={{ width: `${Math.min(pct, 100)}%` }} /></div>
                  <div className="wd-bar-remainder">
                    <span className="wd-bar-rem-lbl">Remaining after</span>
                    <span className="wd-bar-rem-val" style={{ color: isOver ? "var(--red)" : "var(--subtle)" }}>{isOver ? "⚠ Insufficient" : kes(remaining)}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="wd-foot">
              <button className="btn-wd-submit" onClick={handleSubmit} disabled={loading || !hasPhone || numAmount < MIN_WITHDRAWAL || numAmount > availableBalance}>
                {loading ? <><Spin size={15} color="#fff" />Processing…</> : <><ArrowUpRight size={16} />Withdraw {numAmount >= MIN_WITHDRAWAL && !isOver ? kes(numAmount) : ""}</>}
              </button>
              <button className="btn-wd-cancel" onClick={onClose} disabled={loading}>Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── PROFILE DRAWER ─── */
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
      await updateDoc(doc(firestore, "employees", user.uid), { name: name.trim(), phoneNumber: phone.trim() });
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
      const map = { "auth/wrong-password": "Wrong current password.", "auth/invalid-credential": "Wrong current password." };
      setPmsg({ t: "err", s: map[e.code] ?? e.message });
    } finally { setPassLoad(false); }
  };

  return (
    <>
      <div className="overlay-backdrop" onClick={e => e.target === e.currentTarget && onClose()} />
      <aside className="drawer">
        <div className="dr-head">
          <span className="dr-title">Profile</span>
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
          <AccSection id="info" openId={openSection} onToggle={toggle} icon={ShieldCheck} title="Account Info" sub="Role, ref code, status">
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
          <AccSection id="edit" openId={openSection} onToggle={toggle} icon={Edit3} title="Edit Details" sub="Name, phone number">
            <div className="form-stack">
              <div>
                <label className="form-label">Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <label className="form-label">M-Pesa Phone Number</label>
                <input className="form-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="254..." />
              </div>
              {msg && <div className={`feedback feedback-${msg.t === "ok" ? "ok" : "err"}`}>{msg.t === "ok" ? <Check size={12} /> : <X size={12} />}{msg.s}</div>}
              <button className="btn-primary" onClick={saveProfile} disabled={saving}>
                {saving ? <><Spin size={13} color="#fff" />Saving…</> : "Save Changes"}
              </button>
            </div>
          </AccSection>
          <AccSection id="pass" openId={openSection} onToggle={toggle} icon={Lock} title="Change Password" sub="Update your credentials">
            <div className="form-stack">
              <div>
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" value={curPass} onChange={e => setCurPass(e.target.value)} placeholder="••••••••" />
              </div>
              <div>
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="min 6 chars" />
              </div>
              {pmsg && <div className={`feedback feedback-${pmsg.t === "ok" ? "ok" : "err"}`}>{pmsg.t === "ok" ? <Check size={12} /> : <X size={12} />}{pmsg.s}</div>}
              <button className="btn-secondary" onClick={changePass} disabled={passLoad}>
                {passLoad ? <><Spin size={13} />Updating…</> : "Update Password"}
              </button>
            </div>
          </AccSection>
          <AccSection id="session" openId={openSection} onToggle={toggle} icon={LogOut} title="Session" sub="Sign out of this device">
            <button className="btn-destructive" onClick={onLogout}><LogOut size={14} />Sign out</button>
          </AccSection>
          <div style={{ height: 8 }} />
        </div>
      </aside>
    </>
  );
}

/* ─── STAT CARD (employee stats + admin overview) ─── */
function StatCard({ label, value, display, sub, accent, icon: Icon, small }) {
  const num = Number(value);
  const shown = display ?? compact(value);
  const full = !isNaN(num) ? num.toLocaleString("en-KE") : String(value);
  return (
    <div className="stat-card" style={accent ? { "--accent": accent } : undefined}>
      <div className="stat-head">
        <div className="stat-label">{label}</div>
        {Icon && <div className="stat-icon"><Icon size={15} /></div>}
      </div>
      <div className={`stat-value${small ? " sm" : ""}`} title={full}>{shown}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/* ─── WALLET + TX BLOCK (employee view) ─── */
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
      <div className="wallet-inner">
        <div className="wallet-top">
          <div className="wallet-left">
            <div className="wallet-eyebrow"><Wallet size={14} />Available balance</div>
            <div className="wallet-balance">
              <span className="wallet-balance-currency">KES</span>
              {balance.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {wallet?.updatedAt && <div className="wallet-updated">updated {fmt(wallet.updatedAt)}</div>}
          </div>
          <div className="wallet-right">
            <div className="wallet-icon-circle"><CircleDollarSign size={20} /></div>
            {pendingWithdrawal ? (
              <div className="btn-withdraw-pending" title="A withdrawal is already awaiting admin approval">
                <Hourglass size={14} />Pending…
              </div>
            ) : (
              <button className="btn-withdraw" onClick={onWithdraw} disabled={!canWithdraw} title={!canWithdraw ? `Minimum balance to withdraw is KES ${MIN_WITHDRAWAL}` : "Withdraw funds"}>
                <ArrowUpRight size={14} />Withdraw
              </button>
            )}
          </div>
        </div>
        {pendingWithdrawal && (
          <div className="pending-wd-banner">
            <div className="pending-wd-banner-icon"><Hourglass size={14} /></div>
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
          <div className="wm-item"><div className="wm-label"><TrendingUp size={13} color="var(--green)" />Earned</div><div className="wm-value c-green">{compact(earned)}</div></div>
          <div className="wm-item"><div className="wm-label"><Clock size={13} color="var(--amber)" />In flight</div><div className="wm-value c-amber">{compact(pending)}</div></div>
          <div className="wm-item"><div className="wm-label"><XCircle size={13} color="var(--red)" />Lost</div><div className="wm-value c-red">{compact(failed)}</div></div>
        </div>
      </div>
      <div className="tx-divider-line" />
      <div className="tx-toolbar">
        <div className="tx-toolbar-l">
          <Activity size={16} style={{ color: "var(--primary)" }} />Activity
          {!txLoad && <span className="tx-count-pill">{filteredTxs.length} entries</span>}
        </div>
        <input type="date" className="date-pick" value={selectedDate} max={todayNairobi()} onChange={e => onDateChange(e.target.value)} />
      </div>
      <div className="tx-list">
        {txLoad ? (
          <div className="skel-list">{[100, 76, 88, 62].map((w, i) => <div key={i} className="skel" style={{ width: `${w}%` }} />)}</div>
        ) : filteredTxs.length === 0 ? (
          <div className="tx-empty">
            <div className="tx-empty-icon"><CalendarDays size={22} /></div>
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
          const wdIconColor = isApproved ? "var(--green)" : isFailed ? "var(--red)" : "var(--amber)";
          return (
            <div className="tx-row" key={tx.id}>
              <div className="tx-icon-wrap" style={isWithdrawal ? { background: isApproved ? "var(--gdim)" : isFailed ? "var(--rdim)" : "var(--adim)", borderColor: isApproved ? "var(--gbdr)" : isFailed ? "var(--rbdr)" : "var(--abdr)", color: wdIconColor } : {}}>
                {isWithdrawal ? <ArrowUpRight size={15} /> : <PayIcon method={tx.paymentMethod} size={15} />}
              </div>
              <div className="tx-body">
                <div className="tx-method" style={isWithdrawal ? { color: "var(--text)" } : {}}>{isWithdrawal ? "Withdrawal" : (tx.paymentMethod ?? "—")}</div>
                <div className="tx-time">{fmt(tx.timestamp ?? tx.processedAt)}</div>
                <div className="tx-pills">
                  {tx.type && <span className={`pill ${typeCls}`}>{typeLabel}</span>}
                  <span className={`pill ${statusCls}`}><StatusIcon size={11} />{statusLabel}</span>
                  {!isWithdrawal && commRate && <span className="pill pill-muted">{commRate}</span>}
                  {isWithdrawal && tx.refCode && <span className="pill pill-muted"><Smartphone size={11} />{tx.refCode}</span>}
                </div>
              </div>
              <div className="tx-right">
                {isWithdrawal ? (
                  <>
                    <div className="tx-comm-label">amount</div>
                    <div className="tx-comm-val" style={{ color: isApproved ? "var(--red)" : isFailed ? "var(--muted)" : "var(--amber)", textDecoration: isFailed ? "line-through" : "none" }}>
                      {isApproved || isPending ? `-${kes(tx.amount)}` : kes(tx.amount)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="tx-comm-label">commission</div>
                    {isCompleted ? <div className="tx-comm-val earned">+KES {tx.commission ?? "—"}</div> : <div className="tx-comm-val nil">—</div>}
                  </>
                )}
                {tx.newWalletBalance != null && (
                  <div className="tx-bal-trail">
                    <span>{compact(tx.previousWalletBalance ?? 0)}</span>
                    <ChevronRight size={10} />
                    <span style={{ color: isWithdrawal ? (isApproved ? "var(--red)" : isFailed ? "var(--muted)" : "var(--amber)") : (isCompleted ? "var(--green)" : "var(--subtle)") }}>
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

/* ─── ADMIN: CONFIRM MODAL ─── */
function ConfirmApproveModal({ request, empName, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !loading && onCancel()}>
      <div className="confirm-modal">
        <div className="confirm-icon-wrap"><CheckCircle2 size={24} strokeWidth={1.8} /></div>
        <div>
          <div className="confirm-title">Approve Withdrawal?</div>
          <div className="confirm-body" style={{ marginTop: 6 }}>
            This will mark the request as APPROVED. The agent will be notified and funds sent to their M-Pesa.
          </div>
        </div>
        <div className="confirm-detail">
          {[
            ["Agent",      empName],
            ["Amount",     kes(request.amount)],
            ["Phone",      request.refCode ?? "—"],
            ["Requested",  fmt(request.requestedAt)],
            ["Request ID", request.requestId ?? request.id],
          ].map(([k, v]) => (
            <div className="confirm-detail-row" key={k}>
              <span className="confirm-detail-k">{k}</span>
              <span className="confirm-detail-v">{v}</span>
            </div>
          ))}
        </div>
        <div className="confirm-btns">
          <button className="btn-cancel-sm" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm} disabled={loading}>
            {loading ? <><Spin size={14} color="#fff" />Approving…</> : <><CheckCircle2 size={14} />Approve</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN: GENERIC FORM MODAL ─── */
const callFn = (name, data) => httpsCallable(functions, name)(data);
const ratePct = (emp) => Math.round(Number(emp?.commisionRate ?? 0.25) * 10000) / 100;

function AdminModal({ icon: Icon, tone = "green", title, body, children, error, onCancel, onConfirm, confirmLabel, confirmIcon: CIcon, loading, busyLabel, danger }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && !loading && onCancel()}>
      <div className="confirm-modal">
        <div className={`confirm-icon-wrap tone-${tone}`}><Icon size={24} strokeWidth={1.8} /></div>
        <div>
          <div className="confirm-title">{title}</div>
          {body && <div className="confirm-body" style={{ marginTop: 6 }}>{body}</div>}
        </div>
        {children}
        {error && <div className="feedback feedback-err"><X size={12} />{error}</div>}
        <div className="confirm-btns">
          <button className="btn-cancel-sm" onClick={onCancel} disabled={loading}>{onConfirm ? "Cancel" : "Close"}</button>
          {onConfirm && (
            <button className={`btn-confirm${danger ? " btn-confirm-danger" : ""}`} onClick={onConfirm} disabled={loading}>
              {loading ? <><Spin size={14} color="#fff" />{busyLabel}</> : <>{CIcon && <CIcon size={14} />}{confirmLabel}</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── ADMIN: CREATE EMPLOYEE ─── */
function CreateEmployeeModal({ onClose, onDone }) {
  const [f, setF] = useState({ name: "", username: "", password: "", phoneNumber: "", commissionRatePercent: "25" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const set = (k) => (e) => { setF(p => ({ ...p, [k]: e.target.value })); setError(""); };

  const submit = async () => {
    if (!f.name.trim())                                      return setError("Enter the employee's name.");
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(f.username.trim()))  return setError("Username: 3–30 letters, numbers, dot, dash or underscore.");
    if (f.password.length < 6)                               return setError("Password must be at least 6 characters.");
    const pct = Number(f.commissionRatePercent);
    if (f.commissionRatePercent === "" || isNaN(pct) || pct < 0 || pct > 100) return setError("Commission must be between 0 and 100%.");
    setLoading(true);
    try {
      const { data } = await callFn("createEmployee", { ...f, commissionRatePercent: pct });
      setCreated({ ...data, password: f.password, name: f.name.trim() });
      onDone?.(`Employee ${f.name.trim()} created`);
    } catch (e) { setError(e?.message ?? "Could not create employee."); }
    finally { setLoading(false); }
  };

  if (created) return (
    <AdminModal icon={CheckCircle2} title="Employee created" onCancel={onClose}
      body="Share these login details with the employee. They can change the password from their profile.">
      <div className="confirm-detail">
        {[["Name", created.name], ["Username", created.email.split("@")[0]], ["Password", created.password]].map(([k, v]) => (
          <div className="confirm-detail-row" key={k}><span className="confirm-detail-k">{k}</span><span className="confirm-detail-v">{v}</span></div>
        ))}
      </div>
    </AdminModal>
  );

  return (
    <AdminModal icon={UserPlus} tone="purple" title="New employee"
      body="Creates a login for the employee. Their referral code is generated automatically."
      error={error} onCancel={onClose} onConfirm={submit} loading={loading}
      confirmLabel="Create employee" confirmIcon={UserPlus} busyLabel="Creating…">
      <div className="form-stack">
        <div><label className="form-label">Full name</label>
          <input className="form-input" value={f.name} onChange={set("name")} placeholder="Jane Wanjiku" autoFocus /></div>
        <div><label className="form-label">Username <span className="form-hint">signs in as username@emp.com</span></label>
          <div className="input-icon-wrap"><AtSign size={14} />
            <input className="form-input" value={f.username} onChange={set("username")} placeholder="jane.w" autoCapitalize="none" autoComplete="off" /></div></div>
        <div><label className="form-label">Password</label>
          <div className="input-icon-wrap"><KeyRound size={14} />
            <input className="form-input" value={f.password} onChange={set("password")} placeholder="min 6 characters" autoComplete="new-password" /></div></div>
        <div className="form-grid-2">
          <div><label className="form-label">M-Pesa phone <span className="form-hint">optional</span></label>
            <input className="form-input" value={f.phoneNumber} onChange={set("phoneNumber")} placeholder="2547…" inputMode="tel" /></div>
          <div><label className="form-label">Commission %</label>
            <input className="form-input" value={f.commissionRatePercent} onChange={set("commissionRatePercent")} inputMode="decimal" /></div>
        </div>
      </div>
    </AdminModal>
  );
}

/* ─── ADMIN: EDIT EMPLOYEE DETAILS ─── */
// Only fields that are safe to change. Ref code, role, login and balances are shown read-only.
function EditEmployeeModal({ emp, onClose, onDone }) {
  const initial = { name: emp.name ?? "", phoneNumber: emp.phoneNumber ?? "", pct: String(ratePct(emp)) };
  const [f, setF] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => { setF(p => ({ ...p, [k]: e.target.value })); setError(""); };

  const submit = async () => {
    const name  = f.name.trim();
    const phone = f.phoneNumber.replace(/[\s-]/g, "");
    const n     = Number(f.pct);
    if (!name)                                           return setError("Name can't be empty.");
    if (phone && !/^\+?\d{9,15}$/.test(phone))           return setError("Phone must be 9–15 digits, e.g. 254712345678.");
    if (f.pct === "" || isNaN(n) || n < 0 || n > 100)    return setError("Commission must be between 0 and 100%.");

    // Send only what changed.
    const changes = {};
    if (name  !== (emp.name ?? ""))        changes.name = name;
    if (phone !== (emp.phoneNumber ?? "")) changes.phoneNumber = phone;
    if (n     !== ratePct(emp))            changes.commissionRatePercent = n;
    if (!Object.keys(changes).length)      return onClose();

    setLoading(true);
    try {
      await callFn("updateEmployee", { employeeId: emp.uid, ...changes });
      onDone(`Details updated for ${name}`);
    } catch (e) { setError(e?.message ?? "Could not save changes."); setLoading(false); }
  };

  return (
    <AdminModal icon={Edit3} tone="purple" title="Edit employee"
      body={<>Update details for <b>{emp.name}</b>.</>}
      error={error} onCancel={onClose} onConfirm={submit} loading={loading}
      confirmLabel="Save changes" confirmIcon={Check} busyLabel="Saving…">
      <div className="form-stack">
        <div><label className="form-label">Full name</label>
          <input className="form-input" value={f.name} onChange={set("name")} maxLength={80} /></div>
        <div><label className="form-label">M-Pesa phone <span className="form-hint">leave empty to clear</span></label>
          <div className="input-icon-wrap"><Smartphone size={14} />
            <input className="form-input" value={f.phoneNumber} onChange={set("phoneNumber")} placeholder="2547…" inputMode="tel" /></div></div>
        <div><label className="form-label">Commission rate (%) <span className="form-hint">new sales only</span></label>
          <div className="input-icon-wrap"><Percent size={14} />
            <input className="form-input" value={f.pct} onChange={set("pct")} inputMode="decimal" /></div></div>
      </div>
      <div className="confirm-detail">
        {[["Ref code", emp.refCode ?? "—"], ["Role", emp.role ?? "—"]].map(([k, v]) => (
          <div className="confirm-detail-row" key={k}>
            <span className="confirm-detail-k">{k}</span>
            <span className="confirm-detail-v"><Lock size={11} style={{ verticalAlign: "-1px", marginRight: 5, color: "var(--muted)" }} />{v}</span>
          </div>
        ))}
      </div>
    </AdminModal>
  );
}

/* ─── ADMIN: WITHDRAW ON BEHALF ─── */
function AdminWithdrawModal({ emp, wallet, onClose, onDone }) {
  const balance = Number(wallet?.availableBalance ?? 0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    const n = Number(amount);
    if (!amount || isNaN(n))   return setError("Enter an amount.");
    if (n < MIN_WITHDRAWAL)    return setError(`Minimum withdrawal is KES ${MIN_WITHDRAWAL}.`);
    if (n > balance)           return setError("Amount exceeds the available balance.");
    setLoading(true);
    try {
      await callFn("adminCreateWithdrawal", { employeeId: emp.uid, amount: n });
      onDone(`Withdrawal of ${kes(n)} created for ${emp.name} — approve it to pay out`);
    } catch (e) { setError(e?.message ?? "Could not create withdrawal."); setLoading(false); }
  };
  return (
    <AdminModal icon={ArrowUpRight} tone="amber" title="Withdraw for agent"
      body={<>Creates a pending withdrawal for <b>{emp.name}</b>. It appears on their card and still needs to be approved.</>}
      error={error} onCancel={onClose} onConfirm={submit} loading={loading}
      confirmLabel="Create request" confirmIcon={ArrowUpRight} busyLabel="Creating…">
      <div className="confirm-detail">
        <div className="confirm-detail-row"><span className="confirm-detail-k">Available balance</span><span className="confirm-detail-v">{kes(balance)}</span></div>
        <div className="confirm-detail-row"><span className="confirm-detail-k">M-Pesa phone</span><span className="confirm-detail-v">{emp.phoneNumber || "— not set"}</span></div>
      </div>
      <div>
        <label className="form-label">Amount (KES)</label>
        <input className="form-input" value={amount} onChange={e => { setAmount(e.target.value); setError(""); }} inputMode="decimal" placeholder={`${MIN_WITHDRAWAL} – ${Math.floor(balance)}`} autoFocus />
        {balance >= MIN_WITHDRAWAL && (
          <button type="button" className="link-btn" onClick={() => setAmount(String(Math.floor(balance)))}>Use full balance</button>
        )}
      </div>
    </AdminModal>
  );
}

/* ─── ADMIN: CANCEL WITHDRAWAL ─── */
function CancelWithdrawalModal({ request, empName, onClose, onDone }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async () => {
    setLoading(true);
    try {
      await callFn("cancelWithdrawal", { requestId: request.id, reason });
      onDone(`Withdrawal for ${empName} cancelled`);
    } catch (e) { setError(e?.message ?? "Could not cancel withdrawal."); setLoading(false); }
  };
  return (
    <AdminModal icon={Ban} tone="red" title="Cancel withdrawal?" danger
      body="The request is closed and no money is moved. The agent can request again later."
      error={error} onCancel={onClose} onConfirm={submit} loading={loading}
      confirmLabel="Cancel withdrawal" confirmIcon={Ban} busyLabel="Cancelling…">
      <div className="confirm-detail">
        {[["Agent", empName], ["Amount", kes(request.amount)], ["Requested", fmt(request.requestedAt)]].map(([k, v]) => (
          <div className="confirm-detail-row" key={k}><span className="confirm-detail-k">{k}</span><span className="confirm-detail-v">{v}</span></div>
        ))}
      </div>
      <div>
        <label className="form-label">Reason <span className="form-hint">optional</span></label>
        <input className="form-input" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. wrong amount" maxLength={300} />
      </div>
    </AdminModal>
  );
}

/* ─── ADMIN: EMPLOYEE CARD ─── */
function EmployeeCard({ emp, wallet, walletLoading, pendingWd, onApprove, onCancelWd, onEdit, onWithdraw }) {
  const [grad] = useState(() => avatarGrad(emp.uid));
  const hasPending = !!pendingWd;
  const balance = Number(wallet?.availableBalance ?? 0);
  const withdrawBlock = hasPending ? "This agent already has a pending withdrawal"
    : balance < MIN_WITHDRAWAL ? `Balance is below the KES ${MIN_WITHDRAWAL} minimum` : "";
  return (
    <div className={`emp-card${hasPending ? " has-pending" : ""}`}>
      <div className={`emp-card-shine ${hasPending ? "emp-card-shine-pending" : "emp-card-shine-normal"}`} />
      <div className="emp-card-top">
        <div className="emp-avatar" style={{ background: `linear-gradient(135deg, ${grad[0]}, ${grad[1]})` }}>
          {initials(emp.name)}
        </div>
        <div className="emp-header">
          <div className="emp-name-row">
            <span className="emp-name">{emp.name}</span>
            <div className={`emp-status-dot ${emp.isActive ? "active" : "inactive"}`} title={emp.isActive ? "Active" : "Inactive"} />
          </div>
          <div className="emp-chips">
            <span className="chip-xs chip-purple"><Shield size={11} />{emp.role}</span>
            <span className="chip-xs chip-blue"><Activity size={11} />ref {emp.refCode ?? "…"}</span>
            <span className="chip-xs chip-purple"><Percent size={11} />{ratePct(emp)}% commission</span>
            {emp.isActive
              ? <span className="chip-xs chip-green"><CheckCircle2 size={11} />Active</span>
              : <span className="chip-xs chip-muted"><XCircle size={11} />Inactive</span>}
          </div>
          {emp.phoneNumber && <div className="emp-phone"><Smartphone size={11} />{emp.phoneNumber}</div>}
        </div>
        <div className="emp-uid">
          <div className="emp-uid-lbl">UID</div>
          <div className="emp-uid-val" title={emp.uid}>{emp.uid}</div>
        </div>
      </div>
      {walletLoading ? (
        <div className="skel-row">{[1,2,3,4].map(i => <div key={i} className="skel" />)}</div>
      ) : wallet ? (
        <div className="emp-wallet-row">
          <div className="wm"><div className="wm-lbl"><Wallet size={12} color="var(--green)" />Balance</div><div className="wm-val" style={{ color: "var(--green)" }}>{kes(wallet.availableBalance)}</div></div>
          <div className="wm"><div className="wm-lbl"><TrendingUp size={12} color="var(--teal)" />Earned</div><div className="wm-val" style={{ color: "var(--teal)" }}>{compact(wallet.totalEarned)}</div></div>
          <div className="wm"><div className="wm-lbl"><ArrowUpRight size={12} color="var(--subtle)" />Withdrawn</div><div className="wm-val" style={{ color: "var(--dim)" }}>{compact(wallet.totalWithdrawn)}</div></div>
          <div className="wm"><div className="wm-lbl"><XCircle size={12} color="var(--red)" />Failed</div><div className="wm-val" style={{ color: "var(--red)" }}>{compact(wallet.totalFailed)}</div></div>
        </div>
      ) : (
        <div className="emp-wallet-empty">No wallet data</div>
      )}
      {hasPending && (
        <div className="pending-wd-row">
          <div className="pending-wd-icon"><Hourglass size={15} /></div>
          <div className="pending-wd-info">
            <div className="pending-wd-title">
              <span>Withdrawal Pending</span>
              <span className="wd-amount">{kes(pendingWd.amount)}</span>
            </div>
            <div className="pending-wd-meta">
              Requested <em>{fmt(pendingWd.requestedAt)}</em>
              {pendingWd.refCode && <> · to <em>{pendingWd.refCode}</em></>}
              {" · "}Bal. at request: <em>{kes(pendingWd.availableBalance)}</em>
              {pendingWd.initiatedBy && <> · <em>created by admin</em></>}
            </div>
          </div>
          <div className="pending-wd-btns">
            <button className="btn-reject" onClick={() => onCancelWd(pendingWd, emp.name)}>
              <Ban size={14} />Cancel
            </button>
            <button className="btn-approve" onClick={() => onApprove(pendingWd, emp.name)}>
              <CheckCircle2 size={14} />Approve
            </button>
          </div>
        </div>
      )}
      <div className="emp-actions">
        <button className="emp-action-btn" onClick={() => onEdit(emp)}>
          <Edit3 size={14} />Edit details
        </button>
        <button className="emp-action-btn" onClick={() => onWithdraw(emp)} disabled={!!withdrawBlock || walletLoading} title={withdrawBlock || "Create a withdrawal for this agent"}>
          <ArrowUpRight size={14} />Withdraw for agent
        </button>
      </div>
    </div>
  );
}

/* ─── ADMIN VIEW ─── */
function AdminView({ user, adminEmp, onLogout }) {
  const [employees,      setEmployees]      = useState([]);
  const [wallets,        setWallets]        = useState({});
  const [pendingWds,     setPendingWds]     = useState({});
  const [empLoading,     setEmpLoading]     = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [search,         setSearch]         = useState("");
  const [filterActive,   setFilterActive]   = useState("all");
  const [filterPending,  setFilterPending]  = useState(false);
  const [confirmReq,     setConfirmReq]     = useState(null);
  const [approving,      setApproving]      = useState(false);
  const [toast,          setToast]          = useState(null);
  const [modal,          setModal]          = useState(null); // { type: "create"|"edit"|"withdraw"|"cancel", ... }

  const closeModal = () => setModal(null);
  const modalDone  = (msg) => { setModal(null); showToast(msg, "ok"); };

  const showToast = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // All employees
  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "employees"),
      snap => { setEmployees(snap.docs.map(d => ({ ...d.data(), uid: d.id }))); setEmpLoading(false); },
      () => setEmpLoading(false)
    );
    return unsub;
  }, []);

  // Wallets per employee
  useEffect(() => {
    if (!employees.length) return;
    setWalletsLoading(true);
    const unsubList = employees.map(emp =>
      onSnapshot(doc(firestore, "wallet", emp.uid), snap => {
        if (snap.exists()) setWallets(prev => ({ ...prev, [emp.uid]: snap.data() }));
        setWalletsLoading(false);
      }, () => setWalletsLoading(false))
    );
    return () => unsubList.forEach(fn => fn());
  }, [employees.length]);

  // All pending withdraw_requests
  useEffect(() => {
    const q = query(collection(firestore, "withdraw_requests"), where("status", "==", "PENDING"));
    const unsub = onSnapshot(q, snap => {
      const map = {};
      snap.docs.forEach(d => {
        const data = { id: d.id, ...d.data() };
        if (!map[data.employeeId] || (data.requestedAt?.toDate?.() ?? 0) > (map[data.employeeId].requestedAt?.toDate?.() ?? 0)) {
          map[data.employeeId] = data;
        }
      });
      setPendingWds(map);
    }, () => setPendingWds({}));
    return unsub;
  }, []);

  const handleApprove = async () => {
    if (!confirmReq) return;
    setApproving(true);
    try {
      await updateDoc(doc(firestore, "withdraw_requests", confirmReq.request.id), {
        status: "APPROVED", processedAt: serverTimestamp(), updatedAt: serverTimestamp(),
      });
      showToast(`Withdrawal approved for ${confirmReq.empName}`, "ok");
      setConfirmReq(null);
    } catch (e) {
      showToast("Approval failed: " + e.message, "err");
    } finally { setApproving(false); }
  };

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase();
    const matchSearch  = !q || emp.name?.toLowerCase().includes(q) || emp.refCode?.toLowerCase().includes(q) || emp.phoneNumber?.includes(q);
    const matchActive  = filterActive === "all" || (filterActive === "active" ? emp.isActive : !emp.isActive);
    const matchPending = !filterPending || !!pendingWds[emp.uid];
    return matchSearch && matchActive && matchPending;
  });

  const totalEmployees  = employees.length;
  const activeEmployees = employees.filter(e => e.isActive).length;
  const pendingCount    = Object.keys(pendingWds).length;
  const totalBalance    = Object.values(wallets).reduce((s, w) => s + (w.availableBalance ?? 0), 0);

  return (
    <>
      {confirmReq && (
        <ConfirmApproveModal
          request={confirmReq.request} empName={confirmReq.empName}
          onConfirm={handleApprove} onCancel={() => !approving && setConfirmReq(null)} loading={approving}
        />
      )}
      {modal?.type === "create"   && <CreateEmployeeModal onClose={closeModal} onDone={msg => showToast(msg, "ok")} />}
      {modal?.type === "edit"     && <EditEmployeeModal emp={modal.emp} onClose={closeModal} onDone={modalDone} />}
      {modal?.type === "withdraw" && <AdminWithdrawModal emp={modal.emp} wallet={wallets[modal.emp.uid]} onClose={closeModal} onDone={modalDone} />}
      {modal?.type === "cancel"   && <CancelWithdrawalModal request={modal.request} empName={modal.empName} onClose={closeModal} onDone={modalDone} />}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "ok" ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
          {toast.msg}
        </div>
      )}
      <div className="page admin-page">
        {/* ADMIN HERO */}
        <div className="card admin-hero a1">
          <div className="admin-hero-shine" />
          <div className="admin-hero-blob" />
          <div className="admin-hero-row">
            <div>
              <div className="hero-eyebrow">Welcome back{adminEmp?.name ? `, ${adminEmp.name}` : ""}</div>
              <h1 className="admin-hero-title">Admin <em>Console</em></h1>
              <p className="admin-hero-sub">Add agents · set commission · manage withdrawals</p>
            </div>
            <div className="hero-date-box">
              <div className="hero-date-lbl">Today</div>
              <div className="hero-date-val">
                {new Date().toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}
              </div>
            </div>
          </div>
        </div>

        {/* OVERVIEW TILES */}
        <div className="a2">
          <div className="sec-label"><BarChart3 size={14} />Overview</div>
          <div className="overview-row">
            {[
              { label: "Employees",      value: totalEmployees,  sub: "Total registered",   accent: "var(--blue)",   icon: Users },
              { label: "Active",         value: activeEmployees, sub: "Currently active",   accent: "var(--green)",  icon: Activity },
              { label: "Pending Payout", value: pendingCount,    sub: "Awaiting approval",  accent: "var(--amber)",  icon: Hourglass },
              { label: "Total Balance",  value: totalBalance, display: kes(totalBalance), sub: "Across all wallets", accent: "var(--purple)", icon: Wallet, small: true },
            ].map((t, i) => <StatCard key={i} {...t} />)}
          </div>
        </div>

        {/* EMPLOYEE LIST */}
        <div className="a3">
          <div className="sec-label"><Users size={14} />Employees</div>
          <div className="toolbar">
            <div className="search-wrap">
              <Search size={15} />
              <input className="search-input" placeholder="Search by name, ref code, phone…" value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button className="search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                  <X size={12} />
                </button>
              )}
            </div>
            <button
              className={`filter-btn ${filterActive !== "all" ? "active-filter" : ""}`}
              onClick={() => setFilterActive(filterActive === "active" ? "all" : filterActive === "inactive" ? "all" : "active")}
            >
              <Activity size={14} />
              {filterActive === "all" ? "All status" : filterActive === "active" ? "Active only" : "Inactive only"}
            </button>
            <button className={`filter-btn ${filterPending ? "active-filter-amber" : ""}`} onClick={() => setFilterPending(p => !p)}>
              <Hourglass size={14} />
              {filterPending ? "Pending only" : "All requests"}
              {pendingCount > 0 && (
                <span className="filter-count">
                  {pendingCount}
                </span>
              )}
            </button>
            <button className="btn-new-emp" onClick={() => setModal({ type: "create" })}>
              <UserPlus size={14} />New employee
            </button>
          </div>
          {filtered.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon-wrap"><Users size={26} /></div>
                <div className="empty-title">No employees found</div>
                <div className="empty-sub">Try adjusting your search or filters</div>
              </div>
            </div>
          ) : (
            <div className="emp-list">
              {filtered.map(emp => (
                <EmployeeCard
                  key={emp.uid} emp={emp}
                  wallet={wallets[emp.uid] ?? null}
                  walletLoading={walletsLoading && !wallets[emp.uid]}
                  pendingWd={pendingWds[emp.uid] ?? null}
                  onApprove={(req, name) => setConfirmReq({ request: req, empName: name })}
                  onCancelWd={(req, name) => setModal({ type: "cancel", request: req, empName: name })}
                  onEdit={e => setModal({ type: "edit", emp: e })}
                  onWithdraw={e => setModal({ type: "withdraw", emp: e })}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ─── EMPLOYEE VIEW ─── */
function EmployeeView({ user, emp, setEmp, onLogout }) {
  const [dashboard,         setDashboard]         = useState(null);
  const [wallet,            setWallet]            = useState(null);
  const [txs,               setTxs]               = useState([]);
  const [txLoad,            setTxLoad]            = useState(true);
  const [showDrawer,        setShowDrawer]        = useState(false);
  const [showWithdraw,      setShowWithdraw]      = useState(false);
  const [selectedDate,      setSelectedDate]      = useState(todayNairobi());
  const [copied,            setCopied]            = useState(false);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(null);

  // Dashboard + wallet listeners
  useEffect(() => {
    const unsubDash = onSnapshot(doc(firestore, "employee_dashboard", user.uid), snap => { if (snap.exists()) setDashboard(snap.data()); });
    const unsubWallet = onSnapshot(doc(firestore, "wallet", user.uid), snap => { if (snap.exists()) setWallet(snap.data()); });
    return () => { unsubDash(); unsubWallet(); };
  }, [user.uid]);

  // Transactions
  useEffect(() => {
    setTxLoad(true);
    const q = query(collection(firestore, "wallet_transactions"), where("employeeId", "==", user.uid), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q,
      snap => { setTxs(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setTxLoad(false); },
      err => {
        // Usually means the composite index (backend/firestore.indexes.json) isn't deployed.
        console.error("Failed to load transactions:", err);
        setTxs([]);
        setTxLoad(false);
      }
    );
    return () => unsub();
  }, [user.uid]);

  // Pending withdrawal
  useEffect(() => {
    const q = query(collection(firestore, "withdraw_requests"), where("employeeId", "==", user.uid), where("status", "==", "PENDING"));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => (b.requestedAt?.toDate?.() ?? 0) - (a.requestedAt?.toDate?.() ?? 0));
        setPendingWithdrawal(docs[0]);
      } else { setPendingWithdrawal(null); }
    }, () => setPendingWithdrawal(null));
    return () => unsub();
  }, [user.uid]);

  const refUrl = emp?.refCode ? `${REFERRAL_BASE}?ref=${emp.refCode}` : null;
  const copyRefLink = async () => {
    if (!refUrl) return;
    try { await navigator.clipboard.writeText(refUrl); }
    catch { const el = document.createElement("textarea"); el.value = refUrl; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el); }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const todayCommission = isToday(dashboard?.commissionTodayDate)         ? dashboard?.commissionToday     ?? 0 : 0;
  const weekCommission  = isThisWeek(dashboard?.commissionThisWeekDate)   ? dashboard?.commissionThisWeek  ?? 0 : 0;
  const monthCommission = isThisMonth(dashboard?.commissionThisMonthDate) ? dashboard?.commissionThisMonth ?? 0 : 0;

  return (
    <>
      {showWithdraw && !pendingWithdrawal && (
        <WithdrawModal
          availableBalance={wallet?.availableBalance ?? 0}
          phoneNumber={emp?.phoneNumber}
          onClose={() => setShowWithdraw(false)}
          onSuccess={() => setShowWithdraw(false)}
        />
      )}
      {showDrawer && (
        <ProfileDrawer emp={emp} user={user} onClose={() => setShowDrawer(false)} onUpdated={setEmp} onLogout={onLogout} />
      )}
      <div className="page emp-page">
        {/* HERO */}
        <div className="card hero a1">
          <div className="card-shine hero-shine" />
          <div className="hero-glow-blob" />
          <div className="hero-row">
            <div>
              <div className="hero-eyebrow">Welcome back</div>
              <h1 className="hero-name">Hello, <em>{emp?.name ?? "Employee"}</em></h1>
              <div className="hero-chips">
                <span className="chip chip-blue"><User size={12} />{emp?.role ?? "—"}</span>
                <span className="chip chip-purple"><Activity size={12} />ref {emp?.refCode ?? "—"}</span>
              </div>
            </div>
            <div className="hero-date-box">
              <div className="hero-date-lbl">Today</div>
              <div className="hero-date-val">{new Date().toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" })}</div>
            </div>
          </div>
          {refUrl && (
            <>
              <div className="hero-divider" />
              <div className="ref-label">Your referral link</div>
              <div className="ref-row">
                <span className="ref-url" title={refUrl}>{REFERRAL_BASE.replace(/^https?:\/\//, "")}?ref=<em>{emp.refCode}</em></span>
                <button className={`btn-copy${copied ? " copied" : ""}`} onClick={copyRefLink}>
                  {copied ? <><Check size={14} />Copied!</> : <><Copy size={14} />Copy link</>}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="emp-grid">
        {/* WALLET + TRANSACTIONS */}
        <div className="emp-main a2">
          <div className="sec-label"><Wallet size={14} />Wallet & Activity</div>
          <WalletTxBlock
            wallet={wallet} txs={txs} txLoad={txLoad}
            selectedDate={selectedDate} onDateChange={setSelectedDate}
            onWithdraw={() => setShowWithdraw(true)} pendingWithdrawal={pendingWithdrawal}
          />
        </div>

        <div className="emp-side">
        {/* COMMISSION STATS */}
        <div className="a3">
          <div className="sec-label"><BarChart3 size={14} />Commission Earnings</div>
          <div className="stats-grid">
            {[
              { label: "Today",      value: todayCommission,                       cls: "c-green",  accent: "var(--green)",  icon: TrendingUp,       sub: new Date().toLocaleDateString("en-KE", { weekday: "short", month: "short", day: "numeric" }) },
              { label: "This Week",  value: weekCommission,                        cls: "c-teal",   accent: "var(--teal)",   icon: CalendarDays,     sub: "7-day window" },
              { label: "This Month", value: monthCommission,                       cls: "c-blue",   accent: "var(--blue)",   icon: Activity,         sub: new Date().toLocaleDateString("en-KE", { month: "long" }) },
              { label: "All Time",   value: dashboard?.totalCommissionEarned ?? 0, cls: "c-purple", accent: "var(--purple)", icon: CircleDollarSign, sub: "total earned" },
            ].map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </div>

        {/* SALES STATS */}
        <div className="a4">
          <div className="sec-label"><Activity size={14} />Sales Activity</div>
          <div className="stats-grid">
            {[
              { label: "Successful",  value: dashboard?.successfulSalesCount     ?? 0, cls: "c-green",  accent: "var(--green)",  icon: CheckCircle2, sub: `${kes(dashboard?.totalCommissionEarned  ?? 0)} earned` },
              { label: "Failed",      value: dashboard?.failedSalesCount         ?? 0, cls: "c-red",    accent: "var(--red)",    icon: XCircle,      sub: `${kes(dashboard?.totalFailedCommission  ?? 0)} lost` },
              { label: "Pending",     value: dashboard?.pendingSalesCount        ?? 0, cls: "c-amber",  accent: "var(--amber)",  icon: Timer,        sub: `${kes(dashboard?.totalPendingCommission ?? 0)} in flight` },
              { label: "Avg. Amount", value: dashboard?.averageTransactionAmount ?? 0, cls: "c-blue",   accent: "var(--blue)",   icon: BarChart3,    sub: `${kes(dashboard?.totalTransactionVolume ?? 0)} volume`, small: true },
            ].map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </div>
        </div>
        </div>
      </div>
    </>
  );
}

/* ─── MAIN EXPORT ─── */
export default function Dashboard() {
  const navigate = useNavigate();

  const [user,    setUser]    = useState(null);
  const [emp,     setEmp]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Inject styles
  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  // Auth + employee doc
  useEffect(() => {
    let unsubEmp = () => {};
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      unsubEmp();
      if (!u) { setLoading(false); navigate("/auth"); return; }
      setUser(u);
      unsubEmp = onSnapshot(
        doc(firestore, "employees", u.uid),
        (snap) => { if (snap.exists()) setEmp(snap.data()); setLoading(false); },
        () => setLoading(false)
      );
    });
    return () => { unsubAuth(); unsubEmp(); };
  }, [navigate]);

  const logout = async () => { await signOut(auth); navigate("/auth"); };

  const isAdmin = emp?.role === "Administrator";

  if (loading) return (
    <div className="splash">
      <div className="splash-inner">
        <Spin size={26} color="var(--primary)" />
        <p className="splash-txt">Loading your dashboard…</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className={`app ${isAdmin ? "admin-mode" : "emp-mode"}`}>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
        <div className="nav-l">
          <div className={`nav-logo ${isAdmin ? "admin" : "emp"}`}>
            {isAdmin ? <Shield size={15} color="#fff" strokeWidth={1.5} /> : <Hexagon size={16} color="#fff" strokeWidth={1.5} />}
          </div>
          <span className={`nav-brand ${isAdmin ? "admin" : "emp"}`}>EMP<em>.</em>PORTAL</span>
          {isAdmin && <div className="nav-admin-badge"><Shield size={11} /><span>Admin</span></div>}
        </div>
        <div className="nav-r">
          {isAdmin ? (
            <>
              <span className="nav-user">{emp?.name ?? user?.email}</span>
              <button className="nav-logout-btn" onClick={logout}><LogOut size={14} /><span className="nav-logout-txt">Sign out</span></button>
            </>
          ) : (
            // Employee gets avatar that opens the profile drawer
            // We pass a setter down so EmployeeView can wire it up
            <button
              className="nav-av emp"
              id="emp-profile-btn"
              title="Profile"
              aria-label="Open profile"
            >
              {initials(emp?.name)}
            </button>
          )}
        </div>
        </div>
      </nav>

      {/* ROUTED VIEW */}
      {isAdmin
        ? <AdminView user={user} adminEmp={emp} onLogout={logout} />
        : <EmployeeViewWithNav user={user} emp={emp} setEmp={setEmp} onLogout={logout} />
      }
    </div>
  );
}

/* Thin wrapper so employee view can wire the nav avatar button */
function EmployeeViewWithNav({ user, emp, setEmp, onLogout }) {
  const [showDrawer, setShowDrawer] = useState(false);

  // Wire the nav button click
  useEffect(() => {
    const btn = document.getElementById("emp-profile-btn");
    if (!btn) return;
    const handler = () => setShowDrawer(true);
    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  return (
    <>
      {showDrawer && (
        <ProfileDrawer emp={emp} user={user} onClose={() => setShowDrawer(false)} onUpdated={setEmp} onLogout={onLogout} />
      )}
      <EmployeeView user={user} emp={emp} setEmp={setEmp} onLogout={onLogout} />
    </>
  );
}