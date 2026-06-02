import hyundaiLogo from '@/assets/hyundai-ori-hitam.png'
import zinusLogo from '@/assets/zinus-tulisan-putih.webp'

interface FooterProps {
  year?: number
  companyName?: string
}

export const Footer = ({ year = new Date().getFullYear(), companyName = 'Compliance Zinus Indonesia' }: FooterProps) => (
  <footer className="footer">
    <div className="footer-logos">
      <img src={hyundaiLogo} alt="Hyundai" />
      <div className="footer-divider" />
      <img src={zinusLogo} alt="Zinus" />
    </div>
    <div className="footer-copy">
      © {year} {companyName} · All rights reserved
    </div>
  </footer>
)