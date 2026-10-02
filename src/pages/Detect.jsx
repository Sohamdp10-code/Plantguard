import { useState, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Upload,
  Camera,
  RotateCcw,
  Scan,
  CheckCircle,
  AlertTriangle,
  History,
  BookOpen,
  Settings,
  Languages,
  Printer,
  Share2,
  Download,
  Trash2,
  Search,
  Sparkles,
  ShieldCheck,
  Bug,
  Pill,
  ChevronDown,
  Info
} from 'lucide-react'
import { CROP_DISEASE_DB, CROP_LIST, TRANSLATIONS } from '../data/cropDiseases'

function Detect() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab')
  const activeMainTab = ['scan', 'history', 'guide', 'settings'].includes(rawTab) ? rawTab : 'scan'

  const [lang, setLang] = useState(() => localStorage.getItem('plantguard_lang') || 'en')
  const [selectedCrop, setSelectedCrop] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Settings state
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('plantguard_api_url') || '')
  const [testStatus, setTestStatus] = useState(null) // { success: boolean, msg: string }

  // History state
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem('hist') || localStorage.getItem('plantguard_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Guide search & filter state
  const [guideSearch, setGuideSearch] = useState('')
  const [guideCropFilter, setGuideCropFilter] = useState('All')

  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en

  const switchTab = (tabName) => {
    setSearchParams(tabName === 'scan' ? {} : { tab: tabName })
  }

  const toggleLang = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en'
    setLang(nextLang)
    localStorage.setItem('plantguard_lang', nextLang)
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Handle image upload / selection
  const handleFile = useCallback((file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, or WEBP).')
      return
    }
    if (file.size > 12 * 1024 * 1024) {
      alert('Image file size exceeds 12 MB. Please select a smaller photo.')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setResult(null)
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

  // Prediction Logic: Real API or Demo Mode
  const analyzeImage = async () => {
    if (!imageFile) return
    setAnalyzing(true)

    try {
      let predictions = []
      let isDemo = false

      if (apiUrl.trim()) {
        // Connect to user's custom deep learning endpoint
        const formData = new FormData()
        formData.append('file', imageFile)
        if (selectedCrop) {
          formData.append('crop', selectedCrop)
        }

        const response = await fetch(apiUrl.trim(), {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`)
        }

        const data = await response.json()
        const rawPreds = (data.predictions || [data])
          .filter((p) => p && (p.label || p.class || p.name))
          .map((p) => ({
            label: p.label || p.class || p.name,
            confidence: Number(p.confidence ?? p.score ?? 0.85)
          }))
          .sort((a, b) => b.confidence - a.confidence)

        if (!rawPreds.length) {
          throw new Error('API response did not return any predictions array')
        }

        predictions = rawPreds.slice(0, 3)
      } else {
        // Demo mode: simulated prediction using the built-in database
        await new Promise((res) => setTimeout(res, 1200))
        isDemo = true

        const dbKeys = Object.keys(CROP_DISEASE_DB)
        const eligibleKeys = selectedCrop
          ? dbKeys.filter((k) => CROP_DISEASE_DB[k].crop.toLowerCase() === selectedCrop.toLowerCase())
          : dbKeys

        const keysToUse = eligibleKeys.length ? eligibleKeys : dbKeys
        const shuffled = [...keysToUse].sort(() => Math.random() - 0.5)

        const topConfidence = +(0.75 + Math.random() * 0.22).toFixed(2)
        const secondConfidence = +((1 - topConfidence) * 0.65).toFixed(2)
        const thirdConfidence = +(1 - topConfidence - secondConfidence).toFixed(2)

        predictions = [
          { label: shuffled[0], confidence: topConfidence },
          { label: shuffled[1] || shuffled[0], confidence: secondConfidence },
          { label: shuffled[2] || shuffled[0], confidence: thirdConfidence }
        ]
      }

      // Format top diagnosis
      const topPred = predictions[0]
      const labelKey = topPred.label
      const dbEntry =
        CROP_DISEASE_DB[labelKey] ||
        Object.values(CROP_DISEASE_DB).find(
          (item) => item.name.toLowerCase() === labelKey.toLowerCase()
        ) || {
          name: labelKey.replace(/_+/g, ' '),
          crop: selectedCrop || 'Crop',
          isHealthy: labelKey.toLowerCase().includes('healthy'),
          severity: 'moderate',
          severityPercent: 50,
          symptoms: 'Visible spots or changes observed on leaf surface.',
          cause: 'Pathogen or abiotic plant stress.',
          treatment: 'Consult a local agricultural extension officer for specific pesticide recommendations.',
          prevention: 'Maintain clean farm hygiene and monitor crop canopy regularly.'
        }

      const pct = Math.round(topPred.confidence * 100)
      const diagnosisResult = {
        id: Date.now(),
        date: new Date().toISOString(),
        crop: dbEntry.crop || selectedCrop || 'Unknown',
        name: dbEntry.name,
        isHealthy: dbEntry.isHealthy,
        confidence: pct,
        severity: dbEntry.severity,
        severityPercent: dbEntry.severityPercent,
        symptoms: dbEntry.symptoms,
        cause: dbEntry.cause,
        treatment: dbEntry.treatment,
        prevention: dbEntry.prevention,
        isDemo,
        otherPossibilities: predictions.slice(1).map((p) => {
          const entry = CROP_DISEASE_DB[p.label]
          return {
            name: entry?.name || p.label.replace(/_+/g, ' '),
            confidence: Math.round(p.confidence * 100)
          }
        })
      }

      setResult(diagnosisResult)

      // Save to history (capped at 200 items)
      const updatedHistory = [diagnosisResult, ...historyList].slice(0, 200)
      setHistoryList(updatedHistory)
      localStorage.setItem('hist', JSON.stringify(updatedHistory))
      localStorage.setItem('plantguard_history', JSON.stringify(updatedHistory))
    } catch (err) {
      alert(`Could not complete analysis: ${err.message}. Check Settings if using a custom backend.`)
    } finally {
      setAnalyzing(false)
    }
  }

  const resetState = () => {
    setImageFile(null)
    setImagePreview(null)
    setResult(null)
    setAnalyzing(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  // History operations
  const clearHistory = () => {
    if (window.confirm(t.clearHistoryConfirm)) {
      setHistoryList([])
      localStorage.removeItem('hist')
      localStorage.removeItem('plantguard_history')
      showToast('History cleared.')
    }
  }

  const exportHistoryCsv = () => {
    if (!historyList.length) {
      alert('No history entries to export.')
      return
    }
    const headers = ['Date', 'Crop', 'Result', 'Confidence', 'Healthy', 'Mode']
    const rows = historyList.map((item) => [
      `"${new Date(item.date).toLocaleString()}"`,
      `"${item.crop}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.confidence}%"`,
      item.isHealthy ? 'Yes' : 'No',
      item.isDemo ? 'Demo' : 'Live'
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `cropguard-history-${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Settings operations
  const saveSettings = () => {
    localStorage.setItem('plantguard_api_url', apiUrl.trim())
    showToast(t.settingsSaved)
  }

  const testApiConnection = async () => {
    if (!apiUrl.trim()) {
      setTestStatus({ success: false, msg: t.enterUrlFirst })
      return
    }
    setTestStatus({ loading: true, msg: t.testingConnection })
    try {
      const res = await fetch(apiUrl.trim(), { method: 'OPTIONS' })
      if (res.ok || res.status === 405 || res.status === 404) {
        setTestStatus({ success: true, msg: t.serverReachable })
      } else {
        setTestStatus({ success: false, msg: `Server responded with status ${res.status}` })
      }
    } catch {
      setTestStatus({ success: false, msg: t.serverError })
    }
  }

  // Share operation
  const handleShare = () => {
    if (!result) return
    const textToShare = `${t.shareTitle}: ${result.name} (${result.confidence}% ${t.confidence}). ${t.action}: ${result.treatment}`
    if (navigator.share) {
      navigator.share({ title: t.shareTitle, text: textToShare }).catch(() => {})
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).then(() => {
        showToast(t.copiedToast)
      })
    }
  }

  // Guide filtering
  const filteredGuide = Object.values(CROP_DISEASE_DB).filter((item) => {
    const matchesCrop = guideCropFilter === 'All' || item.crop.toLowerCase() === guideCropFilter.toLowerCase()
    const q = guideSearch.toLowerCase().trim()
    const matchesQuery = !q || item.name.toLowerCase().includes(q) || item.crop.toLowerCase().includes(q) || item.symptoms.toLowerCase().includes(q) || item.cause.toLowerCase().includes(q)
    return matchesCrop && matchesQuery
  })

  // History stats
  const totalScans = historyList.length
  const diseasedCount = historyList.filter((x) => !x.isHealthy).length
  const healthyCount = historyList.filter((x) => x.isHealthy).length

  return (
    <div className="detect-page" id="detect-page">
      <div className="container">
        {/* Page Top Header with Title and Language Toggle */}
        <div className="detect-header">
          <div className="detect-header-top">
            <div className="badge-wrapper">
              <span className="hero-badge">
                <span className="badge-dot" />
                {t.tagline}
              </span>
            </div>
            <button
              onClick={toggleLang}
              className="lang-toggle-btn"
              title="Change Language"
              id="lang-toggle"
            >
              <Languages size={16} />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <h1>
            <span className="text-gradient">{t.heroTitle}</span>
          </h1>
          <p>{t.heroSub}</p>
        </div>

        {/* Global Toast */}
        {toastMessage && (
          <div className="toast-notification">
            <CheckCircle size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* App Navigation Tabs */}
        <div className="nav-tabs-container">
          <div className="detect-nav-tabs" role="tablist">
            <button
              role="tab"
              aria-selected={activeMainTab === 'scan'}
              className={`nav-tab-btn ${activeMainTab === 'scan' ? 'active' : ''}`}
              onClick={() => switchTab('scan')}
              id="tab-btn-scan"
            >
              <Scan size={18} />
              <span>{t.tabScan}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeMainTab === 'history'}
              className={`nav-tab-btn ${activeMainTab === 'history' ? 'active' : ''}`}
              onClick={() => switchTab('history')}
              id="tab-btn-history"
            >
              <History size={18} />
              <span>{t.tabHistory}</span>
              {historyList.length > 0 && <span className="tab-counter">{historyList.length}</span>}
            </button>
            <button
              role="tab"
              aria-selected={activeMainTab === 'guide'}
              className={`nav-tab-btn ${activeMainTab === 'guide' ? 'active' : ''}`}
              onClick={() => switchTab('guide')}
              id="tab-btn-guide"
            >
              <BookOpen size={18} />
              <span>{t.tabGuide}</span>
            </button>
            <button
              role="tab"
              aria-selected={activeMainTab === 'settings'}
              className={`nav-tab-btn ${activeMainTab === 'settings' ? 'active' : ''}`}
              onClick={() => switchTab('settings')}
              id="tab-btn-settings"
            >
              <Settings size={18} />
              <span>{t.tabSettings}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SCAN LEAF */}
        {activeMainTab === 'scan' && (
          <div className="tab-pane active" id="pane-scan">
            <div className="scan-layout-grid">
              {/* Left Column: Upload & Camera Controls */}
              <div className="scan-input-card card">
                <h2>{t.step1Title}</h2>

                {/* Hidden File Inputs */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="file-input-field"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="camera-input-field"
                />

                {!imagePreview ? (
                  <div
                    className={`dropzone ${dragOver ? 'dragover' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    id="dropzone"
                  >
                    <div className="dropzone-icon">
                      <Upload size={32} />
                    </div>
                    <b>{t.dropTitle}</b>
                    <p className="note">{t.dropSub}</p>
                  </div>
                ) : (
                  <div className="image-preview-box">
                    <div className="preview-image-wrapper">
                      <img src={imagePreview} alt="Selected leaf preview" />
                      {analyzing && (
                        <div className="preview-overlay">
                          <div className="scan-line" />
                          <div className="spinner" />
                          <p className="analyzing-text">{t.analyzing}</p>
                        </div>
                      )}
                    </div>
                    {imageFile && (
                      <div className="image-meta-bar">
                        <span>{imageFile.name}</span>
                        <span>{(imageFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls: Camera & Crop Selection */}
                <div className="action-row">
                  <button
                    type="button"
                    className="btn btn-secondary btn-icon"
                    onClick={() => cameraInputRef.current?.click()}
                    id="camera-btn"
                  >
                    <Camera size={18} />
                    <span>{t.useCamera}</span>
                  </button>

                  <div className="crop-select-wrapper">
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="crop-select"
                      aria-label="Crop filter"
                      id="crop-select"
                    >
                      <option value="">{t.cropAuto}</option>
                      {CROP_LIST.filter((c) => c !== 'Auto').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="action-row primary-actions">
                  <button
                    className="btn btn-primary"
                    onClick={analyzeImage}
                    disabled={!imagePreview || analyzing}
                    id="analyze-leaf-btn"
                  >
                    <Scan size={18} />
                    <span>{t.analyzeBtn}</span>
                  </button>

                  {imagePreview && (
                    <button
                      className="btn btn-secondary"
                      onClick={resetState}
                      disabled={analyzing}
                      id="clear-btn"
                    >
                      <RotateCcw size={18} />
                      <span>{t.clearBtn}</span>
                    </button>
                  )}
                </div>

                {!apiUrl.trim() && (
                  <div className="demo-hint-box">
                    <Info size={16} />
                    <span>
                      Demo mode active. Connect your ML model API in <b>Settings</b> for live predictions.
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Diagnosis Result */}
              <div className="scan-result-card card" id="scan-results-box" aria-live="polite">
                <h2>{t.step2Title}</h2>

                {!result && !analyzing && (
                  <div className="empty-result-state">
                    <div className="empty-icon">
                      <Sparkles size={36} />
                    </div>
                    <p>{t.emptyResult}</p>
                    <span className="empty-sub">
                      Select or capture a leaf photo and click <b>"{t.analyzeBtn}"</b> to receive a detailed AI diagnosis.
                    </span>
                  </div>
                )}

                {analyzing && (
                  <div className="analyzing-state">
                    <div className="spinner-large" />
                    <h3>{t.analyzing}</h3>
                    <p className="note">Extracting disease patterns and comparing visual markers...</p>
                  </div>
                )}

                {result && !analyzing && (
                  <div className="result-content-view">
                    {result.isDemo && (
                      <div className="demo-banner">
                        <AlertTriangle size={15} />
                        <span>Simulated Prediction (Demo Mode). Connect your model in Settings.</span>
                      </div>
                    )}

                    {/* Result Header Badge */}
                    <div className="result-top-bar">
                      <span className={`status-pill ${result.isHealthy ? 'healthy' : 'diseased'}`}>
                        {result.isHealthy ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                        {result.isHealthy ? t.healthy : t.diseased}
                      </span>
                      <span className="crop-tag">{result.crop}</span>
                    </div>

                    <h3 className="result-disease-name">{result.name}</h3>

                    {/* Confidence Bar */}
                    <div className="confidence-block">
                      <div className="confidence-labels">
                        <span>{t.confidence}</span>
                        <span className="confidence-number">{result.confidence}%</span>
                      </div>
                      <div className="confidence-track">
                        <div
                          className={`confidence-fill ${result.isHealthy ? 'healthy' : result.confidence < 60 ? 'low' : 'high'}`}
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                    </div>

                    {result.confidence < 60 && (
                      <div className="warning-callout">
                        <AlertTriangle size={16} />
                        <p>{t.lowConfidenceWarn}</p>
                      </div>
                    )}

                    {/* Detail Sections */}
                    <div className="result-details-accordion">
                      <div className="detail-item">
                        <div className="detail-header">
                          <Bug size={17} className="detail-icon" />
                          <h4>{t.symptoms}</h4>
                        </div>
                        <p>{result.symptoms}</p>
                      </div>

                      {!result.isHealthy && result.cause && (
                        <div className="detail-item">
                          <div className="detail-header">
                            <Info size={17} className="detail-icon" />
                            <h4>{t.cause}</h4>
                          </div>
                          <p>{result.cause}</p>
                        </div>
                      )}

                      <div className="detail-item highlight">
                        <div className="detail-header">
                          <Pill size={17} className="detail-icon" />
                          <h4>{t.action}</h4>
                        </div>
                        <p>{result.treatment}</p>
                      </div>

                      <div className="detail-item">
                        <div className="detail-header">
                          <ShieldCheck size={17} className="detail-icon" />
                          <h4>{t.prevention}</h4>
                        </div>
                        <p>{result.prevention}</p>
                      </div>
                    </div>

                    {/* Other Possibilities */}
                    {result.otherPossibilities?.length > 0 && (
                      <div className="other-possibilities-box">
                        <h5>{t.otherPossibilities}</h5>
                        <div className="possibility-pills">
                          {result.otherPossibilities.map((p, i) => (
                            <span key={i} className="possibility-pill">
                              {p.name} <b>({p.confidence}%)</b>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className="disclaimer-note">{t.disclaimer}</p>

                    {/* Result Action Buttons */}
                    <div className="result-footer-actions noprint">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => window.print()}
                        title="Print or Save PDF"
                      >
                        <Printer size={16} />
                        <span>{t.printReport}</span>
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={handleShare}
                        title="Share diagnosis"
                      >
                        <Share2 size={16} />
                        <span>{t.share}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCAN HISTORY */}
        {activeMainTab === 'history' && (
          <div className="tab-pane active" id="pane-history">
            <div className="history-container card">
              <div className="history-header">
                <div>
                  <h2>{t.historyTitle}</h2>
                  <p className="note">Track previous leaf analyses and export reports for record-keeping.</p>
                </div>

                <div className="history-actions noprint">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={exportHistoryCsv}
                    disabled={!historyList.length}
                    id="export-csv-btn"
                  >
                    <Download size={16} />
                    <span>{t.exportCsv}</span>
                  </button>
                  <button
                    className="btn btn-danger-outline btn-sm"
                    onClick={clearHistory}
                    disabled={!historyList.length}
                    id="clear-history-btn"
                  >
                    <Trash2 size={16} />
                    <span>{t.clearHistory}</span>
                  </button>
                </div>
              </div>

              {/* Stats Summary Cards */}
              <div className="stats-row">
                <div className="stat-card">
                  <b>{totalScans}</b>
                  <span>{t.totalScans}</span>
                </div>
                <div className="stat-card diseased">
                  <b>{diseasedCount}</b>
                  <span>{t.diseasedCount}</span>
                </div>
                <div className="stat-card healthy">
                  <b>{healthyCount}</b>
                  <span>{t.healthyCount}</span>
                </div>
              </div>

              {/* History Table */}
              {historyList.length === 0 ? (
                <div className="empty-history-state">
                  <History size={40} />
                  <p>{t.noHistory}</p>
                  <button className="btn btn-primary btn-sm" onClick={() => switchTab('scan')}>
                    <Scan size={16} /> {t.tabScan}
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>{t.colDate}</th>
                        <th>{t.colCrop}</th>
                        <th>{t.colResult}</th>
                        <th>{t.colConfidence}</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyList.map((item) => (
                        <tr key={item.id || item.date}>
                          <td className="date-cell">{new Date(item.date).toLocaleString()}</td>
                          <td>
                            <span className="crop-tag-sm">{item.crop}</span>
                          </td>
                          <td className="result-name-cell">
                            <b>{item.name}</b>
                            {item.isDemo && <span className="demo-badge">demo</span>}
                          </td>
                          <td>
                            <div className="table-conf-cell">
                              <span>{item.confidence}%</span>
                              <div className="table-conf-mini-bar">
                                <div
                                  className="table-conf-fill"
                                  style={{ width: `${item.confidence}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-tag ${item.isHealthy ? 'ok' : 'bad'}`}>
                              {item.isHealthy ? t.healthy : t.diseased}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DISEASE GUIDE */}
        {activeMainTab === 'guide' && (
          <div className="tab-pane active" id="pane-guide">
            <div className="guide-container card">
              <div className="guide-header">
                <h2>{t.guideTitle}</h2>
                <p className="note">{t.guideSub}</p>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="guide-toolbar">
                <div className="search-input-wrapper">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    value={guideSearch}
                    onChange={(e) => setGuideSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="guide-search-input"
                    aria-label="Search diseases"
                  />
                  {guideSearch && (
                    <button className="search-clear" onClick={() => setGuideSearch('')}>
                      ×
                    </button>
                  )}
                </div>

                <div className="crop-filter-chips">
                  {['All', ...CROP_LIST.filter((c) => c !== 'Auto')].map((cropName) => (
                    <button
                      key={cropName}
                      className={`filter-chip ${guideCropFilter === cropName ? 'active' : ''}`}
                      onClick={() => setGuideCropFilter(cropName)}
                    >
                      {cropName === 'All' ? t.filterAll : cropName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Disease Cards Accordion */}
              <div className="guide-list">
                {filteredGuide.length === 0 ? (
                  <p className="no-matches-text">No disease entries match your search criteria.</p>
                ) : (
                  filteredGuide.map((item, idx) => (
                    <details key={idx} className="guide-item-details" open={idx < 2}>
                      <summary>
                        <div className="guide-summary-left">
                          <span className={`guide-status-dot ${item.isHealthy ? 'healthy' : 'diseased'}`} />
                          <span className="guide-crop-tag">{item.crop}</span>
                          <span className="guide-title">{item.name}</span>
                        </div>
                        <ChevronDown size={18} className="chevron-icon" />
                      </summary>
                      <div className="guide-details-body">
                        <div className="guide-detail-row">
                          <b>{t.symptoms}:</b>
                          <p>{item.symptoms}</p>
                        </div>
                        {!item.isHealthy && item.cause && (
                          <div className="guide-detail-row">
                            <b>{t.cause}:</b>
                            <p>{item.cause}</p>
                          </div>
                        )}
                        <div className="guide-detail-row">
                          <b>{t.action}:</b>
                          <p>{item.treatment}</p>
                        </div>
                        <div className="guide-detail-row">
                          <b>{t.prevention}:</b>
                          <p>{item.prevention}</p>
                        </div>
                      </div>
                    </details>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeMainTab === 'settings' && (
          <div className="tab-pane active" id="pane-settings">
            <div className="settings-container card">
              <h2>{t.settingsTitle}</h2>
              <p className="note">{t.settingsSub}</p>

              <div className="settings-form">
                <label htmlFor="api-url-input" className="form-label">
                  {t.apiUrlLabel}
                </label>
                <input
                  id="api-url-input"
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder={t.apiUrlPlaceholder}
                  className="settings-text-input"
                />

                <div className="action-row">
                  <button className="btn btn-primary" onClick={saveSettings} id="save-settings-btn">
                    {t.saveBtn}
                  </button>
                  <button className="btn btn-secondary" onClick={testApiConnection} id="test-api-btn">
                    {t.testBtn}
                  </button>
                </div>

                {testStatus && (
                  <div
                    className={`test-status-banner ${
                      testStatus.loading ? 'loading' : testStatus.success ? 'success' : 'error'
                    }`}
                  >
                    <span>{testStatus.msg}</span>
                  </div>
                )}

                {/* API Status Notice */}
                {!apiUrl.trim() ? (
                  <div className="settings-alert-box warn">
                    <AlertTriangle size={18} />
                    <div>
                      <b>Demo Mode Active</b>
                      <p>{t.demoNotice}</p>
                    </div>
                  </div>
                ) : (
                  <div className="settings-alert-box ok">
                    <CheckCircle size={18} />
                    <div>
                      <b>Custom API Configured</b>
                      <p>{t.activeApiNotice}</p>
                    </div>
                  </div>
                )}

                {/* API Technical Specifications */}
                <div className="api-spec-box">
                  <h4>{t.apiSpecTitle}</h4>
                  <p>{t.apiSpecDesc}</p>
                  <pre className="code-block">
{`// Sample Expected JSON Response:
{
  "predictions": [
    { "label": "Tomato___Late_blight", "confidence": 0.94 },
    { "label": "Tomato___Early_blight", "confidence": 0.04 },
    { "label": "Tomato___healthy", "confidence": 0.02 }
  ]
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Detect
