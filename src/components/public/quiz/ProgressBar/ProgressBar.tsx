interface ProgressBarProps {
    answered: number
    total: number
    label?: string
  }
  
  export const ProgressBar = ({ answered, total, label = 'Progress Jawaban' }: ProgressBarProps) => {
    const progress = total > 0 ? Math.round((answered / total) * 100) : 0
    
    return (
      <div className="card progress-card">
        <div className="progress-top">
          <span className="progress-label">{label}</span>
          <span className="progress-count">{answered} / {total}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{width:`${progress}%`}} />
        </div>
        <div className="progress-pct">{progress}% selesai</div>
      </div>
    )
  }