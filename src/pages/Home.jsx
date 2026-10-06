import { Link } from 'react-router-dom';
import { Cpu, Camera, Sprout, Pill, ArrowRight, Shield, Zap, Users, ChevronRight } from 'lucide-react';
import './Home.css';

export default function Home() {
  const features = [
    {
      icon: <Cpu size={28} />,
      title: 'AI-Powered Detection',
      desc: 'Advanced image analysis to identify plant diseases from visual symptoms.'
    },
    {
      icon: <Camera size={28} />,
      title: 'Image-Based Analysis',
      desc: 'Simply upload a photo — no complex tools or equipment needed.'
    },
    {
      icon: <Sprout size={28} />,
      title: 'Plant Health Insights',
      desc: 'Get detailed health assessments with visual feature analysis.'
    },
    {
      icon: <Pill size={28} />,
      title: 'Treatment Guidance',
      desc: 'Receive informational recommendations for managing detected diseases.'
    }
  ];

  const howItWorks = [
    { step: '01', title: 'Upload Image', desc: 'Take or upload a clear picture of the affected plant or leaf.' },
    { step: '02', title: 'AI Analysis', desc: 'Our model examines visual features like color, spots, and texture.' },
    { step: '03', title: 'Get Results', desc: 'Receive disease identification with confidence level and details.' },
    { step: '04', title: 'Take Action', desc: 'Follow informational recommendations to address the issue.' },
  ];

  return (
    <div className="page home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>
        <div className="container hero-container">
          <div className="hero-content animate-fade-in-up">
            <span className="hero-badge">
              <Sprout size={16} />
              AI-Based Plant Disease Detection
            </span>
            <h1 className="hero-title">
              Protect Your Plants
              <span className="hero-title-accent"> with AI</span>
            </h1>
            <p className="hero-subtitle">
              Upload a plant image and let AI analyze visible symptoms to identify possible diseases. Fast, simple, and designed for everyone.
            </p>
            <div className="hero-actions">
              <Link to="/detect" className="btn btn-primary btn-lg">
                <Sprout size={20} />
                Detect Disease
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-secondary btn-lg">
                📚 Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-value">12+</span>
                <span className="hero-stat-label">Diseases Covered</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">5+</span>
                <span className="hero-stat-label">Crop Types</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-value">Fast</span>
                <span className="hero-stat-label">Analysis</span>
              </div>
            </div>
          </div>
          <div className="hero-visual animate-fade-in-up delay-2">
            <div className="hero-plant-card">
              <div className="hero-leaf hero-leaf-1">🌿</div>
              <div className="hero-leaf hero-leaf-2">🍃</div>
              <div className="hero-leaf hero-leaf-3">🌱</div>
              <div className="hero-plant-icon">🌿</div>
              <div className="hero-scan-ring" />
              <div className="hero-scan-ring hero-scan-ring-2" />
              <div className="hero-ai-badge">
                <Cpu size={14} />
                AI Analyzing...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Fasal Rakshak?</h2>
          <p className="section-subtitle">
            A simple yet powerful tool that brings AI-powered plant health monitoring to your fingertips.
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className={`feature-card card animate-fade-in-up delay-${index + 1}`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get results in just a few simple steps — no technical knowledge required.
          </p>
          <div className="how-grid">
            {howItWorks.map((item, index) => (
              <div key={index} className="how-card">
                <div className="how-step">{item.step}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {index < howItWorks.length - 1 && (
                  <ChevronRight className="how-arrow" size={24} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="section quick-section">
        <div className="container">
          <div className="quick-cards">
            <Link to="/quick-diagnosis" className="quick-card quick-card-diagnosis">
              <div className="quick-card-icon">🩺</div>
              <h3>Quick Diagnosis</h3>
              <p>Answer simple questions about your plant's symptoms for a guided assessment.</p>
              <span className="quick-card-link">
                Try Now <ArrowRight size={16} />
              </span>
            </Link>
            <Link to="/diseases" className="quick-card quick-card-library">
              <div className="quick-card-icon">📚</div>
              <h3>Disease Library</h3>
              <p>Browse our searchable database of common plant diseases and treatments.</p>
              <span className="quick-card-link">
                Explore <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Protect Your Plants?</h2>
              <p>Upload a photo of your plant and get instant AI-powered analysis.</p>
              <Link to="/detect" className="btn btn-primary btn-lg">
                <Sprout size={20} />
                Start Detection
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
