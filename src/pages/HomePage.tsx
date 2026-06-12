import { useNavigate } from 'react-router-dom'
import zinusLogo from '@/assets/zinus-tulisan-putih-contour.webp'
import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'

export default function HomePage() {
  const navigate = useNavigate()

  // Training categories split by department
  const COMPLIANCE_TRAININGS = [
    { name: 'Etika & Tata Tertib Karyawan', count: '' },
    { name: 'Company Profile',              count: '' },
    { name: 'C-TPAT',                       count: '' },
    { name: 'dan lainnya...',               count: '', faint: true },
  ]
  const HR_TRAININGS = [
    { name: 'Orientasi Karyawan',               count: '' },
    { name: 'BPJS Kesehatan & BPJS TK',         count: '' },
    { name: 'Management Knowledge',             count: '' },
    { name: 'dan lainnya...',                   count: '', faint: true },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

        :root {
          --teal-deep:  #0f5c57;
          --teal-mid:   #1a7a73;
          --teal-main:  #329F96;
          --teal-light: #2ab5aa;
          --teal-pale:  #e6f7f6;
          --text-dark:  #0d2220;
          --text-muted: #4a6b69;
          --text-faint: #99bfbd;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .hr {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5fafa;
          color: var(--text-dark);
          overflow-x: hidden;
        }

        /* ─── Navbar ─────────────────────────────────── */
        .hr-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 48px;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(50,159,150,0.1);
          box-shadow: 0 2px 24px rgba(0,0,0,0.05);
        }
        .hr-nav-logos { display: flex; align-items: center; gap: 18px; }
        .hr-nav-logos img.logo-zinus  { height: 26px; width: auto; object-fit: contain; }
        .hr-nav-logos img.logo-hyundai { height: 32px; width: auto; object-fit: contain; }
        .hr-nav-divider { width: 1px; height: 26px; background: rgba(50,159,150,0.25); }
        .hr-nav-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 22px; border-radius: 50px;
          font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: none;
          background: linear-gradient(135deg, var(--teal-mid), var(--teal-light));
          color: white;
          box-shadow: 0 4px 16px rgba(50,159,150,0.32);
          transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .hr-nav-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(50,159,150,0.44); }
        .hr-nav-btn:active { transform: scale(0.97); }

        /* ─── Hero ───────────────────────────────────── */
        .hr-hero {
          padding-top: 64px;
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hr-hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 68% 38%, rgba(50,159,150,0.16) 0%, transparent 62%),
            radial-gradient(ellipse 45% 45% at 8% 80%, rgba(26,122,115,0.10) 0%, transparent 55%),
            #f5fafa;
        }
        .hr-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(50,159,150,0.14) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 55% 55% at 80% 28%, black 0%, transparent 70%);
        }
        .hr-ring {
          position: absolute; border-radius: 50%;
          border: 1.5px solid rgba(50,159,150,0.10); pointer-events: none;
        }
        .hr-ring-a { width: 560px; height: 560px; top: -100px; right: -120px; }
        .hr-ring-b { width: 360px; height: 360px; top: 50px;  right: 60px; }
        .hr-ring-c { width: 180px; height: 180px; top: 160px; right: 200px; border-color: rgba(50,159,150,0.18); }

        .hr-hero-inner {
          position: relative; z-index: 2;
          width: 100%; max-width: 1100px;
          margin: 0 auto; padding: 80px 48px;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 64px; align-items: center;
        }

        /* ─── Left ───────────────────────────────────── */
        .hr-left { display: flex; flex-direction: column; gap: 28px; }

        .hr-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 6px 14px 6px 8px; border-radius: 50px;
          background: rgba(50,159,150,0.08); border: 1px solid rgba(50,159,150,0.18);
          width: fit-content; animation: fadeUp 0.55s ease both;
        }
        .hr-eyebrow-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--teal-main);
          animation: pulse-dot 2.2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(0.8); }
        }
        .hr-eyebrow span {
          font-size: 11.5px; font-weight: 700;
          color: var(--teal-mid); letter-spacing: 0.6px; text-transform: uppercase;
        }

        .hr-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(34px, 4.2vw, 54px); line-height: 1.1;
          color: var(--text-dark); animation: fadeUp 0.55s 0.08s ease both;
        }
        .hr-title em { font-style: italic; color: var(--teal-main); }

        .hr-desc {
          font-size: 15.5px; line-height: 1.72;
          color: var(--text-muted); max-width: 440px;
          animation: fadeUp 0.55s 0.16s ease both;
        }

        .hr-actions {
          display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
          animation: fadeUp 0.55s 0.24s ease both;
        }

        .hr-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px; border-radius: 50px;
          font-size: 14.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; border: none;
          background: linear-gradient(135deg, var(--teal-mid) 0%, var(--teal-light) 100%);
          color: white; box-shadow: 0 8px 28px rgba(50,159,150,0.38);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .hr-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(50,159,150,0.50); }
        .hr-btn-primary:active { transform: scale(0.97); }

        .hr-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 26px; border-radius: 50px;
          font-size: 14.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          cursor: pointer; background: white; color: var(--teal-mid);
          border: 1.5px solid rgba(50,159,150,0.28);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .hr-btn-ghost:hover { border-color: var(--teal-main); box-shadow: 0 4px 18px rgba(50,159,150,0.16); transform: translateY(-1px); }

        .hr-stats { display: flex; gap: 28px; padding-top: 4px; animation: fadeUp 0.55s 0.32s ease both; }
        .hr-stat  { display: flex; flex-direction: column; gap: 3px; }
        .hr-stat-num  { font-family: 'DM Serif Display', serif; font-size: 30px; line-height: 1; color: var(--teal-deep); }
        .hr-stat-label { font-size: 11.5px; color: var(--text-faint); font-weight: 500; }
        .hr-stat-sep  { width: 1px; background: rgba(50,159,150,0.14); align-self: stretch; }

        /* ─── Right — Training Info Card ─────────────── */
        .hr-right {
          display: flex; align-items: center; justify-content: center;
          animation: fadeUp 0.7s 0.18s ease both;
        }

        .hr-card-wrap {
          position: relative;
          width: 380px;
        }

        /* Shadow cards behind */
        .hr-card-shadow-a {
          position: absolute;
          top: 14px; left: 14px; right: -14px; bottom: -14px;
          border-radius: 24px;
          background: linear-gradient(135deg, #1a7a73, #2ab5aa);
          opacity: 0.14;
          transform: rotate(2deg);
        }

        /* Main card */
        .hr-card {
          position: relative;
          background: white; border-radius: 24px; padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.09), 0 4px 16px rgba(50,159,150,0.10);
          z-index: 2;
        }

        /* Department tabs */
        .hr-dept-tabs {
          display: flex; gap: 8px; margin-bottom: 20px;
        }
        .hr-dept-tab {
          flex: 1; padding: 8px 12px; border-radius: 10px; border: none; cursor: default;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700;
          display: flex; align-items: center; gap: 7px;
          letter-spacing: 0.3px;
        }
        .hr-dept-tab.compliance {
          background: rgba(50,159,150,0.10); color: var(--teal-mid);
        }
        .hr-dept-tab.hr-tab {
          background: rgba(99,102,241,0.10); color: #4f46e5;
        }
        .hr-dept-tab-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }

        /* Section label */
        .hr-section-label {
          font-size: 10.5px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; margin-bottom: 8px;
          display: flex; align-items: center; gap: 7px;
        }
        .hr-section-label::after {
          content: '';
          flex: 1; height: 1px; background: rgba(50,159,150,0.12);
        }

        /* Training row */
        .hr-training-list { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
        .hr-training-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 11px;
          background: #f8fcfc; border: 1px solid rgba(50,159,150,0.08);
        }
        .hr-training-row.faint {
          background: transparent; border-color: transparent; padding-top: 2px; padding-bottom: 2px;
        }
        .hr-training-dot {
          width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
        }
        .hr-training-row.faint .hr-training-dot { opacity: 0; }
        .hr-training-name {
          flex: 1; font-size: 13px; font-weight: 600; color: var(--text-dark);
        }
        .hr-training-row.faint .hr-training-name {
          font-size: 11.5px; font-weight: 500; font-style: italic; color: var(--text-faint);
        }
        .hr-training-count {
          font-size: 11px; color: var(--text-faint); white-space: nowrap;
        }

        /* HR section */
        .hr-training-list.indigo .hr-training-row {
          background: #f8f8ff; border-color: rgba(99,102,241,0.08);
        }
        .hr-training-list.indigo .hr-training-row.faint {
          background: transparent; border-color: transparent;
        }

        /* Floating score */
        .hr-float {
          position: absolute;
          bottom: -18px; right: -18px;
          background: white; border-radius: 16px; padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          z-index: 3; display: flex; align-items: center; gap: 10px;
          animation: float 3.2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        .hr-float-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0;
        }
        .hr-float-text p    { font-size: 10.5px; color: var(--text-faint); }
        .hr-float-text strong { font-size: 15px; font-weight: 700; color: var(--text-dark); }

        /* ─── Footer ────────────────────────────────── */
        .hr-footer {
          border-top: 1px solid rgba(50,159,150,0.1);
          padding: 28px 48px;
          display: flex; align-items: center; justify-content: space-between;
          max-width: 1100px; margin: 0 auto; flex-wrap: wrap; gap: 12px;
        }
        .hr-footer-logos { display: flex; align-items: center; gap: 14px; }
        .hr-footer-logos img.logo-zinus-f   { height: 22px; object-fit: contain; opacity: 0.8; }
        .hr-footer-logos img.logo-hyundai-f { height: 26px; object-fit: contain; opacity: 0.8; }
        .hr-footer-divider { width: 1px; height: 18px; background: rgba(50,159,150,0.2); }
        .hr-footer-right { text-align: right; }
        .hr-footer-right p     { font-size: 12px; color: var(--text-faint); }
        .hr-footer-right small { font-size: 11px; color: #b5d2d0; }

        /* ─── Animations ─────────────────────────────── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }

        /* ─── Responsive ─────────────────────────────── */
        @media (max-width: 900px) {
          .hr-nav { padding: 0 20px; }
          .hr-hero-inner { grid-template-columns: 1fr; gap: 48px; padding: 64px 20px 60px; }
          .hr-right { display: none; }
          .hr-title { font-size: clamp(32px, 8vw, 44px); }
          .hr-desc { max-width: 100%; }
          .hr-stats { gap: 20px; }
          .hr-stat-num { font-size: 26px; }
          .hr-footer { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
          .hr-footer-right { text-align: left; }
        }
        @media (max-width: 480px) {
          .hr-actions { flex-direction: column; align-items: flex-start; }
          .hr-btn-primary, .hr-btn-ghost { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="hr">

        {/* ── Navbar ───────────────────────────────────────── */}
        <nav className="hr-nav">
          <div className="hr-nav-logos">
            <img src={zinusLogo}   alt="Zinus"   className="logo-zinus" />
            <div className="hr-nav-divider" />
            <img src={hyundaiLogo} alt="Hyundai" className="logo-hyundai" />
          </div>
          <button className="hr-nav-btn" onClick={() => navigate('/admin/login')}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login Admin
          </button>
        </nav>

        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="hr-hero">
          <div className="hr-hero-bg" />
          <div className="hr-dots" />
          <div className="hr-ring hr-ring-a" />
          <div className="hr-ring hr-ring-b" />
          <div className="hr-ring hr-ring-c" />

          <div className="hr-hero-inner">

            {/* Left */}
            <div className="hr-left">
              <div className="hr-eyebrow">
                <div className="hr-eyebrow-dot" />
                <span>Platform Training Internal</span>
              </div>

              <h1 className="hr-title">
                Platform Peningkatan<br />
                <em>Kompetensi</em><br />
                Karyawan
              </h1>

              <p className="hr-desc">
                Ujian evaluasi online untuk mengukur pemahaman karyawan Zinus Indonesia
                terhadap materi training — dikelola oleh tim Compliance.
              </p>

              <div className="hr-actions">
                <button className="hr-btn-primary" onClick={() => navigate('/quiz')}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 12h6M9 16h4" />
                  </svg>
                  Mulai Evaluasi
                </button>
                <button className="hr-btn-ghost" onClick={() => navigate('/admin/login')}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Portal
                </button>
              </div>

              <div className="hr-stats">
                <div className="hr-stat">
                  <span className="hr-stat-num">2</span>
                  <span className="hr-stat-label">Departemen</span>
                </div>
                <div className="hr-stat-sep" />
                <div className="hr-stat">
                  <span className="hr-stat-num">25+</span>
                  <span className="hr-stat-label">Soal Tersedia</span>
                </div>
                <div className="hr-stat-sep" />
                <div className="hr-stat">
                  <span className="hr-stat-num">2</span>
                  <span className="hr-stat-label">Factory</span>
                </div>
              </div>
            </div>

            {/* Right — Training Info Card */}
            <div className="hr-right">
              <div className="hr-card-wrap">
                <div className="hr-card-shadow-a" />

                <div className="hr-card">

                  {/* Department badges */}
                  <div className="hr-dept-tabs">
                    <div className="hr-dept-tab compliance">
                      <div className="hr-dept-tab-dot" style={{ background: '#329F96' }} />
                      Compliance
                    </div>
                    <div className="hr-dept-tab hr-tab">
                      <div className="hr-dept-tab-dot" style={{ background: '#6366f1' }} />
                      HR
                    </div>
                  </div>

                  {/* Compliance trainings */}
                  <div className="hr-section-label" style={{ color: '#329F96' }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Compliance
                  </div>

                  <div className="hr-training-list">
                    {COMPLIANCE_TRAININGS.map((t) => (
                      <div className={`hr-training-row${t.faint ? ' faint' : ''}`} key={t.name}>
                        <div className="hr-training-dot" style={{ background: '#329F96' }} />
                        <span className="hr-training-name">{t.name}</span>
                        <span className="hr-training-count">{t.count}</span>
                      </div>
                    ))}
                  </div>

                  {/* HR trainings */}
                  <div className="hr-section-label" style={{ color: '#6366f1' }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    HR
                  </div>

                  <div className="hr-training-list indigo">
                    {HR_TRAININGS.map((t) => (
                      <div className={`hr-training-row${t.faint ? ' faint' : ''}`} key={t.name}>
                        <div className="hr-training-dot" style={{ background: '#6366f1' }} />
                        <span className="hr-training-name">{t.name}</span>
                        <span className="hr-training-count">{t.count}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Floating total badge */}
                <div className="hr-float">
                  <div className="hr-float-icon">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 12h6M9 16h4" />
                    </svg>
                  </div>
                  <div className="hr-float-text">
                    <p>Total Materi</p>
                    <strong>6+ Training</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer>
          <div className="hr-footer">
            <div className="hr-footer-logos">
              <img src={zinusLogo}   alt="Zinus"   className="logo-zinus-f" />
              <div className="hr-footer-divider" />
              <img src={hyundaiLogo} alt="Hyundai" className="logo-hyundai-f" />
            </div>
            <div className="hr-footer-right">
              <p>© {new Date().getFullYear()} Compliance — Zinus Indonesia.</p>
              <small>Developed by Nurmalik Wijaya</small>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}