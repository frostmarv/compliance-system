interface NIKFormProps {
    nik: string
    onChange: (nik: string) => void
    onEmployeeFound?: (nik: string) => void
    searching?: boolean
    found?: boolean
    error?: string
  }
  
  export const NIKForm = ({ 
    nik, 
    onChange, 
    searching = false, 
    found = false,
    error 
  }: NIKFormProps) => {
    return (
      <div className="card nik-card">
        <div className="nik-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
          </svg>
        </div>
        <div className="nik-title">Selamat Datang</div>
        <div className="nik-subtitle">Masukkan NIK untuk memulai Quiz 5R</div>
  
        <span className="nik-label">Nomor Induk Karyawan</span>
        <div className="nik-input-wrap">
          <input
            className="nik-input"
            type="text"
            inputMode="numeric"
            placeholder="Contoh: 12345678"
            value={nik}
            maxLength={8}
            autoFocus
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 8)
              onChange(val)
            }}
          />
          {searching && <div className="nik-spinner" />}
          {!searching && found && (
            <div className="nik-check">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
  
        <div className="nik-dots">
          {Array.from({length: 8}).map((_, i) => (
            <div key={i} className={`nik-dot${i < nik.length ? ' filled' : ''}`} />
          ))}
        </div>
        <div className="nik-hint">{nik.length}/8 digit — otomatis terdeteksi</div>
  
        {searching && (
          <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:8}}>
            {[0.7,0.5,0.6].map((w,i) => (
              <div key={i} style={{height:10,borderRadius:999,background:'#F0F1F5',width:`${w*100}%`,animation:'pulse 1.5s ease-in-out infinite',animationDelay:`${i*0.15}s`}} />
            ))}
          </div>
        )}
  
        {error && !searching && (
          <div style={{marginTop:16,padding:'12px 16px',background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:12,color:'#B91C1C',fontSize:13}}>
            ⚠️ {error}
          </div>
        )}
      </div>
    )
  }