import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Scan,
  Shield,
  Sparkles,
  ArrowRight,
  Upload,
  Brain,
  ClipboardCheck,
  Leaf,
  Zap,
  Target,
  BookOpen
} from 'lucide-react'

function Home() {
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    document.querySelectorAll('.fade-in-up').forEach((el) => {
      observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg">
          <div className="hero-grid-overlay" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              AI-Powered Plant Healthcare
            </div>

            <h1>
              Protect Your Crops{' '}
              <span className="text-gradient">with AI</span>
            </h1>

            <p>
              Upload a photo of your plant and let our AI instantly detect
              diseases, suggest treatments, and help you save your harvest.
              Fast, accurate, and free.
            </p>

            <div className="hero-actions">
              <Link to="/detect" className="btn btn-primary btn-lg" id="hero-cta-primary">
                Start Detection <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg" id="hero-cta-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-float-card">
          <div className="float-icon">
            <Shield size={20} />
          </div>
          <div className="float-text">
            <h4>95%+ Accuracy</h4>
            <p>AI-powered detection</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features section" id="features-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-label">Features</span>
            <h2>Everything You Need to Protect Your Plants</h2>
            <p>
              Advanced AI technology meets agricultural expertise to deliver
              accurate plant disease detection and actionable insights.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in-up" id="feature-ai">
              <div className="feature-icon green">
                <Brain size={24} />
              </div>
              <h3>AI-Powered Analysis</h3>
              <p>
                Our deep learning model analyzes leaf images to detect visual
                symptoms and identify diseases with high accuracy.
              </p>
            </div>

            <div className="feature-card fade-in-up" id="feature-diseases">
              <div className="feature-icon amber">
                <Target size={24} />
              </div>
              <h3>30+ Diseases Detected</h3>
              <p>
                Comprehensive disease database covering major crops including
                tomato, potato, corn, rice, and more.
              </p>
            </div>

            <div className="feature-card fade-in-up" id="feature-treatment">
              <div className="feature-icon blue">
                <BookOpen size={24} />
              </div>
              <h3>Treatment Advice</h3>
              <p>
                Get actionable treatment recommendations and prevention tips
                tailored to each detected disease.
              </p>
            </div>

            <div className="feature-card fade-in-up" id="feature-speed">
              <div className="feature-icon orange">
                <Zap size={24} />
              </div>
              <h3>Instant Results</h3>
              <p>
                Get your diagnosis in seconds. No waiting, no complicated
                setup — just upload and go.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works section" id="how-it-works-section">
        <div className="container">
          <div className="section-header fade-in-up">
            <span className="section-label">How It Works</span>
            <h2>Three Simple Steps</h2>
            <p>
              Detecting plant diseases has never been easier. Follow these
              three simple steps to get started.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card fade-in-up" id="step-1">
              <div className="step-number">1</div>
              <div className="step-icon">
                <Upload size={28} />
              </div>
              <h3>Upload Image</h3>
              <p>
                Take a clear photo of the affected plant leaf and upload it
                to our platform.
              </p>
            </div>

            <div className="step-card fade-in-up" id="step-2">
              <div className="step-number">2</div>
              <div className="step-icon">
                <Scan size={28} />
              </div>
              <h3>AI Analysis</h3>
              <p>
                Our trained model processes the image and analyzes visible
                symptoms using deep learning.
              </p>
            </div>

            <div className="step-card fade-in-up" id="step-3">
              <div className="step-number">3</div>
              <div className="step-icon">
                <ClipboardCheck size={28} />
              </div>
              <h3>Get Results</h3>
              <p>
                Receive a detailed diagnosis with disease identification,
                severity level, and treatment plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats section" id="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-in-up">
              <h3 className="text-gradient">50K+</h3>
              <p>Scans Performed</p>
            </div>
            <div className="stat-item fade-in-up">
              <h3 className="text-gradient">30+</h3>
              <p>Diseases Detected</p>
            </div>
            <div className="stat-item fade-in-up">
              <h3 className="text-gradient">95%+</h3>
              <p>Accuracy Rate</p>
            </div>
            <div className="stat-item fade-in-up">
              <h3 className="text-gradient">10K+</h3>
              <p>Farmers Helped</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section" id="cta-section">
        <div className="container">
          <div className="cta-box fade-in-up">
            <Sparkles size={32} style={{ color: 'var(--accent)', marginBottom: '1rem' }} />
            <h2>Ready to Protect Your Crops?</h2>
            <p>
              Start detecting plant diseases today. It's fast, accurate, and
              completely free to use.
            </p>
            <Link to="/detect" className="btn btn-primary btn-lg" id="cta-button">
              Start Free Scan <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
