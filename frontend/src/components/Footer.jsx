import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">TripTuner</div>
            <p className="footer-tagline">AI-powered travel planning for India. Plan trips with generated itineraries, real rupee budgets, and destination guides.</p>
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
            <h4>Features</h4>
            <ul>
              <li><Link to="/tripi">Chat with Tripi</Link></li>
              <li><Link to="/plan">Trip Builder</Link></li>
              <li><Link to="/saved">Saved Trips</Link></li>
              <li><Link to="/profile">My Profile</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 TripTuner. Open source under MIT License.</p>
          <p className="footer-disclaimer">AI-generated itineraries are for planning purposes only. Always verify prices, schedules, and travel conditions before booking.</p>
        </div>
      </div>
    </footer>
  );
}
