/* Dashboard stylesheet — injected while the dashboard is mounted. */
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f5f6fa;
    --s1:        #ffffff;
    --s2:        #f8fafc;
    --s3:        #f1f5f9;
    --border:    #e5e8ef;
    --border2:   #d6dbe4;
    --muted:     #8b95a7;
    --subtle:    #64748b;
    --dim:       #475569;
    --text:      #0f172a;

    --primary:     #4f46e5;
    --primary-600: #4338ca;
    --primary-50:  #eef2ff;
    --primary-100: #e0e7ff;

    --green:  #059669; --gdim: #ecfdf5; --gbdr: #a7f3d0;
    --blue:   #2563eb; --bdim: #eff6ff; --bbdr: #bfdbfe;
    --purple: #7c3aed; --pdim: #f5f3ff; --pbdr: #ddd6fe;
    --amber:  #d97706; --adim: #fffbeb; --abdr: #fde68a;
    --red:    #dc2626; --rdim: #fef2f2; --rbdr: #fecaca;
    --teal:   #0891b2; --tdim: #ecfeff; --tbdr: #a5f3fc;

    --shadow-sm: 0 1px 2px rgba(15,23,42,.04), 0 1px 3px rgba(15,23,42,.06);
    --shadow-md: 0 6px 16px -4px rgba(15,23,42,.10), 0 2px 4px -2px rgba(15,23,42,.06);
    --shadow-lg: 0 24px 56px -12px rgba(15,23,42,.28);

    --font: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  }

  html, body, #root {
    min-height: 100%;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font);
    -webkit-font-smoothing: antialiased;
  }
  body { font-size: 15px; line-height: 1.5; }
  button, input { font-family: inherit; }
  button:focus-visible, input:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cfd5df; border-radius: 99px; border: 3px solid transparent; background-clip: padding-box; }

  .mono { font-family: var(--mono); }

  /* ── APP SHELL ── */
  .app { min-height: 100vh; display: flex; flex-direction: column; position: relative; }
  .app::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 360px;
    background: linear-gradient(180deg, #eceefe 0%, rgba(245,246,250,0) 100%);
    pointer-events: none; z-index: 0;
  }
  .app.admin-mode::before { background: linear-gradient(180deg, #f1ecfe 0%, rgba(245,246,250,0) 100%); }

  /* ── NAV ── */
  nav {
    position: sticky; top: 0; z-index: 30;
    background: rgba(255,255,255,.82);
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto; height: 64px; padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .nav-l { display: flex; align-items: center; gap: 10px; min-width: 0; }
  .nav-logo {
    width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
    display: grid; place-items: center;
  }
  .nav-logo.emp   { background: linear-gradient(135deg, #6366f1, #4338ca); box-shadow: 0 4px 12px -2px rgba(79,70,229,.45), inset 0 1px 0 rgba(255,255,255,.25); }
  .nav-logo.admin { background: linear-gradient(135deg, #8b5cf6, #6d28d9); box-shadow: 0 4px 12px -2px rgba(124,58,237,.45), inset 0 1px 0 rgba(255,255,255,.25); }
  .nav-brand { font-size: 1rem; font-weight: 700; letter-spacing: -.01em; color: var(--text); }
  .nav-brand em { font-style: normal; color: var(--primary); }
  .nav-brand.admin em { color: var(--purple); }
  .nav-admin-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px;
    background: var(--pdim); border: 1px solid var(--pbdr);
    font-size: .72rem; font-weight: 600; color: var(--purple);
  }
  .nav-r { display: flex; align-items: center; gap: 12px; }
  .nav-user { font-size: .85rem; font-weight: 500; color: var(--dim); }
  .nav-av {
    width: 38px; height: 38px; border-radius: 50%;
    border: 2px solid #fff; cursor: pointer;
    display: grid; place-items: center;
    font-size: .78rem; font-weight: 700; color: #fff;
    box-shadow: 0 0 0 1px var(--border2), var(--shadow-sm);
    transition: box-shadow .2s, transform .15s;
  }
  .nav-av.emp   { background: linear-gradient(135deg, #6366f1, #8b5cf6); }
  .nav-av.admin { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
  .nav-av:hover { box-shadow: 0 0 0 1px #a5b4fc, 0 0 0 4px var(--primary-50); transform: translateY(-1px); }
  .nav-logout-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    background: var(--s1); color: var(--dim); border: 1px solid var(--border);
    font-size: .82rem; font-weight: 600; cursor: pointer;
    box-shadow: var(--shadow-sm); transition: color .15s, background .15s, border-color .15s;
  }
  .nav-logout-btn:hover { color: var(--red); background: var(--rdim); border-color: var(--rbdr); }

  /* ── PAGE ── */
  .page {
    flex: 1; position: relative; z-index: 1;
    padding: 32px 24px 80px; margin: 0 auto; width: 100%; max-width: 1200px;
    display: flex; flex-direction: column; gap: 28px;
  }

  .emp-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr); gap: 24px; align-items: start; }
  .emp-side { display: flex; flex-direction: column; gap: 28px; }

  /* ── ANIMATIONS ── */
  .a1 { animation: rise .5s .02s both cubic-bezier(.16,1,.3,1); }
  .a2 { animation: rise .5s .08s both cubic-bezier(.16,1,.3,1); }
  .a3 { animation: rise .5s .14s both cubic-bezier(.16,1,.3,1); }
  .a4 { animation: rise .5s .20s both cubic-bezier(.16,1,.3,1); }
  .a5 { animation: rise .5s .26s both cubic-bezier(.16,1,.3,1); }
  @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes rot  { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  }

  /* ── SECTION LABEL ── */
  .sec-label {
    display: flex; align-items: center; gap: 8px;
    font-size: .8rem; font-weight: 600; color: var(--dim);
    margin-bottom: 12px;
  }
  .sec-label svg { color: var(--muted); }

  /* ── CARD BASE ── */
  .card {
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 16px; position: relative; overflow: hidden;
    box-shadow: var(--shadow-sm);
  }
  .card-shine, .hero-glow-blob, .admin-hero-shine, .admin-hero-blob,
  .wallet-tx-block-shine, .emp-card-shine { display: none; }

  /* ── HERO (employee + admin) ── */
  .hero, .admin-hero { padding: 28px; }
  .hero       { background: radial-gradient(120% 140% at 100% 0%, #e8ebff 0%, rgba(255,255,255,0) 55%), var(--s1); }
  .admin-hero { background: radial-gradient(120% 140% at 100% 0%, #efe9ff 0%, rgba(255,255,255,0) 55%), var(--s1); }
  .hero-row, .admin-hero-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .hero-eyebrow { font-size: .82rem; font-weight: 500; color: var(--subtle); margin-bottom: 4px; }
  .hero-name, .admin-hero-title { font-size: 1.75rem; font-weight: 700; letter-spacing: -.025em; line-height: 1.2; color: var(--text); }
  .hero-name em { font-style: normal; color: var(--primary); }
  .admin-hero-title em { font-style: normal; color: var(--purple); }
  .admin-hero-sub { font-size: .9rem; color: var(--subtle); margin-top: 6px; }
  .hero-chips { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 99px;
    font-size: .75rem; font-weight: 500; border: 1px solid;
  }
  .chip-blue   { color: var(--primary); background: var(--primary-50); border-color: var(--primary-100); }
  .chip-purple { color: var(--purple);  background: var(--pdim);       border-color: var(--pbdr); }
  .hero-date-box {
    text-align: right; flex-shrink: 0;
    padding: 10px 14px; border-radius: 12px;
    background: rgba(255,255,255,.75); border: 1px solid var(--border);
  }
  .hero-date-lbl { font-size: .68rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
  .hero-date-val { font-size: .88rem; font-weight: 600; color: var(--text); }
  .hero-divider { height: 1px; background: var(--border); margin: 22px 0 18px; }
  .ref-label { font-size: .8rem; font-weight: 600; color: var(--dim); margin-bottom: 8px; }
  .ref-row {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 12px; padding: 6px 6px 6px 14px;
  }
  .ref-url {
    font-family: var(--mono); font-size: .8rem; color: var(--subtle);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
  }
  .ref-url em { font-style: normal; color: var(--primary); font-weight: 500; }
  .btn-copy {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 9px;
    background: var(--primary); color: #fff; border: none;
    font-size: .8rem; font-weight: 600; cursor: pointer; white-space: nowrap;
    box-shadow: 0 1px 2px rgba(79,70,229,.35);
    transition: background .15s, transform .12s;
  }
  .btn-copy:hover { background: var(--primary-600); }
  .btn-copy:active { transform: scale(.97); }
  .btn-copy.copied { background: var(--green); }

  /* ── PENDING WITHDRAWAL BANNER (employee) ── */
  .pending-wd-banner {
    display: flex; align-items: flex-start; gap: 12px;
    background: var(--adim); border: 1px solid var(--abdr);
    border-radius: 12px; padding: 14px 16px; margin-top: 18px;
    animation: rise .4s cubic-bezier(.16,1,.3,1) both;
  }
  .pending-wd-banner-icon {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    background: #fef3c7; display: grid; place-items: center; color: var(--amber);
  }
  .pending-wd-banner-body { flex: 1; min-width: 0; }
  .pending-wd-banner-title { font-size: .88rem; font-weight: 600; color: #92400e; margin-bottom: 2px; }
  .pending-wd-banner-detail { font-size: .8rem; color: #a16207; line-height: 1.55; }
  .pending-wd-banner-detail em { font-style: normal; font-weight: 600; color: #92400e; }

  /* ── WALLET + TX BLOCK ── */
  .wallet-tx-block {
    display: flex; flex-direction: column;
    border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    background: var(--s1); box-shadow: var(--shadow-sm); position: relative;
  }
  .wallet-inner { padding: 24px; }
  .wallet-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
  .wallet-left { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .wallet-eyebrow { display: flex; align-items: center; gap: 6px; font-size: .82rem; font-weight: 500; color: var(--subtle); }
  .wallet-balance {
    font-size: 2.5rem; font-weight: 700; letter-spacing: -.035em; line-height: 1.05;
    color: var(--text); font-variant-numeric: tabular-nums;
  }
  .wallet-balance-currency { font-size: 1rem; font-weight: 600; letter-spacing: 0; color: var(--muted); margin-right: 8px; vertical-align: .6em; }
  .wallet-updated { font-size: .75rem; color: var(--muted); }
  .wallet-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
  .wallet-icon-circle {
    width: 44px; height: 44px; border-radius: 12px;
    background: var(--gdim); border: 1px solid var(--gbdr);
    display: grid; place-items: center; color: var(--green);
  }
  .btn-withdraw {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 18px; border-radius: 10px;
    background: var(--primary); color: #fff; border: none;
    font-size: .86rem; font-weight: 600; cursor: pointer; white-space: nowrap;
    box-shadow: 0 1px 2px rgba(79,70,229,.3), 0 6px 16px -4px rgba(79,70,229,.45);
    transition: background .15s, transform .12s, box-shadow .15s;
  }
  .btn-withdraw:hover:not(:disabled) { background: var(--primary-600); transform: translateY(-1px); }
  .btn-withdraw:disabled { background: var(--s3); color: var(--muted); box-shadow: none; cursor: not-allowed; }
  .btn-withdraw-pending {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 16px; border-radius: 10px;
    background: var(--adim); color: var(--amber); border: 1px solid var(--abdr);
    font-size: .86rem; font-weight: 600; cursor: not-allowed; white-space: nowrap;
  }
  .wallet-metrics { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 22px; gap: 12px; }
  .wm-item {
    background: var(--s2); border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 14px;
    display: flex; flex-direction: column; gap: 6px;
  }
  .wm-label { display: flex; align-items: center; gap: 6px; font-size: .75rem; font-weight: 500; color: var(--subtle); }
  .wm-value { font-size: 1.1rem; font-weight: 700; letter-spacing: -.01em; font-variant-numeric: tabular-nums; }
  .tx-divider-line { height: 1px; background: var(--border); }
  .tx-toolbar {
    padding: 14px 24px; background: var(--s2);
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .tx-toolbar-l { display: flex; align-items: center; gap: 8px; font-size: .92rem; font-weight: 600; color: var(--text); }
  .tx-count-pill {
    font-size: .72rem; font-weight: 600;
    color: var(--primary); background: var(--primary-50); border: 1px solid var(--primary-100);
    border-radius: 99px; padding: 1px 8px;
  }
  .date-pick {
    background: var(--s1); border: 1px solid var(--border2);
    border-radius: 9px; padding: 7px 10px;
    font-size: .8rem; font-weight: 500; color: var(--dim);
    outline: none; color-scheme: light; cursor: pointer;
    transition: border-color .15s, box-shadow .15s;
  }
  .date-pick:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-100); }
  .tx-list { display: flex; flex-direction: column; max-height: 640px; overflow-y: auto; }
  .tx-row {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 14px 24px; border-top: 1px solid var(--border);
    transition: background .12s;
  }
  .tx-row:hover { background: var(--s2); }
  .tx-icon-wrap {
    width: 40px; height: 40px; border-radius: 11px;
    background: var(--s3); border: 1px solid transparent;
    display: grid; place-items: center; flex-shrink: 0; color: var(--dim);
  }
  .tx-body { flex: 1; min-width: 0; }
  .tx-method { font-size: .9rem; font-weight: 600; text-transform: capitalize; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 1px; }
  .tx-time { font-size: .76rem; color: var(--muted); }
  .tx-pills { display: flex; align-items: center; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
  .pill {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: .68rem; font-weight: 600; letter-spacing: .02em;
    padding: 2px 8px; border-radius: 6px; border: 1px solid;
  }
  .pill-green { color: var(--green);  background: var(--gdim); border-color: var(--gbdr); }
  .pill-red   { color: var(--red);    background: var(--rdim); border-color: var(--rbdr); }
  .pill-amber { color: var(--amber);  background: var(--adim); border-color: var(--abdr); }
  .pill-blue  { color: var(--blue);   background: var(--bdim); border-color: var(--bbdr); }
  .pill-muted { color: var(--subtle); background: var(--s3);   border-color: var(--border); }
  .tx-right { text-align: right; flex-shrink: 0; min-width: 110px; display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
  .tx-comm-label { font-size: .7rem; font-weight: 500; color: var(--muted); }
  .tx-comm-val { font-size: .95rem; font-weight: 600; font-variant-numeric: tabular-nums; }
  .tx-comm-val.earned { color: var(--green); }
  .tx-comm-val.nil    { color: var(--muted); }
  .tx-bal-trail { font-size: .72rem; color: var(--muted); display: flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
  .tx-bal-trail span { color: var(--subtle); }
  .tx-empty {
    padding: 56px 20px; text-align: center;
    font-size: .86rem; color: var(--subtle);
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .tx-empty-icon {
    width: 48px; height: 48px; border-radius: 14px; background: var(--s3);
    display: grid; place-items: center; color: var(--muted);
  }
  .skel-list { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .skel {
    height: 12px; border-radius: 6px;
    background: linear-gradient(90deg, #eceff4 0%, #f7f8fb 50%, #eceff4 100%);
    background-size: 200% 100%; animation: shim 1.4s ease infinite;
  }
  @keyframes shim { to { background-position: -200% 0; } }

  /* ── STAT CARDS (employee + admin overview) ── */
  .stats-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .overview-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .stat-card {
    --accent: var(--primary);
    background: var(--s1); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px 18px;
    box-shadow: var(--shadow-sm);
    transition: box-shadow .2s, transform .15s, border-color .2s;
    min-width: 0;
  }
  .stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); border-color: var(--border2); }
  .stat-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
  .stat-label { font-size: .8rem; font-weight: 500; color: var(--subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stat-icon {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: grid; place-items: center;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 11%, white);
  }
  .stat-value {
    font-size: 1.6rem; font-weight: 700; letter-spacing: -.025em; line-height: 1.1;
    color: var(--text); font-variant-numeric: tabular-nums;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .stat-value.sm { font-size: 1.25rem; }
  .stat-sub { font-size: .75rem; color: var(--muted); margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .c-green  { color: var(--green); }
  .c-blue   { color: var(--blue); }
  .c-amber  { color: var(--amber); }
  .c-red    { color: var(--red); }
  .c-purple { color: var(--purple); }
  .c-teal   { color: var(--teal); }

  /* ── MODALS ── */
  @keyframes fdin  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes popIn { from { opacity: 0; transform: scale(.96) translateY(12px); } to { opacity: 1; transform: none; } }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: .6; } 100% { transform: scale(1.8); opacity: 0; } }
  @keyframes countUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

  .modal-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(15,23,42,.45);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    display: grid; place-items: center; padding: 16px;
    animation: fdin .2s ease both;
  }
  .wd-modal {
    width: 100%; max-width: 440px;
    background: var(--s1); border-radius: 20px; overflow: hidden;
    box-shadow: var(--shadow-lg);
    animation: popIn .3s cubic-bezier(.16,1,.3,1) both; position: relative;
  }
  .wd-hero {
    position: relative; padding: 22px 24px 20px;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 60%, #ecfdf5 100%);
    border-bottom: 1px solid var(--border);
  }
  .wd-hero-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .wd-hero-label-row { display: flex; align-items: center; gap: 8px; font-size: .9rem; font-weight: 600; color: var(--text); }
  .wd-hero-label-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--green); position: relative; }
  .wd-hero-label-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 1px solid var(--green); animation: pulseRing 1.8s ease-out infinite; }
  .wd-close {
    width: 32px; height: 32px; border-radius: 9px;
    background: rgba(255,255,255,.8); border: 1px solid var(--border);
    color: var(--subtle); cursor: pointer; display: grid; place-items: center;
    transition: background .15s, color .15s; flex-shrink: 0;
  }
  .wd-close:hover { background: #fff; color: var(--text); }
  .wd-balance-display { display: flex; flex-direction: column; gap: 2px; }
  .wd-balance-currency { font-size: .78rem; font-weight: 500; color: var(--subtle); }
  .wd-balance-num { font-size: 2.3rem; font-weight: 700; letter-spacing: -.035em; line-height: 1.1; color: var(--text); font-variant-numeric: tabular-nums; }
  .wd-balance-sub { font-size: .75rem; color: var(--muted); margin-top: 2px; }
  .wd-dest-chip {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: 12px;
    background: #fff; border: 1px solid var(--border); margin-top: 16px;
    box-shadow: var(--shadow-sm);
  }
  .wd-dest-chip-icon { width: 28px; height: 28px; border-radius: 8px; background: var(--gdim); display: grid; place-items: center; color: var(--green); flex-shrink: 0; }
  .wd-dest-chip-info { display: flex; flex-direction: column; gap: 0; }
  .wd-dest-chip-label { font-size: .68rem; font-weight: 600; letter-spacing: .04em; color: var(--muted); text-transform: uppercase; }
  .wd-dest-chip-val { font-size: .88rem; font-weight: 600; }
  .wd-dest-chip-val.no-phone { color: var(--red); font-size: .8rem; }
  .wd-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
  .wd-amount-section { display: flex; flex-direction: column; gap: 8px; }
  .wd-amount-header { display: flex; align-items: center; justify-content: space-between; }
  .wd-amount-lbl { font-size: .82rem; font-weight: 600; color: var(--dim); }
  .wd-avail-lbl { font-size: .78rem; font-weight: 500; color: var(--green); }
  .wd-amount-input-wrap {
    display: flex; align-items: center;
    background: var(--s1); border: 1.5px solid var(--border2); border-radius: 12px;
    transition: border-color .15s, box-shadow .15s; overflow: hidden;
  }
  .wd-amount-input-wrap:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-100); }
  .wd-amount-input-wrap.wrap-error { border-color: var(--red); box-shadow: 0 0 0 4px var(--rdim); }
  .wd-cur-label {
    padding: 0 14px; font-size: .85rem; font-weight: 600; color: var(--subtle);
    background: var(--s2); border-right: 1px solid var(--border);
    height: 52px; display: flex; align-items: center; flex-shrink: 0;
  }
  .wd-num-input {
    flex: 1; min-width: 0; background: transparent; border: none; outline: none;
    font-size: 1.35rem; font-weight: 600; color: var(--text);
    padding: 0 14px; height: 52px; font-variant-numeric: tabular-nums;
    -moz-appearance: textfield;
  }
  .wd-num-input:focus-visible { outline: none; }
  .wd-num-input::-webkit-outer-spin-button, .wd-num-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .wd-num-input::placeholder { color: #c3cad6; }
  .wd-max-btn {
    margin-right: 8px; padding: 6px 10px; border-radius: 8px;
    font-size: .72rem; font-weight: 700; letter-spacing: .04em;
    color: var(--primary); background: var(--primary-50); border: none;
    cursor: pointer; flex-shrink: 0; transition: background .15s;
  }
  .wd-max-btn:hover { background: var(--primary-100); }
  .wd-field-msg { font-size: .76rem; display: flex; align-items: center; gap: 5px; }
  .wd-field-msg.err  { color: var(--red); }
  .wd-field-msg.hint { color: var(--muted); }
  .wd-presets { display: flex; gap: 8px; flex-wrap: wrap; }
  .wd-preset {
    padding: 6px 14px; border-radius: 99px;
    background: var(--s1); border: 1px solid var(--border2);
    font-size: .8rem; font-weight: 500; color: var(--dim);
    cursor: pointer; transition: all .12s; white-space: nowrap; font-variant-numeric: tabular-nums;
  }
  .wd-preset:hover  { border-color: #a5b4fc; color: var(--primary); background: var(--primary-50); }
  .wd-preset.active { border-color: var(--primary); color: #fff; background: var(--primary); }
  .wd-balance-bar-wrap { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .wd-bar-labels, .wd-bar-remainder { display: flex; justify-content: space-between; align-items: center; }
  .wd-bar-lbl, .wd-bar-rem-lbl { font-size: .76rem; color: var(--subtle); }
  .wd-bar-val, .wd-bar-rem-val { font-size: .84rem; font-weight: 600; font-variant-numeric: tabular-nums; }
  .wd-bar-track { height: 6px; background: #e3e7ee; border-radius: 99px; overflow: hidden; }
  .wd-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #10b981, #14b8a6); transition: width .3s cubic-bezier(.16,1,.3,1); }
  .wd-bar-fill.over { background: linear-gradient(90deg, #ef4444, #f97316); }
  .wd-foot { padding: 0 24px 24px; display: flex; flex-direction: column; gap: 8px; }
  .btn-wd-submit {
    width: 100%; padding: 13px; border: none; border-radius: 12px;
    background: var(--primary); color: #fff;
    font-size: .95rem; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    box-shadow: 0 1px 2px rgba(79,70,229,.3), 0 8px 20px -6px rgba(79,70,229,.5);
    transition: background .15s, transform .12s, box-shadow .15s;
  }
  .btn-wd-submit:hover:not(:disabled) { background: var(--primary-600); transform: translateY(-1px); }
  .btn-wd-submit:active:not(:disabled) { transform: scale(.99); }
  .btn-wd-submit:disabled { background: var(--s3); color: var(--muted); box-shadow: none; cursor: not-allowed; }
  .btn-wd-cancel {
    width: 100%; padding: 12px; border: 1px solid var(--border2); border-radius: 12px;
    background: var(--s1); color: var(--dim);
    font-size: .9rem; font-weight: 600; cursor: pointer; transition: background .15s;
  }
  .btn-wd-cancel:hover { background: var(--s2); }
  .wd-result { padding: 36px 28px 28px; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .wd-result-icon-wrap { position: relative; width: 76px; height: 76px; display: grid; place-items: center; margin-bottom: 18px; }
  .wd-result-ring { position: absolute; inset: 0; border-radius: 50%; }
  .wd-result-ring.success { background: var(--gdim); }
  .wd-result-ring.failure { background: var(--rdim); }
  .wd-result-icon-bg { position: relative; width: 52px; height: 52px; border-radius: 50%; display: grid; place-items: center; color: #fff; }
  .wd-result-icon-bg.success { background: var(--green); box-shadow: 0 8px 20px -6px rgba(5,150,105,.6); }
  .wd-result-icon-bg.failure { background: var(--red);   box-shadow: 0 8px 20px -6px rgba(220,38,38,.6); }
  .wd-result-title { font-size: 1.25rem; font-weight: 700; letter-spacing: -.02em; margin-bottom: 6px; }
  .wd-result-amount { font-size: 1.6rem; font-weight: 700; color: var(--green); letter-spacing: -.02em; margin-bottom: 10px; font-variant-numeric: tabular-nums; animation: countUp .4s .1s cubic-bezier(.16,1,.3,1) both; }
  .wd-result-msg { font-size: .86rem; color: var(--subtle); line-height: 1.6; max-width: 320px; margin-bottom: 20px; }
  .wd-result-dest { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; background: var(--s2); border: 1px solid var(--border); font-size: .82rem; font-weight: 500; color: var(--dim); margin-bottom: 20px; }
  .wd-result-btns { display: flex; gap: 8px; width: 100%; }

  /* ── DRAWER ── */
  .overlay-backdrop { position: fixed; inset: 0; z-index: 50; background: rgba(15,23,42,.4); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); animation: fdin .18s ease both; }
  .drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: min(400px, 94vw); z-index: 51;
    background: var(--s2); border-left: 1px solid var(--border); box-shadow: var(--shadow-lg);
    display: flex; flex-direction: column; animation: slideIn .3s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: none; } }
  .dr-head { padding: 16px 20px; background: var(--s1); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .dr-title { font-size: 1rem; font-weight: 600; color: var(--text); }
  .dr-close-btn { width: 32px; height: 32px; border-radius: 9px; background: var(--s1); border: 1px solid var(--border); color: var(--subtle); cursor: pointer; display: grid; place-items: center; transition: background .15s, color .15s; }
  .dr-close-btn:hover { background: var(--s3); color: var(--text); }
  .dr-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
  .dr-profile-strip { display: flex; align-items: center; gap: 14px; padding: 18px; background: var(--s1); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 8px; box-shadow: var(--shadow-sm); }
  .dr-avatar { width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: grid; place-items: center; font-size: 1rem; font-weight: 700; color: #fff; box-shadow: 0 0 0 4px var(--primary-50); }
  .dr-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .dr-name { font-size: 1rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dr-email { font-size: .8rem; color: var(--subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .dr-role-chip { display: inline-block; margin-top: 6px; font-size: .7rem; font-weight: 600; padding: 2px 9px; border-radius: 99px; background: var(--primary-50); color: var(--primary); border: 1px solid var(--primary-100); width: fit-content; }
  .acc-item { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; background: var(--s1); box-shadow: var(--shadow-sm); }
  .acc-trigger { width: 100%; background: none; border: none; color: var(--text); display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; text-align: left; transition: background .12s; }
  .acc-trigger:hover { background: var(--s2); }
  .acc-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--s3); display: grid; place-items: center; flex-shrink: 0; color: var(--dim); }
  .acc-meta { flex: 1; min-width: 0; }
  .acc-title { font-size: .9rem; font-weight: 600; }
  .acc-sub   { font-size: .76rem; color: var(--subtle); margin-top: 1px; }
  .acc-chevron { flex-shrink: 0; color: var(--muted); transition: transform .2s; }
  .acc-chevron.open { transform: rotate(180deg); }
  .acc-content { padding: 16px; border-top: 1px solid var(--border); animation: accIn .2s cubic-bezier(.16,1,.3,1) both; }
  @keyframes accIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
  .info-table { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
  .info-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 14px; border-bottom: 1px solid var(--border); }
  .info-row:nth-child(even) { background: var(--s2); }
  .info-row:last-child { border-bottom: none; }
  .info-k { font-size: .82rem; color: var(--subtle); }
  .info-v { font-size: .82rem; font-weight: 500; color: var(--text); text-align: right; max-width: 58%; word-break: break-all; }
  .form-stack { display: flex; flex-direction: column; gap: 12px; }
  .form-label { display: block; font-size: .8rem; font-weight: 600; color: var(--dim); margin-bottom: 6px; }
  .form-input {
    width: 100%; background: var(--s1); border: 1px solid var(--border2); border-radius: 10px;
    padding: 10px 12px; font-size: .9rem; color: var(--text); outline: none;
    transition: border-color .15s, box-shadow .15s;
  }
  .form-input::placeholder { color: #a8b1c0; }
  .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-100); }
  .btn-primary, .btn-secondary, .btn-destructive {
    width: 100%; padding: 11px; border-radius: 10px;
    font-size: .88rem; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .15s, border-color .15s, transform .12s;
  }
  .btn-primary { border: none; background: var(--primary); color: #fff; box-shadow: 0 1px 2px rgba(79,70,229,.3); }
  .btn-primary:hover:not(:disabled) { background: var(--primary-600); }
  .btn-secondary { border: 1px solid var(--border2); background: var(--s1); color: var(--text); }
  .btn-secondary:hover:not(:disabled) { background: var(--s2); }
  .btn-destructive { border: 1px solid var(--rbdr); background: var(--rdim); color: var(--red); }
  .btn-destructive:hover { background: #fee2e2; }
  .btn-primary:disabled, .btn-secondary:disabled { opacity: .55; cursor: not-allowed; }
  .feedback { padding: 10px 12px; border-radius: 10px; font-size: .8rem; line-height: 1.5; display: flex; align-items: flex-start; gap: 8px; animation: fdin .18s ease both; }
  .feedback svg { flex-shrink: 0; margin-top: 2px; }
  .feedback-ok  { background: var(--gdim); border: 1px solid var(--gbdr); color: #047857; }
  .feedback-err { background: var(--rdim); border: 1px solid var(--rbdr); color: #b91c1c; }

  /* ── ADMIN ── */
  .toolbar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
  .search-wrap {
    flex: 1; min-width: 200px; display: flex; align-items: center; gap: 8px;
    background: var(--s1); border: 1px solid var(--border2); border-radius: 10px; padding: 0 12px;
    box-shadow: var(--shadow-sm); transition: border-color .15s, box-shadow .15s;
  }
  .search-wrap:focus-within { border-color: var(--purple); box-shadow: 0 0 0 4px var(--pdim); }
  .search-wrap > svg { color: var(--muted); flex-shrink: 0; }
  .search-input { flex: 1; min-width: 0; background: transparent; border: none; outline: none; font-size: .88rem; color: var(--text); padding: 10px 0; }
  .search-input:focus-visible { outline: none; }
  .search-input::placeholder { color: var(--muted); }
  .search-clear { background: var(--s3); border: none; cursor: pointer; color: var(--subtle); display: grid; place-items: center; width: 22px; height: 22px; border-radius: 6px; }
  .search-clear:hover { color: var(--text); }
  .filter-btn {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 10px 14px; border-radius: 10px;
    background: var(--s1); border: 1px solid var(--border2);
    font-size: .82rem; font-weight: 500; color: var(--dim);
    cursor: pointer; white-space: nowrap; box-shadow: var(--shadow-sm); transition: all .15s;
  }
  .filter-btn:hover { background: var(--s2); }
  .filter-btn.active-filter       { border-color: var(--pbdr); color: var(--purple); background: var(--pdim); }
  .filter-btn.active-filter-amber { border-color: var(--abdr); color: var(--amber);  background: var(--adim); }
  .filter-count { background: var(--amber); color: #fff; border-radius: 99px; padding: 0 7px; font-size: .7rem; font-weight: 700; line-height: 1.5; }
  .emp-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 480px), 1fr)); gap: 16px; align-items: start; }
  .emp-card {
    background: var(--s1); border: 1px solid var(--border); border-radius: 16px; overflow: hidden;
    box-shadow: var(--shadow-sm); transition: border-color .2s, box-shadow .2s; position: relative;
  }
  .emp-card:hover { border-color: var(--border2); box-shadow: var(--shadow-md); }
  .emp-card.has-pending { border-color: #fcd34d; box-shadow: 0 0 0 3px #fef3c7, var(--shadow-sm); }
  .emp-card-top { padding: 18px 20px 16px; display: flex; align-items: flex-start; gap: 14px; }
  .emp-avatar { width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0; display: grid; place-items: center; font-size: .9rem; font-weight: 700; color: #fff; box-shadow: inset 0 1px 0 rgba(255,255,255,.25); }
  .emp-header { flex: 1; min-width: 0; }
  .emp-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .emp-name { font-size: 1rem; font-weight: 600; letter-spacing: -.01em; }
  .emp-status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .emp-status-dot.active   { background: #10b981; box-shadow: 0 0 0 3px #d1fae5; }
  .emp-status-dot.inactive { background: #f87171; box-shadow: 0 0 0 3px #fee2e2; }
  .emp-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
  .chip-xs { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 99px; font-size: .7rem; font-weight: 500; border: 1px solid; }
  .chip-xs.chip-purple { color: var(--purple); background: var(--pdim); border-color: var(--pbdr); }
  .chip-xs.chip-blue   { color: var(--blue);   background: var(--bdim); border-color: var(--bbdr); }
  .chip-xs.chip-green  { color: var(--green);  background: var(--gdim); border-color: var(--gbdr); }
  .chip-xs.chip-muted  { color: var(--subtle); background: var(--s3);   border-color: var(--border); }
  .chip-xs.chip-amber  { color: var(--amber);  background: var(--adim); border-color: var(--abdr); }
  .emp-phone { font-size: .78rem; color: var(--subtle); display: flex; align-items: center; gap: 5px; margin-top: 8px; }
  .emp-uid { text-align: right; flex-shrink: 0; }
  .emp-uid-lbl { font-size: .66rem; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
  .emp-uid-val { font-family: var(--mono); font-size: .72rem; color: var(--subtle); max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .emp-wallet-row { display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid var(--border); background: var(--s2); }
  .wm { padding: 12px 16px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .wm:last-child { border-right: none; }
  .wm-lbl { display: flex; align-items: center; gap: 5px; font-size: .72rem; font-weight: 500; color: var(--subtle); }
  .wm-val { font-size: .9rem; font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .emp-wallet-empty { padding: 12px 20px; border-top: 1px solid var(--border); background: var(--s2); font-size: .8rem; color: var(--muted); }
  .pending-wd-row { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-top: 1px solid var(--abdr); background: var(--adim); animation: rise .3s cubic-bezier(.16,1,.3,1) both; }
  .pending-wd-icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; background: #fef3c7; display: grid; place-items: center; color: var(--amber); }
  .pending-wd-info { flex: 1; min-width: 0; }
  .pending-wd-title { font-size: .88rem; font-weight: 600; color: #92400e; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .pending-wd-title .wd-amount { font-size: .88rem; font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
  .pending-wd-meta { font-size: .76rem; color: #a16207; margin-top: 2px; line-height: 1.55; }
  .pending-wd-meta em { font-style: normal; font-weight: 500; color: #92400e; }
  .btn-approve, .btn-confirm {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    border-radius: 10px; background: var(--green); color: #fff; border: none;
    font-weight: 600; cursor: pointer; white-space: nowrap;
    box-shadow: 0 1px 2px rgba(5,150,105,.3), 0 6px 16px -6px rgba(5,150,105,.55);
    transition: background .15s, transform .12s;
  }
  .btn-approve { padding: 9px 16px; font-size: .85rem; flex-shrink: 0; }
  .btn-approve:hover:not(:disabled), .btn-confirm:hover:not(:disabled) { background: #047857; transform: translateY(-1px); }
  .btn-approve:disabled, .btn-confirm:disabled { opacity: .5; cursor: not-allowed; transform: none; }
  .skel-row .skel { flex: 1; }
  .skel-row { display: flex; gap: 10px; padding: 14px 16px; border-top: 1px solid var(--border); background: var(--s2); }
  .empty-state { padding: 56px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .empty-icon-wrap { width: 56px; height: 56px; border-radius: 16px; background: var(--s3); display: grid; place-items: center; color: var(--muted); margin-bottom: 6px; }
  .empty-title { font-size: 1rem; font-weight: 600; color: var(--text); }
  .empty-sub { font-size: .85rem; color: var(--subtle); }
  .toast {
    position: fixed; bottom: 24px; right: 24px; z-index: 99;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px; border-radius: 12px;
    background: #0f172a; color: #f8fafc;
    font-size: .86rem; font-weight: 500;
    animation: toastIn .3s cubic-bezier(.16,1,.3,1) both; box-shadow: var(--shadow-lg);
  }
  .toast-ok  svg { color: #34d399; }
  .toast-err svg { color: #f87171; }
  @keyframes toastIn { from { opacity: 0; transform: translateY(16px) scale(.97); } to { opacity: 1; transform: none; } }
  .confirm-modal {
    width: 100%; max-width: 400px; background: var(--s1); border-radius: 18px; overflow: hidden;
    box-shadow: var(--shadow-lg); animation: popIn .3s cubic-bezier(.16,1,.3,1) both;
    padding: 24px; display: flex; flex-direction: column; gap: 16px;
  }
  .confirm-icon-wrap { width: 48px; height: 48px; border-radius: 12px; background: var(--gdim); display: grid; place-items: center; color: var(--green); }
  .confirm-title { font-size: 1.15rem; font-weight: 700; letter-spacing: -.02em; }
  .confirm-body { font-size: .86rem; color: var(--subtle); line-height: 1.6; }
  .confirm-detail { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
  .confirm-detail-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
  .confirm-detail-k { font-size: .82rem; color: var(--subtle); }
  .confirm-detail-v { font-size: .82rem; font-weight: 500; color: var(--text); max-width: 60%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .confirm-btns { display: flex; gap: 8px; }
  .btn-cancel-sm { flex: 1; padding: 11px; border: 1px solid var(--border2); border-radius: 10px; background: var(--s1); color: var(--dim); font-size: .88rem; font-weight: 600; cursor: pointer; transition: background .15s; }
  .btn-cancel-sm:hover { background: var(--s2); }
  .btn-confirm { flex: 2; padding: 11px; font-size: .88rem; }

  /* ── SPLASH ── */
  .splash { min-height: 100vh; display: grid; place-items: center; background: var(--bg); }
  .splash-inner { display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .splash-txt { font-size: .86rem; font-weight: 500; color: var(--subtle); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1000px) {
    .emp-grid { grid-template-columns: 1fr; }
    .overview-row { grid-template-columns: repeat(2, 1fr); }
    .tx-list { max-height: none; }
  }
  /* Lock background scroll while a modal / drawer is open */
  body:has(.modal-overlay), body:has(.drawer) { overflow: hidden; }

  /* Dynamic viewport height (accounts for mobile browser toolbars) */
  .app, .splash { min-height: 100vh; min-height: 100dvh; }

  /* Safe areas (notch / home indicator) */
  nav { padding-top: env(safe-area-inset-top); }
  .nav-inner { padding-left: max(24px, env(safe-area-inset-left)); padding-right: max(24px, env(safe-area-inset-right)); }

  /* ── PHONES ── */
  @media (max-width: 640px) {
    body { font-size: 14.5px; }

    /* Nav */
    .nav-inner { height: 58px; padding-left: max(16px, env(safe-area-inset-left)); padding-right: max(16px, env(safe-area-inset-right)); }
    .nav-user { display: none; }
    .nav-brand { font-size: .95rem; }
    .nav-logout-btn { padding: 9px 12px; }

    /* Page */
    .page {
      padding: 18px max(14px, env(safe-area-inset-right)) calc(56px + env(safe-area-inset-bottom)) max(14px, env(safe-area-inset-left));
      gap: 22px;
    }
    .emp-side { gap: 22px; }
    .sec-label { margin-bottom: 10px; }
    .card, .wallet-tx-block, .emp-card { border-radius: 14px; }

    /* Hero */
    .hero, .admin-hero { padding: 20px 18px; }
    .hero-eyebrow { font-size: .78rem; }
    .hero-name, .admin-hero-title { font-size: 1.45rem; }
    .admin-hero-sub { font-size: .84rem; }
    .hero-date-box { display: none; }
    .hero-chips { margin-top: 12px; }
    .hero-divider { margin: 18px 0 14px; }
    .ref-row { flex-direction: column; align-items: stretch; gap: 10px; padding: 12px; }
    .ref-url { white-space: normal; word-break: break-all; line-height: 1.5; font-size: .78rem; }
    .btn-copy { justify-content: center; padding: 12px 16px; font-size: .88rem; border-radius: 10px; }

    /* Wallet: stack balance above a full-width Withdraw button */
    .wallet-inner { padding: 20px 18px; }
    .wallet-top { flex-direction: column; align-items: stretch; gap: 16px; }
    .wallet-balance { font-size: clamp(1.85rem, 9vw, 2.3rem); }
    .wallet-right { flex-direction: row; align-items: center; }
    .wallet-icon-circle { display: none; }
    .btn-withdraw, .btn-withdraw-pending { flex: 1; justify-content: center; padding: 13px 18px; font-size: .92rem; border-radius: 12px; }
    .pending-wd-banner { margin-top: 14px; padding: 12px 14px; }
    .wallet-metrics { gap: 8px; margin-top: 18px; }
    .wm-item { padding: 10px 11px; gap: 4px; }
    .wm-label { font-size: .7rem; gap: 4px; }
    .wm-value { font-size: .98rem; }

    /* Transactions */
    .tx-toolbar { padding: 12px 14px 12px 18px; }
    .tx-row { padding: 14px 18px; gap: 12px; }
    .tx-icon-wrap { width: 36px; height: 36px; border-radius: 10px; }
    .tx-right { min-width: 0; }
    .tx-comm-val { font-size: .9rem; }
    .tx-pills { gap: 5px; margin-top: 6px; }
    .tx-empty { padding: 40px 20px; }

    /* Stats */
    .stats-grid, .overview-row { gap: 10px; }
    .stat-card { padding: 14px; border-radius: 12px; }
    .stat-head { margin-bottom: 10px; }
    .stat-label { font-size: .76rem; }
    .stat-icon { width: 28px; height: 28px; }
    .stat-value { font-size: 1.35rem; }
    .stat-value.sm { font-size: 1.1rem; }
    .stat-sub { font-size: .72rem; }

    /* Bottom-sheet modals */
    .modal-overlay { place-items: end center; padding: 0; }
    .wd-modal, .confirm-modal {
      max-width: none; border-radius: 22px 22px 0 0;
      position: relative; max-height: 92dvh; overflow-y: auto; overscroll-behavior: contain;
      animation: sheetUp .32s cubic-bezier(.16,1,.3,1) both;
    }
    .wd-modal::before, .confirm-modal::before {
      content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
      width: 40px; height: 4px; border-radius: 99px; background: rgba(15,23,42,.18); z-index: 2;
    }
    .wd-hero { padding: 24px 18px 18px; }
    .wd-balance-num { font-size: 2rem; }
    .wd-body { padding: 18px; }
    .wd-foot { padding: 0 18px calc(18px + env(safe-area-inset-bottom)); }
    .wd-result { padding: 36px 20px calc(22px + env(safe-area-inset-bottom)); }
    .confirm-modal { padding: 28px 20px calc(20px + env(safe-area-inset-bottom)); }

    /* Drawer: full screen */
    .drawer { width: 100vw; border-left: none; }
    .dr-head { padding-top: calc(14px + env(safe-area-inset-top)); }
    .dr-body { padding-bottom: calc(16px + env(safe-area-inset-bottom)); overscroll-behavior: contain; }

    /* Admin */
    .search-wrap { flex-basis: 100%; }
    .filter-btn { flex: 1; justify-content: center; }
    .emp-list { gap: 12px; }
    .emp-card-top { padding: 16px; gap: 12px; }
    .emp-avatar { width: 42px; height: 42px; }
    .emp-uid { display: none; }
    .emp-wallet-row { grid-template-columns: 1fr 1fr; }
    .wm { padding: 11px 16px; }
    .wm:nth-child(2) { border-right: none; }
    .wm:nth-child(n+3) { border-top: 1px solid var(--border); }
    .pending-wd-row { flex-direction: column; align-items: stretch; gap: 12px; padding: 14px 16px; }
    .pending-wd-icon { display: none; }
    .btn-approve { width: 100%; padding: 12px 16px; font-size: .9rem; }

    .toast { left: 14px; right: 14px; bottom: calc(14px + env(safe-area-inset-bottom)); }
  }
  @keyframes sheetUp { from { transform: translateY(100%); } to { transform: none; } }

  @media (max-width: 420px) {
    .nav-logout-txt, .nav-admin-badge span { display: none; }
    .nav-admin-badge { padding: 4px 7px; }
  }
  @media (max-width: 360px) {
    .page { padding-left: 10px; padding-right: 10px; }
    .stats-grid, .overview-row { gap: 8px; }
    .stat-card { padding: 12px; }
    .stat-value { font-size: 1.2rem; }
    .wallet-metrics { grid-template-columns: 1fr 1fr; }
    .wallet-metrics .wm-item:last-child { grid-column: span 2; }
  }

  /* ── TOUCH DEVICES ── */
  @media (pointer: coarse) {
    /* 16px+ inputs stop iOS Safari from zooming on focus */
    .form-input, .search-input, .date-pick { font-size: 16px; }
    .date-pick { min-height: 40px; }
    .form-input { padding: 12px 14px; }
    /* Comfortable tap targets */
    .nav-av { width: 40px; height: 40px; }
    .wd-close, .dr-close-btn { width: 40px; height: 40px; border-radius: 10px; }
    .search-clear { width: 30px; height: 30px; }
    .filter-btn { min-height: 44px; }
    .wd-preset { padding: 10px 16px; font-size: .86rem; }
    .wd-max-btn { padding: 9px 12px; }
    .acc-trigger { padding: 16px; }
    .btn-primary, .btn-secondary, .btn-destructive, .btn-cancel-sm, .btn-confirm { min-height: 46px; }
  }

  /* No sticky hover effects on touch screens; give press feedback instead */
  @media (hover: none) {
    .stat-card:hover, .emp-card:hover { transform: none; box-shadow: var(--shadow-sm); border-color: var(--border); }
    .emp-card.has-pending:hover { border-color: #fcd34d; box-shadow: 0 0 0 3px #fef3c7, var(--shadow-sm); }
    .tx-row:hover { background: transparent; }
    .btn-withdraw:hover:not(:disabled), .btn-wd-submit:hover:not(:disabled),
    .btn-approve:hover:not(:disabled), .btn-confirm:hover:not(:disabled),
    .nav-av:hover { transform: none; }
    .btn-withdraw:active:not(:disabled), .btn-wd-submit:active:not(:disabled), .btn-copy:active,
    .btn-approve:active:not(:disabled), .btn-confirm:active:not(:disabled),
    .btn-primary:active:not(:disabled), .filter-btn:active, .wd-preset:active { transform: scale(.97); }
    .tx-row:active, .acc-trigger:active { background: var(--s2); }
  }
`;

export default styles;
