import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { destinations } from '../data/destinations';
import { weekendGetaways } from '../data/weekendGetaways';
import { saveTrip } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import DestinationCard from '../components/DestinationCard';
import './NearMePage.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons
const userIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-marker-pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const destinationIcon = L.divIcon({
  className: 'destination-marker',
  html: '<div class="destination-pin">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate drive time estimate (distance / 50 kmph, rounded to nearest 0.5 hour)
function calculateDriveTime(distanceKm) {
  const hours = distanceKm / 50;
  return Math.round(hours * 2) / 2; // Round to nearest 0.5
}

// Format drive time for display
function formatDriveTime(hours) {
  if (hours < 1) return `${Math.round(hours * 60)} mins`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// Component to fly map to location
function FlyToLocation({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function NearMePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [locationStatus, setLocationStatus] = useState('idle');
  const [userLocation, setUserLocation] = useState(null);
  const [cityName, setCityName] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('both'); // 'both', 'map', 'list'
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [savingTrip, setSavingTrip] = useState(false);

  // Get user's location using browser geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }
    setLocationStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(location);
        setLocationStatus('granted');
        
        // Reverse geocode to get city name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`
          );
          const data = await response.json();
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || 'your location';
          setCityName(city);
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setCityName('your location');
        }
      },
      async (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
        
        // Fallback to IP-based location
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          if (data.latitude && data.longitude) {
            const location = { lat: data.latitude, lng: data.longitude };
            setUserLocation(location);
            setCityName(data.city || 'your location');
            setLocationStatus('granted');
          }
        } catch (error) {
          console.error('IP location fallback failed:', error);
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Search for a city using Nominatim
  const handleCitySearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    
    setIsLoadingCity(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchCity)},India&format=json&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        setUserLocation(location);
        setCityName(data[0].display_name.split(',')[0]);
        setLocationStatus('granted');
      } else {
        alert('City not found. Please try another name.');
      }
    } catch (error) {
      console.error('City search failed:', error);
      alert('Failed to search city. Please try again.');
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Calculate distances and sort destinations
  const nearbyDestinations = useMemo(() => {
    if (!userLocation) return [];
    
    const withDistances = destinations.map(dest => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        dest.lat,
        dest.lng
      );
      const driveTime = calculateDriveTime(distance);
      
      return {
        ...dest,
        distance: Math.round(distance),
        driveTime,
        driveTimeFormatted: formatDriveTime(driveTime),
      };
    });
    
    // Sort by distance
    return withDistances.sort((a, b) => a.distance - b.distance).slice(0, 20);
  }, [userLocation]);

  // Apply filters
  const filteredDestinations = useMemo(() => {
    let filtered = nearbyDestinations;
    
    // Distance filter
    if (distanceFilter !== 'all') {
      const [min, max] = distanceFilter.split('-').map(Number);
      filtered = filtered.filter(d => {
        if (max) return d.distance >= min && d.distance <= max;
        return d.distance >= min;
      });
    }
    
    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(d => 
        d.category.some(c => c.toLowerCase() === categoryFilter.toLowerCase())
      );
    }
    
    return filtered;
  }, [nearbyDestinations, distanceFilter, categoryFilter]);

  // Get unique categories from destinations
  const categories = useMemo(() => {
    const cats = new Set();
    destinations.forEach(d => d.category.forEach(c => cats.add(c)));
    return Array.from(cats).sort();
  }, []);

  const handleItineraryGenerate = (itineraryData) => {
    setGeneratedItinerary(itineraryData);
    // Scroll to itinerary section
    setTimeout(() => {
      document.getElementById('generated-itinerary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSaveItinerary = async () => {
    if (!user) {
      showToast('Please log in to save trips', 'warning');
      return;
    }

    if (!generatedItinerary) return;

    setSavingTrip(true);
    try {
      const { saveItineraryAsPDF, extractTripData } = await import('../lib/saveTripPDF');
      
      const tripData = extractTripData(generatedItinerary, 'generated');
      await saveItineraryAsPDF(tripData);
    } catch (err) {
      console.error('Save trip error:', err);
      showToast(`Failed to save trip: ${err.message}`, 'error');
    } finally {
      setSavingTrip(false);
    }
  };

  // Budget color class
  const getBudgetClass = (budget) => {
    if (budget <= 1500) return 'budget-low';
    if (budget <= 4000) return 'budget-mid';
    return 'budget-high';
  };

  return (
    <main className="near-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        {/* Hero Section */}
        {locationStatus === 'idle' && (
          <div className="near-hero">
            <div className="near-hero-icon">📍</div>
            <h1 className="section-title">Discover Places Near You</h1>
            <p className="section-subtitle">Find amazing destinations close to your location</p>
            <button className="btn btn-primary btn-large" onClick={requestLocation}>
              <span className="btn-icon">📍</span>
              Find Places Near Me
            </button>
            <div className="hero-divider">
              <span>or</span>
            </div>
            <form onSubmit={handleCitySearch} className="city-search-form">
              <input
                type="text"
                placeholder="Enter your city name..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="city-search-input"
              />
              <button type="submit" className="btn btn-secondary" disabled={isLoadingCity}>
                {isLoadingCity ? '🔍 Searching...' : '🔍 Search'}
              </button>
            </form>
          </div>
        )}

        {locationStatus === 'loading' && (
          <div className="near-hero">
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <div className="loading-pulse"></div>
            </div>
            <h2 className="section-title">Getting your location...</h2>
            <p className="section-subtitle">Please allow location access in your browser</p>
          </div>
        )}

        {locationStatus === 'denied' && !userLocation && (
          <div className="near-hero">
            <div className="near-hero-icon">🔒</div>
            <h2 className="section-title">Location Access Denied</h2>
            <p className="section-subtitle">No worries! You can still search by city name</p>
            <form onSubmit={handleCitySearch} className="city-search-form">
              <input
                type="text"
                placeholder="Enter your city name (e.g., Mumbai, Delhi)..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="city-search-input"
              />
              <button type="submit" className="btn btn-primary" disabled={isLoadingCity}>
                {isLoadingCity ? '🔍 Searching...' : '🔍 Search'}
              </button>
            </form>
          </div>
        )}

        {locationStatus === 'unsupported' && (
          <div className="near-hero">
            <div className="near-hero-icon">⚠️</div>
            <h2 className="section-title">Geolocation Not Supported</h2>
            <p className="section-subtitle">Your browser doesn't support geolocation. Search by city instead:</p>
            <form onSubmit={handleCitySearch} className="city-search-form">
              <input
                type="text"
                placeholder="Enter your city name..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="city-search-input"
              />
              <button type="submit" className="btn btn-primary" disabled={isLoadingCity}>
                {isLoadingCity ? '🔍 Searching...' : '🔍 Search'}
              </button>
            </form>
          </div>
        )}

        {/* Success State with Map and Results */}
        {locationStatus === 'granted' && userLocation && (
          <>
            <div className="location-success">
              <div className="success-animation">✅</div>
              <h2 className="section-title">Showing places near {cityName}</h2>
              <p className="location-coords">
                📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
              <button className="btn btn-small btn-secondary" onClick={() => {
                setLocationStatus('idle');
                setUserLocation(null);
                setCityName('');
              }}>
                🔄 Change Location
              </button>
            </div>

            {/* View Toggle (Mobile) */}
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'map' ? 'active' : ''}`}
                onClick={() => setViewMode('map')}
              >
                🗺️ Map
              </button>
              <button
                className={`view-btn ${viewMode === 'both' ? 'active' : ''}`}
                onClick={() => setViewMode('both')}
              >
                📊 Both
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                📋 List
              </button>
            </div>

            {/* Map Section */}
            {(viewMode === 'map' || viewMode === 'both') && (
              <div className="map-container">
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={6}
                  style={{ height: '500px', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FlyToLocation center={[userLocation.lat, userLocation.lng]} zoom={6} />
                  
                  {/* User Location Marker */}
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>
                      <div className="map-popup">
                        <strong>📍 You are here</strong>
                        <p>{cityName}</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Destination Markers */}
                  {filteredDestinations.map(dest => (
                    <Marker
                      key={dest.id}
                      position={[dest.lat, dest.lng]}
                      icon={destinationIcon}
                    >
                      <Popup>
                        <div className="map-popup">
                          <div className="popup-header">
                            <span className="popup-emoji">{dest.emoji}</span>
                            <strong>{dest.name}</strong>
                          </div>
                          <p className="popup-distance">📏 {dest.distance} km away</p>
                          <p className="popup-drive">🚗 ~{dest.driveTimeFormatted} drive</p>
                          <p className="popup-budget">💰 ₹{dest.avg_budget_per_day}/day</p>
                          <button
                            className="btn btn-small btn-primary"
                            onClick={() => navigate(`/plan?destination=${dest.name}`)}
                          >
                            Plan Trip
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}

            {/* Filters */}
            {(viewMode === 'list' || viewMode === 'both') && (
              <>
                <div className="filters-section">
                  <div className="filter-group">
                    <label>Distance:</label>
                    <div className="filter-buttons">
                      <button
                        className={`filter-btn ${distanceFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setDistanceFilter('all')}
                      >
                        All
                      </button>
                      <button
                        className={`filter-btn ${distanceFilter === '0-100' ? 'active' : ''}`}
                        onClick={() => setDistanceFilter('0-100')}
                      >
                        Under 100km
                      </button>
                      <button
                        className={`filter-btn ${distanceFilter === '100-300' ? 'active' : ''}`}
                        onClick={() => setDistanceFilter('100-300')}
                      >
                        100-300km
                      </button>
                      <button
                        className={`filter-btn ${distanceFilter === '300-500' ? 'active' : ''}`}
                        onClick={() => setDistanceFilter('300-500')}
                      >
                        300-500km
                      </button>
                      <button
                        className={`filter-btn ${distanceFilter === '500-99999' ? 'active' : ''}`}
                        onClick={() => setDistanceFilter('500-99999')}
                      >
                        500km+
                      </button>
                    </div>
                  </div>
                  
                  <div className="filter-group">
                    <label>Category:</label>
                    <div className="filter-buttons">
                      <button
                        className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setCategoryFilter('all')}
                      >
                        All
                      </button>
                      {categories.slice(0, 6).map(cat => (
                        <button
                          key={cat}
                          className={`filter-btn ${categoryFilter === cat ? 'active' : ''}`}
                          onClick={() => setCategoryFilter(cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Destinations List */}
                <section className="destinations-section">
                  <h2 className="section-title">
                    📍 {filteredDestinations.length} Destinations Near You
                  </h2>
                  <div className="destinations-grid grid-3">
                    {filteredDestinations.map(dest => (
                      <DestinationCard key={dest.id} destination={dest} onItineraryGenerate={handleItineraryGenerate} />
                    ))}
                  </div>
                  
                  {filteredDestinations.length === 0 && (
                    <div className="no-results">
                      <p>😔 No destinations found with the selected filters.</p>
                      <button className="btn btn-secondary" onClick={() => {
                        setDistanceFilter('all');
                        setCategoryFilter('all');
                      }}>
                        Clear Filters
                      </button>
                    </div>
                  )}
                </section>

                {/* Generated Itinerary Section */}
                {generatedItinerary && (
                  <section id="generated-itinerary" className="itinerary-result-section" aria-label="Generated itinerary">
                    <div className="itinerary-result-card">
                      <div className="itinerary-header">
                        <div>
                          <h2 className="section-title">✨ Your {generatedItinerary.destination} Itinerary</h2>
                          <p className="section-subtitle">{generatedItinerary.duration} days • {generatedItinerary.category} • ₹{generatedItinerary.budget.toLocaleString('en-IN')} total</p>
                        </div>
                        <button 
                          className="btn-close" 
                          onClick={() => setGeneratedItinerary(null)}
                          aria-label="Close itinerary"
                        >
                          ✕
                        </button>
                      </div>
                      
                      {generatedItinerary.image && (
                        <div className="itinerary-image" style={{ backgroundImage: `url(${generatedItinerary.image})` }} />
                      )}
                      
                      <div className="itinerary-content">
                        <div 
                          className="itinerary-text"
                          dangerouslySetInnerHTML={{ 
                            __html: generatedItinerary.itinerary
                              .replace(/\n/g, '<br/>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }} 
                        />
                      </div>
                      
                      <div className="itinerary-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={handleSaveItinerary}
                          disabled={savingTrip || !user}
                          title={!user ? 'Please log in to save trips' : 'Save this trip'}
                        >
                          {savingTrip ? '⏳ Saving...' : '💾 Save Trip'}
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={async () => {
                            const { generateEnhancedItineraryPDF } = await import('../lib/enhancedPdf');
                            await generateEnhancedItineraryPDF({
                              title: `${generatedItinerary.destination} Trip`,
                              destination: generatedItinerary.destination,
                              state: generatedItinerary.state,
                              duration: `${generatedItinerary.duration} Days`,
                              groupSize: '2 people',
                              category: generatedItinerary.category,
                              emoji: '✈️',
                              description: `A ${generatedItinerary.duration}-day trip to ${generatedItinerary.destination}`,
                              budgetTotal: { mid: generatedItinerary.budget },
                              budgetPerPerson: { mid: Math.round(generatedItinerary.budget / 2) },
                              plan: generatedItinerary.itinerary,
                            });
                          }}
                        >
                          📄 Download PDF
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => navigate(`/tripi?q=Tell me more about ${generatedItinerary.destination}`)}
                        >
                          💬 Chat with Tripi
                        </button>
                        <button 
                          className="btn btn-secondary"
                          onClick={() => navigate(`/plan?destination=${generatedItinerary.destination}`)}
                        >
                          ✏️ Customize Trip
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </>
        )}

        {/* Weekend Getaways Section - Always Visible */}
        <section className="section weekend-section" aria-label="Weekend getaways">
          <h2 className="section-title">🚗 Popular Weekend Getaways</h2>
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
                  <p className="getaway-drive">🚗 ~{formatDriveTime(calculateDriveTime(g.distance))} drive</p>
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
