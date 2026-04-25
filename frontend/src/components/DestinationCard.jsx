import { useNavigate } from 'react-router-dom';
import { getBudgetClass } from '../data/destinations';
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

export default function DestinationCard({ destination, skeleton = false }) {
  const navigate = useNavigate();

  if (skeleton) {
    return (
      <div className="dest-card skeleton-card" aria-hidden="true">
        <div className="skeleton dest-card-emoji-area" />
        <div className="dest-card-body">
          <div className="skeleton" style={{height:'20px',width:'60%',marginBottom:'8px'}} />
          <div className="skeleton" style={{height:'14px',width:'40%',marginBottom:'12px'}} />
          <div className="skeleton" style={{height:'14px',width:'80%'}} />
        </div>
      </div>
    );
  }

  const { name, state, emoji, best_time, avg_budget_per_day, category, description } = destination;
  const budgetClass = getBudgetClass(avg_budget_per_day);
  const inSeason = isInSeason(best_time);

  const handleClick = () => {
    navigate(`/tripi?q=Plan a ${category[0].toLowerCase()} trip to ${name}, ${state}`);
  };

  return (
    <article
      className="dest-card card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={`Explore ${name}, ${state}`}
    >
      <div className="dest-card-emoji-area">
        <span className="dest-emoji" role="img" aria-label={name}>{emoji}</span>
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
      </div>
    </article>
  );
}
