import { Link } from 'react-router-dom'
import { Leaf, Heart } from 'lucide-react'

function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              <Leaf size={20} style={{ color: 'var(--accent)' }} />
              Fasal Rakshak
            </h3>
            <p>
              AI-powered plant disease detection system helping farmers protect
              their crops and improve yield through early diagnosis and treatment
              recommendations.
            </p>
          </div>

          <div className="footer-col">
            <h4>Features</h4>
            <Link to="/detect" id="footer-detect">Scan Leaf</Link>
            <Link to="/detect?tab=guide" id="footer-guide">Disease Guide</Link>
            <Link to="/detect?tab=history" id="footer-history">Scan History</Link>
            <Link to="/detect?tab=settings" id="footer-settings">Model Settings</Link>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/" id="footer-home">Home</Link>
            <Link to="/about" id="footer-about">About Us</Link>
            <a href="/cropguard.html" target="_blank" rel="noopener noreferrer" id="footer-standalone">
              Standalone App
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Fasal Rakshak (CropGuard). Made with{' '}
            <Heart size={13} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent-danger)' }} />{' '}
            for Indian Farmers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
