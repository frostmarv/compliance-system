import { useNavigate } from 'react-router-dom'
import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'
import zinusLogo from '@/assets/zinus-tulisan-putih-contour.webp'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --teal-deep: #0f5c57;
          --teal-mid:  #1a7a73;
          --teal-main: #329F96;
          --teal-light:#2ab5aa;
          --teal-pale: #e6f7f6;
        }

        .home-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f5fafa;
          color: #1a2e2d;
          overflow-x: hidden;
        }

        /* ── Navbar ─────────────────────────────────── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          height: 68px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(50,159,150,0.12);
          box-shadow: 0 2px 20px rgba(0,0,0,0.05);
        }

        .navbar-logos {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .navbar-logos img.hyundai {
          height: 36px;
          width: auto;
          object-fit: contain;
        }

        .navbar-divider {
          width: 1px;
          height: 28px;
          background: #329F9640;
        }

        .navbar-logos img.zinus {
          height: 28px;
          width: auto;
          object-fit: contain;
        }

        .nav-login-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 22px;
          border-radius: 50px;
          font-size: 13.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.2px;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, var(--teal-mid), var(--teal-light));
          color: white;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 14px rgba(50,159,150,0.35);
        }
        .nav-login-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(50,159,150,0.45);
        }
        .nav-login-btn:active { transform: scale(0.97); }

        /* ── Hero ───────────────────────────────────── */
        .hero {
          padding-top: 68px;
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        /* Big background gradient mesh */
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(50,159,150,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 10% 80%, rgba(26,122,115,0.12) 0%, transparent 55%),
            #f5fafa;
        }

        /* Decorative rings */
        .ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(50,159,150,0.12);
          pointer-events: none;
        }
        .ring-1 { width: 520px; height: 520px; top: -80px; right: -100px; }
        .ring-2 { width: 340px; height: 340px; top: 60px; right: 40px; }
        .ring-3 { width: 180px; height: 180px; top: 160px; right: 180px; border-color: rgba(50,159,150,0.2); }

        /* Grid dot pattern */
        .dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(50,159,150,0.15) 1px, transparent 1px);
          background-size: 32px 32px;
          opacity: 0.6;
          pointer-events: none;
          mask-image: radial-gradient(ellipse 60% 60% at 80% 30%, black 0%, transparent 70%);
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          width: 100%;
        }

        /* ── Hero Left ──────────────────────────────── */
        .hero-left { display: flex; flex-direction: column; gap: 28px; }

        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px 6px 8px;
          border-radius: 50px;
          background: rgba(50,159,150,0.1);
          border: 1px solid rgba(50,159,150,0.2);
          width: fit-content;
          animation: fadeUp 0.6s ease both;
        }
        .hero-tag-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--teal-main);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .hero-tag span {
          font-size: 12px;
          font-weight: 600;
          color: var(--teal-mid);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 4.5vw, 56px);
          line-height: 1.1;
          color: #0d2220;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-title em {
          font-style: italic;
          color: var(--teal-main);
        }

        .hero-desc {
          font-size: 16px;
          line-height: 1.7;
          color: #4a6b69;
          max-width: 460px;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: none;
          background: linear-gradient(135deg, var(--teal-mid) 0%, var(--teal-light) 100%);
          color: white;
          box-shadow: 0 8px 28px rgba(50,159,150,0.40);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(50,159,150,0.50);
        }
        .btn-primary:active { transform: scale(0.97); }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 50px;
          font-size: 15px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          background: white;
          color: var(--teal-mid);
          border: 1.5px solid rgba(50,159,150,0.3);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
        }
        .btn-secondary:hover {
          border-color: var(--teal-main);
          box-shadow: 0 4px 18px rgba(50,159,150,0.18);
          transform: translateY(-1px);
        }

        /* Stats row */
        .hero-stats {
          display: flex;
          gap: 32px;
          padding-top: 8px;
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .stat-item { display: flex; flex-direction: column; gap: 2px; }
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 28px;
          color: var(--teal-deep);
          line-height: 1;
        }
        .stat-label { font-size: 12px; color: #7a9997; font-weight: 500; }
        .stat-sep { width: 1px; background: rgba(50,159,150,0.15); align-self: stretch; }

        /* ── Hero Right — Feature Card Stack ───────── */
        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        .card-stack {
          position: relative;
          width: 360px;
          height: 420px;
        }

        .card-back {
          position: absolute;
          width: 300px;
          height: 180px;
          border-radius: 20px;
          background: linear-gradient(135deg, #1a7a73, #2ab5aa);
          opacity: 0.25;
          transform: rotate(6deg) translateX(30px);
          top: 40px;
          right: 0;
        }
        .card-back-2 {
          position: absolute;
          width: 300px;
          height: 180px;
          border-radius: 20px;
          background: linear-gradient(135deg, #329F96, #1a7a73);
          opacity: 0.15;
          transform: rotate(-4deg) translateX(-20px);
          top: 120px;
          right: 20px;
        }

        .card-main {
          position: absolute;
          top: 20px;
          left: 0;
          right: 0;
          background: white;
          border-radius: 24px;
          padding: 28px;
          box-shadow:
            0 20px 60px rgba(0,0,0,0.10),
            0 4px 16px rgba(50,159,150,0.12);
          z-index: 2;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .card-icon {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--teal-mid), var(--teal-light));
          display: flex; align-items: center; justify-content: center;
          color: white;
        }
        .card-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 50px;
          background: #e6f7f6;
          color: var(--teal-mid);
          letter-spacing: 0.3px;
        }

        .card-title {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #0d2220;
          margin-bottom: 6px;
        }
        .card-sub { font-size: 13px; color: #7a9997; margin-bottom: 20px; }

        .card-quiz-list { display: flex; flex-direction: column; gap: 10px; }
        .quiz-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          background: #f5fafa;
          border: 1px solid rgba(50,159,150,0.1);
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .quiz-item:hover { background: #e6f7f6; border-color: rgba(50,159,150,0.25); }
        .quiz-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--teal-main); flex-shrink: 0;
        }
        .quiz-item-name { font-size: 13.5px; font-weight: 600; color: #1a2e2d; flex: 1; }
        .quiz-item-count { font-size: 11px; color: #99bfbd; }
        .quiz-arrow {
          width: 24px; height: 24px; border-radius: 8px;
          background: white;
          display: flex; align-items: center; justify-content: center;
          color: var(--teal-main);
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        /* Progress bar mini */
        .card-progress { margin-top: 16px; }
        .progress-label {
          display: flex; justify-content: space-between;
          font-size: 11px; color: #99bfbd; margin-bottom: 6px;
        }
        .progress-bar-bg {
          height: 6px; border-radius: 50px;
          background: #e6f7f6; overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%; border-radius: 50px;
          background: linear-gradient(90deg, var(--teal-mid), var(--teal-light));
          width: 72%;
          animation: growBar 1.2s 0.8s ease both;
          transform-origin: left;
        }
        @keyframes growBar {
          from { width: 0; }
          to { width: 72%; }
        }

        /* Floating mini card */
        .card-float {
          position: absolute;
          bottom: 0;
          right: 0;
          background: white;
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #f59e0b, #f97316);
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 16px;
        }
        .float-text p { font-size: 11px; color: #99bfbd; }
        .float-text strong { font-size: 15px; font-weight: 700; color: #0d2220; }

        /* ── Features Section ───────────────────────── */
        .features {
          max-width: 1100px;
          margin: 0 auto;
          padding: 80px 40px;
        }

        .section-label {
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--teal-main);
          margin-bottom: 14px;
        }

        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(28px, 3.5vw, 42px);
          text-align: center;
          color: #0d2220;
          margin-bottom: 48px;
          line-height: 1.2;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          padding: 28px;
          border-radius: 20px;
          background: white;
          border: 1px solid rgba(50,159,150,0.1);
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(50,159,150,0.14);
        }
        .feature-icon {
          width: 48px; height: 48px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
          font-size: 22px;
        }
        .feature-card h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 18px;
          color: #0d2220;
          margin-bottom: 8px;
        }
        .feature-card p { font-size: 14px; color: #6b8f8d; line-height: 1.65; }

        /* ── Footer ─────────────────────────────────── */
        .footer {
          border-top: 1px solid rgba(50,159,150,0.1);
          padding: 32px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1100px;
          margin: 0 auto;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-logos { display: flex; align-items: center; gap: 16px; }
        .footer-logos img { height: 24px; object-fit: contain; opacity: 0.7; }
        .footer p { font-size: 12px; color: #99bfbd; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }

        @media (max-width: 768px) {
          .hero-inner { grid-template-columns: 1fr; gap: 40px; padding: 60px 20px; }
          .hero-right { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .navbar { padding: 0 20px; }
          .features { padding: 60px 20px; }
          .hero-stats { gap: 20px; }
        }
      `}</style>

      <div className="home-root">

        {/* ── Navbar ─────────────────────────────────────────────── */}
        <nav className="navbar">
          <div className="navbar-logos">
            <img src={hyundaiLogo} alt="Hyundai" className="hyundai" />
            <div className="navbar-divider" />
            <img src={zinusLogo} alt="Zinus" className="zinus" />
          </div>

          <button className="nav-login-btn" onClick={() => navigate('/admin/login')}>
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login Admin
          </button>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="hero">
          <div className="hero-bg" />
          <div className="dot-grid" />
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />

          <div className="hero-inner">
            {/* Left */}
            <div className="hero-left">
              <div className="hero-tag">
                <div className="hero-tag-dot" />
                <span>Platform Training Internal</span>
              </div>

              <h1 className="hero-title">
                Tingkatkan Kompetensi<br />
                Karyawan dengan <em>Quiz</em><br />
                yang Terukur
              </h1>

              <p className="hero-desc">
                Platform ujian online internal Hyundai &amp; Zinus untuk
                mengukur pemahaman karyawan terhadap materi training —
                mulai dari 5S, Pengelolaan Limbah B3, hingga K3.
              </p>

              <div className="hero-actions">
                <button className="btn-primary" onClick={() => navigate('/')}>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Mulai Ujian
                </button>
                <button className="btn-secondary" onClick={() => navigate('/admin/login')}>
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Admin Portal
                </button>
              </div>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-num">2</span>
                  <span className="stat-label">Kategori Training</span>
                </div>
                <div className="stat-sep" />
                <div className="stat-item">
                  <span className="stat-num">25+</span>
                  <span className="stat-label">Soal Tersedia</span>
                </div>
                <div className="stat-sep" />
                <div className="stat-item">
                  <span className="stat-num">2</span>
                  <span className="stat-label">Factory</span>
                </div>
              </div>
            </div>

            {/* Right — Card Stack */}
            <div className="hero-right">
              <div className="card-stack">
                <div className="card-back" />
                <div className="card-back-2" />

                <div className="card-main">
                  <div className="card-header">
                    <div className="card-icon">
                      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 12h6M9 16h4" />
                      </svg>
                    </div>
                    <span className="card-badge">AKTIF</span>
                  </div>

                  <p className="card-title">Pilih Kategori Ujian</p>
                  <p className="card-sub">Tersedia untuk seluruh karyawan</p>

                  <div className="card-quiz-list">
                    {[
                      { name: 'Training 5S', count: '10 soal', color: '#329F96' },
                      { name: 'Pengelolaan Limbah B3', count: '15 soal', color: '#0ea5e9' },
                    ].map((q) => (
                      <div className="quiz-item" key={q.name}>
                        <div className="quiz-dot" style={{ background: q.color }} />
                        <span className="quiz-item-name">{q.name}</span>
                        <span className="quiz-item-count">{q.count}</span>
                        <div className="quiz-arrow">
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-progress">
                    <div className="progress-label">
                      <span>Partisipasi bulan ini</span>
                      <span>72%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" />
                    </div>
                  </div>
                </div>

                {/* Floating mini card */}
                <div className="card-float">
                  <div className="float-icon">🏆</div>
                  <div className="float-text">
                    <p>Rata-rata Skor</p>
                    <strong>84.5</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ───────────────────────────────────────────── */}
        <section className="features">
          <p className="section-label">Fitur Platform</p>
          <h2 className="section-title">Semua yang kamu butuhkan<br />dalam satu tempat</h2>

          <div className="features-grid">
            {[
              {
                icon: '📋',
                bg: 'linear-gradient(135deg, #e6f7f6, #c8efed)',
                title: 'Bank Soal Terstruktur',
                desc: 'Soal pilihan ganda dan YA/TIDAK untuk berbagai kategori training, dapat difilter per factory.',
              },
              {
                icon: '📊',
                bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
                title: 'Hasil & Statistik Real-time',
                desc: 'Dashboard admin dengan grafik distribusi skor, tren performa, dan rekap hasil ujian karyawan.',
              },
              {
                icon: '🏭',
                bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                title: 'Multi Factory',
                desc: 'Dukungan soal per factory — Factory 1 dan Factory 2 dapat memiliki soal yang berbeda.',
              },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid rgba(50,159,150,0.1)', padding: '32px 40px' }}>
          <div className="footer">
            <div className="footer-logos">
              <img src={hyundaiLogo} alt="Hyundai" />
              <div style={{ width: 1, height: 20, background: 'rgba(50,159,150,0.2)' }} />
              <img src={zinusLogo} alt="Zinus" />
            </div>
            <p style={{ fontSize: 12, color: '#99bfbd' }}>
              © {new Date().getFullYear()} Compliance - Zinus Indonesia
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}