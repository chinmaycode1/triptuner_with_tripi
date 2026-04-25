import { useNavigate } from 'react-router-dom';
import './ItineraryCard.css';

export default function ItineraryCard({ itinerary }) {
  const navigate = useNavigate();
  const { id, title, route, duration, groupSize, category, emoji, highlights, budgetTotal, budgetPerPerson, description, image } = itinerary;

  const handleCardClick = () => {
    navigate(`/itinerary/${id}`);
  };

  return (
    <article className="itin-card card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Image */}
      {image && (
        <div className="itin-card-image" style={{ backgroundImage: `url(${image})` }}>
          <span className="itin-category-badge">{category}</span>
        </div>
      )}

      <div className="itin-card-content">
        <div className="itin-card-header">
          <span className="itin-emoji" role="img" aria-label={title}>{emoji}</span>
          <div>
            {!image && <span className="tag itin-category">{category}</span>}
            <h3 className="itin-title">{title}</h3>
            <p className="itin-route">{route}</p>
          </div>
        </div>

        <div className="itin-meta">
          <span>⏱️ {duration}</span>
          <span>👥 {groupSize} people</span>
        </div>

        <p className="itin-desc">{description}</p>

        <ul className="itin-highlights" aria-label="Highlights">
          {highlights.slice(0, 3).map((h, i) => (
            <li key={i}><span className="highlight-arrow">→</span> {h}</li>
          ))}
        </ul>

        <div className="itin-budget">
          <div className="budget-row">
            <span className="budget-label">Starting from</span>
            <span className="budget-value budget-mid">₹{budgetPerPerson?.mid?.toLocaleString('en-IN')}/person</span>
          </div>
        </div>

        <button className="btn btn-primary itin-view-btn" aria-label={`View details for ${title}`}>
          View Details →
        </button>
      </div>
    </article>
  );
}
