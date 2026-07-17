import { getCurrentVenueId } from './venues.js';

export const MATCH_SCHEDULE = [
  { id: 1, homeTeam: 'Brazil', awayTeam: 'Germany', homeFlag: '🇧🇷', awayFlag: '🇩🇪', date: '2026-07-10', time: '20:00', venue: 'MetLife Stadium', group: 'Semi-Final' },
  { id: 2, homeTeam: 'Argentina', awayTeam: 'France', homeFlag: '🇦🇷', awayFlag: '🇫🇷', date: '2026-07-11', time: '20:00', venue: 'AT&T Stadium', group: 'Semi-Final' },
  { id: 3, homeTeam: 'Spain', awayTeam: 'England', homeFlag: '🇪🇸', awayFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', date: '2026-07-14', time: '17:00', venue: 'MetLife Stadium', group: '3rd Place' },
  { id: 4, homeTeam: 'TBD', awayTeam: 'TBD', homeFlag: '🏆', awayFlag: '🏆', date: '2026-07-19', time: '20:00', venue: 'MetLife Stadium', group: 'FINAL' },
];

export const LIVE_MATCH = {
  homeTeam: 'Brazil', awayTeam: 'Germany', homeFlag: '🇧🇷', awayFlag: '🇩🇪',
  homeScore: 2, awayScore: 1, minute: 67, status: 'LIVE', venue: 'MetLife Stadium',
  events: [
    { minute: 12, type: 'goal', team: 'Brazil', player: 'Vinícius Jr.' },
    { minute: 34, type: 'goal', team: 'Germany', player: 'Musiala' },
    { minute: 58, type: 'goal', team: 'Brazil', player: 'Rodrygo' },
    { minute: 45, type: 'yellow', team: 'Germany', player: 'Rüdiger' },
  ],
};

export const INITIAL_ALERTS = [
  { id: 1, severity: 'warning', title: 'High Density Alert', message: 'North Upper section approaching 90% capacity', location: 'North Upper', timestamp: new Date(Date.now() - 120000) },
  { id: 2, severity: 'info', title: 'VIP Access Update', message: 'VIP lounge gates now open for credential holders', location: 'VIP North', timestamp: new Date(Date.now() - 300000) },
  { id: 3, severity: 'success', title: 'Medical Cleared', message: 'Minor incident in Section 112 resolved — fan treated and released', location: 'East Lower', timestamp: new Date(Date.now() - 600000) },
];

const getDynamicFoodOptions = () => {
  const venueId = getCurrentVenueId();
  
  if (venueId === 'sofi') {
    return [
      { name: 'Hollywood Grill', type: 'American', zone: 'North Lower', priceRange: '$$', tags: ['gf'] },
      { name: 'Inglewood Taqueria', type: 'Mexican', zone: 'South Lower', priceRange: '$', tags: ['halal'] },
      { name: 'Sunset Boulevard Grill', type: 'Italian', zone: 'East Lower', priceRange: '$', tags: [] },
      { name: 'Pacific Coast Sushi', type: 'Japanese', zone: 'West Upper', priceRange: '$$$', tags: ['gf'] },
      { name: 'Venice Beach Bowls', type: 'Vegan', zone: 'North Upper', priceRange: '$$', tags: ['vegan', 'gf'] },
      { name: 'Crenshaw Kitchen', type: 'Soul Food', zone: 'South Upper', priceRange: '$$', tags: ['halal'] },
      { name: 'Pacific Craft Brews', type: 'Drinks', zone: 'VIP North', priceRange: '$$$', tags: [] },
    ];
  }
  
  if (venueId === 'azteca') {
    return [
      { name: 'Tacos El Pastor', type: 'Mexican', zone: 'North Lower', priceRange: '$', tags: ['halal'] },
      { name: 'Antojitos Azteca', type: 'Mexican', zone: 'South Lower', priceRange: '$', tags: [] },
      { name: 'Cervecería del Sol', type: 'Drinks', zone: 'East Lower', priceRange: '$$', tags: [] },
      { name: 'Churros y Café', type: 'Dessert', zone: 'West Upper', priceRange: '$', tags: [] },
      { name: 'Ensaladas de la Villa', type: 'Vegan', zone: 'North Upper', priceRange: '$$', tags: ['vegan', 'gf'] },
      { name: 'Cantina del Coloso', type: 'Drinks', zone: 'VIP North', priceRange: '$$$', tags: [] },
    ];
  }

  if (venueId === 'lumen') {
    return [
      { name: 'Puget Sound Seafood', type: 'Seafood', zone: 'North Lower', priceRange: '$$$', tags: ['gf'] },
      { name: 'Emerald City Grill', type: 'American', zone: 'South Lower', priceRange: '$$', tags: [] },
      { name: 'Rainier Espresso', type: 'Coffee', zone: 'East Lower', priceRange: '$', tags: [] },
      { name: 'PNW Craft Brewery', type: 'Drinks', zone: 'West Upper', priceRange: '$$', tags: [] },
      { name: 'Seattle Poke', type: 'Asian', zone: 'North Upper', priceRange: '$$', tags: ['gf'] },
      { name: 'Space Needle Suites', type: 'Gourmet', zone: 'VIP North', priceRange: '$$$', tags: [] },
    ];
  }

  // Default: MetLife Stadium
  return [
    { name: 'Stadium Grill', type: 'American', zone: 'North Lower', priceRange: '$$', tags: ['gf'] },
    { name: 'Taco Fiesta', type: 'Mexican', zone: 'South Lower', priceRange: '$', tags: ['halal'] },
    { name: 'Pizza Corner', type: 'Italian', zone: 'East Lower', priceRange: '$', tags: [] },
    { name: 'Sushi Express', type: 'Japanese', zone: 'West Upper', priceRange: '$$$', tags: ['gf'] },
    { name: 'Green Bowl', type: 'Vegan', zone: 'North Upper', priceRange: '$$', tags: ['vegan', 'gf'] },
    { name: 'Halal Kitchen', type: 'Middle Eastern', zone: 'South Upper', priceRange: '$$', tags: ['halal'] },
    { name: 'BBQ Pit', type: 'BBQ', zone: 'Field Level West', priceRange: '$$', tags: ['gf'] },
    { name: 'Craft Beer Garden', type: 'Drinks', zone: 'VIP North', priceRange: '$$$', tags: [] },
  ];
};

export const FOOD_OPTIONS = getDynamicFoodOptions();
