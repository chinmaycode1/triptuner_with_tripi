import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">✈️ TripTuner</div>
            <p className="footer-tagline">India's AI-powered travel planning platform. Plan your perfect Indian adventure with Tripi AI.</p>
            <div className="footer-badges">
              <span className="badge">🤖 Powered by Tripi AI</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/destinations">Destinations</Link></li>
              <li><Link to="/itineraries">Itineraries</Link></li>
              <li><Link to="/near-me">Near Me</Link></li>
              <li><Link to="/plan">Plan a Trip</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>AI Features</h4>
            <ul>
              <li><Link to="/tripi">Chat with Tripi</Link></li>
              <li><Link to="/plan">Trip Builder</Link></li>
              <li><Link to="/saved">Saved Trips</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Popular Routes</h4>
            <ul>
              <li><Link to="/tripi?q=Golden Triangle 7 days">Golden Triangle</Link></li>
              <li><Link to="/tripi?q=Kerala backwaters 5 days">Kerala Backwaters</Link></li>
              <li><Link to="/tripi?q=Ladakh trip 7 days">Ladakh Circuit</Link></li>
              <li><Link to="/tripi?q=Rajasthan royal tour">Rajasthan Royal</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TripTuner. Made with ❤️ for India 🇮🇳</p>
          <p className="footer-disclaimer">AI responses are for planning purposes. Always verify current prices and conditions.</p>
        </div>
      </div>
    </footer>
  );
}
