import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  /** Judul utama quiz, contoh: "Quiz 5R" */
  title: string
  /** Subjudul/deskripsi quiz, contoh: "Ringkas · Rapi · Resik · Rawat · Rajin" */
  subtitle?: string
  /** Icon SVG opsional (jika ingin custom per quiz) */
  icon?: React.ReactNode
  /** Tampilkan tombol kembali (default: true) */
  showBack?: boolean
  /** Path tujuan tombol kembali (default: "/quiz") */
  backTo?: string
}

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} width="18" height="18">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
)

export const Navbar = ({ title, subtitle, icon, showBack = true, backTo = '/quiz' }: NavbarProps) => {
  const navigate = useNavigate()

  // Default icon jika tidak disediakan
  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )

  return (
    <nav className="nav">
      <div className="nav-inner">
        {showBack && (
          <button
            onClick={() => navigate(backTo)}
            aria-label="Kembali"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 10,
              border: '1px solid #E8E0D5',
              background: '#FAFAF8',
              color: '#57534E',
              cursor: 'pointer',
              flexShrink: 0,
              marginRight: 4,
            }}
          >
            <BackIcon />
          </button>
        )}

        <div className="nav-badge">
          {icon ?? defaultIcon}
        </div>
        <div>
          <div className="nav-title">{title}</div>
          {subtitle && <div className="nav-sub">{subtitle}</div>}
        </div>
      </div>
    </nav>
  )
}