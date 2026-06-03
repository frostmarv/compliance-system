// pages/public/view/ViewPage.tsx
import { useNavigate } from 'react-router-dom'

const FACTORIES = [
  {
    id: 1,
    short: 'ZGI',
    name: 'Zinus Global Indonesia',
    location: 'Factory 1',
    color: '#329F96',
    grad: 'linear-gradient(135deg, #1a7a73 0%, #329F96 100%)',
    shadow: 'rgba(50,159,150,0.35)',
    pattern: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)`,
  },
  {
    id: 2,
    short: 'ZGK',
    name: 'Zinus Global Indonesia',
    location: 'Karawang · Factory 2',
    color: '#0ea5e9',
    grad: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)',
    shadow: 'rgba(14,165,233,0.35)',
    pattern: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)`,
  },
  {
    id: 3,
    short: 'ZDI',
    name: 'Zinus Dream Indonesia',
    location: 'Factory 3',
    color: '#8b5cf6',
    grad: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
    shadow: 'rgba(139,92,246,0.35)',
    pattern: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)`,
  },
]

const TRAININGS = [
  { code: '5S',     label: 'Training 5S',         icon: '🏭', desc: 'Seiri · Seiton · Seiso · Seiketsu · Shitsuke' },
  { code: 'LIMBAH', label: 'Limbah B3',            icon: '♻️', desc: 'Klasifikasi dan penanganan limbah berbahaya' },
]

export default function ViewPage() {
  const navigate = useNavigate()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .view-root {
          min-height: 100vh;
          font-family: 'Sora', sans-serif;
          background: #f0f4f8;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(50,159,150,0.1) 0%, transparent 60%);
          color: #0d1f1e;
        }

        /* ── Header ─────────────────────────── */
        .vp-header {
          padding: 48px 40px 32px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .vp-tag {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 12px; border-radius: 50px;
          background: rgba(50,159,150,0.1); border: 1px solid rgba(50,159,150,0.2);
          font-size: 11px; font-weight: 600; color: #329F96;
          letter-spacing: 1px; text-transform: uppercase; margin-bottom: 14px;
          animation: fadeUp 0.5s ease both;
        }
        .vp-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #329F96; animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1}50%{opacity:0.4} }
        .vp-title {
          font-size: clamp(26px, 3.5vw, 40px); font-weight: 800;
          color: #0d1f1e; line-height: 1.15; margin: 0 0 8px;
          animation: fadeUp 0.5s 0.06s ease both; animationFillMode: both;
        }
        .vp-sub {
          font-size: 15px; color: #6b8f8d; font-weight: 400;
          animation: fadeUp 0.5s 0.12s ease both; animationFillMode: both;
        }

        /* ── Section label ──────────────────── */
        .vp-section-label {
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #94a3b8; margin: 0 0 16px;
        }

        /* ── Factory Cards ──────────────────── */
        .factory-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1100px; margin: 0 auto;
          padding: 0 40px 40px;
        }

        .factory-card {
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.10);
          transition: transform 0.2s, box-shadow 0.2s;
          animation: fadeUp 0.5s ease both;
          animationFillMode: both;
        }
        .factory-card:hover {
          transform: translateY(-4px);
        }

        .factory-card-top {
          padding: 28px 24px 24px;
          position: relative;
          overflow: hidden;
        }
        .factory-card-badge {
          font-family: 'DM Mono', monospace;
          font-size: 11px; font-weight: 500; letter-spacing: 1px;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.15);
          padding: 4px 10px; border-radius: 50px;
          display: inline-block; margin-bottom: 14px;
        }
        .factory-card-short {
          font-size: 38px; font-weight: 800; color: white;
          line-height: 1; letter-spacing: -1px; margin-bottom: 4px;
        }
        .factory-card-name {
          font-size: 13px; color: rgba(255,255,255,0.75); font-weight: 500;
        }
        .factory-card-loc {
          font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 3px;
        }

        /* Decorative circle */
        .factory-card-deco {
          position: absolute; right: -20px; bottom: -20px;
          width: 100px; height: 100px; border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .factory-card-deco2 {
          position: absolute; right: 30px; bottom: -30px;
          width: 60px; height: 60px; border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }

        /* Bottom training list */
        .factory-card-bottom {
          background: white; padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
        }
        .training-btn {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 12px;
          background: #f8fafc; border: 1.5px solid #f1f5f9;
          cursor: pointer; text-decoration: none;
          transition: all 0.15s; font-family: 'Sora', sans-serif;
        }
        .training-btn:hover {
          background: #f0f9f8; border-color: rgba(50,159,150,0.25);
          transform: translateX(3px);
        }
        .training-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .training-info { flex: 1; }
        .training-name { font-size: 13px; font-weight: 700; color: #1a2e2d; }
        .training-desc { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .training-arrow {
          width: 22px; height: 22px; border-radius: 7px;
          background: #f1f5f9; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0;
          transition: background 0.15s;
        }
        .training-btn:hover .training-arrow {
          background: rgba(50,159,150,0.15);
        }
        .training-btn:hover .training-arrow svg { stroke: #329F96; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:none; }
        }

        @media (max-width: 900px) {
          .factory-grid { grid-template-columns: 1fr; padding: 0 20px 40px; }
          .vp-header { padding: 36px 20px 24px; }
        }
      `}</style>

      <div className="view-root">

        {/* ── Header ───────────────────────── */}
        <div className="vp-header">
          <div className="vp-tag">
            <div className="vp-tag-dot" />
            Monitoring Training
          </div>
          <h1 className="vp-title">Status Ujian Karyawan</h1>
          <p className="vp-sub">Pilih factory dan kategori training untuk melihat hasil</p>
        </div>

        {/* ── Factory + Training Grid ───────── */}
        <div className="factory-grid">
          {FACTORIES.map((fac, fi) => (
            <div
              key={fac.id}
              className="factory-card"
              style={{ animationDelay: `${fi * 80}ms` }}
            >
              {/* Top colored section */}
              <div className="factory-card-top" style={{ background: fac.grad }}>
                <div style={{ background: fac.pattern, position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                <div className="factory-card-badge">{fac.location}</div>
                <div className="factory-card-short">{fac.short}</div>
                <div className="factory-card-name">{fac.name}</div>
                <div className="factory-card-deco" />
                <div className="factory-card-deco2" />
              </div>

              {/* Bottom training buttons */}
              <div className="factory-card-bottom">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#cbd5e1', margin: '0 2px 4px' }}>
                  Pilih Training
                </p>
                {TRAININGS.map((t) => (
                  <button
                    key={t.code}
                    className="training-btn"
                    onClick={() => navigate(`/view/${t.code.toLowerCase()}?factory=${fac.id}`)}
                  >
                    <div
                      className="training-icon"
                      style={{ background: fac.color + '18' }}
                    >
                      {t.icon}
                    </div>
                    <div className="training-info">
                      <div className="training-name">{t.label}</div>
                      <div className="training-desc">{t.desc}</div>
                    </div>
                    <div className="training-arrow">
                      <svg width="11" height="11" fill="none" stroke="#94a3b8" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}