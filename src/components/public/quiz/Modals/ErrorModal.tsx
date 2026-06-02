interface ErrorModalProps {
    isOpen: boolean
    onClose: () => void
    message: string
  }
  
  export const ErrorModal = ({ isOpen, onClose, message }: ErrorModalProps) => {
    if (!isOpen) return null
  
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-icon error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <span className="modal-title">Perhatian</span>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <p className="modal-message error">{message}</p>
          </div>
          <div className="modal-actions">
            <button className="modal-btn primary" onClick={onClose}>Mengerti</button>
          </div>
        </div>
      </div>
    )
  }