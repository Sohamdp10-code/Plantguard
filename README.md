# 🌿 Fasal Rakshak (CropGuard) - AI Plant Disease Detection System

**Fasal Rakshak (CropGuard)** is an AI-powered agricultural web application designed to help farmers, agronomists, and gardeners detect crop diseases early, understand symptoms, and apply actionable treatments and preventive measures.

---

## 🚀 Key Features

- **Leaf Health Diagnosis**: Upload leaf photos via drag-and-drop, device file explorer, or direct camera capture (`capture="environment"`).
- **Multi-Crop Support**: Automated detection or crop-specific filtering across Tomato, Potato, Corn, Apple, Grape, and more.
- **Custom Model Integration (Settings)**:
  - Connect your own trained deep learning model backend (Flask, FastAPI, PyTorch, TensorFlow Serving).
  - Configurable endpoint URL with live connection testing.
  - Sends `multipart/form-data` with image file and optional crop selector.
  - Expects JSON: `{"predictions": [{"label": "Tomato___Late_blight", "confidence": 0.94}]}`.
- **Intelligent Demo Mode**: Offline simulated prediction fallback when no custom backend API is connected.
- **Comprehensive Diagnosis Reports**:
  - Healthy vs. Diseased status indicator.
  - Severity level and animated confidence score meter.
  - Low confidence warning banner (<60%).
  - Symptoms, pathogen cause, recommended actions/treatments, and prevention guidelines.
  - Alternative candidate possibilities with confidence percentages.
  - Print report (`window.print()`) and native Web Share / clipboard copy.
- **Scan History & CSV Export**:
  - Saved in browser `localStorage`.
  - Metrics cards: Total Scans, Diseased count, Healthy count.
  - Export complete scan logs as `.csv` files.
- **Searchable Disease Encyclopedia**:
  - Interactive knowledge base with live search by crop, pathogen, or symptom.
  - Crop filter chips for quick navigation.
- **Bilingual Interface**:
  - Seamless 1-click toggle between **English** and **Hindi (हिन्दी)**.
- **Standalone Version**:
  - Also available as a self-contained single-page file in `public/cropguard.html`.

---

## 🛠 Tech Stack

- **Frontend**: React 19, React Router 7, Vite
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with dark mode, glassmorphism, responsive grid
- **Linter**: Oxlint

---

## 💻 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

### 3. Production Build

```bash
npm run build
```

### 4. Code Quality & Linting

```bash
npm run lint
```

---

## 📄 License

MIT License. Designed with ❤️ for farmers and agricultural sustainability.
