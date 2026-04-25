import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Itineraries from './pages/Itineraries';
import ItineraryDetail from './pages/ItineraryDetail';
import TripiAgent from './pages/TripiAgent';
import PlanTrip from './pages/PlanTrip';
import NearMePage from './pages/NearMePage';
import SavedTrips from './pages/SavedTrips';
import Profile from './pages/Profile';
import './styles/globals.css';

export default function App() {
  const [authModal, setAuthModal] = useState(null);
  const [language, setLanguage] = useState(() => localStorage.getItem('tripi-lang') || 'en');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('tripi-lang', lang);
  };

  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Navbar
            onAuthOpen={(mode) => setAuthModal(mode)}
            language={language}
            onLanguageChange={handleLanguageChange}
          />

          <Routes>
            <Route path="/" element={<Home onAuthOpen={(mode) => setAuthModal(mode)} />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/itineraries" element={<Itineraries />} />
            <Route path="/itinerary/:id" element={<ItineraryDetail />} />
            <Route path="/tripi" element={<TripiAgent language={language} onLanguageChange={handleLanguageChange} />} />
            <Route path="/plan" element={<PlanTrip />} />
            <Route path="/near-me" element={<NearMePage />} />
            <Route path="/saved" element={<SavedTrips />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={
              <div style={{ paddingTop: 'var(--nav-height)', textAlign: 'center', padding: '120px 24px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✈️</div>
                <h1 style={{ marginBottom: '12px' }}>Page Not Found</h1>
                <p style={{ color: 'var(--text2)', marginBottom: '24px' }}>This destination doesn't exist on our map!</p>
                <a href="/" className="btn btn-primary">Back to Home</a>
              </div>
            } />
          </Routes>

          <Footer />
          <Toast />

          {authModal && (
            <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />
          )}

          {showBackToTop && (
            <button
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
            >
              ↑
            </button>
          )}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
