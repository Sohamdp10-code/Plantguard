import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" id="logo-link">
            <div className="logo-icon">
              <Leaf size={20} />
            </div>
            Fasal Rakshak
          </Link>

          <div className="navbar-links">
            <Link to="/" className={isActive('/')} id="nav-home">Home</Link>
            <Link to="/detect" className={isActive('/detect')} id="nav-detect">Detect</Link>
            <Link to="/about" className={isActive('/about')} id="nav-about">About</Link>
            <Link to="/detect" className="btn btn-primary navbar-cta" id="nav-cta">
              Start Scan
            </Link>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            id="mobile-menu-open"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`} id="mobile-nav">
        <button
          className="mobile-nav-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          id="mobile-menu-close"
        >
          <X size={28} />
        </button>
        <Link to="/" id="mobile-nav-home">Home</Link>
        <Link to="/detect" id="mobile-nav-detect">Detect Disease</Link>
        <Link to="/about" id="mobile-nav-about">About</Link>
        <Link to="/detect" className="btn btn-primary" id="mobile-nav-cta">
          Start Scan
        </Link>
      </div>
    </>
  )
}

export default Navbar
