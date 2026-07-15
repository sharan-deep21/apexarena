import { useMemo } from 'react';
export function useCrowdData(crowdData) {
  return useMemo(() => {
    if (!crowdData) return { totalCurrent: 0, totalCapacity: 0, avgDensity: 0, criticalZones: [], highZones: [] };
    const totalCurrent = crowdData.reduce((s, z) => s + z.current, 0);
    const totalCapacity = crowdData.reduce((s, z) => s + z.capacity, 0);
    const avgDensity = totalCapacity > 0 ? (totalCurrent / totalCapacity) * 100 : 0;
    const criticalZones = crowdData.filter(z => (z.current / z.capacity) * 100 >= 90);
    const highZones = crowdData.filter(z => { const p = (z.current / z.capacity) * 100; return p >= 75 && p < 90; });
    return { totalCurrent, totalCapacity, avgDensity, criticalZones, highZones };
  }, [crowdData]);
}
