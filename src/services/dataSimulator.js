/**
 * StadiumAI — Real-Time Data Simulation Engine
 * Generates realistic, fluctuating stadium operation data for demonstration.
 */
import { STADIUM_ZONES } from '../data/stadiumLayout.js';
import { INITIAL_ALERTS, LIVE_MATCH } from '../data/mockData.js';

const FEED_MESSAGES = [
  { type: 'info', message: 'Gate 2 ticket scan rate: 42 per minute' },
  { type: 'success', message: 'VIP lounge A capacity balanced — 68% occupancy' },
  { type: 'info', message: 'Concession stand #7 restocked — burgers available' },
  { type: 'warning', message: 'Slow line detected at Food Court B — avg wait 8 min' },
  { type: 'success', message: 'Wheelchair assistance completed at Gate 1' },
  { type: 'info', message: 'PA system check completed — all sectors nominal' },
  { type: 'info', message: 'Volunteer shift change completed — Zone East' },
  { type: 'warning', message: 'Parking Lot A approaching capacity — 89% full' },
  { type: 'success', message: 'Medical team responded to Section 215 — all clear' },
  { type: 'info', message: 'NJ Transit reporting on-time arrivals for Line 160' },
  { type: 'warning', message: 'Elevated noise levels detected in South Lower' },
  { type: 'info', message: 'Recycling station 3 at 75% — collection scheduled' },
  { type: 'success', message: 'Fire safety check completed — all exits clear' },
  { type: 'info', message: 'Broadcast: Match minute 67 — Brazil leads 2-1' },
  { type: 'warning', message: 'Route 3 traffic congestion increasing' },
  { type: 'success', message: 'Solar panel output: 120kW — above daily target' },
];

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }

export function createDataSimulator() {
  let tickCount = 0;

  // Initialize zone crowd data
  let zones = STADIUM_ZONES.map(z => ({
    name: z.name,
    capacity: z.capacity,
    current: Math.floor(z.capacity * (0.6 + Math.random() * 0.25)),
    trend: 'stable',
  }));

  let alerts = [...INITIAL_ALERTS];
  let liveFeed = [
    { id: 1, type: 'info', message: '🏟️ Stadium gates opened — fans entering', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, type: 'success', message: '✅ Pre-match security sweep completed', timestamp: new Date(Date.now() - 2400000) },
    { id: 3, type: 'info', message: '⚽ Teams arrived — warmup in progress', timestamp: new Date(Date.now() - 1200000) },
  ];

  let matchMinute = LIVE_MATCH.minute;
  let feedIdCounter = 10;
  let alertIdCounter = 10;

  const weather = { temp: 72, condition: 'Partly Cloudy', humidity: 45, wind: '8 mph', icon: '⛅' };

  const incidents = [
    { title: 'Minor medical — Section 215', location: 'East Upper', severity: 'medium', status: 'resolved' },
    { title: 'Suspicious package — Gate 4', location: 'West Exit', severity: 'high', status: 'resolved' },
    { title: 'Intoxicated fan — Section 108', location: 'East Lower', severity: 'low', status: 'progress' },
  ];

  let parking = [
    { name: 'Lot A', total: 2000, available: 234 },
    { name: 'Lot B', total: 2000, available: 567 },
    { name: 'Lot C', total: 1500, available: 890 },
    { name: 'Lot D', total: 1500, available: 123 },
  ];

  const transit = [
    { name: 'NJ Transit 160', destination: 'Port Authority', nextArrival: '4 min', status: 'On Time' },
    { name: 'NJ Transit 165', destination: 'GW Bridge', nextArrival: '7 min', status: 'On Time' },
    { name: 'Meadowlands Rail', destination: 'Secaucus Junction', nextArrival: '12 min', status: 'Delayed' },
  ];

  const rideshare = { avgWait: '6 min', surgeMultiplier: 1.8, activeDrivers: 342, pickupZone: 'Lot G' };

  let sustainability = {
    overallScore: 87, carbonReduction: 73, carbonTons: 12.4,
    recyclingRate: 68, waterEfficiency: 82, waterSaved: 15200,
    wasteRecycled: 45, wasteComposted: 23, wasteLandfill: 32,
    energyUsage: 4850,
  };

  return {
    tick() {
      tickCount++;
      matchMinute = clamp(matchMinute + (Math.random() > 0.3 ? 1 : 0), 0, 90);

      // Fluctuate zone crowds
      zones = zones.map(z => {
        const delta = rand(-150, 200);
        const newCurrent = clamp(z.current + delta, Math.floor(z.capacity * 0.3), z.capacity);
        return {
          ...z,
          current: newCurrent,
          trend: delta > 50 ? 'up' : delta < -50 ? 'down' : 'stable',
        };
      });

      // Fluctuate parking
      parking = parking.map(p => ({
        ...p,
        available: clamp(p.available + rand(-15, 5), 10, p.total),
      }));

      // Fluctuate sustainability
      sustainability = {
        ...sustainability,
        carbonTons: +(sustainability.carbonTons + (Math.random() - 0.4) * 0.3).toFixed(1),
        waterSaved: sustainability.waterSaved + rand(-50, 100),
        energyUsage: clamp(sustainability.energyUsage + rand(-30, 30), 4000, 6000),
        recyclingRate: clamp(sustainability.recyclingRate + rand(-1, 1), 55, 85),
      };

      // Generate new feed event every ~4 ticks
      if (tickCount % 4 === 0) {
        const msg = FEED_MESSAGES[rand(0, FEED_MESSAGES.length - 1)];
        liveFeed = [...liveFeed, { id: ++feedIdCounter, ...msg, timestamp: new Date() }].slice(-20);
      }

      // Generate/resolve alert every ~15 ticks
      if (tickCount % 15 === 0) {
        const severities = ['warning', 'info', 'critical'];
        const titles = ['Crowd surge detected', 'Queue buildup', 'Temperature alert', 'Noise threshold exceeded'];
        const locations = zones.map(z => z.name);
        alerts = [...alerts, {
          id: ++alertIdCounter,
          severity: severities[rand(0, severities.length - 1)],
          title: titles[rand(0, titles.length - 1)],
          message: `Automated detection in ${locations[rand(0, locations.length - 1)]}`,
          location: locations[rand(0, locations.length - 1)],
          timestamp: new Date(),
        }].slice(-8);
      }
    },

    getStats() {
      const totalCurrent = zones.reduce((s, z) => s + z.current, 0);
      const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);
      return {
        attendance: totalCurrent,
        capacityPercent: Math.round((totalCurrent / totalCapacity) * 100),
        activeAlerts: alerts.filter(a => a.severity === 'critical' || a.severity === 'warning').length,
        avgWaitTime: `${(3 + Math.random() * 4).toFixed(1)} min`,
        sustainabilityScore: sustainability.overallScore,
        transitLoad: clamp(65 + rand(-5, 10), 50, 95),
      };
    },

    getCrowdData() { return zones; },
    getAlerts() { return alerts; },
    getLiveFeed() { return liveFeed; },
    getWeather() { return weather; },
    getTransportData() { return { parking, transit, rideshare }; },
    getSustainabilityMetrics() { return sustainability; },
    getEmergencyStatus() { return { isActive: false, level: 'all-clear', incidents }; },
    getMatchInfo() {
      return { ...LIVE_MATCH, minute: matchMinute };
    },
  };
}
