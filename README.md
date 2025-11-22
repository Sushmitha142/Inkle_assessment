# 🌍 Tourism AI Assistant

> **A sophisticated multi-agent tourism system built for Inkle AI internship assignment**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-blue?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

### 🤖 Multi-Agent Architecture
- **Parent Agent**: Orchestrates and routes user queries intelligently
- **Weather Agent**: Real-time weather data using Open-Meteo API
- **Places Agent**: Tourist attractions via Overpass API (OpenStreetMap)

### 🎨 Modern UI/UX
- **Stunning Dark Theme**: Glass morphism effects with gradient backgrounds
- **Real-time Chat Interface**: Seamless conversation experience
- **Embedded Maps**: Interactive location previews
- **Language Preferences**: Multi-language support for international destinations
- **Responsive Design**: Perfect on all devices

### 🌐 Live APIs Integration
- **Open-Meteo**: Accurate weather forecasting
- **Overpass API**: Comprehensive POI data from OpenStreetMap
- **Nominatim**: Reliable geocoding services

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000 (or auto-assigned port)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   FastAPI       │
│   (Frontend)    │◄──►│   (Backend)     │
│                 │    │                 │
│ ▪ Chat Interface│    │ ▪ Parent Agent  │
│ ▪ Map Preview   │    │ ▪ Weather Agent │
│ ▪ Settings      │    │ ▪ Places Agent  │
│ ▪ Dark Theme    │    │ ▪ API Router    │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │   External APIs     │
                    │                     │
                    │ ▪ Open-Meteo        │
                    │ ▪ Overpass API      │
                    │ ▪ Nominatim         │
                    └─────────────────────┘
```

## 🎯 Example Queries

- *"What's the weather in Tokyo?"*
- *"Find the best cafes in Paris"*
- *"I'm planning a trip to Rome, what should I know?"*
- *"Restaurants near the Eiffel Tower"*
- *"Weather and attractions in Bangkok"*

## 🛠️ Technology Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for lightning-fast development
- **Tailwind CSS** for stunning styling
- **Lucide React** for beautiful icons
- **Glass morphism** UI effects

### Backend
- **FastAPI** for high-performance API
- **Python 3.11+** with async/await
- **Pydantic** for data validation
- **HTTP clients** for external APIs
- **Multi-agent architecture**

### External Services
- **Open-Meteo API**: Weather data
- **Overpass API**: Points of Interest
- **OpenStreetMap**: Mapping and geocoding

## 🎨 UI Showcase

The application features a premium dark theme with:
- 🌟 **Glass morphism effects**
- ⚡ **Smooth animations**
- 🎭 **Gradient backgrounds**
- 💫 **Interactive hover effects**
- 🗺️ **Embedded map previews**
- 🌍 **Language preference system**

## 📱 Responsive Design

Perfect experience across:
- 💻 **Desktop**: Full-featured interface
- 📱 **Mobile**: Touch-optimized controls
- 📋 **Tablet**: Adaptive layout

## 🔧 Development

### Project Structure
```
inkle_ass/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API communication
│   │   └── App.jsx        # Main application
│   ├── public/            # Static assets
│   └── package.json       # Dependencies
├── backend/               # FastAPI application
│   ├── app/
│   │   ├── agents/        # Multi-agent system
│   │   ├── services/      # External API integrations
│   │   └── main.py        # Application entry point
│   └── requirements.txt   # Python dependencies
└── README.md              # This file
```

### Key Features Implemented
- ✅ **Multi-agent orchestration** with intelligent routing
- ✅ **Real-time weather data** from Open-Meteo
- ✅ **Tourism POI discovery** via Overpass API
- ✅ **Interactive chat interface** with message history
- ✅ **Embedded map previews** with location markers
- ✅ **Language preference system** for international queries
- ✅ **Comprehensive error handling** and validation
- ✅ **Responsive design** for all devices
- ✅ **Production-ready** deployment configuration

## 🚀 Deployment Options

### 🌟 **Option 1: Single Repo + Render (Recommended)**
Deploy both frontend and backend on Render from the same repository.

#### Backend Service on Render
1. **Create Web Service** from your GitHub repo
2. **Root Directory**: `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. **Environment**: `Python 3`

#### Frontend Service on Render
1. **Create Static Site** from the same GitHub repo
2. **Root Directory**: `frontend`
3. **Build Command**: `npm install && npm run build`
4. **Publish Directory**: `frontend/dist`
5. **Environment Variable**: `VITE_API_URL` = your backend URL

### 💡 **Option 2: Separate Repositories**
```
tourism-ai-backend/     # Backend only
tourism-ai-frontend/    # Frontend only
```

### 🐳 **Option 3: Docker Deployment**
```bash
# Backend
docker build -t tourism-ai-backend ./backend
docker run -p 8000:8000 tourism-ai-backend

# Frontend
docker build -t tourism-ai-frontend ./frontend
docker run -p 3000:3000 tourism-ai-frontend
```

### ☁️ **Alternative Platforms**
- **Vercel**: Frontend + Serverless API
- **Netlify**: Frontend + Edge Functions
- **Railway**: Full-stack deployment
- **AWS/Azure**: Enterprise deployment

## 🤝 Contributing

This project was built as part of an internship assignment for **Inkle AI**. It demonstrates:
- Clean, maintainable code architecture
- Modern web development practices
- API integration expertise
- User experience design skills

## 📧 Contact

Built with ❤️ for **Inkle AI** internship assignment.

---

*"Making travel planning intelligent, one conversation at a time."* ✈️🌍