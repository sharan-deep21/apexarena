# 🏟️ ApexArena — GenAI-Powered Smart Stadium Operations

> **FIFA World Cup 2026 • Challenge 4: Smart Stadiums & Tournament Operations**

ApexArena is a GenAI-enabled platform designed to optimize stadium operations and the overall tournament experience for fans, venue staff, and organizers during the FIFA World Cup 2026. It leverages the **Google Gemini API** for intelligent navigation wayfinding, real-time crowd flow analysis, active emergency dispatch logs, and eco-grid resource automation.

---

## 🎯 Chosen Vertical

**Persona: Fans & Venue Organizers**

Managing a massive tournament venue hosting 80,000+ fans presents unique friction points for both spectators and staff:
* **For Fans**: Navigating complex gate entries, finding accessible restrooms/medical stations, communicating in native languages, and routing around congestions.
* **For Organizers & Staff**: Monitoring zone crowd densities, responding to concourse safety incidents, coordinating public transit backlogs, and maintaining energy grid efficiency.

ApexArena resolves these challenges in a unified, premium hub. It bridges the gap between spectator self-service (multilingual wayfinding) and operational command (transit dispatch, safety advisories, and eco-controls) to ensure smooth match-day execution.

---

## 💡 Approach & Logic

### 1. Unified Real-Time Operations Telemetry
Instead of separate database logs, ApexArena implements a custom **Data Simulator (`dataSimulator.js`)** that ticks every 3 seconds. It dynamically generates fluctuating attendance metrics, zone densities, public transit arrival countdowns, rideshare wait times, and active warning flags.

### 2. Context-Aware Gemini Prompt Pipeline (`geminiService.js`)
Every user chat query is enriched via a telemetry snapshot formatter. This automatically appends the live status of the stadium (including weather, current score, active alerts, and congestions) directly to the model prompt.
* *Example*: If a fan asks *"hows the climate"* or *"is there a warning"*, the system does not need a database search—the Gemini model reasons directly over the injected real-time telemetry context to output a natural answer.

### 3. Outward Arc Wayfinding Logic
Standard maps draw straight route lines crossing directly over the pitch (which is physically impossible to walk). ApexArena implements a quadratic bezier route algorithm that calculates the mid-point between the selected gate and POI, and bows it outward away from the pitch center `(250, 175)` to curve gracefully along the concourses.

### 4. Interactive Feedback Loops & State Overrides
The Transport and Sustainability pages implement state-based controller overrides. When an operator slides the solar efficiency dial or clicks "Dispatch Shuttles", the input values temporarily override the simulator feeds. The numerical values immediately gooey-melt and morph into optimized statistics using custom SVG gooey-threshold matrix filters.

---

## 🧠 Generative AI Integration

ApexArena leverages **Google Gemini 2.0 Flash** for core cognitive features:

| Feature | AI Capability | Trigger Context |
|---------|--------------|-----------------|
| **Concierge Chat** | Natural language queries | MetLife layout knowledge, live telemetry, and language autodetection |
| **Crowd Flow Analysis** | Real-time redistribution | Evaluates zone occupancy percentages to suggest alternative exit routings |
| **Incident Advisory** | Containment protocols | Generates dispatcher check-lists for selected concourse safety alerts |
| **Eco-Recommendations** | Environmental advice | Suggests HVAC and solar grid tuning based on live energy loads |

**Demo Mode**: The application is fully functional without an API key using realistic pre-built AI response mapping, making it instantly reviewable and testable.

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
apexarena/
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
git clone https://github.com/YOUR_USERNAME/apexarena.git
cd apexarena

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

ApexArena uses the **Google Gemini API** for its AI features. You have two options:

1. **Demo Mode** (default): Works immediately with no API key. Pre-built responses simulate AI behavior.
2. **Live AI Mode**: Set your Gemini API key as `VITE_GEMINI_API_KEY` in your `.env` file for secure execution.

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

## 📝 Assumptions

1. **Fictional Concourse Geometries**: While the 11 stadium options correspond to real-world FIFA World Cup 2026 host venues, the internal con-course maps, point-of-interest coordinates, and evacuation routing parameters use simplified relative percentage schemes to ensure rapid browser rendering.
2. **Client-Side Simulation**: Stadium status metrics, transit arrival counters, and matches proceed on localized React intervals, removing the dependency on external databases or live webhooks while keeping server overhead at zero.
3. **Demo Pipeline Reliability**: The GenAI model falls back to a deterministic semantic keyword matcher when `import.meta.env.VITE_GEMINI_API_KEY` is not present, simulating realistic Gemini-Flash behaviors for instant, offline-capable review.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ for FIFA World Cup 2026<br>
  <strong>ApexArena</strong> — Intelligent Operations for the Beautiful Game
</p>
