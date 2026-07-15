import { useState, useEffect, useRef, useCallback } from 'react';
import { createDataSimulator } from '../services/dataSimulator';
import { REFRESH_INTERVAL } from '../utils/constants';

export function useRealTimeData() {
  const simulatorRef = useRef(null);
  const [data, setData] = useState(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    simulatorRef.current = createDataSimulator();
    const updateData = () => {
      const sim = simulatorRef.current;
      sim.tick();
      setData({
        stats: sim.getStats(),
        crowdData: sim.getCrowdData(),
        alerts: sim.getAlerts(),
        liveFeed: sim.getLiveFeed(),
        weather: sim.getWeather(),
        transport: sim.getTransportData(),
        sustainability: sim.getSustainabilityMetrics(),
        emergency: sim.getEmergencyStatus(),
        matchInfo: sim.getMatchInfo(),
      });
    };
    updateData();
    const interval = setInterval(updateData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const toggleLive = useCallback(() => setIsLive(prev => !prev), []);
  return { ...(data || {}), isLive, toggleLive };
}
