/**
 * StadiumAI — Google Gemini API Integration Service
 * Core GenAI service for chat, crowd analysis, emergency advice, translation, and sustainability.
 */

import { getCurrentVenue } from '../data/venues';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function getSystemPrompt() {
  const venue = getCurrentVenue();
  return `You are "ApexArena", the official AI assistant for FIFA World Cup 2026 at ${venue.name} in ${venue.city}, ${venue.country}. You help fans, staff, and volunteers with:

VENUE KNOWLEDGE:
- ${venue.name}: ${venue.capacity.toLocaleString()} capacity, located in ${venue.city}.
- 12 zones: North/South/East/West Upper & Lower, VIP North & South, Field Level East & West
- 4 main gates: Gate 1 (North), Gate 2 (East), Gate 3 (South), Gate 4 (West)
- Accessible entrances at Gates A (North) and B (South)

FOOD & AMENITIES:
- Food Courts A-D located at each corner of the stadium concourse
- Options: Stadium Grill (American), Taco Fiesta (Mexican), Pizza Corner, Sushi Express, Green Bowl (Vegan), Halal Kitchen, BBQ Pit, Craft Beer Garden
- Restrooms at all 4 cardinal points + VIP areas
- First Aid stations near Section 112 (East) and Section 332 (West)

NAVIGATION TIPS:
- Sections 100-150: Lower Level East/South
- Sections 200-250: Upper Level
- Sections 300-350: Club Level
- VIP access through dedicated elevators at Gates 1 and 3

TRANSPORTATION:
- Parking lots A-D surrounding the stadium, recommended pre-booking
- Transit trains to local municipal/transit station
- Rideshare pickup at Lot G designated zone

EMERGENCY:
- For emergencies: alert nearest staff or text HELP to stadium number
- First aid stations: East (Section 112), West (Section 332)

Keep responses concise, helpful, and friendly. Use emojis sparingly. If asked about match scores or live events, provide helpful context. Support multiple languages when requested.`;
}

const DEMO_RESPONSES = {
  seat: "🎫 **Finding Your Seat:**\n\nCheck your ticket for **Section**, **Row**, and **Seat** number.\n\n**Level Guide:**\n- **Sections 100-150**: Lower Level (closest to field)\n- **Sections 200-250**: Upper Level\n- **Sections 300-350**: Club Level\n- **VIP**: Accessible via Gates 1 & 3 elevators\n\nFollow the illuminated overhead signs to your section. Staff in **yellow vests** are at every entrance to help. Digital wayfinding kiosks are located at all 4 gates!\n\n💡 **Tip:** Take a photo of your ticket — it makes re-entry much faster.",

  food: "🍔 **Food Options Near You:**\n\n1. **Stadium Grill** — Burgers & hot dogs, North Lower ($$ • GF options)\n2. **Taco Fiesta** — Tacos, burritos, nachos, South Lower ($ • Halal)\n3. **Green Bowl** — Vegan bowls & salads, North Upper ($$ • Vegan/GF)\n4. **Pizza Corner** — Fresh pizza & garlic bread, East Lower ($)\n5. **Halal Kitchen** — Shawarma & falafel, South Upper ($$ • Halal)\n6. **Sushi Express** — Rolls & bento, West Upper ($$$)\n7. **BBQ Pit** — Smoked ribs & brisket, Field Level West ($$)\n8. **Craft Beer Garden** — 20+ craft beers, VIP North ($$$)\n\n💡 **Tip:** Lines are shortest during the first 15 min of each half. Green Bowl has the fastest service right now (~3 min wait)!",

  restroom: "🚻 **Restroom Locations:**\n\nRestrooms are available at all four cardinal points of each level:\n\n- 🚻 **North** — Near Gate 1, both levels\n- 🚻 **South** — Near Gate 3, both levels\n- 🚻 **East** — Near Section 112, both levels\n- 🚻 **West** — Near Section 332, both levels\n- ♿ **Accessible restrooms** — Available at all locations\n- 👶 **Family restrooms** with changing stations — Gates 1 & 3\n\n📍 **Nearest to you:** Head to the closest concourse corner — restrooms are clearly marked with overhead signs.\n\n💡 **Tip:** East restrooms typically have the shortest lines during the match!",

  accessibility: "♿ **Accessibility Guide:**\n\n• **Accessible Entrances:** Gates A (North) and B (South) with ramp access\n• **Wheelchair Seating:** Available in all sections — ask at Guest Services\n• **Elevators:** Located at Gates 1 and 3 for all levels\n• **Accessible Restrooms:** At all restroom locations\n• **Service Animals:** Welcome throughout the venue\n• **Assistive Listening:** Devices at Guest Services (Gate 1)\n• **Sensory Room:** Near Section 114 for guests needing a calm space\n• **Sign Language:** Interpreters available upon request at Guest Services\n\nNeed specific directions? Tell me your section and I'll guide you!",

  parking: "🅿️ **Parking Status (Live):**\n\n| Lot | Spots Left | Status |\n|-----|-----------|--------|\n| Lot A | 234/2,000 | ⚠️ Almost Full |\n| Lot B | 567/2,000 | ✅ Available |\n| Lot C | 890/1,500 | ✅ Available |\n| Lot D | 123/1,500 | ⚠️ Almost Full |\n\n🚗 **Rideshare Pickup:** Lot G designated zone (Uber/Lyft)\n🚌 **Free Shuttle:** Local Station → Stadium every 10 min\n\n💡 **Tip:** Lot B has the easiest access to Gates 1 and 2. Post-match, expect 20-30 min exit time from Lots A & D — consider waiting 15 min to avoid the rush.",

  emergency: "🚨 **Emergency Assistance:**\n\nFor immediate help:\n1. **Find nearest staff** — yellow vests (general), blue vests (security)\n2. **Text HELP** to the stadium emergency number on your ticket\n3. **Guest Services** — Gate 1 or Gate 3\n4. **Call 911** for life-threatening emergencies\n\n🏥 **First Aid Stations:**\n- East side: Section 112\n- West side: Section 332\n\nStay calm and alert nearby staff — they're trained to respond quickly.",

  directions: "🗺️ **Getting Around:**\n\nThe concourse forms a **complete loop** on each level — you can walk the full circle without stairs.\n\n**Key Landmarks:**\n- 🍔 Food Courts — All 4 corners\n- 🚻 Restrooms — N/S/E/W on each level\n- 🏥 First Aid — Section 112 (East), Section 332 (West)\n- 🛍️ Team Store — Near Gate 1 (North)\n- 📱 Charging Stations — Gates 2 and 4\n- 🎒 Bag Check — Gate 1 entrance\n\n**Level Changes:** Ramps at Gates 1 & 3, escalators at Gates 2 & 4, elevators at Gates 1 & 3.\n\nTell me where you are and where you need to go — I'll give you step-by-step directions!",

  match: "⚽ **Live Match Status:**\n\n🇧🇷 **Brazil 2 - 1 Germany** 🇩🇪\n⏱️ 67th minute • LIVE\n\n**Match Events:**\n- ⚽ 12' — Vinícius Jr. (Brazil) — stunning left-foot finish\n- ⚽ 34' — Musiala (Germany) — header from corner kick\n- 🟨 45' — Rüdiger (Germany) — tactical foul\n- ⚽ 58' — Rodrygo (Brazil) — counterattack goal\n\n⏱️ **Attendance:** ~67,000\n\nNext match: 3rd Place Play-off, July 14",

  weather: "🌤️ **Current Weather:**\n\n🌡️ **72°F** (22°C) — Partly Cloudy\n💧 Humidity: 45%\n💨 Wind: 8 mph from the west\n☀️ UV Index: 5 (moderate)\n\n**Forecast for today:**\n- No rain expected through the match\n- Temperature will drop to ~65°F by evening\n- Light jacket recommended for after the game\n\n💡 **Tip:** Sunscreen is available free at Guest Services!",

  medical: "🏥 **Medical Assistance:**\n\nIf you or someone nearby needs medical help:\n\n1. **Alert nearest staff** immediately (yellow or blue vests)\n2. **First Aid Stations:**\n   - 📍 Section 112 (East side) — full medical team\n   - 📍 Section 332 (West side) — full medical team\n3. **AED locations:** Every 100 sections throughout the stadium\n4. **Emergency:** Call 911 or text HELP\n\n24 medical staff are on duty right now across the venue.",

  wifi: "📶 **WiFi & Connectivity:**\n\n**Free Stadium WiFi:**\n- Network: `Stadium_FIFA2026`\n- No password required\n- Connect → Accept terms → Browse!\n\n📱 **Charging Stations:**\n- Gate 2 — 20 USB ports\n- Gate 4 — 20 USB ports\n- VIP Lounges — Wireless charging pads\n\n💡 **Tip:** If WiFi is slow in your section, try switching to 5GHz band. Cell coverage is enhanced with DAS (Distributed Antenna System) throughout the stadium.",

  kids: "👨‍👩‍👧‍👦 **Family & Kids Services:**\n\n- 👶 **Family Restrooms** with changing stations — Gates 1 & 3\n- 🎈 **Kids Zone** — Interactive play area near Gate 2 (free)\n- 🎨 **Face Painting** — North concourse, lower level\n- 🍦 **Kid-friendly food** — Pizza Corner, Stadium Grill (kids menu)\n- 🧸 **Lost Child Station** — Guest Services, Gate 1\n- 🔇 **Sensory Room** — Section 114 (quiet, low-stimulation)\n- 🎧 **Ear protection** — Available free at Guest Services\n\n💡 **Tip:** Take a photo of your child's outfit and write your phone number on their wristband before the match!",

  merch: "🛍️ **Merchandise & Team Store:**\n\n📍 **Main Team Store** — Near Gate 1 (North entrance)\n🕐 Open from gates-open until 1 hour post-match\n\n**What's Available:**\n- 🏆 Official FIFA WC 2026 jerseys ($89-$149)\n- ⚽ Match balls & mini balls ($25-$165)\n- 🧢 Caps, scarves & accessories ($15-$45)\n- 📸 Commemorative match programs ($10)\n- 🎁 Souvenirs & collectibles\n\n**Pop-up stands** are also located at Gates 2, 3, and 4.\n\n💡 **Tip:** The main store near Gate 1 has the widest selection. Lines are shortest before kickoff!",

  water: "💧 **Water & Hydration:**\n\n**Free Water Refill Stations:**\n- Gate 1 concourse\n- Gate 2 concourse\n- Gate 3 concourse\n- Gate 4 concourse\n\n🥤 Bottled water is also available at all concession stands ($4)\n\n♻️ **Sustainability note:** Please use refill stations when possible! We've saved 15,200 gallons today through our water efficiency program.\n\n💡 **Tip:** You can bring an empty reusable bottle into the stadium and fill it at any refill station for free!",

  schedule: "📅 **Match Schedule:**\n\n| Date | Match | Round |\n|------|-------|-------|\n| Jul 10 | 🇧🇷 Brazil vs Germany 🇩🇪 | Semi-Final ⚽ LIVE |\n| Jul 14 | 🇪🇸 Spain vs England 🏴󠁧󠁢󠁥󠁮󠁧󠁿 | 3rd Place |\n| Jul 19 | 🏆 TBD vs TBD | **THE FINAL** |\n\n**Gates open** 3 hours before kickoff.\n**Kickoff times:** 5:00 PM or 8:00 PM ET\n\n🎫 Tickets: fifa.com/tickets",

  lost: "🔍 **Lost & Found:**\n\n📍 **Location:** Guest Services desk at **Gate 1** (North)\n🕐 **Hours:** Open during events + 2 hours after\n\n**What to do:**\n1. Visit Guest Services at Gate 1 immediately\n2. Describe your item in detail\n3. Leave your contact information\n\n**Lost a person?** Staff at any gate can help with PA announcements. Lost children should be reported to the nearest security officer (blue vest) immediately.\n\n💡 **Tip:** The stadium app has a 'Find My Group' feature — share your live location with friends!",
};

const GREETING_RESPONSES = (venueName) => [
  `👋 Hey there! Welcome to ${venueName} for FIFA World Cup 2026! I'm your AI assistant — ask me about finding your seat, food options, restrooms, match scores, directions, or anything else. How can I help?`,
  `🏟️ Welcome to the World Cup! I'm ApexArena, here to make your experience amazing. I can help with seating, food, navigation, accessibility, weather, and much more. What do you need?`,
  `⚽ Hi! Great to have you at ${venueName}! Whether you need directions, want to know the score, or are looking for food — I've got you covered. What can I help you with?`,
  `👋 Hello! I'm your smart stadium assistant. Ask me anything — from 'Where's the nearest restroom?' to 'What's the score?' to 'Where can I get halal food?' — I'm here to help!`,
];

// Keyword mapping: keyword → response key
const KEYWORD_MAP = [
  // Specific domains first
  { keys: ['seat', 'section', 'ticket', 'row', 'gate', 'entrance', 'entry', 'enter'], response: 'seat' },
  { keys: ['food', 'eat', 'hungry', 'lunch', 'dinner', 'snack', 'burger', 'pizza', 'taco', 'sushi', 'halal', 'vegan', 'vegetarian', 'gluten', 'restaurant', 'menu', 'concession', 'beer', 'drink', 'bar', 'coffee', 'beverage'], response: 'food' },
  { keys: ['restroom', 'bathroom', 'washroom', 'toilet', 'wc', 'loo', 'lavatory', 'pee', 'urgently', 'baby change', 'changing station', 'diaper'], response: 'restroom' },
  { keys: ['wheelchair', 'accessible', 'disability', 'disabled', 'ramp', 'elevator', 'lift', 'hearing', 'blind', 'visual', 'sensory', 'service animal', 'sign language'], response: 'accessibility' },
  { keys: ['park', 'car', 'drive', 'uber', 'lyft', 'taxi', 'cab', 'rideshare', 'ride share', 'bus', 'train', 'transit', 'subway', 'shuttle', 'transport', 'traffic', 'commute', 'lot a', 'lot b', 'lot c', 'lot d'], response: 'parking' },
  { keys: ['emergency', 'help', 'danger', 'fire', 'evacuate', 'evacuation', 'security', 'police', 'fight', 'threat', 'suspicious', 'alarm', 'unsafe', 'report', 'issue', 'problem', 'complaint'], response: 'emergency' },
  { keys: ['score', 'match', 'game', 'goal', 'result', 'who is winning', 'who scored', 'brazil', 'germany', 'half time', 'halftime', 'red card', 'yellow card', 'penalty', 'kickoff', 'kick off', 'lineup'], response: 'match' },
  { keys: ['weather', 'climate', 'rain', 'temperature', 'temp', 'hot', 'cold', 'sun', 'wind', 'forecast', 'umbrella', 'sunscreen', 'jacket', 'conditions', 'forecasts'], response: 'weather' },
  { keys: ['wifi', 'wi-fi', 'internet', 'charge', 'charging', 'battery', 'phone', 'plug', 'outlet', 'usb', 'signal', 'connection', 'data'], response: 'wifi' },
  { keys: ['kid', 'child', 'children', 'baby', 'family', 'infant', 'toddler', 'stroller', 'pram', 'play area', 'face paint', 'ear protection'], response: 'kids' },
  { keys: ['shop', 'store', 'merch', 'merchandise', 'jersey', 'shirt', 'souvenir', 'buy', 'purchase', 'gift', 'scarf', 'hat', 'cap', 'ball', 'flag'], response: 'merch' },
  { keys: ['water', 'hydrat', 'thirsty', 'refill', 'bottle', 'fountain', 'tap water'], response: 'water' },
  { keys: ['schedule', 'fixture', 'next match', 'upcoming', 'final', 'semi', 'what time', 'when is', 'calendar', 'dates'], response: 'schedule' },
  { keys: ['lost', 'found', 'missing', 'forgot', 'left behind', 'lost and found', 'misplaced', 'stolen'], response: 'lost' },
  { keys: ['medical', 'first aid', 'doctor', 'nurse', 'injury', 'injured', 'hurt', 'sick', 'ill', 'faint', 'dizzy', 'ambulance', 'hospital', 'medicine', 'allergy', 'allergic', 'epipen', 'defibrillator', 'aed', 'health'], response: 'medical' },
  
  // Generic question/nav helpers at the bottom
  { keys: ['direction', 'where', 'how to get', 'navigate', 'find', 'map', 'way to', 'route', 'walk', 'go to', 'get to', 'closest', 'nearest', 'location', 'located'], response: 'directions' },
];

function formatTelemetryContext(context) {
  if (!context || Object.keys(context).length === 0) return '';
  
  let lines = ['\n\n=== REAL-TIME OPERATIONS TELEMETRY ==='];
  
  if (context.matchInfo) {
    const m = context.matchInfo;
    lines.push(`LIVE MATCH: ${m.homeFlag} ${m.homeTeam} vs ${m.awayTeam} ${m.awayFlag} (${m.homeScore} - ${m.awayScore})`);
    lines.push(`ELAPSED: ${m.minute}' (${m.status})`);
  }
  
  if (context.stats) {
    const s = context.stats;
    lines.push(`ATTENDANCE: ${s.attendance?.toLocaleString()} fans (${s.capacityPercent}% capacity)`);
    lines.push(`WAIT TIME: avg ${s.avgWaitTime}`);
  }
  
  if (context.weather) {
    const w = context.weather;
    lines.push(`WEATHER: ${w.temp}°F, ${w.condition}, Wind ${w.wind}, Humidity ${w.humidity}`);
  }
  
  if (context.alerts && context.alerts.length > 0) {
    lines.push('ACTIVE ALERTS & WARNINGS:');
    context.alerts.forEach(a => {
      lines.push(`- [${a.severity.toUpperCase()}] ${a.title} at ${a.location}: ${a.message}`);
    });
  } else {
    lines.push('ACTIVE ALERTS & WARNINGS: None (All Clear)');
  }
  
  if (context.crowdData && context.crowdData.length > 0) {
    lines.push('CONCOURSE ZONE OCCUPANCIES:');
    context.crowdData.forEach(z => {
      const pct = Math.round((z.current / z.capacity) * 100);
      lines.push(`- ${z.name}: ${z.current.toLocaleString()} / ${z.capacity.toLocaleString()} (${pct}% capacity - Trend: ${z.trend})`);
    });
  }
  
  lines.push('=====================================');
  return lines.join('\n');
}

/** Find a matching demo response */
function getDemoResponse(message, context = {}) {
  const venue = getCurrentVenue();
  const lower = message.toLowerCase().replace(/[^a-z0-9 ]/g, ' ');

  // 1. Dynamic Check for Active Emergency Warnings/Alerts
  if (lower.includes('alert') || lower.includes('warning') || lower.includes('incident') || lower.includes('emergency') || lower.includes('danger') || lower.includes('threat') || lower.includes('police') || lower.includes('fire')) {
    if (context.alerts && context.alerts.length > 0) {
      const alertList = context.alerts.map(a => `🚨 **[${a.severity.toUpperCase()}] ${a.title}** at **${a.location}**\n*Details:* ${a.message}`).join('\n\n');
      return `⚠️ **Active Operations Alerts:**\n\nThere are ongoing incidents requiring active containment:\n\n${alertList}\n\n💡 **Advisory:** Deploy security response teams to affected zones immediately.`;
    }
    return `✅ **Operations Status:**\n\nAll clear! There are currently no active warnings or emergency incidents logged in the stadium concourses.`;
  }

  // 2. Dynamic Check for Crowd Density & Congested Zones
  if (lower.includes('crowd') || lower.includes('congest') || lower.includes('busy') || lower.includes('full') || lower.includes('density')) {
    if (context.crowdData && context.crowdData.length > 0) {
      const criticalZones = context.crowdData.filter(z => (z.current / z.capacity) * 100 >= 80);
      const avgOcc = context.stats?.capacityPercent || 81;
      if (criticalZones.length > 0) {
        return `👥 **Crowd Density Analysis:**\n\nThe average occupancy is **${avgOcc}%**. The following zones have reached heavy congestion limits:\n\n${criticalZones.map(z => `- **${z.name}**: ${Math.round((z.current/z.capacity)*100)}% capacity (${z.current.toLocaleString()} fans)`).join('\n')}\n\n💡 **Advisory:** Divert incoming spectator flows to adjacent lower-density gates or concourse loops.`;
      }
      return `👥 **Crowd Flow Status:**\n\nTotal occupancy is stable at **${avgOcc}%** with normal flow. No zones are reporting capacity blockages.`;
    }
  }

  // 3. Dynamic Check for Score/Live Match Stats
  if (lower.includes('score') || lower.includes('goal') || lower.includes('winning') || lower.includes('score') || lower.includes('who scored') || lower.includes('minute') || lower.includes('match') || lower.includes('game') || lower.includes('brazil') || lower.includes('germany')) {
    if (context.matchInfo) {
      const m = context.matchInfo;
      return `⚽ **Live Match Status Update:**\n\n**${m.homeFlag} ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam} ${m.awayFlag}**\n⏱️ ${m.minute}' • ${m.status}\n🏟️ Venue: ${m.venue}\n\nAll gates and amenities are adjusted for live crowd movements.`;
    }
  }

  // 4. Dynamic Check for Weather Condition
  if (lower.includes('weather') || lower.includes('climate') || lower.includes('temp') || lower.includes('rain') || lower.includes('cloud') || lower.includes('wind') || lower.includes('forecast') || lower.includes('sun')) {
    if (context.weather) {
      const w = context.weather;
      return `🌤️ **Current Weather Report:**\n\nTemperature is **${w.temp}°F** (${w.condition}).\n- 💧 Humidity: ${w.humidity}\n- 💨 Wind: ${w.wind}\n\nPerfect match-day conditions. No delays anticipated!`;
    }
  }

  // Direct checks for common queries to ensure "natural answers"
  if (lower.includes('name') && (lower.includes('stadium') || lower.includes('venue') || lower.includes('place'))) {
    return `🏟️ You are currently at **${venue.name}** in ${venue.city}, ${venue.country}! Let me know if you need help finding your seat or exploring the concessions!`;
  }
  if (lower.includes('capacity') || lower.includes('how big') || lower.includes('size')) {
    return `📊 **${venue.name}** has a total capacity of **${venue.capacity.toLocaleString()}** spectators for the FIFA World Cup 2026!`;
  }
  if (lower.includes('where') && (lower.includes('stadium') || lower.includes('located') || lower.includes('city'))) {
    return `📍 **${venue.name}** is located in **${venue.city}, ${venue.country}**.`;
  }

  // Keyword matching — check all keyword groups with word boundaries
  for (const group of KEYWORD_MAP) {
    for (const keyword of group.keys) {
      const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(lower)) {
        const baseResponse = DEMO_RESPONSES[group.response];
        return baseResponse.replaceAll('MetLife Stadium', venue.name).replaceAll('MetLife', venue.name);
      }
    }
  }

  // Check for greetings (moved down so it doesn't hijack questions that start with 'hey' or 'hi')
  if (/^(hi|hey|hello|yo|sup|howdy|greetings|good morning|good evening|good afternoon|what can you do|what do you do)\b/.test(lower.trim())) {
    const greetings = GREETING_RESPONSES(venue.name);
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // Check for thank you (moved down so it doesn't hijack questions that mention thank you)
  if (/\b(thank|thanks|thx|cheers|appreciate|great help|helpful)\b/.test(lower)) {
    return `😊 You're welcome! Enjoy the match at ${venue.name}! If you need anything else during the game, just ask. Go enjoy the beautiful game! ⚽🎉`;
  }

  // Fallback: random greeting
  const greetings = GREETING_RESPONSES(venue.name);
  return greetings[Math.floor(Math.random() * greetings.length)];
}

/** Get API key from localStorage or environment */
export function getApiKey() {
  return localStorage.getItem('stadiumai_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
}

/** Store API key in localStorage */
export function setApiKey(key) {
  localStorage.setItem('stadiumai_gemini_key', key);
}

/** Check if running in demo mode (no API key) */
function isDemoMode() {
  return !getApiKey();
}

/** Send a chat message to Gemini API */
export async function sendChatMessage(message, context = {}, language = 'en') {
  if (isDemoMode()) {
    await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    return { text: getDemoResponse(message, context), success: true };
  }
  try {
    const telemetryContext = formatTelemetryContext(context);
    const systemPrompt = getSystemPrompt() + telemetryContext;
    const langInstruction = language !== 'en' ? `\n\nIMPORTANT: Respond in the language with code "${language}".` : '';
    const venue = getCurrentVenue();
    const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + langInstruction }] },
          { role: 'model', parts: [{ text: `Understood! I am ApexArena, the smart stadium Operations AI. I see the live metrics and am ready to support fans and command operators at ${venue.name}.` }] },
          { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    });
    if (!res.ok) {
      console.warn('Gemini API HTTP error:', res.status, '— falling back to demo mode');
      return { text: getDemoResponse(message, context), success: false };
    }
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.warn('Gemini API returned no candidates — falling back to demo mode');
      return { text: getDemoResponse(message, context), success: false };
    }
    return { text, success: true };
  } catch (error) {
    console.error('Gemini API error:', error);
    return { text: getDemoResponse(message, context), success: false };
  }
}

/** Get AI crowd analysis */
export async function getCrowdAnalysis(crowdData) {
  const venue = getCurrentVenue();
  if (isDemoMode()) {
    return { text: `${venue.name} at 81% capacity. North Upper approaching critical levels — recommend redirecting to West Lower and Field Level sections. Concession areas experiencing normal halftime surge.`, success: true };
  }
  try {
    const prompt = `Analyze this crowd data for ${venue.name} and provide brief operational recommendations:\n${JSON.stringify(crowdData)}`;
    const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5, maxOutputTokens: 512 } }),
    });
    if (!res.ok) return { text: `${venue.name} at 81% capacity. North Upper approaching critical levels — recommend redirecting to West Lower and Field Level sections.`, success: false };
    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis unavailable.', success: true };
  } catch { return { text: 'Analysis unavailable.', success: false }; }
}

/** Get emergency decision support from AI */
export async function getEmergencyAdvice(incidentType, crowdDensity, location) {
  const venue = getCurrentVenue();
  if (isDemoMode()) {
    return { text: `For ${incidentType} at ${location}: Deploy nearest response team inside ${venue.name}. Current density is ${crowdDensity}% — ${crowdDensity > 80 ? 'consider partial evacuation of adjacent sections' : 'standard protocol applies'}. Nearest medical: Section 112 First Aid. ETA: 3 min.`, success: true };
  }
  try {
    const prompt = `Emergency at ${venue.name}: ${incidentType} at ${location}. Crowd density: ${crowdDensity}%. Provide concise emergency response recommendations.`;
    const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 512 } }),
    });
    if (!res.ok) return { text: `For ${incidentType} at ${location}: Deploy nearest response team. Current density is ${crowdDensity}%. Nearest medical: Section 112. ETA: 3 min.`, success: false };
    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'Follow standard protocol.', success: true };
  } catch { return { text: 'Follow standard emergency protocol.', success: false }; }
}

/** Translate text using Gemini */
export async function translateText(text, targetLanguage) {
  if (isDemoMode()) return { text, success: false };
  try {
    const prompt = `Translate the following text to ${targetLanguage}. Return only the translation:\n${text}`;
    const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2, maxOutputTokens: 512 } }),
    });
    if (!res.ok) return { text, success: false };
    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || text, success: true };
  } catch { return { text, success: false }; }
}

/** Get AI sustainability tips */
export async function getSustainabilityTips(metrics) {
  const venue = getCurrentVenue();
  if (isDemoMode()) {
    return { text: `Reduce lighting in low-traffic sections of ${venue.name} by 20%. Redirect fans to water refill stations. Schedule early composting collection for Food Court B.`, success: true };
  }
  try {
    const prompt = `Given these sustainability metrics for ${venue.name}: ${JSON.stringify(metrics)}. Provide 3 brief actionable eco-recommendations.`;
    const res = await fetch(`${GEMINI_API_URL}?key=${getApiKey()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.5, maxOutputTokens: 512 } }),
    });
    if (!res.ok) return { text: 'Reduce lighting in low-traffic sections by 20%. Redirect fans to water refill stations.', success: false };
    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No tips available.', success: true };
  } catch { return { text: 'Sustainability analysis unavailable.', success: false }; }
}
