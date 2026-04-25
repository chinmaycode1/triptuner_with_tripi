import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TripiChat from '../components/TripiChat';
import './TripiAgent.css';

const QUICK_PROMPTS = [
  { label: '🏖️ Goa 5 days', query: 'Plan a 5-day trip to Goa for a couple' },
  { label: '🏔️ Ladakh 7 days', query: 'Plan a 7-day Ladakh trip from Delhi' },
  { label: '🛶 Kerala 6 days', query: 'Plan a 6-day Kerala backwaters trip' },
  { label: '🏰 Rajasthan 9 days', query: 'Plan a 9-day Rajasthan royal circuit' },
  { label: '🧘 Rishikesh 3 days', query: 'Plan a 3-day Rishikesh adventure trip' },
  { label: '🌿 Coorg weekend', query: 'Plan a 2-day Coorg trip from Bangalore' },
];

export default function TripiAgent({ language, onLanguageChange }) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  return (
    <main className="tripi-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="tripi-layout">
        {/* Sidebar */}
        <aside className="tripi-sidebar" aria-label="Tripi AI sidebar">
          <div className="tripi-profile">
            <div className="tripi-avatar-large">🧭</div>
            <h2 className="tripi-name">Tripi</h2>
            <p className="tripi-tagline">Your AI Travel Architect for India</p>
            <div className="tripi-status">
              <span className="status-dot" aria-hidden="true" />
              <span>Online</span>
            </div>
          </div>

          <div className="quick-prompts">
            <h3>Quick Trips</h3>
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                className="quick-prompt-btn"
                onClick={() => setActiveQuery(p.query + ' ' + Date.now())}
                aria-label={`Ask about ${p.label}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat */}
        <div className="tripi-chat-area">
          <TripiChat initialQuery={activeQuery} language={language} />
        </div>
      </div>
    </main>
  );
}
