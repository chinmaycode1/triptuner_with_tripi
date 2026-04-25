import { itineraries } from '../data/itineraries';
import ItineraryCard from '../components/ItineraryCard';
import './Itineraries.css';

export default function Itineraries() {
  return (
    <main className="itineraries-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">📋 Curated Itineraries</h1>
          <p className="section-subtitle">Expert-crafted travel plans with real budgets — download as PDF instantly</p>
        </div>
        <div className="grid-3">
          {itineraries.map(itin => (
            <ItineraryCard key={itin.id} itinerary={itin} />
          ))}
        </div>
      </div>
    </main>
  );
}
