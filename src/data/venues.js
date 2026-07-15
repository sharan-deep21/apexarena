export const VENUES = [
  { id: 'metlife', name: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', capacity: 82500, timezone: 'EST', emoji: '🏟️', isFinal: true },
  { id: 'att', name: 'AT&T Stadium', city: 'Arlington, TX', country: 'USA', capacity: 80000, timezone: 'CST', emoji: '🏈' },
  { id: 'sofi', name: 'SoFi Stadium', city: 'Inglewood, CA', country: 'USA', capacity: 70240, timezone: 'PST', emoji: '🎬' },
  { id: 'hardrock', name: 'Hard Rock Stadium', city: 'Miami Gardens, FL', country: 'USA', capacity: 64767, timezone: 'EST', emoji: '🌴' },
  { id: 'azteca', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: 87523, timezone: 'CST', emoji: '🇲🇽', isLegacy: true },
  { id: 'bmo', name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: 45736, timezone: 'EST', emoji: '🇨🇦' },
  { id: 'gillette', name: 'Gillette Stadium', city: 'Foxborough, MA', country: 'USA', capacity: 65878, timezone: 'EST', emoji: '🏟️' },
  { id: 'lincoln', name: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA', capacity: 69176, timezone: 'EST', emoji: '🦅' },
  { id: 'lumen', name: 'Lumen Field', city: 'Seattle, WA', country: 'USA', capacity: 68740, timezone: 'PST', emoji: '☔' },
  { id: 'nrg', name: 'NRG Stadium', city: 'Houston, TX', country: 'USA', capacity: 72220, timezone: 'CST', emoji: '🤠' },
  { id: 'arrowhead', name: 'GEHA Field at Arrowhead', city: 'Kansas City, MO', country: 'USA', capacity: 76416, timezone: 'CST', emoji: '🏹' },
];

export const getCurrentVenueId = () => localStorage.getItem('stadiumai_venue_id') || 'metlife';
export const setCurrentVenueId = (id) => localStorage.setItem('stadiumai_venue_id', id);

export const getCurrentVenue = () => {
  const id = getCurrentVenueId();
  return VENUES.find(v => v.id === id) || VENUES[0];
};

export const CURRENT_VENUE = getCurrentVenue();
export const getVenueById = (id) => VENUES.find(v => v.id === id) || VENUES[0];
