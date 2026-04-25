import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedDestinations } from '../data/destinations';
import DestinationCard from '../components/DestinationCard';
import './Home.css';

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export default function Home({ onAuthOpen }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ destination: '', members: 'Solo', duration: '5' });
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const destinations500 = useCounter(500, 2000, statsVisible);
  const trips50k = useCounter(50000, 2000, statsVisible);
  const satisfaction = useCounter(98, 1500, statsVisible);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsVisible(true);
    }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = form.destination
      ? `Plan a ${form.duration}-day ${form.members.toLowerCase()} trip to ${form.destination}`
      : `Best ${form.duration}-day India trip for ${form.members.toLowerCase()}`;
    navigate(`/tripi?q=${encodeURIComponent(q)}`);
  };

  const featured = getFeaturedDestinations().slice(0, 6);

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-orbs" aria-hidden="true">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>
        <div className="hero-content container">
          <div className="badge hero-badge">🤖 Powered by Tripi AI</div>
          <h1 className="hero-title">
            Tune Your Perfect<br />
            <span className="gradient-text">India Adventure</span>
          </h1>
          <p className="hero-subtitle">
            Plan epic Indian trips with AI-powered itineraries, real rupee budgets, and insider tips from Tripi — your personal India travel expert.
          </p>

          <form className="hero-search" onSubmit={handleSearch} role="search" aria-label="Trip search">
            <input
              type="text"
              className="hero-search-input"
              placeholder="Where in India? (Goa, Ladakh, Kerala...)"
              value={form.destination}
              onChange={e => setForm({...form, destination: e.target.value})}
              aria-label="Destination"
            />
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
              🔍 Explore with Tripi
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section" ref={statsRef} aria-label="Platform statistics">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{destinations500}+</div>
              <div className="stat-label">Destinations</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{trips50k.toLocaleString('en-IN')}+</div>
              <div className="stat-label">Trips Planned</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">₹999</div>
              <div className="stat-label">Avg Budget/Day</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{satisfaction}%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="section featured-section" aria-label="Featured destinations">
        <div className="container">
          <h2 className="section-title">✨ Featured Destinations</h2>
          <p className="section-subtitle">Handpicked by Tripi AI for unforgettable experiences</p>
          <div className="grid-3">
            {featured.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
          <div className="view-all-row">
            <button className="btn btn-secondary" onClick={() => navigate('/destinations')}>
              View All 500+ Destinations →
            </button>
          </div>
        </div>
      </section>

      {/* Tripi CTA */}
      <section className="tripi-cta-section section" aria-label="Tripi AI call to action">
        <div className="container">
          <div className="tripi-cta-card">
            <div className="tripi-cta-content">
              <div className="tripi-cta-avatar">🧭</div>
              <div>
                <h2>Meet Tripi — Your AI Travel Architect</h2>
                <p>Get personalized itineraries, real rupee budgets, train routes, hotel recommendations and insider tips for any destination in India. Available 24/7 in 8 Indian languages.</p>
                <div className="tripi-cta-features">
                  <span>✅ Real rupee prices</span>
                  <span>✅ Day-by-day itineraries</span>
                  <span>✅ Train & flight routes</span>
                  <span>✅ 8 Indian languages</span>
                </div>
                <button className="btn btn-primary" onClick={() => navigate('/tripi')}>
                  Chat with Tripi →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
