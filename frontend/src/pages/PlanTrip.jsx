import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { generateTrip, saveTrip } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../components/Toast';
import { destinationNames } from '../data/destinations';
import { generateItineraryPDF } from '../lib/enhancedPdf';
import './PlanTrip.css';

const INTERESTS = ['Sightseeing','Trekking','Beach','Food','Spiritual','Wildlife','Photography','Shopping'];

export default function PlanTrip() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    destination: searchParams.get('destination') || '', 
    tripType: 'Solo Adventure', 
    duration: 5,
    style: 'Mid-range Comfort', 
    groupSize: 2, 
    budget: 25000,
    accommodation: 'Mid-range Hotel', 
    transport: 'Public Transport',
    season: 'Winter (Oct-Feb)', 
    interests: [],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Auto-generate if destination is provided
  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest && dest.trim()) {
      setForm(prev => ({ ...prev, destination: dest }));
      // Auto-generate after a short delay
      setTimeout(() => {
        handleGenerate(null, dest);
      }, 500);
    }
  }, [searchParams]);

  const validate = () => {
    const e = {};
    if (!form.destination.trim()) e.destination = 'Please enter a destination';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleGenerate = async (e, destinationOverride = null) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await generateTrip({
        destination: destinationOverride || form.destination,
        days: form.duration,
        groupSize: form.groupSize,
        budget: form.budget,
        tripType: form.tripType,
        style: form.style,
        transport: form.transport,
        accommodation: form.accommodation,
        season: form.season,
        interests: form.interests,
      });
      setResult(data);
      showToast('Trip plan generated! 🎉', 'success');
    } catch (err) {
      showToast('Failed to generate trip. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result) return;
    setDownloadingPDF(true);
    try {
      await generateItineraryPDF({
        destination: form.destination,
        duration: form.duration,
        groupSize: form.groupSize,
        budget: form.budget,
        budgetPerPerson: Math.round(form.budget / form.groupSize),
        tripType: form.tripType,
        style: form.style,
        transport: form.transport,
        accommodation: form.accommodation,
        season: form.season,
        interests: form.interests,
        itinerary: result.plan || '',
      });
      showToast('PDF downloaded! 📄', 'success');
    } catch (err) {
      console.error('PDF generation error:', err);
      showToast('Failed to generate PDF', 'error');
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleSave = async () => {
    if (!user) { 
      showToast('Please log in to save trips', 'warning'); 
      return; 
    }
    
    if (!result || !result.plan) {
      showToast('Please generate an itinerary first', 'warning');
      return;
    }
    
    try {
      const { saveItineraryAsPDF, extractTripData } = await import('../lib/saveTripPDF');
      
      const tripData = extractTripData({
        destination: form.destination,
        plan: result.plan,
        duration: form.duration,
        groupSize: form.groupSize,
        budget: form.budget,
        budgetPerPerson: Math.round(form.budget / form.groupSize),
        tripType: form.tripType
      }, 'form');
      
      await saveItineraryAsPDF(tripData);
    } catch (err) {
      console.error('Save trip error:', err);
      showToast(`Failed to save trip: ${err.message}`, 'error');
    }
  };

  return (
    <main className="plan-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">🗺️ Plan Your Perfect Trip</h1>
          <p className="section-subtitle">Fill in your preferences and Tripi AI will craft a personalized itinerary</p>
        </div>

        <div className="plan-layout">
          <form className="plan-form" onSubmit={handleGenerate} noValidate>
            <div className="form-section">
              <h3>📍 Destination</h3>
              <div className="form-group">
                <label className="form-label" htmlFor="destination">Where do you want to go?</label>
                <input
                  id="destination"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Goa, Ladakh, Kerala..."
                  value={form.destination}
                  onChange={e => setForm({...form, destination: e.target.value})}
                  list="dest-list"
                  aria-describedby={errors.destination ? 'dest-error' : undefined}
                />
                <datalist id="dest-list">
                  {destinationNames.map(n => <option key={n} value={n} />)}
                </datalist>
                {errors.destination && <span id="dest-error" className="field-error" role="alert">{errors.destination}</span>}
              </div>
            </div>

            <div className="form-section">
              <h3>👥 Trip Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="tripType">Trip Type</label>
                  <select id="tripType" className="form-select" value={form.tripType} onChange={e => setForm({...form, tripType: e.target.value})}>
                    {['Solo Adventure','Romantic Couple','Family with Kids','Friends Group','Corporate Team','Honeymoon','Senior Citizens'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="style">Travel Style</label>
                  <select id="style" className="form-select" value={form.style} onChange={e => setForm({...form, style: e.target.value})}>
                    {['Budget Backpacker','Mid-range Comfort','Premium Luxury','Adventure Trekking','Cultural Immersion','Food & Photography'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Duration: <strong>{form.duration} days</strong></label>
                <input type="range" min={2} max={21} value={form.duration} onChange={e => setForm({...form, duration: +e.target.value})} className="range-input" aria-label="Duration in days" />
                <div className="range-labels"><span>2 days</span><span>21 days</span></div>
              </div>

              <div className="form-group">
                <label className="form-label">Group Size: <strong>{form.groupSize} {form.groupSize === 1 ? 'person' : 'people'}</strong></label>
                <input type="range" min={1} max={30} value={form.groupSize} onChange={e => setForm({...form, groupSize: +e.target.value})} className="range-input" aria-label="Group size" />
                <div className="range-labels"><span>1</span><span>30</span></div>
              </div>

              <div className="form-group">
                <label className="form-label">Total Budget: <strong>₹{form.budget.toLocaleString('en-IN')}</strong></label>
                <input type="range" min={5000} max={500000} step={1000} value={form.budget} onChange={e => setForm({...form, budget: +e.target.value})} className="range-input" aria-label="Total budget in rupees" />
                <div className="range-labels"><span>₹5,000</span><span>₹5,00,000</span></div>
                <div className="budget-progress">
                  <div className="budget-bar" style={{width: `${(form.budget / 500000) * 100}%`}} />
                </div>
                <p className="budget-per-person">Per person: ₹{Math.round(form.budget / form.groupSize).toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="form-section">
              <h3>🏨 Logistics</h3>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="accommodation">Accommodation</label>
                  <select id="accommodation" className="form-select" value={form.accommodation} onChange={e => setForm({...form, accommodation: e.target.value})}>
                    {['Hostel Dorm','Budget Hotel','Mid-range Hotel','Premium Hotel','Luxury Resort','Homestay','Camping'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="transport">Transport</label>
                  <select id="transport" className="form-select" value={form.transport} onChange={e => setForm({...form, transport: e.target.value})}>
                    {['Public Transport','Self Drive','Taxi/Cab','Flight + Local','Bike Rental','Private Vehicle'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="season">Season</label>
                <select id="season" className="form-select" value={form.season} onChange={e => setForm({...form, season: e.target.value})}>
                  {['Winter (Oct-Feb)','Summer (Mar-Jun)','Monsoon (Jul-Sep)','Post-Monsoon (Sep-Nov)'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>🎯 Interests</h3>
              <div className="interests-grid" role="group" aria-label="Select interests">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    className={`interest-btn ${form.interests.includes(interest) ? 'active' : ''}`}
                    onClick={() => toggleInterest(interest)}
                    aria-pressed={form.interests.includes(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary generate-btn" disabled={loading}>
              {loading ? '⏳ Tripi is planning your trip...' : '✨ Generate My Perfect Trip'}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="plan-result">
              <div className="result-stats">
                <div className="result-stat"><span className="result-stat-value">{form.duration}</span><span className="result-stat-label">Days</span></div>
                <div className="result-stat"><span className="result-stat-value">{form.groupSize}</span><span className="result-stat-label">People</span></div>
                <div className="result-stat"><span className="result-stat-value">₹{form.budget.toLocaleString('en-IN')}</span><span className="result-stat-label">Total Budget</span></div>
                <div className="result-stat"><span className="result-stat-value">₹{Math.round(form.budget/form.groupSize).toLocaleString('en-IN')}</span><span className="result-stat-label">Per Person</span></div>
              </div>
              <div className="result-plan" dangerouslySetInnerHTML={{ __html: (result.plan || '').replace(/\n/g,'<br/>').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>') }} />
              <div className="result-actions">
                <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={downloadingPDF}>
                  {downloadingPDF ? '⏳ Generating PDF...' : '📄 Download PDF'}
                </button>
                <button className="btn btn-secondary" onClick={handleSave}>💾 Save Trip</button>
                <button className="btn btn-secondary" onClick={() => navigate(`/tripi?q=Tell me more about ${form.destination}`)}>💬 Chat with Tripi</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
