import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBudgetClass } from '../data/destinations';
import { generateTrip } from '../lib/api';
import { generateItineraryPDF } from '../lib/enhancedPdf';
import { showToast } from './Toast';
import './DestinationCard.css';

const CURRENT_MONTH = new Date().getMonth();
const SEASON_MAP = {
  'Nov-Feb': [10,11,0,1], 'Oct-Mar': [9,10,11,0,1,2], 'Jun-Sep': [5,6,7,8],
  'Mar-May,Sep-Nov': [2,3,4,8,9,10], 'Apr-Jun,Sep-Nov': [3,4,5,8,9,10],
  'Mar-Jun,Sep-Nov': [2,3,4,5,8,9,10], 'Oct-May': [9,10,11,0,1,2,3,4],
  'Sep-Mar': [8,9,10,11,0,1,2], 'Sep-Jun': [8,9,10,11,0,1,2,3,4,5],
  'Oct-Jun': [9,10,11,0,1,2,3,4,5], 'Oct-Feb': [9,10,11,0,1],
  'Nov-Apr': [10,11,0,1,2,3], 'Sep-May': [8,9,10,11,0,1,2,3,4],
  'Jun-Sep,Oct-Feb': [5,6,7,8,9,10,11,0,1], 'Oct-Mar,Jun-Sep': [9,10,11,0,1,2,5,6,7,8],
};

function isInSeason(best_time) {
  for (const [key, months] of Object.entries(SEASON_MAP)) {
    if (best_time.includes(key.split(',')[0]) || best_time === key) {
      return months.includes(CURRENT_MONTH);
    }
  }
  return false;
}

export default function DestinationCard({ destination, skeleton = false, onItineraryGenerate }) {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);

  if (skeleton) {
    return (
      <div className="dest-card skeleton-card" aria-hidden="true">
        <div className="skeleton dest-card-image-area" />
        <div className="dest-card-body">
          <div className="skeleton" style={{height:'20px',width:'60%',marginBottom:'8px'}} />
          <div className="skeleton" style={{height:'14px',width:'40%',marginBottom:'12px'}} />
          <div className="skeleton" style={{height:'14px',width:'80%'}} />
        </div>
      </div>
    );
  }

  const { name, state, emoji, image, best_time, avg_budget_per_day, category, description } = destination;
  const budgetClass = getBudgetClass(avg_budget_per_day);
  const inSeason = isInSeason(best_time);

  const handleGenerateItinerary = async (e) => {
    e.stopPropagation();
    setGenerating(true);
    
    try {
      const data = await generateTrip({
        destination: name,
        days: 5,
        groupSize: 2,
        budget: avg_budget_per_day * 5 * 2,
        tripType: 'Leisure Trip',
        style: 'Mid-range Comfort',
        transport: 'Public Transport',
        accommodation: 'Mid-range Hotel',
        season: best_time,
        interests: category,
      });
      
      // Call parent component to show itinerary
      if (onItineraryGenerate) {
        onItineraryGenerate({
          destination: name,
          state,
          itinerary: data.plan,
          duration: 5,
          budget: avg_budget_per_day * 5 * 2,
          budgetPerDay: avg_budget_per_day,
          category: category[0],
          image
        });
      }
      
      showToast('Itinerary generated! 🎉', 'success');
    } catch (err) {
      showToast('Failed to generate itinerary', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <article
      className="dest-card card"
      role="button"
      tabIndex={0}
      aria-label={`Explore ${name}, ${state}`}
    >
      <div className="dest-card-image-area">
        <img src={image} alt={name} className="dest-image" loading="lazy" />
        {inSeason && <span className="season-badge" title="Great time to visit!">🌟 In Season</span>}
      </div>
      <div className="dest-card-body">
        <div className="dest-card-header">
          <h3 className="dest-name">{name}</h3>
          <span className="dest-state">{state}</span>
        </div>
        <p className="dest-desc">{description}</p>
        <div className="dest-card-footer">
          <span className={`dest-budget ${budgetClass === 'budget' ? 'budget-budget' : budgetClass === 'mid' ? 'budget-mid' : 'budget-premium'}`}>
            ₹{avg_budget_per_day.toLocaleString('en-IN')}/day
          </span>
          <span className="tag">{category[0]}</span>
        </div>
        <div className="dest-best-time">🗓️ Best: {best_time}</div>
        <button 
          className="btn btn-primary dest-plan-btn"
          onClick={handleGenerateItinerary}
          disabled={generating}
        >
          {generating ? '⏳ Generating...' : '✨ Get Itinerary'}
        </button>
      </div>
    </article>
  );
}
