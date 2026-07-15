import { useState, useCallback } from 'react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import Icon from '../components/common/Icon';

export default function Transport() {
  const data = useRealTimeData();
  const t = data?.transport;

  // State for parking booking
  const [selectedLot, setSelectedLot] = useState('Lot B');
  const [licensePlate, setLicensePlate] = useState('');
  const [parkingPass, setParkingPass] = useState(null);

  // State for ride assistance booking
  const [pickupGate, setPickupGate] = useState('Gate 1');
  const [destPoint, setDestPoint] = useState('Meadowlands Rail Station');
  const [rideStatus, setRideStatus] = useState(null);
  const [isBookingRide, setIsBookingRide] = useState(false);

  const handleBookParking = useCallback((e) => {
    e.preventDefault();
    if (!licensePlate.trim()) return;
    const spot = Math.floor(Math.random() * 450 + 50);
    setParkingPass({
      lot: selectedLot,
      plate: licensePlate.toUpperCase(),
      spot: `Row G, Spot ${spot}`,
      code: `SAI-${selectedLot[4] || 'X'}-${spot}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }, [selectedLot, licensePlate]);

  const handleRequestRide = useCallback(() => {
    setIsBookingRide(true);
    setRideStatus(null);
    setTimeout(() => {
      setRideStatus({
        status: 'Assigned',
        shuttleId: `Shuttle #${Math.floor(Math.random() * 12 + 1)}`,
        eta: `${Math.floor(Math.random() * 4 + 2)} min`,
        pickup: pickupGate,
        destination: destPoint
      });
      setIsBookingRide(false);
    }, 1200);
  }, [pickupGate, destPoint]);

  if (!t) return <div className="page"><div className="skeleton" style={{ height: 400 }} /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Transportation Hub</h2>
          <p className="page-subtitle">Real-time parking, transit & ride-share coordination</p>
        </div>
      </div>

      <div className="transport-grid">
        {/* Parking Lot Status */}
        <div className="transport-card">
          <div className="transport-card-header">
            <span className="transport-card-icon" style={{ color: 'var(--accent-success)' }}>
              <Icon name="transport" />
            </span>
            <span className="transport-card-title">Parking Lot Capacity</span>
          </div>
          {t.parking.map(l => (
            <div key={l.name} style={{ marginBottom: '12px' }}>
              <div className="transport-stat" style={{ marginBottom: '4px' }}>
                <span className="transport-stat-label" style={{ fontWeight: 600 }}>{l.name}</span>
                <span className="transport-stat-value" style={{ color: l.available < 200 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                  {l.available} / {l.total} Left
                </span>
              </div>
              <div className="progress-bar">
                <div 
                  className={`progress-bar-fill ${l.available < 200 ? 'red' : l.available < 500 ? 'yellow' : 'green'}`} 
                  style={{ width: `${((l.total - l.available) / l.total) * 100}%` }} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Public Transit */}
        <div className="transport-card">
          <div className="transport-card-header">
            <span className="transport-card-icon" style={{ color: 'var(--accent-primary-light)' }}>
              <Icon name="bus" />
            </span>
            <span className="transport-card-title">Transit Status</span>
          </div>
          {t.transit.map(r => (
            <div key={r.name} className="transport-stat" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
              <div>
                <span className="transport-stat-label" style={{ fontWeight: 600 }}>{r.name}</span>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>To: {r.destination}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="transport-stat-value" style={{ fontWeight: 'bold' }}>{r.nextArrival}</span>
                <div style={{ fontSize: 'var(--text-xs)', color: r.status === 'On Time' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                  {r.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ride Share */}
        <div className="transport-card">
          <div className="transport-card-header">
            <span className="transport-card-icon" style={{ color: 'var(--accent-info)' }}>
              <Icon name="car" />
            </span>
            <span className="transport-card-title">Ride Share Telemetry</span>
          </div>
          <div className="transport-stat"><span className="transport-stat-label">Avg Pickup Wait</span><span className="transport-stat-value">{t.rideshare.avgWait}</span></div>
          <div className="transport-stat"><span className="transport-stat-label">Surge Multiplier</span><span className="transport-stat-value" style={{ color: t.rideshare.surgeMultiplier > 1.5 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>{t.rideshare.surgeMultiplier}x</span></div>
          <div className="transport-stat"><span className="transport-stat-label">Active Drivers Nearby</span><span className="transport-stat-value">{t.rideshare.activeDrivers}</span></div>
          <div className="transport-stat"><span className="transport-stat-label">Designated Area</span><span className="transport-stat-value">{t.rideshare.pickupZone}</span></div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: 'var(--space-4)' }}>
        {/* Interactive Parking Reservation */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="transport" style={{ color: 'var(--accent-success)' }} /> Pre-Book Stadium Parking
            </span>
          </div>
          <div className="card-body">
            {!parkingPass ? (
              <form onSubmit={handleBookParking} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Select Lot</label>
                    <select 
                      className="settings-select" 
                      value={selectedLot} 
                      onChange={e => setSelectedLot(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}
                    >
                      <option value="Lot A">Lot A (Nearest to Gate 1)</option>
                      <option value="Lot B">Lot B (Nearest to Gate 2)</option>
                      <option value="Lot C">Lot C (Nearest to Gate 3)</option>
                      <option value="Lot D">Lot D (Nearest to Gate 4)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>License Plate</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ABC-123" 
                      value={licensePlate} 
                      onChange={e => setLicensePlate(e.target.value)} 
                      style={{ width: '100%', padding: '8px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                  Confirm Reservation & Generate Pass
                </button>
              </form>
            ) : (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(34, 197, 94, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-success)', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Mock QR Code representation */}
                  <div style={{ width: '80px', height: '80px', background: '#000', color: '#fff', fontSize: '8px', display: 'flex', flexWrap: 'wrap', wordBreak: 'break-all', fontFamily: 'monospace', padding: '4px' }}>
                    {parkingPass.code}{parkingPass.code}
                  </div>
                </div>
                <div style={{ flex: 1, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    ✅ PARKING RESERVATION CONFIRMED
                  </div>
                  <div>Lot: <strong>{parkingPass.lot}</strong></div>
                  <div>Spot Assignment: <strong>{parkingPass.spot}</strong></div>
                  <div>Vehicle Plate: <strong>{parkingPass.plate}</strong></div>
                  <div>Pass Reference: <code>{parkingPass.code}</code></div>
                  <button 
                    className="btn" 
                    onClick={() => { setParkingPass(null); setLicensePlate(''); }} 
                    style={{ marginTop: '8px', padding: '2px 8px', fontSize: '10px' }}
                  >
                    Cancel / Book Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Ride Assistance */}
        <div className="card">
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon name="accessibility" style={{ color: 'var(--accent-primary-light)' }} /> Request Shuttle / Accessibility Ride
            </span>
          </div>
          <div className="card-body">
            {!rideStatus ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Pickup Location</label>
                    <select className="settings-select" value={pickupGate} onChange={e => setPickupGate(e.target.value)}>
                      <option value="Gate 1">Gate 1 Concourse</option>
                      <option value="Gate 2">Gate 2 Concourse</option>
                      <option value="Gate 3">Gate 3 Concourse</option>
                      <option value="Gate 4">Gate 4 Concourse</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Destination</label>
                    <select className="settings-select" value={destPoint} onChange={e => setDestPoint(e.target.value)}>
                      <option value="Meadowlands Rail Station">Meadowlands Rail</option>
                      <option value="Lot G Rideshare Zone">Lot G Rideshare</option>
                      <option value="Lot B Parking">Lot B Parking</option>
                    </select>
                  </div>
                </div>
                <button 
                  className="btn btn-primary" 
                  onClick={handleRequestRide} 
                  disabled={isBookingRide}
                  style={{ width: '100%', padding: '10px' }}
                >
                  {isBookingRide ? 'Dispatching Shuttle Assist...' : 'Request Shuttle Assistance'}
                </button>
              </div>
            ) : (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--accent-primary)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  🚖 ACCESSIBILITY RIDE EN ROUTE
                </div>
                <div>Assigned Vehicle: <strong>{rideStatus.shuttleId}</strong> (Electric Golf Cart)</div>
                <div>Estimated Arrival: <strong>{rideStatus.eta}</strong></div>
                <div>Pickup: <strong>{rideStatus.pickup}</strong></div>
                <div>Destination: <strong>{rideStatus.destination}</strong></div>
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                  <span className="status-badge live" style={{ padding: '2px 8px', fontSize: '10px' }}>DISPATCHED</span>
                  <button 
                    className="btn" 
                    onClick={() => setRideStatus(null)} 
                    style={{ padding: '2px 8px', fontSize: '10px' }}
                  >
                    Cancel Ride
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Highway Conditions */}
      <div className="card" style={{ marginTop: 'var(--space-4)' }}>
        <div className="card-header">
          <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Icon name="road" style={{ color: 'var(--accent-info)' }} /> Traffic Conditions
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {[
              { route: 'Route 3 North', status: 'Heavy', color: 'var(--accent-danger)', time: '25 min' }, 
              { route: 'I-95 South', status: 'Moderate', color: 'var(--accent-warning)', time: '15 min' }, 
              { route: 'NJ Turnpike', status: 'Light', color: 'var(--accent-success)', time: '8 min' }, 
              { route: 'Route 120', status: 'Normal', color: 'var(--accent-success)', time: '10 min' }
            ].map(r => (
              <div key={r.route} style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '4px' }}>{r.route}</div>
                <div style={{ color: r.color, fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>{r.status}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>{r.time} transit delay</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
