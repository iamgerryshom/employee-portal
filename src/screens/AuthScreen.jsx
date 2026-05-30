import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #080b10;
    --surface:   #0e1219;
    --border:    #1c2230;
    --muted:     #3a4455;
    --text:      #e4eaf4;
    --subtle:    #68788f;
    --accent:    #4f8eff;
    --accent-glow: rgba(79,142,255,.18);
    --danger:    #ff4f6a;
    --success:   #3ddc84;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .scene {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
  }

  .scene::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    opacity: .35;
    pointer-events: none;
  }

  .scene::after {
    content: '';
    position: fixed; top: -20%; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 500px;
    background: radial-gradient(ellipse, rgba(79,142,255,.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .card {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2.75rem 2.5rem 2.5rem;
    box-shadow: 0 0 0 1px rgba(255,255,255,.03), 0 32px 64px rgba(0,0,0,.6);
    animation: slideUp .55s cubic-bezier(.22,1,.36,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .logo-wrap { display: flex; align-items: center; gap: .65rem; margin-bottom: 2rem; }

  .logo-icon {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent) 0%, #7b5fff 100%);
    border-radius: 9px;
    display: grid; place-items: center;
    box-shadow: 0 0 18px rgba(79,142,255,.35);
  }

  .logo-text { font-size: 1.05rem; font-weight: 700; letter-spacing: .04em; }
  .logo-text span { color: var(--accent); }

  h1 { font-size: 1.7rem; font-weight: 800; letter-spacing: -.02em; line-height: 1.15; margin-bottom: .55rem; }

  .subtitle { font-family: 'DM Mono', monospace; font-size: .78rem; color: var(--subtle); letter-spacing: .02em; margin-bottom: 2rem; }

  .field { margin-bottom: 1.1rem; }

  label { display: block; font-size: .72rem; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--subtle); margin-bottom: .45rem; }

  .input-wrap { position: relative; display: flex; align-items: center; }

  .input-icon {
    position: absolute; left: .85rem;
    color: var(--muted);
    display: flex; align-items: center;
    pointer-events: none; transition: color .2s;
  }

  input {
    width: 100%;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; padding: .75rem .9rem .75rem 2.6rem;
    font-family: 'DM Mono', monospace; font-size: .88rem; color: var(--text);
    outline: none; transition: border-color .2s, box-shadow .2s;
  }

  input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }

  .divider { border: none; border-top: 1px solid var(--border); margin: 1.6rem 0 1.4rem; }

  .btn {
    width: 100%; padding: .82rem 1rem;
    background: var(--accent); color: #fff; border: none; border-radius: 9px;
    font-family: 'Syne', sans-serif; font-size: .93rem; font-weight: 700;
    letter-spacing: .04em; cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(79,142,255,.3);
  }

  .btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,.12) 0%, transparent 60%); }

  .btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(79,142,255,.45); }
  .btn:active:not(:disabled) { transform: translateY(0); }
  .btn:disabled { opacity: .55; cursor: not-allowed; transform: none; box-shadow: none; }

  .btn-inner { display: flex; align-items: center; justify-content: center; gap: .5rem; }

  .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin .6s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .alert { display: flex; align-items: flex-start; gap: .6rem; padding: .8rem 1rem; border-radius: 9px; font-family: 'DM Mono', monospace; font-size: .78rem; line-height: 1.5; margin-top: 1.1rem; animation: fadeIn .25s ease both; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
  .alert-error   { background: rgba(255,79,106,.08); border: 1px solid rgba(255,79,106,.25); color: var(--danger); }
  .alert-success { background: rgba(61,220,132,.08); border: 1px solid rgba(61,220,132,.25); color: var(--success); }
  .alert-icon { flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; }
`;

const IconHexagon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
  </svg>
);

const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const IconXCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
  </svg>
);

const IconCheckCircle = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const [checking, setChecking] = useState(true);

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
    <div className="scene">
      <div className="card">
        <div className="logo-wrap">
          <div className="logo-icon">
            <IconHexagon />
          </div>
          <div className="logo-text">EMP<span>.</span>PORTAL</div>
        </div>

        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to your employee account</p>

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="field">
            <label>Username</label>
            <div className="input-wrap">
              <span className="input-icon"><IconUser /></span>
              <input
                type="text" placeholder="johndoe"
                value={username} onChange={e => setUsername(e.target.value)}
                spellCheck={false} autoCapitalize="none"
              />
            </div>
          </div>

          <div className="field">
            <label>Password</label>
            <div className="input-wrap">
              <span className="input-icon"><IconLock /></span>
              <input
                type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <hr className="divider" />

          <button type="submit" className="btn" disabled={loading}>
            <span className="btn-inner">
              {loading
                ? <><div className="spinner" /> Authenticating…</>
                : <>Sign In <IconArrowRight /></>
              }
            </span>
          </button>
        </form>

        {error   && (
          <div className="alert alert-error">
            <span className="alert-icon"><IconXCircle /></span>
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            <span className="alert-icon"><IconCheckCircle /></span>
            {success}
          </div>
        )}
      </div>
    </div>
  );
}