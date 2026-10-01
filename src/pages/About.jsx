import { Link } from 'react-router-dom'
import {
  Leaf,
  Code,
  Database,
  Globe,
  ArrowRight,
  Brain,
  Camera,
  Microscope,
  Heart,
  Users,
  BookOpen,
  Cpu
} from 'lucide-react'

function About() {
  return (
    <div className="about-page" id="about-page">
      <div className="container">
        {/* Hero */}
        <div className="about-hero">
          <h1>
            About <span className="text-gradient">Fasal Rakshak</span>
          </h1>
          <p>
            Fasal Rakshak (फसल रक्षक) means "Crop Protector" in Hindi. We're on
            a mission to empower farmers with AI-powered tools for early plant
            disease detection and crop protection.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="about-grid">
          <div className="about-card" id="about-mission">
            <div className="about-card-icon">
              <Heart size={24} />
            </div>
            <h3>Our Mission</h3>
            <p>
              To make advanced plant disease detection accessible to every
              farmer, regardless of their technical background. Early detection
              can save up to 40% of potential crop loss.
            </p>
          </div>

          <div className="about-card" id="about-how">
            <div className="about-card-icon">
              <Brain size={24} />
            </div>
            <h3>How It Works</h3>
            <p>
              We use deep learning models trained on thousands of labelled plant
              leaf images. The model analyzes visual patterns like spots,
              discoloration, and texture changes to identify diseases.
            </p>
          </div>

          <div className="about-card" id="about-impact">
            <div className="about-card-icon">
              <Users size={24} />
            </div>
            <h3>Our Impact</h3>
            <p>
              Designed as a tool for Indian agriculture, Fasal Rakshak aims to
              bridge the gap between advanced AI research and the farmers who
              need it most.
            </p>
          </div>

          <div className="about-card" id="about-accuracy">
            <div className="about-card-icon">
              <Microscope size={24} />
            </div>
            <h3>Accuracy & Data</h3>
            <p>
              Our model is trained and validated on curated datasets with
              continuous improvements. We strive for 95%+ accuracy across
              all supported crop diseases.
            </p>
          </div>

          <div className="about-card" id="about-open">
            <div className="about-card-icon">
              <BookOpen size={24} />
            </div>
            <h3>Open Knowledge</h3>
            <p>
              Every diagnosis includes detailed information about symptoms,
              treatment methods, and prevention strategies sourced from
              agricultural research.
            </p>
          </div>

          <div className="about-card" id="about-future">
            <div className="about-card-icon">
              <Globe size={24} />
            </div>
            <h3>Future Roadmap</h3>
            <p>
              We're working on multi-language support, real-time camera
              detection, offline mode, and integration with agricultural
              advisory services.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="tech-stack">
          <div className="section-header">
            <span className="section-label">Technology</span>
            <h2>Built With Modern Tools</h2>
            <p>
              Powered by cutting-edge web technologies and AI frameworks.
            </p>
          </div>

          <div className="tech-grid">
            <div className="tech-badge" id="tech-react">
              <Code size={16} /> React 19
            </div>
            <div className="tech-badge" id="tech-vite">
              <Cpu size={16} /> Vite
            </div>
            <div className="tech-badge" id="tech-router">
              <Globe size={16} /> React Router
            </div>
            <div className="tech-badge" id="tech-lucide">
              <Leaf size={16} /> Lucide Icons
            </div>
            <div className="tech-badge" id="tech-ai">
              <Brain size={16} /> Deep Learning
            </div>
            <div className="tech-badge" id="tech-cv">
              <Camera size={16} /> Computer Vision
            </div>
            <div className="tech-badge" id="tech-data">
              <Database size={16} /> PlantVillage Dataset
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="cta-box" style={{ marginBottom: '2rem' }}>
          <h2>Try It Now</h2>
          <p>
            Upload a photo of your plant and see AI-powered disease detection
            in action.
          </p>
          <Link to="/detect" className="btn btn-primary btn-lg" id="about-cta">
            Start Detection <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About
