import { getCurrentVenueId } from './venues';

export const STADIUM_ZONES = [
  { id: 'nu', name: 'North Upper', capacity: 7500, type: 'general' },
  { id: 'nl', name: 'North Lower', capacity: 6800, type: 'general' },
  { id: 'eu', name: 'East Upper', capacity: 7200, type: 'general' },
  { id: 'el', name: 'East Lower', capacity: 6500, type: 'general' },
  { id: 'su', name: 'South Upper', capacity: 7500, type: 'general' },
  { id: 'sl', name: 'South Lower', capacity: 6800, type: 'general' },
  { id: 'wu', name: 'West Upper', capacity: 7200, type: 'general' },
  { id: 'wl', name: 'West Lower', capacity: 6500, type: 'general' },
  { id: 'vn', name: 'VIP North', capacity: 4200, type: 'vip' },
  { id: 'vs', name: 'VIP South', capacity: 4200, type: 'vip' },
  { id: 'fe', name: 'Field Level East', capacity: 5100, type: 'field' },
  { id: 'fw', name: 'Field Level West', capacity: 5100, type: 'field' },
];

const getDynamicPOIs = () => {
  const venueId = getCurrentVenueId();
  
  if (venueId === 'sofi') {
    // SoFi Stadium: Asymmetric teardrop. POIs are shifted along the curves and columns.
    return [
      { id: 'f1', name: 'Hollywood Concessions', type: 'food', icon: '🍔', x: 20, y: 45 },
      { id: 'f2', name: 'Inglewood Taqueria', type: 'food', icon: '🌮', x: 80, y: 22 },
      { id: 'f3', name: 'Sunset Boulevard Grill', type: 'food', icon: '🍕', x: 30, y: 75 },
      { id: 'f4', name: 'Pacific Coast Sushi', type: 'food', icon: '🍣', x: 75, y: 78 },
      
      { id: 'r1', name: 'Oculus North Restroom', type: 'restroom', icon: '🚻', x: 40, y: 25 },
      { id: 'r2', name: 'Oculus South Restroom', type: 'restroom', icon: '🚻', x: 60, y: 75 },
      { id: 'r3', name: 'VIP East Restroom', type: 'restroom', icon: '🚻', x: 85, y: 35 },
      { id: 'r4', name: 'VIP West Restroom', type: 'restroom', icon: '🚻', x: 15, y: 65 },
      
      { id: 'm1', name: 'West Concourse Medical', type: 'medical', icon: '🏥', x: 25, y: 32 },
      { id: 'm2', name: 'East Concourse Medical', type: 'medical', icon: '🏥', x: 70, y: 68 },
      
      { id: 'e1', name: 'Oculus Gate A (North)', type: 'exit', icon: '🚪', x: 45, y: 15 },
      { id: 'e2', name: 'Canyon Gate B (East)', type: 'exit', icon: '🚪', x: 90, y: 40 },
      { id: 'e3', name: 'Oculus Gate C (South)', type: 'exit', icon: '🚪', x: 55, y: 85 },
      { id: 'e4', name: 'Canyon Gate D (West)', type: 'exit', icon: '🚪', x: 15, y: 60 },
      
      { id: 'a1', name: 'Ramp Entrance A', type: 'accessibility', icon: '♿', x: 35, y: 18 },
      { id: 'a2', name: 'Ramp Entrance B', type: 'accessibility', icon: '♿', x: 65, y: 82 },
    ];
  }
  
  if (venueId === 'azteca') {
    // Estadio Azteca: Promenades around the massive double oval rim.
    return [
      { id: 'f1', name: 'Tacos Al Pastor', type: 'food', icon: '🌮', x: 15, y: 25 },
      { id: 'f2', name: 'Antojitos Mexicanos', type: 'food', icon: '🌯', x: 85, y: 25 },
      { id: 'f3', name: 'Cervecería del Sol', type: 'food', icon: '🍺', x: 15, y: 75 },
      { id: 'f4', name: 'Churros y Café', type: 'food', icon: '☕', x: 85, y: 75 },
      
      { id: 'r1', name: 'Servicios Sanitarios Norte', type: 'restroom', icon: '🚻', x: 32, y: 14 },
      { id: 'r2', name: 'Servicios Sanitarios Sur', type: 'restroom', icon: '🚻', x: 68, y: 86 },
      { id: 'r3', name: 'Servicios Sanitarios Este', type: 'restroom', icon: '🚻', x: 88, y: 30 },
      { id: 'r4', name: 'Servicios Sanitarios Oeste', type: 'restroom', icon: '🚻', x: 12, y: 70 },
      
      { id: 'm1', name: 'Puesto Médico Norte', type: 'medical', icon: '🏥', x: 22, y: 20 },
      { id: 'm2', name: 'Puesto Médico Sur', type: 'medical', icon: '🏥', x: 78, y: 80 },
      
      { id: 'e1', name: 'Puerta de Acceso 1 (Norte)', type: 'exit', icon: '🚪', x: 50, y: 5 },
      { id: 'e2', name: 'Puerta de Acceso 2 (Este)', type: 'exit', icon: '🚪', x: 95, y: 50 },
      { id: 'e3', name: 'Puerta de Acceso 3 (Sur)', type: 'exit', icon: '🚪', x: 50, y: 95 },
      { id: 'e4', name: 'Puerta de Acceso 4 (Oeste)', type: 'exit', icon: '🚪', x: 5, y: 50 },
      
      { id: 'a1', name: 'Acceso Accesible A', type: 'accessibility', icon: '♿', x: 42, y: 10 },
      { id: 'a2', name: 'Acceso Accesible B', type: 'accessibility', icon: '♿', x: 58, y: 90 },
    ];
  }

  if (venueId === 'lumen') {
    // Lumen Field: Seattle. Open north end, meaning no assets in the far north.
    // Clustered heavily along the East/West towers.
    return [
      { id: 'f1', name: 'Puget Sound Seafood', type: 'food', icon: '🐟', x: 16, y: 40 },
      { id: 'f2', name: 'Emerald City Grill', type: 'food', icon: '🍔', x: 84, y: 42 },
      { id: 'f3', name: 'Rainier Espresso', type: 'food', icon: '☕', x: 18, y: 65 },
      { id: 'f4', name: 'PNW Craft Brewery', type: 'food', icon: '🍺', x: 82, y: 63 },
      
      { id: 'r1', name: 'Restroom North Arch', type: 'restroom', icon: '🚻', x: 22, y: 28 },
      { id: 'r2', name: 'Restroom South Plaza', type: 'restroom', icon: '🚻', x: 78, y: 28 },
      { id: 'r3', name: 'Restroom East Tower', type: 'restroom', icon: '🚻', x: 22, y: 72 },
      { id: 'r4', name: 'Restroom West Deck', type: 'restroom', icon: '🚻', x: 78, y: 72 },
      
      { id: 'm1', name: 'First Aid North', type: 'medical', icon: '🏥', x: 20, y: 50 },
      { id: 'm2', name: 'First Aid South', type: 'medical', icon: '🏥', x: 80, y: 50 },
      
      { id: 'e1', name: 'North Exit Gate', type: 'exit', icon: '🚪', x: 50, y: 35 }, // Shifted down due to open end
      { id: 'e2', name: 'East Plaza Gate', type: 'exit', icon: '🚪', x: 90, y: 55 },
      { id: 'e3', name: 'South Rail Gate', type: 'exit', icon: '🚪', x: 50, y: 90 },
      { id: 'e4', name: 'West Skyline Gate', type: 'exit', icon: '🚪', x: 10, y: 55 },
      
      { id: 'a1', name: 'Accessible Entrance North', type: 'accessibility', icon: '♿', x: 30, y: 38 },
      { id: 'a2', name: 'Accessible Entrance South', type: 'accessibility', icon: '♿', x: 70, y: 86 },
    ];
  }

  if (venueId === 'arrowhead') {
    // Arrowhead Stadium: Octagon. Food & Restrooms nestled in the sharp corners.
    return [
      { id: 'f1', name: 'Arrowhead Grill', type: 'food', icon: '🍔', x: 14, y: 14 }, // NW corner
      { id: 'f2', name: 'Chiefs Taqueria', type: 'food', icon: '🌮', x: 86, y: 14 }, // NE corner
      { id: 'f3', name: 'Kingdom Pizza', type: 'food', icon: '🍕', x: 14, y: 86 }, // SW corner
      { id: 'f4', name: 'Midwest BBQ', type: 'food', icon: '🍖', x: 86, y: 86 }, // SE corner
      
      { id: 'r1', name: 'Restroom North Wall', type: 'restroom', icon: '🚻', x: 32, y: 10 },
      { id: 'r2', name: 'Restroom South Wall', type: 'restroom', icon: '🚻', x: 68, y: 90 },
      { id: 'r3', name: 'Restroom East Wall', type: 'restroom', icon: '🚻', x: 90, y: 32 },
      { id: 'r4', name: 'Restroom West Wall', type: 'restroom', icon: '🚻', x: 10, y: 68 },
      
      { id: 'm1', name: 'First Aid North East', type: 'medical', icon: '🏥', x: 75, y: 22 },
      { id: 'm2', name: 'First Aid South West', type: 'medical', icon: '🏥', x: 25, y: 78 },
      
      { id: 'e1', name: 'North Exit Gate', type: 'exit', icon: '🚪', x: 50, y: 7 },
      { id: 'e2', name: 'East Plaza Gate', type: 'exit', icon: '🚪', x: 93, y: 50 },
      { id: 'e3', name: 'South Gate Center', type: 'exit', icon: '🚪', x: 50, y: 93 },
      { id: 'e4', name: 'West Entrance Gate', type: 'exit', icon: '🚪', x: 7, y: 50 },
      
      { id: 'a1', name: 'Accessible Ramp North', type: 'accessibility', icon: '♿', x: 38, y: 12 },
      { id: 'a2', name: 'Accessible Ramp South', type: 'accessibility', icon: '♿', x: 62, y: 88 },
    ];
  }

  // Default: MetLife Stadium (balanced oval concentric positioning)
  return [
    { id: 'f1', name: 'Garden State Concessions', type: 'food', icon: '🍔', x: 25, y: 30 },
    { id: 'f2', name: 'Jersey Shore Grill', type: 'food', icon: '🌭', x: 75, y: 30 },
    { id: 'f3', name: 'Pizza Corner MetLife', type: 'food', icon: '🍕', x: 25, y: 70 },
    { id: 'f4', name: 'Meadowlands Tacos', type: 'food', icon: '🌮', x: 75, y: 70 },
    
    { id: 'r1', name: 'Restroom North', type: 'restroom', icon: '🚻', x: 50, y: 18 },
    { id: 'r2', name: 'Restroom South', type: 'restroom', icon: '🚻', x: 50, y: 82 },
    { id: 'r3', name: 'Restroom East', type: 'restroom', icon: '🚻', x: 88, y: 50 },
    { id: 'r4', name: 'Restroom West', type: 'restroom', icon: '🚻', x: 12, y: 50 },
    
    { id: 'm1', name: 'First Aid Station A', type: 'medical', icon: '🏥', x: 35, y: 20 },
    { id: 'm2', name: 'First Aid Station B', type: 'medical', icon: '🏥', x: 65, y: 80 },
    
    { id: 'e1', name: 'Exit Gate 1 (North)', type: 'exit', icon: '🚪', x: 50, y: 8 },
    { id: 'e2', name: 'Exit Gate 2 (East)', type: 'exit', icon: '🚪', x: 92, y: 50 },
    { id: 'e3', name: 'Exit Gate 3 (South)', type: 'exit', icon: '🚪', x: 50, y: 92 },
    { id: 'e4', name: 'Exit Gate 4 (West)', type: 'exit', icon: '🚪', x: 8, y: 50 },
    
    { id: 'a1', name: 'Accessible Entrance A', type: 'accessibility', icon: '♿', x: 40, y: 12 },
    { id: 'a2', name: 'Accessible Entrance B', type: 'accessibility', icon: '♿', x: 60, y: 88 },
  ];
};

const getDynamicEvacuations = () => {
  const venueId = getCurrentVenueId();
  
  if (venueId === 'sofi') {
    return [
      { id: 'r1', name: 'Route Alpha — Oculus North Exit', description: 'Via North Oculus Concourse → Gate A. Covers North Upper/Lower and VIP North.', zones: ['nu', 'nl', 'vn'], estimatedTime: '7 min' },
      { id: 'r2', name: 'Route Bravo — East Canyon Exit', description: 'Via East Canyon Passages → Gate B. Covers East Upper/Lower and Field Level East.', zones: ['eu', 'el', 'fe'], estimatedTime: '9 min' },
      { id: 'r3', name: 'Route Charlie — Oculus South Exit', description: 'Via South Oculus Concourse → Gate C. Covers South Upper/Lower and VIP South.', zones: ['su', 'sl', 'vs'], estimatedTime: '8 min' },
      { id: 'r4', name: 'Route Delta — West Canyon Exit', description: 'Via West Canyon Passages → Gate D. Covers West Upper/Lower and Field Level West.', zones: ['wu', 'wl', 'fw'], estimatedTime: '9 min' },
    ];
  }
  
  if (venueId === 'azteca') {
    return [
      { id: 'r1', name: 'Ruta Alfa — Salida Norte Tifón', description: 'Vía túnel Norte → Puerta de Acceso 1. Cubre las secciones norteñas.', zones: ['nu', 'nl', 'vn'], estimatedTime: '10 min' },
      { id: 'r2', name: 'Ruta Bravo — Salida Este Calzada', description: 'Vía explanada Este → Puerta de Acceso 2. Cubre las secciones orientales.', zones: ['eu', 'el', 'fe'], estimatedTime: '12 min' },
      { id: 'r3', name: 'Ruta Charlie — Salida Sur Coloso', description: 'Vía túnel Sur → Puerta de Acceso 3. Cubre las secciones sureñas.', zones: ['su', 'sl', 'vs'], estimatedTime: '11 min' },
      { id: 'r4', name: 'Ruta Delta — Salida Oeste Insurgentes', description: 'Vía explanada Oeste → Puerta de Acceso 4. Cubre las secciones occidentales.', zones: ['wu', 'wl', 'fw'], estimatedTime: '12 min' },
    ];
  }

  if (venueId === 'lumen') {
    return [
      { id: 'r1', name: 'Route Alpha — North Arch Exit', description: 'Via North Arch Concourse → North Gate. Covers North bowl.', zones: ['nu', 'nl', 'vn'], estimatedTime: '8 min' },
      { id: 'r2', name: 'Route Bravo — East Plaza Exit', description: 'Via East Plaza → East Gate. Covers East bowl.', zones: ['eu', 'el', 'fe'], estimatedTime: '10 min' },
      { id: 'r3', name: 'Route Charlie — South Rail Exit', description: 'Via South concourse → South Rail Gate. Covers South bowl.', zones: ['su', 'sl', 'vs'], estimatedTime: '9 min' },
      { id: 'r4', name: 'Route Delta — West Skyline Exit', description: 'Via West concourse → West Skyline Gate. Covers West bowl.', zones: ['wu', 'wl', 'fw'], estimatedTime: '10 min' },
    ];
  }

  // Default: MetLife Stadium
  return [
    { id: 'r1', name: 'Route Alpha — North Exit', description: 'Via North Upper concourse → Gate 1. Covers North Upper, North Lower, VIP North.', zones: ['nu', 'nl', 'vn'], estimatedTime: '8 min' },
    { id: 'r2', name: 'Route Bravo — East Exit', description: 'Via East concourse → Gate 2. Covers East Upper, East Lower, Field Level East.', zones: ['eu', 'el', 'fe'], estimatedTime: '10 min' },
    { id: 'r3', name: 'Route Charlie — South Exit', description: 'Via South Lower concourse → Gate 3. Covers South Upper, South Lower, VIP South.', zones: ['su', 'sl', 'vs'], estimatedTime: '9 min' },
    { id: 'r4', name: 'Route Delta — West Exit', description: 'Via West concourse → Gate 4. Covers West Upper, West Lower, Field Level West.', zones: ['wu', 'wl', 'fw'], estimatedTime: '10 min' },
  ];
};

export const POINTS_OF_INTEREST = getDynamicPOIs();
export const EVACUATION_ROUTES = getDynamicEvacuations();
