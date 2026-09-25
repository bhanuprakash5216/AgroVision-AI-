# 🌿 AgroVision AI — Precision AgTech Platform

> **AI-Driven Plant Pathology, Real-Time Mandi Economics & Smart Agricultural Advisory**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?logo=python)](https://python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AgroVision AI is an end-to-end intelligent agricultural decision platform tailored for smallholder and commercial farmers. By unifying real-time computer vision leaf disease diagnosis, localized meteorological intelligence, soil nutrient telemetry, and dynamic Mandi price tracking, AgroVision AI delivers actionable insights directly to agriculturalists.

---

## 🚀 Key Highlights & Capabilities

### 🍃 1. Plant Pathology & Disease Classification
- **Transfer-Learning Engine**: Benchmarked on PlantVillage & PlantDoc architectures (EfficientNet, MobileNetV3, ConvNeXt).
- **Field-Ready Quality Check**: Blur detection, contrast ratio verification, and leaf segment boundary confidence scoring.
- **Pathogen Profiling**: Granular breakdown of fungal, bacterial, and oomycete infections with multi-stage organic and chemical remediation plans.

### 💧 2. Meteorological & Smart Watering Advisory
- **Hyperlocal Geo-Weather**: Real-time ambient temperature, humidity, wind velocity, and rainfall telemetry.
- **Dynamic Irrigation Scheduling**: Water requirement calculations dynamically adapted based on upcoming weather forecasts to avoid overwatering and root rot.

### 🧪 3. Soil Nutrient Indication (NPK + pH)
- Real-time deficiency diagnostics for Nitrogen (N), Phosphorus (P), and Potassium (K) based on visual symptom patterns and soil readings.
- Tailored organic (compost, biofertilizers) and chemical (urea, DAP, MOP) corrective dosages.

### 📈 4. Mandi Market Intelligence & Logistics Optimization
- Real-time commodity spot prices across major agricultural markets (Mandis).
- **Haversine Distance & Transport Cost Calculator**: Evaluates net profit margins per quintal considering local transportation overhead.

### 🤖 5. AgroBot Multilingual AI Agronomist
- Interactive AI conversational assistant for farming guidance, crop rotation strategies, and pest control queries.
- Voice-enabled speech synthesis for accessible field use.

### 🌐 6. Interactive 3D Farm Visualizer
- Hardware-accelerated 3D agricultural terrain rendering with Three.js.

---

## 🛠️ Tech Architecture

```
agrovision-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/              # Conversational Agronomist endpoint
│   │   │   ├── disease/           # Disease catalog & model metadata
│   │   │   ├── markets/           # APMC Mandi pricing & transport logistics
│   │   │   ├── nutrients/         # NPK nutrient calculation logic
│   │   │   ├── plant-analysis/    # Complete multimodal diagnostic pipeline
│   │   │   ├── treatment/         # Verified chemical & organic treatments
│   │   │   ├── watering/          # Irrigation scheduling engine
│   │   │   └── weather/           # OpenMeteo weather integration
│   │   ├── globals.css            # Tailwind CSS styling tokens
│   │   ├── layout.tsx             # Root app shell
│   │   └── page.tsx               # Main AgroVision dashboard
│   ├── components/                # Modular UI & interactive 3D widgets
│   └── lib/                       # Types, geo-utilities, and data store
│
└── ml_service/                    # Python FastAPI Microservice
    ├── main.py                    # Inference API & route handlers
    ├── preprocess_plantvillage.py # PlantVillage model pipeline
    ├── preprocess_plantdoc.py     # Image quality & calibration logic
    ├── preprocess_crop_recommendation.py # Soil & nutrient diagnostic models
    └── preprocess_market_prices.py# Mandi econometric analysis
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18.x
- Python >= 3.10
- npm / yarn / pnpm

### 1. Frontend & Core API (Next.js)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if port 3000 is occupied).

### 2. Machine Learning Microservice (FastAPI)

```bash
cd ml_service

# Install Python requirements
pip install -r requirements.txt

# Launch FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```

Interactive Swagger API docs available at [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs).

---

## ☁️ Deployment

### One-Click Deploy to Vercel (Frontend & Full-Stack Next.js API)

1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Leave framework preset as **Next.js**.
4. Set build command: `npm run build`
5. Click **Deploy**.

### Python ML Service Deployment (Render / Railway / Fly.io)

For production deployment of `ml_service`:
- **Docker**: Containerize with standard python base image `python:3.11-slim`.
- **Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
