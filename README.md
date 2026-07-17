# ApexArena: Intelligent Venue Operations

> FIFA World Cup 2026 • Challenge 4: Smart Stadiums & Tournament Operations

**Live Website**: [https://apexarena-ops.vercel.app](https://apexarena-ops.vercel.app)

ApexArena is a GenAI-enabled platform designed to optimize stadium operations and the overall tournament experience for fans, venue staff, and organizers during the FIFA World Cup 2026. The solution leverages the Google Gemini API to coordinate intelligent navigation, crowd flow analysis, active emergency dispatch logging, and eco-grid resource automation.

---

## Chosen Vertical

**Persona: Fans & Venue Organizers**

Managing a tournament venue hosting 80,000+ spectators presents friction points for both fans and operations teams. ApexArena addresses these challenges in a unified, premium hub:
* **For Fans**: Multi-language concierge chat, accessible POI routing, and step-free wayfinding.
* **For Organizers**: Zone occupancy monitoring, live transit dispatch tools, emergency protocol guidance, and grid efficiency management.

---

## Approach & Logic

### 1. Unified Real-Time Operations Telemetry
Instead of separate database structures, ApexArena uses a localized data simulation engine (`dataSimulator.js`) that ticks every 3 seconds to update attendance metrics, zone densities, rideshare wait times, transit countdowns, and warning states.

### 2. Context-Aware Prompt Pipeline
User queries are automatically formatted alongside a live state snapshot before reaching the model. If a user asks about local climate or active alerts, the Gemini model reasons directly over the injected telemetry block to return an accurate, real-time response.

### 3. Outward Arc Wayfinding
To prevent paths from cutting directly across the stadium pitch, the routing engine calculates a quadratic bezier curve. This curve bows paths outward away from the center coordinate `(250, 175)` to align with actual concourse layouts.

### 4. Interactive Feedback Loops
Operators can override simulated data in real time via the Transport and Sustainability pages. The input metrics immediately transition using custom SVG gooey-threshold matrix filters for responsive visual feedback.

---

## Key Integrations

Generative AI capabilities are integrated across the following core operations:

* **Concierge Chat**: Contextual queries regarding layout, amenities, and schedule with automatic language detection.
* **Crowd Flow Analysis**: Evaluates zone densities and generates occupancy redistribution recommendations.
* **Incident Advisory**: Generates specific check-lists and containment strategies for active concourse alerts.
* **Eco-Recommendations**: Analyzes current environmental metric loads and suggest HVAC and solar grid adjustments.

---

## System Architecture

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

## Assumptions

1. **Fictional Concourse Geometries**: Stadium options correspond to real-world FIFA World Cup 2026 venues, but internal maps and coordinate layouts are simplified relative models to optimize browser load times.
2. **Client-Side Simulation**: Metrics and countdowns run on localized React hooks to keep server overhead at zero.
3. **Demo Pipeline Reliability**: The application falls back to a semantic keyword mapping model when no Gemini API key is configured, allowing offline functionality.

---

## Running the Project

### Installation
```bash
npm install --legacy-peer-deps
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

