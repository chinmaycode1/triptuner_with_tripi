import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { getFeaturedDestinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import './Home.css';

export default function Home({ onAuthOpen }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ destination: '', members: 'Solo', duration: '5' });
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = form.destination
      ? `Plan a ${form.duration}-day ${form.members.toLowerCase()} trip to ${form.destination}`
      : `Best ${form.duration}-day India trip for ${form.members.toLowerCase()}`;
    navigate(`/tripi?q=${encodeURIComponent(q)}`);
  };

  const featured = getFeaturedDestinations().slice(0, 6);

  const handleItineraryGenerate = (itineraryData) => {
    setGeneratedItinerary(itineraryData);
    setTimeout(() => {
      document.getElementById('generated-itinerary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main className="home-page">
      <section className="hero" aria-label="Hero section">
        <div className="hero-content container">
          <h1 className="hero-title">Plan Your India Trip with AI</h1>
          <p className="hero-subtitle">
            Generate custom itineraries with real budgets in Indian rupees, destination guides for 30+ locations, and AI chat support in 8 Indian languages.
          </p>

          <form className="hero-search" onSubmit={handleSearch} role="search" aria-label="Trip search">
            <div className="search-input-wrapper">
              <MapPin size={20} className="search-icon" />
              <input
                type="text"
                className="hero-search-input"
                placeholder="Destination (e.g., Goa, Ladakh, Kerala)"
                value={form.destination}
                onChange={e => setForm({...form, destination: e.target.value})}
                aria-label="Destination"
              />
            </div>
            <select
              className="hero-search-select"
              value={form.members}
              onChange={e => setForm({...form, members: e.target.value})}
              aria-label="Group type"
            >
              <option>Solo</option>
              <option>Couple</option>
              <option>Family</option>
              <option>Friends Group</option>
              <option>Corporate</option>
            </select>
            <select
              className="hero-search-select"
              value={form.duration}
              onChange={e => setForm({...form, duration: e.target.value})}
              aria-label="Duration"
            >
              {[3,4,5,6,7,8,9,10,12,14].map(d => (
                <option key={d} value={d}>{d} Days</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary hero-search-btn">
              <Search size={18} />
              Plan Trip
            </button>
          </form>
        </div>
      </section>

      <section className="section featured-section" aria-label="Featured destinations">
        <div className="container">
          <h2 className="section-title">Featured Destinations</h2>
          <p className="section-subtitle">Explore popular destinations across India with AI-generated itineraries</p>
          <div className="grid-3">
            {featured.map(dest => (
              <DestinationCard key={dest.id} destination={dest} onItineraryGenerate={handleItineraryGenerate} />
            ))}
          </div>
          <div className="view-all-row">
            <button className="btn btn-secondary" onClick={() => navigate('/destinations')}>
              View All Destinations
            </button>
          </div>
        </div>
      </section>

      {generatedItinerary && (
        <section id="generated-itinerary" className="section itinerary-result-section" aria-label="Generated itinerary">
          <div className="container">
            <div className="itinerary-result-card">
              <div className="itinerary-header">
                <div>
                  <h2 className="section-title">{generatedItinerary.destination} Itinerary</h2>
                  <p className="section-subtitle">{generatedItinerary.duration} days • {generatedItinerary.category} • ₹{generatedItinerary.budget.toLocaleString('en-IN')} total</p>
                </div>
                <button 
                  className="btn-close" 
                  onClick={() => setGeneratedItinerary(null)}
                  aria-label="Close itinerary"
                >
                  &times;
                </button>
              </div>
              
              {generatedItinerary.image && (
                <div className="itinerary-image" style={{ backgroundImage: `url(${generatedItinerary.image})` }} />
              )}
              
              <div className="itinerary-content">
                <p className="ai-disclaimer">
                  <strong>AI-generated content:</strong> This itinerary was created by AI. Verify all prices, schedules, and details before booking.
                </p>
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
                  onClick={async () => {
                    const { saveItineraryAsPDF, extractTripData } = await import('../lib/saveTripPDF');
                    try {
                      const tripData = extractTripData(generatedItinerary, 'generated');
                      await saveItineraryAsPDF(tripData);
                    } catch (err) {
                      console.error('Save error:', err);
                    }
                  }}
                >
                  Save Trip
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
                      description: `A ${generatedItinerary.duration}-day trip to ${generatedItinerary.destination}`,
                      budgetTotal: { mid: generatedItinerary.budget },
                      budgetPerPerson: { mid: Math.round(generatedItinerary.budget / 2) },
                      plan: generatedItinerary.itinerary,
                    });
                  }}
                >
                  Download PDF
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/tripi?q=Tell me more about ${generatedItinerary.destination}`)}
                >
                  Chat with Tripi
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/plan?destination=${generatedItinerary.destination}`)}
                >
                  Customize Trip
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="tripi-cta-section section" aria-label="Tripi AI call to action">
        <div className="container">
          <div className="tripi-cta-card">
            <div className="tripi-cta-content">
              <div>
                <h2>Chat with Tripi for Custom Plans</h2>
                <p>Ask Tripi to generate personalized itineraries, estimate budgets in Indian rupees, suggest train routes, recommend hotels, and answer questions about any destination in India. Available in 8 Indian languages.</p>
                <div className="tripi-cta-features">
                  <span>Real rupee pricing</span>
                  <span>Day-by-day plans</span>
                  <span>Transport routes</span>
                  <span>8 languages</span>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/tripi')}>
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
