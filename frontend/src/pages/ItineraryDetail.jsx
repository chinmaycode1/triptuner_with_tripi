import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { itineraries } from '../data/itineraries';
import { generateEnhancedItineraryPDF } from '../lib/pdf';
import { showToast } from '../components/Toast';
import './ItineraryDetail.css';

export default function ItineraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');

  useEffect(() => {
    const found = itineraries.find(i => i.id === id);
    if (found) {
      setItinerary(found);
    } else {
      showToast('Itinerary not found', 'error');
      navigate('/itineraries');
    }
  }, [id, navigate]);

  const handleDownloadPDF = () => {
    showToast('Generating professional PDF... 📄', 'info');
    try {
      generateEnhancedItineraryPDF(itinerary);
      showToast('PDF downloaded successfully! ✅', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF', 'error');
    }
  };

  if (!itinerary) {
    return (
      <div className="loading-container" style={{ paddingTop: 'var(--nav-height)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const { title, route, duration, groupSize, category, emoji, highlights, budgetTotal, budgetPerPerson, description, days, image } = itinerary;

  return (
    <main className="itinerary-detail-page" style={{ paddingTop: 'var(--nav-height)' }}>
      {/* Hero Section */}
      <div className="itinerary-hero" style={{ backgroundImage: `url(${image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200'})` }}>
        <div className="itinerary-hero-overlay">
          <div className="container">
            <button className="back-btn" onClick={() => navigate('/itineraries')} aria-label="Go back">
              ← Back to Itineraries
            </button>
            <div className="itinerary-hero-content">
              <span className="itinerary-emoji-large">{emoji}</span>
              <h1 className="itinerary-hero-title">{title}</h1>
              <p className="itinerary-hero-route">{route}</p>
              <div className="itinerary-hero-meta">
                <span className="tag">{category}</span>
                <span>⏱️ {duration}</span>
                <span>👥 {groupSize} people</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Quick Stats */}
        <div className="itinerary-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-label">Duration</div>
              <div className="stat-value">{duration}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-label">Group Size</div>
              <div className="stat-value">{groupSize} people</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-label">Total Budget</div>
              <div className="stat-value">₹{budgetTotal?.mid?.toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💵</div>
            <div className="stat-content">
              <div className="stat-label">Per Person</div>
              <div className="stat-value">₹{budgetPerPerson?.mid?.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="itinerary-tabs">
          <button
            className={`tab-btn ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => setActiveTab('itinerary')}
          >
            📋 Itinerary
          </button>
          <button
            className={`tab-btn ${activeTab === 'highlights' ? 'active' : ''}`}
            onClick={() => setActiveTab('highlights')}
          >
            ✨ Highlights
          </button>
          <button
            className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            💰 Budget
          </button>
        </div>

        {/* Tab Content */}
        <div className="itinerary-content">
          {activeTab === 'itinerary' && (
            <div className="tab-content">
              <div className="itinerary-description">
                <h2>About This Trip</h2>
                <p>{description}</p>
              </div>

              {days && days.length > 0 ? (
                <div className="days-timeline">
                  {days.map((day, index) => (
                    <div key={index} className="day-card">
                      <div className="day-number">{day.day}</div>
                      <div className="day-content">
                        <h3 className="day-title">Day {day.day}: {day.title}</h3>
                        <div className="day-activities">
                          <div className="activity">
                            <span className="activity-time">🌅 Morning</span>
                            <p>{day.morning}</p>
                          </div>
                          <div className="activity">
                            <span className="activity-time">☀️ Afternoon</span>
                            <p>{day.afternoon}</p>
                          </div>
                          <div className="activity">
                            <span className="activity-time">🌆 Evening</span>
                            <p>{day.evening}</p>
                          </div>
                          <div className="activity stay">
                            <span className="activity-time">🏨 Stay</span>
                            <p>{day.stay}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-days-message">
                  <p>📝 Detailed day-by-day itinerary coming soon!</p>
                  <p>Use our AI agent to generate a custom itinerary for this destination.</p>
                  <button className="btn btn-primary" onClick={() => navigate(`/tripi?q=Plan a ${duration} trip for ${title}`)}>
                    🤖 Generate with Tripi AI
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'highlights' && (
            <div className="tab-content">
              <h2>Trip Highlights</h2>
              <div className="highlights-grid">
                {highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <span className="highlight-icon">✨</span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="tab-content">
              <h2>Budget Breakdown</h2>
              <div className="budget-table">
                <div className="budget-row budget-header">
                  <div className="budget-cell">Category</div>
                  <div className="budget-cell">Budget</div>
                  <div className="budget-cell">Mid-Range</div>
                  <div className="budget-cell">Premium</div>
                </div>
                <div className="budget-row">
                  <div className="budget-cell"><strong>Total Trip Cost</strong></div>
                  <div className="budget-cell">₹{budgetTotal?.budget?.toLocaleString('en-IN')}</div>
                  <div className="budget-cell budget-highlight">₹{budgetTotal?.mid?.toLocaleString('en-IN')}</div>
                  <div className="budget-cell">₹{budgetTotal?.premium?.toLocaleString('en-IN')}</div>
                </div>
                <div className="budget-row">
                  <div className="budget-cell"><strong>Per Person</strong></div>
                  <div className="budget-cell">₹{budgetPerPerson?.budget?.toLocaleString('en-IN')}</div>
                  <div className="budget-cell budget-highlight">₹{budgetPerPerson?.mid?.toLocaleString('en-IN')}</div>
                  <div className="budget-cell">₹{budgetPerPerson?.premium?.toLocaleString('en-IN')}</div>
                </div>
              </div>
              <div className="budget-note">
                <p>💡 <strong>Note:</strong> Budget includes accommodation, food, local transport, entry fees, and activities. Flight/train tickets to the starting point are not included.</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="itinerary-actions">
          <button className="btn btn-primary btn-large" onClick={handleDownloadPDF}>
            📥 Download Professional PDF
          </button>
          <button className="btn btn-secondary btn-large" onClick={() => navigate(`/tripi?q=Tell me more about ${title}`)}>
            💬 Chat with Tripi AI
          </button>
          <button className="btn btn-secondary btn-large" onClick={() => navigate('/plan')}>
            ✏️ Customize This Trip
          </button>
        </div>
      </div>
    </main>
  );
}
