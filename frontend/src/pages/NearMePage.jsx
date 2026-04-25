import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { weekendGetaways } from '../data/weekendGetaways';
import './NearMePage.css';

export default function NearMePage() {
  const navigate = useNavigate();
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied')
    );
  };

  return (
    <main className="near-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        {/* Hero */}
        <div className="near-hero">
          <div className="near-hero-icon">📍</div>
          <h1 className="section-title">Explore Near Me</h1>
          <p className="section-subtitle">Discover amazing destinations close to you</p>
          {locationStatus === 'idle' && (
            <button className="btn btn-primary" onClick={requestLocation}>
              📍 Use My Location
            </button>
          )}
          {locationStatus === 'loading' && <p className="location-status">Getting your location...</p>}
          {locationStatus === 'granted' && (
            <div className="location-granted">
              <p>✅ Location found! Showing nearby destinations.</p>
              <p className="location-coords">Lat: {userLocation?.lat?.toFixed(4)}, Lng: {userLocation?.lng?.toFixed(4)}</p>
            </div>
          )}
          {locationStatus === 'denied' && (
            <p className="location-denied">📍 Location access denied. Showing popular weekend getaways instead.</p>
          )}
          {locationStatus === 'unsupported' && (
            <p className="location-denied">Your browser doesn't support geolocation.</p>
          )}
        </div>

        {/* Weekend Getaways */}
        <section className="section" aria-label="Weekend getaways">
          <h2 className="section-title">🚗 Weekend Getaways</h2>
          <p className="section-subtitle">Perfect 2-3 day escapes from major Indian cities</p>
          <div className="getaways-grid">
            {weekendGetaways.map(g => (
              <article
                key={g.id}
                className="getaway-card card"
                onClick={() => navigate(`/tripi?q=Plan a ${g.duration} trip to ${g.name} from ${g.fromCity}`)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/tripi?q=Plan a ${g.duration} trip to ${g.name} from ${g.fromCity}`)}
                aria-label={`Plan trip to ${g.name}`}
              >
                <div className="getaway-emoji">{g.emoji}</div>
                <div className="getaway-body">
                  <div className="getaway-header">
                    <h3>{g.name}</h3>
                    <span className="tag">{g.category}</span>
                  </div>
                  <p className="getaway-from">📍 {g.distance}km from {g.fromCity}</p>
                  <p className="getaway-desc">{g.description}</p>
                  <div className="getaway-footer">
                    <span>⏱️ {g.duration}</span>
                    <span>💰 ₹{g.avg_budget.toLocaleString('en-IN')}/person</span>
                    <span>🗓️ {g.best_time}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
