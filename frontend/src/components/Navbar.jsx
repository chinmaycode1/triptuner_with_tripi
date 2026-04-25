import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

export default function Navbar({ onAuthOpen, language, onLanguageChange }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tripi?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/destinations', label: 'Destinations' },
    { to: '/itineraries', label: 'Itineraries' },
    { to: '/tripi', label: '🤖 Tripi AI' },
    { to: '/plan', label: 'Plan Trip' },
    { to: '/near-me', label: 'Near Me' },
    { to: '/saved', label: 'Saved Trips' },
  ];

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="TripTuner Home">
            <span className="logo-icon">✈️</span>
            <span className="logo-text">TripTuner</span>
          </Link>

          <ul className="navbar-links hide-mobile" role="list">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <button
              className="nav-icon-btn"
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100); }}
              aria-label="Search (Ctrl+K)"
              title="Search (Ctrl+K)"
            >
              🔍
            </button>

            <div className="lang-dropdown" role="combobox" aria-expanded={langOpen}>
              <button className="nav-icon-btn lang-btn" onClick={() => setLangOpen(!langOpen)} aria-label="Select language">
                🌐 <span className="lang-label hide-mobile">{currentLang.label}</span>
              </button>
              {langOpen && (
                <ul className="lang-menu" role="listbox">
                  {LANGUAGES.map(lang => (
                    <li key={lang.code} role="option" aria-selected={lang.code === language}>
                      <button
                        className={`lang-option ${lang.code === language ? 'active' : ''}`}
                        onClick={() => { onLanguageChange(lang.code); setLangOpen(false); }}
                      >
                        {lang.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className="nav-icon-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="user-menu">
                <button className="user-avatar-btn" onClick={() => navigate('/profile')} aria-label="Profile">
                  <div className="user-avatar">
                    {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="user-name hide-mobile">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="auth-btns hide-mobile">
                <button className="btn btn-ghost" onClick={() => onAuthOpen('login')}>Log In</button>
                <button className="btn btn-primary" onClick={() => onAuthOpen('signup')}>Sign Up</button>
              </div>
            )}

            <button
              className="hamburger hide-desktop"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-label="Mobile navigation">
          <div className="mobile-drawer-overlay" onClick={() => setMenuOpen(false)} />
          <div className="mobile-drawer-content">
            <ul role="list">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {!user && (
              <div className="mobile-auth-btns">
                <button className="btn btn-secondary" onClick={() => { onAuthOpen('login'); setMenuOpen(false); }}>Log In</button>
                <button className="btn btn-primary" onClick={() => { onAuthOpen('signup'); setMenuOpen(false); }}>Sign Up</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-label="Search">
          <div className="search-overlay-bg" onClick={() => setSearchOpen(false)} />
          <div className="search-modal">
            <form onSubmit={handleSearch}>
              <input
                ref={searchRef}
                type="text"
                className="search-input"
                placeholder="Search destinations, ask Tripi anything..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Search"
              />
              <button type="submit" className="search-submit-btn">Ask Tripi →</button>
            </form>
            <p className="search-hint">Press Enter to chat with Tripi AI · Esc to close</p>
          </div>
        </div>
      )}
    </>
  );
}
