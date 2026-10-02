import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X, Scan } from 'lucide-react'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const isActive = (path, search = '') => {
    if (search) {
      return location.pathname === path && location.search.includes(search) ? 'active' : ''
    }
    return location.pathname === path && !location.search ? 'active' : ''
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" id="logo-link">
            <div className="logo-icon">
              <Leaf size={20} />
            </div>
            <span>Fasal Rakshak</span>
          </Link>

          <div className="navbar-links">
            <Link to="/" className={isActive('/')} id="nav-home">Home</Link>
            <Link to="/detect" className={isActive('/detect')} id="nav-detect">Detect</Link>
            <Link to="/detect?tab=guide" className={isActive('/detect', 'tab=guide')} id="nav-guide">Disease Guide</Link>
            <Link to="/detect?tab=history" className={isActive('/detect', 'tab=history')} id="nav-history">History</Link>
            <Link to="/about" className={isActive('/about')} id="nav-about">About</Link>
            <Link to="/detect" className="btn btn-primary navbar-cta" id="nav-cta">
              <Scan size={16} /> Start Scan
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
          onClick={closeMobile}
          aria-label="Close menu"
          id="mobile-menu-close"
        >
          <X size={28} />
        </button>
        <Link to="/" onClick={closeMobile} id="mobile-nav-home">Home</Link>
        <Link to="/detect" onClick={closeMobile} id="mobile-nav-detect">Detect Disease</Link>
        <Link to="/detect?tab=guide" onClick={closeMobile} id="mobile-nav-guide">Disease Guide</Link>
        <Link to="/detect?tab=history" onClick={closeMobile} id="mobile-nav-history">Scan History</Link>
        <Link to="/about" onClick={closeMobile} id="mobile-nav-about">About</Link>
        <Link to="/detect" onClick={closeMobile} className="btn btn-primary" id="mobile-nav-cta">
          Start Scan
        </Link>
      </div>
    </>
  )
}

export default Navbar
