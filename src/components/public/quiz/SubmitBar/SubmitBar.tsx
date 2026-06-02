interface SubmitBarProps {
    answered: number
    total: number
    submitting?: boolean
    onSubmit: () => void
    disabled?: boolean
  }
  
  export const SubmitBar = ({ answered, total, submitting = false, onSubmit, disabled = false }: SubmitBarProps) => {
    const progress = total > 0 ? Math.round((answered / total) * 100) : 0
    const allAnswered = total > 0 && progress === 100
    const remaining = total - answered
  
    return (
      <div className="submit-bar">
        <div className="submit-inner">
          <div className="submit-meta">
            <div className="submit-track">
              <div className="submit-fill" style={{width:`${progress}%`}} />
            </div>
            <span className={`submit-hint${allAnswered ? ' ready' : ''}`}>
              {allAnswered ? '✓ Lengkap' : `${remaining} lagi`}
            </span>
          </div>
          <button
            className={`btn-submit${allAnswered && !submitting ? ' active' : ' locked'}`}
            onClick={onSubmit}
            disabled={disabled || !allAnswered || submitting}
          >
            {submitting ? (
              <><div className="btn-spinner" /><span>Mengirim...</span></>
            ) : allAnswered ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Submit Jawaban</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                <span>Selesaikan semua soal</span>
              </>
            )}
          </button>
        </div>
      </div>
    )
  }