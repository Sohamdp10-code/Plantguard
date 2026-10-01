import { useState, useRef, useCallback } from 'react'
import {
  Upload,
  ImagePlus,
  RotateCcw,
  Scan,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Leaf,
  Bug,
  Pill,
  ShieldCheck
} from 'lucide-react'

const MOCK_DISEASES = [
  {
    name: 'Early Blight',
    scientific: 'Alternaria solani',
    confidence: 92,
    severity: 'moderate',
    severityPercent: 55,
    description:
      'Early blight is a common fungal disease affecting tomatoes, potatoes, and other solanaceous crops. It is characterized by dark, concentric spots on older leaves that gradually expand.',
    symptoms: [
      'Dark brown circular spots with concentric rings (target-like pattern)',
      'Yellow halo surrounding the lesions',
      'Lower and older leaves affected first',
      'Premature leaf drop in severe infections',
      'Dark lesions may appear on stems and fruit'
    ],
    treatments: [
      'Apply copper-based fungicide (e.g., Bordeaux mixture)',
      'Use chlorothalonil or mancozeb-based fungicides',
      'Remove and destroy infected plant material',
      'Ensure adequate plant spacing for air circulation',
      'Apply neem oil as an organic alternative'
    ],
    prevention: [
      'Use certified disease-free seeds and transplants',
      'Practice 3-year crop rotation',
      'Mulch around plants to prevent soil splash',
      'Water at base of plants during morning hours',
      'Maintain balanced fertilization (avoid excess nitrogen)'
    ]
  },
  {
    name: 'Powdery Mildew',
    scientific: 'Erysiphe cichoracearum',
    confidence: 88,
    severity: 'low',
    severityPercent: 30,
    description:
      'Powdery mildew is a widespread fungal disease that appears as white, powdery spots on leaves and stems. It thrives in warm, dry climates with high humidity.',
    symptoms: [
      'White to grayish powdery coating on leaf surfaces',
      'Leaves may curl, twist, or become distorted',
      'Yellowing and premature dropping of affected leaves',
      'Stunted growth in severe cases',
      'Reduced fruit quality and yield'
    ],
    treatments: [
      'Apply sulfur-based fungicides at first sign of infection',
      'Use potassium bicarbonate spray solution',
      'Apply neem oil (organic treatment)',
      'Use milk spray (1:9 milk to water ratio)',
      'Remove and destroy heavily infected plant parts'
    ],
    prevention: [
      'Choose resistant plant varieties when available',
      'Ensure proper spacing for good air circulation',
      'Avoid overhead watering',
      'Prune plants to improve airflow',
      'Monitor regularly during warm, humid conditions'
    ]
  },
  {
    name: 'Bacterial Leaf Spot',
    scientific: 'Xanthomonas campestris',
    confidence: 85,
    severity: 'moderate',
    severityPercent: 50,
    description:
      'Bacterial leaf spot is caused by Xanthomonas bacteria and affects a wide range of crops. It produces water-soaked spots that become necrotic and can severely reduce plant productivity.',
    symptoms: [
      'Small, water-soaked spots on leaves',
      'Spots turn brown to black with yellow halos',
      'Lesions may merge causing large dead areas',
      'Leaf distortion and premature defoliation',
      'Raised, scab-like spots on fruit'
    ],
    treatments: [
      'Apply copper hydroxide or copper sulfate sprays',
      'Use streptomycin-based bactericides (if approved)',
      'Remove and destroy all infected plant debris',
      'Disinfect tools between handling plants',
      'Avoid working with plants when foliage is wet'
    ],
    prevention: [
      'Use pathogen-free certified seeds',
      'Practice crop rotation (2-3 years)',
      'Avoid overhead irrigation',
      'Sanitize greenhouse structures between crops',
      'Control insect vectors that spread bacteria'
    ]
  },
  {
    name: 'Late Blight',
    scientific: 'Phytophthora infestans',
    confidence: 90,
    severity: 'high',
    severityPercent: 78,
    description:
      'Late blight is a devastating oomycete disease that caused the Irish Potato Famine. It spreads rapidly in cool, moist conditions and can destroy entire fields within days if left unchecked.',
    symptoms: [
      'Large, dark green to brown water-soaked lesions',
      'White fuzzy mold growth on leaf undersides',
      'Rapid browning and death of foliage',
      'Dark, firm rot on tubers and fruit',
      'Distinctive foul odor from decaying tissue'
    ],
    treatments: [
      'Apply metalaxyl or mefenoxam-based fungicides immediately',
      'Use chlorothalonil as a protectant fungicide',
      'Remove and destroy all infected plants promptly',
      'Do not compost infected material',
      'Apply phosphorous acid-based products'
    ],
    prevention: [
      'Plant resistant varieties (e.g., Sarpo Mira for potatoes)',
      'Eliminate all volunteer plants and cull piles',
      'Ensure good drainage in fields',
      'Monitor weather forecasts for blight-favorable conditions',
      'Use certified disease-free seed potatoes'
    ]
  },
  {
    name: 'Leaf Rust',
    scientific: 'Puccinia triticina',
    confidence: 87,
    severity: 'moderate',
    severityPercent: 45,
    description:
      'Leaf rust is a fungal disease caused by Puccinia species, primarily affecting wheat, barley, and other cereals. It produces characteristic orange-brown pustules on leaf surfaces.',
    symptoms: [
      'Small, circular to oval orange-brown pustules on leaves',
      'Pustules release rusty-colored spores when rubbed',
      'Heavy infection causes leaf yellowing and drying',
      'Reduced grain filling and lower yield',
      'Pustules may also appear on leaf sheaths and stems'
    ],
    treatments: [
      'Apply triazole fungicides (propiconazole, tebuconazole)',
      'Use strobilurin-based fungicides preventively',
      'Remove volunteer plants that harbor the pathogen',
      'Apply foliar fungicides at flag leaf stage',
      'Combine fungicide groups to prevent resistance'
    ],
    prevention: [
      'Plant rust-resistant wheat varieties',
      'Early sowing to avoid peak rust season',
      'Balanced fertilizer application',
      'Destroy crop residue after harvest',
      'Monitor fields regularly from tillering stage'
    ]
  }
]

function Detect() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('symptoms')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setActiveTab('symptoms')
    }
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => setDragOver(false)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    handleFile(file)
  }

  const analyzeImage = () => {
    setAnalyzing(true)
    // Simulate AI analysis with random disease selection
    setTimeout(() => {
      const randomDisease =
        MOCK_DISEASES[Math.floor(Math.random() * MOCK_DISEASES.length)]
      setResult(randomDisease)
      setAnalyzing(false)
    }, 3000)
  }

  const resetState = () => {
    setImage(null)
    setImagePreview(null)
    setResult(null)
    setAnalyzing(false)
    setActiveTab('symptoms')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getTabContent = () => {
    if (!result) return null
    switch (activeTab) {
      case 'symptoms':
        return result.symptoms
      case 'treatments':
        return result.treatments
      case 'prevention':
        return result.prevention
      default:
        return result.symptoms
    }
  }

  const getTabIcon = () => {
    switch (activeTab) {
      case 'symptoms':
        return <Bug size={15} />
      case 'treatments':
        return <Pill size={15} />
      case 'prevention':
        return <ShieldCheck size={15} />
      default:
        return <Bug size={15} />
    }
  }

  return (
    <div className="detect-page" id="detect-page">
      <div className="container">
        <div className="detect-header">
          <h1>
            <span className="text-gradient">Detect</span> Plant Disease
          </h1>
          <p>
            Upload a clear image of an affected plant leaf and our AI will
            analyze it for possible diseases.
          </p>
        </div>

        {/* Upload Zone */}
        {!imagePreview && (
          <div className="uploader" id="uploader-section">
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              id="upload-zone"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                id="file-input"
              />
              <div className="upload-icon">
                <ImagePlus size={32} />
              </div>
              <h3>Drop your plant image here</h3>
              <p>or click to browse from your device</p>
              <p className="upload-hint">
                Supports JPG, PNG, WEBP • Max 10MB
              </p>
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imagePreview && (
          <div className="image-preview" id="image-preview">
            <div className="preview-container">
              <img src={imagePreview} alt="Uploaded plant" />
              {analyzing && (
                <div className="preview-overlay">
                  <div className="scan-line" />
                  <div className="spinner" />
                  <p className="analyzing-text">Analyzing image…</p>
                </div>
              )}
            </div>

            <div className="preview-actions">
              {!analyzing && !result && (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={analyzeImage}
                    id="analyze-btn"
                  >
                    <Scan size={18} /> Analyze Image
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={resetState}
                    id="reset-btn"
                  >
                    <RotateCcw size={18} /> Choose Another
                  </button>
                </>
              )}
              {result && (
                <button
                  className="btn btn-secondary"
                  onClick={resetState}
                  id="new-scan-btn"
                >
                  <RotateCcw size={18} /> New Scan
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="results-section" id="results-section">
            <div className="result-card">
              {/* Header */}
              <div className="result-header">
                <div className="result-header-left">
                  <h2>{result.name}</h2>
                  <span className="scientific-name">{result.scientific}</span>
                </div>
                <div
                  className={`confidence-badge ${
                    result.confidence >= 90 ? 'high' : 'medium'
                  }`}
                >
                  <CheckCircle size={16} />
                  {result.confidence}% Confidence
                </div>
              </div>

              {/* Severity */}
              <div className="severity-bar">
                <span className="label">Severity</span>
                <div className="severity-track">
                  <div
                    className={`severity-fill ${result.severity}`}
                    style={{ width: `${result.severityPercent}%` }}
                  />
                </div>
                <span className={`severity-label ${result.severity}`}>
                  {result.severity === 'low' && 'Low'}
                  {result.severity === 'moderate' && 'Moderate'}
                  {result.severity === 'high' && 'High'}
                </span>
              </div>

              {/* Description */}
              <p className="result-description">{result.description}</p>

              {/* Tabs */}
              <div className="result-tabs" id="result-tabs">
                <button
                  className={`result-tab ${activeTab === 'symptoms' ? 'active' : ''}`}
                  onClick={() => setActiveTab('symptoms')}
                  id="tab-symptoms"
                >
                  Symptoms
                </button>
                <button
                  className={`result-tab ${activeTab === 'treatments' ? 'active' : ''}`}
                  onClick={() => setActiveTab('treatments')}
                  id="tab-treatments"
                >
                  Treatments
                </button>
                <button
                  className={`result-tab ${activeTab === 'prevention' ? 'active' : ''}`}
                  onClick={() => setActiveTab('prevention')}
                  id="tab-prevention"
                >
                  Prevention
                </button>
              </div>

              {/* Tab Content */}
              <div className="result-list" id="result-list">
                {getTabContent()?.map((item, index) => (
                  <div
                    className="result-list-item"
                    key={index}
                    style={{
                      animation: `slideIn 0.3s var(--ease-out) ${index * 0.05}s both`
                    }}
                  >
                    <span className="item-icon">{getTabIcon()}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Detect
