# 🏟️ StadiumAI — GenAI-Powered Smart Stadium Operations

> **FIFA World Cup 2026 • Challenge 4: Smart Stadiums & Tournament Operations**

StadiumAI is a GenAI-enabled platform that enhances stadium operations and the fan experience during the FIFA World Cup 2026. It leverages **Google Gemini AI** for intelligent navigation, real-time crowd management, multilingual assistance, emergency response, sustainability monitoring, and transportation coordination.

---

## 🎯 Problem Statement

Large-scale sporting events like the FIFA World Cup present complex challenges: managing 80,000+ fans in real time, coordinating emergency response, ensuring accessibility, reducing environmental impact, and providing multilingual support for a global audience. Traditional systems lack the intelligence to adapt dynamically.

## 💡 Solution

StadiumAI is a **real-time operations dashboard** powered by Generative AI that provides:

- 🤖 **AI Chat Assistant** — Natural language help for fans (wayfinding, food, accessibility, emergencies) via Google Gemini API
- 📊 **Live Crowd Management** — Real-time zone density heatmaps with AI-driven crowd analysis and redistribution recommendations
- 🗺️ **Smart Navigation** — Interactive stadium SVG map with searchable POIs (food, restrooms, medical, exits, accessibility)
- 🚌 **Transportation Hub** — Parking availability, public transit schedules, rideshare coordination, traffic conditions
- 🚨 **Emergency Response** — Protocol activation, incident logging, evacuation routes, AI decision support
- 🌱 **Sustainability Dashboard** — Carbon tracking, recycling rates, water efficiency, energy consumption with AI eco-recommendations
- 🌐 **Multilingual Support** — 10 languages with real-time AI translation (English, Spanish, French, Arabic, Portuguese, German, Japanese, Korean, Chinese, Hindi)
- ⚙️ **Settings** — Venue selection, API key configuration, notification preferences

---

## 🧠 Generative AI Integration

StadiumAI uses the **Google Gemini 2.0 Flash** model throughout the platform:

| Feature | AI Capability |
|---------|--------------|
| Chat Assistant | Context-aware natural language understanding with deep stadium knowledge |
| Crowd Analysis | Zone density evaluation with redistribution recommendations |
| Emergency Support | Real-time incident assessment and protocol recommendations |
| Translation | Dynamic multilingual text translation |
| Sustainability | Environmental impact analysis and actionable eco-tips |

**Demo Mode**: The app works fully without an API key using realistic pre-built AI responses, making it instantly demonstrable.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI framework with hooks and functional components |
| **Vite 8** | Build tool and dev server |
| **React Router v7** | Client-side routing |
| **Google Gemini API** | Generative AI (chat, analysis, translation) |
| **Vanilla CSS** | Custom design system — no utility framework dependencies |
| **SVG** | Interactive stadium heatmap and navigation map |

---

## 📂 Project Structure

```
stadiumai/
├── index.html              # Entry HTML with SEO meta tags
├── vite.config.js          # Vite + React configuration
├── package.json            # Dependencies and scripts
├── .env.example            # Environment variable template
├── public/                 # Static assets
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Router setup with all routes
    ├── index.css           # Design tokens, reset, keyframes
    ├── App.css             # Component-level styles
    ├── components/
    │   ├── layout/         # Sidebar, Header, Layout shell
    │   ├── dashboard/      # StatsCard, CrowdHeatmap, LiveFeed, WeatherWidget
    │   ├── chat/           # ChatBot, ChatMessage, QuickActions
    │   └── common/         # AnimatedCounter, ProgressRing, StatusBadge
    ├── pages/
    │   ├── Dashboard.jsx       # Operations overview
    │   ├── CrowdManagement.jsx # Zone density monitoring
    │   ├── Navigation.jsx      # Interactive wayfinding
    │   ├── Transport.jsx       # Parking, transit, rideshare
    │   ├── Emergency.jsx       # Emergency protocols
    │   ├── Sustainability.jsx  # Environmental metrics
    │   └── Settings.jsx        # Configuration panel
    ├── services/
    │   ├── geminiService.js    # Gemini API integration (core GenAI)
    │   ├── dataSimulator.js    # Real-time data simulation engine
    │   └── i18nService.js      # Multilingual translations
    ├── hooks/
    │   ├── useRealTimeData.js  # Live data polling hook
    │   ├── useChat.js          # Chat state management
    │   └── useCrowdData.js     # Crowd analytics derivation
    ├── data/
    │   ├── venues.js           # 11 real FIFA WC 2026 venues
    │   ├── stadiumLayout.js    # Zones, POIs, evacuation routes
    │   └── mockData.js         # Match schedule, alerts, food vendors
    └── utils/
        ├── constants.js        # App-wide constants
        └── formatters.js       # Number/date/capacity formatters
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/stadiumai.git
cd stadiumai

# Install dependencies
npm install --legacy-peer-deps

# (Optional) Configure Gemini API key
cp .env.example .env
# Edit .env and add your key from https://aistudio.google.com/apikey

# Start development server
npm run dev
```

The app will open at **http://localhost:5173**

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔑 API Configuration

StadiumAI uses the **Google Gemini API** for its AI features. You have two options:

1. **Demo Mode** (default): Works immediately with no API key. Pre-built responses simulate AI behavior.
2. **Live AI Mode**: Add your Gemini API key via:
   - Settings page → API Configuration
   - Or set `VITE_GEMINI_API_KEY` in your `.env` file

Get your free API key at: [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│                  React App                   │
│  ┌─────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Pages   │  │Components│  │  Chat Bot   │ │
│  └────┬────┘  └────┬─────┘  └──────┬─────┘ │
│       │            │               │        │
│  ┌────▼────────────▼───────────────▼─────┐  │
│  │            Custom Hooks               │  │
│  │  useRealTimeData  useChat  useCrowd   │  │
│  └────┬──────────────┬───────────────────┘  │
│       │              │                      │
│  ┌────▼────┐    ┌────▼────────────────┐     │
│  │  Data   │    │     Services        │     │
│  │Simulator│    │  ┌───────────────┐  │     │
│  └─────────┘    │  │ Gemini API    │  │     │
│                 │  │ (GenAI Core)  │  │     │
│                 │  └───────────────┘  │     │
│                 │  ┌───────────────┐  │     │
│                 │  │ i18n Service  │  │     │
│                 │  └───────────────┘  │     │
│                 └─────────────────────┘     │
└─────────────────────────────────────────────┘
```

---

## ✨ Key Features

### Real-Time Data Simulation
The `dataSimulator.js` engine generates realistic, fluctuating stadium data every 3 seconds — crowd density per zone, parking availability, transit schedules, sustainability metrics, live feed events, and match progression. No backend needed.

### Interactive SVG Stadium Map
Custom SVG-based stadium visualization with 12 clickable zones, color-coded by capacity level (green → yellow → orange → red), with hover tooltips showing real-time occupancy.

### Responsive Design
Fully responsive layout from desktop to mobile with collapsible sidebar, adaptive grids, and touch-friendly interactions.

### Accessibility
- Semantic HTML5 with ARIA labels
- Keyboard navigation support
- `prefers-reduced-motion` media query support
- High contrast text on dark backgrounds
- Screen reader friendly components

### Performance
- Client-side rendering — no server needed
- Lightweight bundle: ~91 KB gzipped
- No heavy UI framework dependencies
- Efficient animation with `requestAnimationFrame`
- Memoized computations with `useMemo`

---

## 📊 Evaluation Criteria Addressed

| Criteria | Implementation |
|----------|---------------|
| **GenAI Usage** | Gemini API for chat, crowd analysis, emergency advice, translation, sustainability tips |
| **Code Quality** | Modular architecture, separation of concerns, reusable components, clean naming |
| **Security** | API key stored in localStorage/env, no hardcoded secrets, input sanitization |
| **Efficiency** | Client-side simulation (no backend), lazy data updates, memoized hooks |
| **Testing** | Production build verification, error boundary handling |
| **Accessibility** | ARIA labels, semantic HTML, keyboard support, reduced-motion support |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for FIFA World Cup 2026<br>
  <strong>StadiumAI</strong> — Intelligent Operations for the Beautiful Game
</p>
