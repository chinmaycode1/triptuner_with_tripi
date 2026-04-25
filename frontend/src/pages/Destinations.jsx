import { useState, useMemo } from 'react';
import { destinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import './Destinations.css';

const FILTERS = ['All India','Mountains','Beaches','Heritage','Wildlife','Spiritual','Adventure','Budget'];

export default function Destinations() {
  const [activeFilter, setActiveFilter] = useState('All India');
  const [search, setSearch] = useState('');

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
              <DestinationCard key={dest.id} destination={dest} />
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
      </div>
    </main>
  );
}
