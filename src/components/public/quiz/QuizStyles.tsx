export const QuizStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  
      * { box-sizing: border-box; }
  
      .quiz-root {
        font-family: 'DM Sans', sans-serif;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        background: #F7F8FC;
        color: #1A1D2E;
      }
  
      /* ── MODAL BACKDROP ── */
      .modal-backdrop {
        position: fixed; inset: 0; z-index: 100;
        background: rgba(26, 29, 46, 0.6);
        backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
        animation: fadeIn 0.2s ease-out;
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  
      /* ── MODAL CARD ── */
      .modal-card {
        background: #fff;
        border-radius: 20px;
        border: 1px solid #E8EAF0;
        width: 100%; max-width: 420px;
        box-shadow: 0 20px 60px rgba(26, 29, 46, 0.3);
        overflow: hidden;
        animation: slideUp 0.25s ease-out;
      }
      @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  
      .modal-header {
        padding: 20px 24px 16px;
        display: flex; align-items: center; gap: 12px;
        border-bottom: 1px solid #F0F1F5;
      }
      .modal-icon {
        width: 36px; height: 36px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }
      .modal-icon.error { background: #FEF2F2; color: #DC2626; }
      .modal-icon.success { background: #DCFCE7; color: #16A34A; }
      .modal-icon svg { width: 20px; height: 20px; }
      .modal-title { font-size: 15px; font-weight: 700; color: #1A1D2E; }
      .modal-close {
        margin-left: auto;
        width: 28px; height: 28px; border-radius: 8px;
        background: #F7F8FC; border: none;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; color: #8B8FA8;
        transition: background 0.15s, color 0.15s;
      }
      .modal-close:hover { background: #EDEEF5; color: #1A1D2E; }
  
      .modal-body { padding: 20px 24px 24px; }
      .modal-message {
        font-size: 14px; color: #4A4D63; line-height: 1.6;
        word-break: break-word; overflow-wrap: break-word;
      }
      .modal-message.error { color: #B91C1C; font-weight: 500; }
  
      .modal-actions {
        display: flex; gap: 10px; padding: 16px 24px 20px;
        border-top: 1px solid #F0F1F5; background: #FAFAFC;
      }
      .modal-btn {
        flex: 1; height: 44px; border-radius: 12px;
        font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
        cursor: pointer; border: none;
        transition: background 0.15s, transform 0.1s;
      }
      .modal-btn:active { transform: translateY(1px); }
      .modal-btn.primary {
        background: #329F96; color: #fff;
        box-shadow: 0 4px 14px rgba(50, 159, 150, 0.3);
      }
      .modal-btn.primary:hover { background: #2B8B83; }
      .modal-btn.secondary {
        background: #F7F8FC; color: #4A4D63;
        border: 1px solid #E8EAF0;
      }
      .modal-btn.secondary:hover { background: #EDEEF5; }
  
      /* ── RESULT MODAL SPECIFIC ── */
      .result-modal-header {
        padding: 32px 24px 20px;
        background: #1A1D2E;
        text-align: center; color: #fff;
        position: relative;
      }
      .result-modal-header::after {
        content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
        height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      }
      .result-trophy { font-size: 40px; margin-bottom: 8px; }
      .result-modal-title { font-size: 18px; font-weight: 700; }
      .result-modal-sub { font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 2px; }
  
      .result-modal-body { padding: 24px; text-align: center; }
      .result-score-ring {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        width: 120px; height: 120px; border-radius: 20px;
        background: #F7F8FC; border: 2px solid #E8EAF0;
        margin: 0 auto 16px;
      }
      .result-score-val { font-size: 36px; font-weight: 700; color: #1A1D2E; line-height: 1; }
      .result-score-unit { font-size: 11px; font-weight: 600; color: #8B8FA8; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 4px; }
      .result-breakdown {
        display: flex; justify-content: center; gap: 24px; margin-bottom: 20px;
      }
      .breakdown-item { text-align: center; }
      .breakdown-val { font-size: 20px; font-weight: 700; color: #1A1D2E; }
      .breakdown-label { font-size: 11px; color: #8B8FA8; margin-top: 2px; }
      .breakdown-val.correct { color: #16A34A; }
      .breakdown-val.incorrect { color: #DC2626; }
  
      .result-verdict {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 16px; border-radius: 999px;
        font-size: 12px; font-weight: 700; letter-spacing: 0.05em;
        margin-bottom: 24px;
      }
      .result-verdict.pass { background: #DCFCE7; color: #15803D; }
      .result-verdict.fail { background: #FFF7ED; color: #C2410C; }
  
      .result-stats {
        display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 24px;
      }
      .result-stat {
        background: #F7F8FC; border: 1px solid #E8EAF0;
        border-radius: 12px; padding: 12px; text-align: left;
      }
      .result-stat-icon { font-size: 16px; margin-bottom: 4px; }
      .result-stat-label { font-size: 10px; color: #B0B4C8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
      .result-stat-val { font-size: 13px; font-weight: 700; color: #1A1D2E; word-break: break-word; }
  
      .result-modal-actions {
        display: flex; gap: 10px; padding: 0 24px 24px;
      }
  
      /* ── NAVBAR ── */
      .nav {
        position: sticky; top: 0; z-index: 50;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(12px);
        border-bottom: 1px solid #E8EAF0;
        padding: 0 1rem; height: 56px;
        display: flex; align-items: center;
      }
      .nav-inner {
        width: 100%; max-width: 680px; margin: 0 auto;
        display: flex; align-items: center; gap: 10px;
      }
      .nav-badge {
        width: 34px; height: 34px; border-radius: 10px;
        background: #329F96;
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      }
      .nav-badge svg { width: 18px; height: 18px; color: #fff; }
      .nav-title { font-size: 15px; font-weight: 700; color: #1A1D2E; line-height: 1.2; }
      .nav-sub { font-size: 11px; color: #8B8FA8; font-weight: 400; letter-spacing: 0.02em; }
  
      /* ── MAIN ── */
      .main {
        flex: 1; width: 100%; max-width: 680px;
        margin: 0 auto; padding: 20px 16px 40px;
      }
  
      /* ── CARD base ── */
      .card {
        background: #fff; border-radius: 18px;
        border: 1px solid #E8EAF0; overflow: hidden;
      }
  
      /* ── STEP 1: NIK ── */
      .nik-card { padding: 32px 24px 28px; }
      .nik-icon-wrap {
        width: 64px; height: 64px; border-radius: 16px;
        background: #329F96;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      }
      .nik-icon-wrap svg { width: 30px; height: 30px; color: #fff; }
      .nik-title { text-align: center; font-size: 22px; font-weight: 700; color: #329F96; margin-bottom: 6px; }
      .nik-subtitle { text-align: center; font-size: 13px; color: #8B8FA8; margin-bottom: 28px; }
      .nik-label { font-size: 11px; font-weight: 600; color: #8B8FA8; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 8px; display: block; }
      .nik-input-wrap { position: relative; }
      .nik-input {
        width: 100%; padding: 14px 52px 14px 18px;
        font-family: 'DM Mono', monospace; font-size: 22px; font-weight: 500;
        letter-spacing: 0.25em; background: #F7F8FC;
        border: 2px solid #E8EAF0; border-radius: 14px;
        outline: none; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        color: #1A1D2E;
      }
      .nik-input::placeholder { font-size: 14px; letter-spacing: 0.02em; color: #C4C7D6; font-family: 'DM Sans', sans-serif; }
      .nik-input:focus { border-color: #1A1D2E; background: #fff; box-shadow: 0 0 0 4px rgba(26,29,46,0.06); }
      .nik-spinner {
        position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
        width: 22px; height: 22px; border: 2.5px solid #E8EAF0; border-top-color: #1A1D2E;
        border-radius: 50%; animation: spin 0.7s linear infinite;
      }
      .nik-check {
        position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
        width: 26px; height: 26px; border-radius: 50%; background: #22C55E;
        display: flex; align-items: center; justify-content: center;
      }
      .nik-check svg { width: 14px; height: 14px; color: #fff; }
      .nik-dots { display: flex; gap: 7px; justify-content: center; margin-top: 18px; }
      .nik-dot { width: 9px; height: 9px; border-radius: 50%; background: #E8EAF0; transition: background 0.25s, transform 0.25s; }
      .nik-dot.filled { background: #329F96; transform: scale(1.15); }
      .nik-hint { text-align: center; font-size: 12px; color: #B0B4C8; margin-top: 10px; }
  
      /* ── EMPLOYEE CARD ── */
      .emp-card { padding: 16px; display: flex; align-items: center; gap: 14px; }
      .emp-avatar {
        flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px;
        background: #329F96; display: flex; align-items: center; justify-content: center;
        font-size: 18px; font-weight: 700; color: #fff;
      }
      .emp-info { flex: 1; min-width: 0; }
      .emp-name { font-size: 14px; font-weight: 700; color: #1A1D2E; word-break: break-word; }
      .emp-dept { font-size: 12px; color: #8B8FA8; margin-top: 1px; word-break: break-word; }
      .emp-factory { font-size: 11px; color: #B0B4C8; margin-top: 1px; word-break: break-word; }
      .emp-nik-badge {
        flex-shrink: 0; background: #F7F8FC; border: 1px solid #E8EAF0;
        border-radius: 10px; padding: 7px 12px; text-align: center;
      }
      .emp-nik-label { font-size: 9px; color: #B0B4C8; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
      .emp-nik-val { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 600; color: #1A1D2E; letter-spacing: 0.1em; }
  
      /* ── PROGRESS ── */
      .progress-card { padding: 16px 18px; }
      .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
      .progress-label { font-size: 12px; font-weight: 600; color: #8B8FA8; }
      .progress-count { font-size: 13px; font-weight: 700; color: #329F96; }
      .progress-track { height: 6px; background: #F0F1F5; border-radius: 999px; overflow: hidden; }
      .progress-fill { height: 100%; border-radius: 999px; background: #329F96; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
      .progress-pct { font-size: 11px; color: #B0B4C8; text-align: right; margin-top: 7px; }
  
      /* ── QUESTION CARD ── */
      .q-card {
        background: #fff; border-radius: 16px; border: 1.5px solid #E8EAF0;
        overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s;
      }
      .q-card.answered { border-color: #1A1D2E; box-shadow: 0 2px 12px rgba(26,29,46,0.08); }
      .q-body { padding: 16px 16px 14px; }
      .q-header { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 14px; }
      .q-num {
        flex-shrink: 0; width: 28px; height: 28px; border-radius: 8px;
        background: #F0F1F5; color: #8B8FA8; font-size: 12px; font-weight: 700;
        display: flex; align-items: center; justify-content: center; transition: background 0.2s, color 0.2s;
      }
      .q-num.answered { background: #329F96; color: #fff; }
      .q-text {
        font-size: 14px; font-weight: 500; color: #1A1D2E; line-height: 1.6;
        flex: 1; word-break: break-word; overflow-wrap: break-word; white-space: normal;
      }
      .q-options { display: flex; flex-direction: column; gap: 8px; }
      .q-option {
        display: flex; align-items: flex-start; gap: 10px; padding: 11px 13px;
        border-radius: 11px; border: 1.5px solid transparent; background: #F7F8FC;
        cursor: pointer; transition: background 0.15s, border-color 0.15s;
        -webkit-tap-highlight-color: transparent; width: 100%; text-align: left;
      }
      .q-option:active { background: #EDEEF5; }
      .q-option.selected { background: #F0F1F9; border-color: #1A1D2E; }
      .q-option input[type=radio] { display: none; }
      .q-radio {
        flex-shrink: 0; width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid #D1D4E0; background: #fff;
        display: flex; align-items: center; justify-content: center;
        transition: border-color 0.15s, background 0.15s; margin-top: 1px;
      }
      .q-option.selected .q-radio { border-color: #329F96; background: #329F96; }
      .q-radio-dot { width: 7px; height: 7px; border-radius: 50%; background: #fff; }
      .q-option-label {
        font-size: 14px; color: #4A4D63; line-height: 1.55; flex: 1;
        word-break: break-word; overflow-wrap: break-word; white-space: normal;
      }
      .q-option.selected .q-option-label { color: #1A1D2E; font-weight: 600; }
  
      /* ── SUBMIT BAR ── */
      .submit-bar { position: sticky; bottom: 16px; z-index: 40; }
      .submit-inner {
        background: rgba(255,255,255,0.97); border: 1px solid #E8EAF0;
        border-radius: 16px; padding: 14px;
        box-shadow: 0 8px 32px rgba(26,29,46,0.12);
      }
      .submit-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
      .submit-track { flex: 1; height: 4px; background: #F0F1F5; border-radius: 999px; overflow: hidden; }
      .submit-fill { height: 100%; border-radius: 999px; background: #329F96; transition: width 0.4s cubic-bezier(.4,0,.2,1); }
      .submit-hint { font-size: 12px; font-weight: 600; color: #B0B4C8; white-space: nowrap; }
      .submit-hint.ready { color: #22C55E; }
      .btn-submit {
        width: 100%; height: 52px; border-radius: 12px; border: none;
        font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700;
        cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
        transition: transform 0.15s, box-shadow 0.15s, background 0.2s; outline: none;
      }
      .btn-submit.active { background: #329F96; color: #fff; box-shadow: 0 4px 20px rgba(26,29,46,0.25); }
      .btn-submit.active:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(26,29,46,0.3); }
      .btn-submit.active:active { transform: translateY(0); }
      .btn-submit.locked { background: #F0F1F5; color: #B0B4C8; cursor: not-allowed; }
      .btn-spinner {
        width: 20px; height: 20px; border: 2.5px solid rgba(255,255,255,0.3); border-top-color: #fff;
        border-radius: 50%; animation: spin 0.7s linear infinite;
      }
  
      /* ── FOOTER ── */
      .footer { background: #329F96; margin-top: auto; }
      .footer-logos {
        max-width: 680px; margin: 0 auto; padding: 20px 24px;
        display: flex; align-items: center; justify-content: center; gap: 24px;
      }
      .footer-logos img { height: 26px; object-fit: contain; }
      .footer-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.15); }
      .footer-copy {
        border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 16px;
        text-align: center; font-size: 11px; color: rgba(255,255,255,0.3);
      }
  
      /* ── UTILS ── */
      .space-y > * + * { margin-top: 12px; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes spin-centered { to { transform: translateY(-50%) rotate(360deg); } }
      .nik-spinner { animation: spin-centered 0.7s linear infinite; }
      @keyframes pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    `}</style>
  )