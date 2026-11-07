import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import {
  Hexagon, User, Lock, ArrowRight, XCircle, CheckCircle2,
  Eye, EyeOff, TrendingUp, Smartphone, ShieldCheck,
} from "lucide-react";

const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #f5f6fa;
    --surface:     #ffffff;
    --border:      #d6dbe4;
    --muted:       #94a3b8;
    --text:        #0f172a;
    --subtle:      #64748b;
    --accent:      #4f46e5;
    --accent-600:  #4338ca;
    --accent-ring: rgba(79,70,229,.15);
  }

  html, body, #root {
    min-height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .auth-shell { min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); }

  /* ── Brand panel ── */
  .auth-brand {
    position: relative; overflow: hidden;
    padding: 48px 56px;
    display: flex; flex-direction: column; justify-content: space-between; gap: 40px;
    color: #fff;
    background:
      radial-gradient(80% 60% at 100% 0%, rgba(167,139,250,.55) 0%, transparent 60%),
      radial-gradient(70% 60% at 0% 100%, rgba(56,189,248,.35) 0%, transparent 60%),
      linear-gradient(150deg, #312e81 0%, #4338ca 45%, #5b21b6 100%);
  }
  .auth-brand::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
    background-size: 44px 44px;
    mask-image: radial-gradient(ellipse at 30% 40%, #000 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(ellipse at 30% 40%, #000 0%, transparent 75%);
    pointer-events: none;
  }
  .auth-brand > * { position: relative; }
  .brand-top { display: flex; align-items: center; gap: 10px; }
  .brand-mark {
    width: 38px; height: 38px; border-radius: 11px;
    background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.25);
    display: grid; place-items: center;
  }
  .brand-name { font-size: 1.05rem; font-weight: 700; letter-spacing: -.01em; }
  .brand-name span { opacity: .6; }
  .brand-copy { max-width: 440px; }
  .brand-copy h2 { font-size: 2.4rem; line-height: 1.15; font-weight: 700; letter-spacing: -.03em; margin-bottom: 16px; }
  .brand-copy p { font-size: 1rem; line-height: 1.6; color: rgba(255,255,255,.78); }
  .brand-features { list-style: none; margin-top: 32px; display: flex; flex-direction: column; gap: 14px; }
  .brand-features li { display: flex; align-items: center; gap: 12px; font-size: .94rem; color: rgba(255,255,255,.92); }
  .brand-feat-icon {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.18);
    display: grid; place-items: center;
  }
  .brand-foot { font-size: .8rem; color: rgba(255,255,255,.55); }

  /* ── Form panel ── */
  .auth-main { display: grid; place-items: center; padding: 40px 24px; }
  .auth-card { width: 100%; max-width: 400px; animation: slideUp .5s cubic-bezier(.22,1,.36,1) both; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

  .mobile-logo { display: none; align-items: center; gap: 10px; margin-bottom: 32px; }
  .mobile-logo .brand-mark { background: linear-gradient(135deg, #6366f1, #4338ca); border: none; box-shadow: 0 4px 12px -2px rgba(79,70,229,.45); }
  .mobile-logo .brand-name { color: var(--text); }

  .auth-card h1 { font-size: 1.85rem; font-weight: 700; letter-spacing: -.025em; line-height: 1.2; margin-bottom: 8px; }
  .subtitle { font-size: .95rem; color: var(--subtle); margin-bottom: 32px; }

  .field { margin-bottom: 18px; }
  .field label { display: block; font-size: .85rem; font-weight: 600; color: #334155; margin-bottom: 7px; }
  .input-wrap { position: relative; display: flex; align-items: center; }
  .input-icon { position: absolute; left: 13px; color: var(--muted); display: flex; pointer-events: none; transition: color .15s; }
  .input-wrap:focus-within .input-icon { color: var(--accent); }
  .field input {
    width: 100%; height: 46px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 11px; padding: 0 44px 0 40px;
    font-family: inherit; font-size: .95rem; color: var(--text);
    outline: none; transition: border-color .15s, box-shadow .15s;
    box-shadow: 0 1px 2px rgba(15,23,42,.04);
  }
  .field input::placeholder { color: #a8b1c0; }
  .field input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px var(--accent-ring); }
  .pw-toggle {
    position: absolute; right: 6px; width: 34px; height: 34px; border-radius: 8px;
    border: none; background: transparent; color: var(--muted); cursor: pointer;
    display: grid; place-items: center; transition: color .15s, background .15s;
  }
  .pw-toggle:hover { color: var(--text); background: #f1f5f9; }
  .pw-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }

  .btn {
    width: 100%; height: 48px; margin-top: 8px;
    background: var(--accent); color: #fff; border: none; border-radius: 11px;
    font-family: inherit; font-size: .95rem; font-weight: 600; cursor: pointer;
    box-shadow: 0 1px 2px rgba(79,70,229,.3), 0 8px 20px -6px rgba(79,70,229,.55);
    transition: background .15s, transform .12s;
  }
  .btn:hover:not(:disabled) { background: var(--accent-600); transform: translateY(-1px); }
  .btn:active:not(:disabled) { transform: none; }
  .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  .btn:disabled { opacity: .65; cursor: not-allowed; }
  .btn-inner { display: flex; align-items: center; justify-content: center; gap: 8px; }

  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .alert { display: flex; align-items: flex-start; gap: 10px; padding: 12px 14px; border-radius: 11px; font-size: .86rem; line-height: 1.5; margin-top: 18px; animation: fadeIn .25s ease both; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
  .alert-error   { background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; }
  .alert-success { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; }
  .alert-icon { flex-shrink: 0; margin-top: 2px; display: flex; }

  .auth-foot { margin-top: 32px; font-size: .8rem; color: var(--muted); display: flex; align-items: center; justify-content: center; gap: 6px; }

  .auth-shell { min-height: 100dvh; }

  @media (max-width: 900px) {
    .auth-shell { grid-template-columns: 1fr; }
    .auth-brand { display: none; }
    .mobile-logo { display: flex; }
    .auth-main {
      align-items: start;
      padding: calc(9vh + env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) calc(32px + env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
      background:
        radial-gradient(110% 45% at 50% 0%, #e4e7ff 0%, rgba(245,246,250,0) 70%),
        var(--bg);
    }
  }
  @media (max-width: 480px) {
    .mobile-logo { margin-bottom: 28px; }
    .auth-card h1 { font-size: 1.6rem; }
    .subtitle { font-size: .9rem; margin-bottom: 26px; }
    .field input { height: 50px; border-radius: 12px; }
    .btn { height: 52px; border-radius: 12px; font-size: 1rem; }
    .auth-foot { margin-top: 28px; }
  }
  /* 16px+ inputs stop iOS Safari from zooming on focus; bigger tap targets */
  @media (pointer: coarse) {
    .field input { font-size: 16px; }
    .pw-toggle { width: 40px; height: 40px; right: 5px; }
  }
  @media (hover: none) {
    .btn:hover:not(:disabled) { transform: none; }
    .btn:active:not(:disabled) { transform: scale(.98); background: var(--accent-600); }
  }
  @media (prefers-reduced-motion: reduce) {
    .auth-card, .alert { animation: none; }
  }
`;

const Brand = () => (
  <>
    <div className="brand-mark"><Hexagon size={18} color="#fff" strokeWidth={2} /></div>
    <div className="brand-name">EMP<span>.</span>PORTAL</div>
  </>
);

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [checking, setChecking] = useState(true);
  const [showPw,   setShowPw]   = useState(false);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = styles;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      } else {
        setChecking(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    const trimmed = username.trim();
    if (!trimmed || !password) { setError("Please enter both username and password."); return; }
    const email = `${trimmed}@emp.com`;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess(`Signed in as ${email}`);
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      const map = {
        "auth/user-not-found":     "No account found for this username.",
        "auth/wrong-password":     "Incorrect password.",
        "auth/invalid-credential": "Invalid username or password.",
        "auth/too-many-requests":  "Too many attempts. Try again later.",
      };
      setError(map[err.code] || err.message);
    } finally { setLoading(false); }
  };

  if (checking) return null;

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <div className="brand-top"><Brand /></div>

        <div className="brand-copy">
          <h2>Your earnings, all in one place.</h2>
          <p>Track commissions in real time, review your sales activity and withdraw straight to M-Pesa.</p>
          <ul className="brand-features">
            <li><span className="brand-feat-icon"><TrendingUp size={16} /></span>Live commission tracking</li>
            <li><span className="brand-feat-icon"><Smartphone size={16} /></span>Fast M-Pesa withdrawals</li>
            <li><span className="brand-feat-icon"><ShieldCheck size={16} /></span>Secure employee access</li>
          </ul>
        </div>

        <div className="brand-foot">© {new Date().getFullYear()} EMP.PORTAL. All rights reserved.</div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="mobile-logo"><Brand /></div>

          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to your employee account to continue.</p>

          <form onSubmit={handleLogin} autoComplete="off" noValidate>
            <div className="field">
              <label htmlFor="username">Username</label>
              <div className="input-wrap">
                <span className="input-icon"><User size={17} /></span>
                <input
                  id="username" type="text" placeholder="johndoe"
                  value={username} onChange={e => setUsername(e.target.value)}
                  spellCheck={false} autoCapitalize="none" autoFocus
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-wrap">
                <span className="input-icon"><Lock size={17} /></span>
                <input
                  id="password" type={showPw ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button" className="pw-toggle"
                  onClick={() => setShowPw(v => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              <span className="btn-inner">
                {loading
                  ? <><div className="spinner" /> Signing in…</>
                  : <>Sign in <ArrowRight size={17} /></>
                }
              </span>
            </button>
          </form>

          {error && (
            <div className="alert alert-error" role="alert">
              <span className="alert-icon"><XCircle size={16} /></span>
              {error}
            </div>
          )}
          {success && (
            <div className="alert alert-success" role="status">
              <span className="alert-icon"><CheckCircle2 size={16} /></span>
              {success}
            </div>
          )}

          <div className="auth-foot"><ShieldCheck size={14} />Protected by secure authentication</div>
        </div>
      </main>
    </div>
  );
}
