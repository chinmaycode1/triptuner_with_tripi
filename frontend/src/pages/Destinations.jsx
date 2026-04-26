import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import './Destinations.css';

const FILTERS = ['All India','Mountains','Beaches','Heritage','Wildlife','Spiritual','Adventure','Budget'];

export default function Destinations() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All India');
  const [search, setSearch] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const filtered = useMemo(() => {
    let list = destinations;
    if (activeFilter !== 'All India') {
      if (activeFilter === 'Budget') {
        list = list.filter(d => d.avg_budget_per_day <= 1500);
      } else {
        list = list.filter(d => d.category.some(c => c.toLowerCase().includes(activeFilter.toLowerCase())));
      }
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q) ||
        d.tags.some(t => t.includes(q))
      );
    }
    return list;
  }, [activeFilter, search]);

  const handleItineraryGenerate = (itineraryData) => {
    setGeneratedItinerary(itineraryData);
    // Scroll to itinerary section
    setTimeout(() => {
      document.getElementById('generated-itinerary')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <main className="destinations-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">🗺️ Explore India</h1>
          <p className="section-subtitle">Discover {destinations.length}+ incredible destinations across all 28 states</p>
        </div>

        <div className="dest-controls">
          <input
            type="search"
            className="form-input dest-search"
            placeholder="Search destinations, states, tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search destinations"
          />
          <div className="filter-pills" role="group" aria-label="Filter by category">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-pill ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <p className="results-count" aria-live="polite">{filtered.length} destination{filtered.length !== 1 ? 's' : ''} found</p>

        {filtered.length > 0 ? (
          <div className="grid-3">
            {filtered.map(dest => (
              <DestinationCard key={dest.id} destination={dest} onItineraryGenerate={handleItineraryGenerate} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No destinations found</h3>
            <p>Try a different search or filter</p>
            <button className="btn btn-secondary" onClick={() => { setSearch(''); setActiveFilter('All India'); }}>
              Clear Filters
            </button>
          </div>
        )}

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
      </div>
    </main>
  );
}
