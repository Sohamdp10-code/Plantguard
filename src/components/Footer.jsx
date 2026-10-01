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
            <h4>Navigation</h4>
            <Link to="/" id="footer-home">Home</Link>
            <Link to="/detect" id="footer-detect">Detect Disease</Link>
            <Link to="/about" id="footer-about">About</Link>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer" id="footer-react">React Docs</a>
            <a href="https://vite.dev" target="_blank" rel="noopener noreferrer" id="footer-vite">Vite Docs</a>
            <a href="#" id="footer-contact">Contact Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Fasal Rakshak. Made with{' '}
            <Heart size={13} style={{ display: 'inline', verticalAlign: 'middle', color: 'var(--accent-danger)' }} />{' '}
            for Indian Farmers.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
