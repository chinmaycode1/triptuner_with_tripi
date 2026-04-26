import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedTrips, deleteTrip } from '../lib/api';
import { showToast } from '../components/Toast';
import './SavedTrips.css';

export default function SavedTrips() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { navigate('/'); return; }
    if (user) fetchTrips();
  }, [user, authLoading]);

  const fetchTrips = async () => {
    try {
      const data = await getSavedTrips();
      setTrips(data.trips || []);
    } catch (err) {
      showToast('Failed to load trips', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await deleteTrip(id);
      setTrips(prev => prev.filter(t => t.id !== id));
      showToast('Trip deleted', 'info');
    } catch (err) {
      showToast('Failed to delete trip', 'error');
    }
  };

  const handleViewPDF = (pdfUrl) => {
    window.open(pdfUrl, '_blank');
  };

  const handleDownloadPDF = (pdfUrl, destination) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${destination.replace(/[^a-zA-Z0-9]/g, '-')}-itinerary.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || loading) {
    return (
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p>Loading your trips...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="saved-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">💾 Saved Trips</h1>
          <p className="section-subtitle">Your personalized India travel plans stored as PDFs</p>
        </div>

        {trips.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <h3>No saved trips yet</h3>
            <p>Plan a trip with Tripi AI and save it here!</p>
            <button className="btn btn-primary" onClick={() => navigate('/plan')}>Plan a Trip</button>
          </div>
        ) : (
          <div className="grid-3">
            {trips.map(trip => (
              <article key={trip.id} className="saved-trip-card card">
                <div className="saved-trip-header">
                  <h3>{trip.destination}</h3>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(trip.id)}
                    aria-label={`Delete trip to ${trip.destination}`}
                  >
                    🗑️
                  </button>
                </div>
                <div className="saved-trip-meta">
                  <span>📄 PDF Itinerary</span>
                  <span>📅 {new Date(trip.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                </div>
                <p className="saved-trip-date">
                  Saved {new Date(trip.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </p>
                <div className="saved-trip-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleViewPDF(trip.pdf_url)}
                  >
                    👁️ View PDF
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleDownloadPDF(trip.pdf_url, trip.destination)}
                  >
                    📥 Download
                  </button>
                </div>
                <button
                  className="btn btn-secondary saved-trip-chat-btn"
                  onClick={() => navigate(`/tripi?q=Tell me more about my trip to ${trip.destination}`)}
                >
                  💬 Continue with Tripi
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
