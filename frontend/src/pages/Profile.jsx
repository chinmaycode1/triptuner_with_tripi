import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { showToast } from '../components/Toast';
import './Profile.css';

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', home_city: '', preferred_language: 'en', travel_style: 'mid-range' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { navigate('/'); return; }
    if (user) {
      setForm(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
      }));
      loadProfile();
    }
  }, [user, authLoading]);

  const loadProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) setForm({ full_name: data.full_name || '', home_city: data.home_city || '', preferred_language: data.preferred_language || 'en', travel_style: data.travel_style || 'mid-range' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({ id: user.id, ...form, updated_at: new Date().toISOString() });
      if (error) throw error;
      showToast('Profile updated! ✅', 'success');
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    showToast('Logged out. Safe travels! ��', 'info');
    navigate('/');
  };

  if (authLoading) return null;

  const initials = (form.full_name || user?.email || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <main className="profile-page" style={{ paddingTop: 'var(--nav-height)' }}>
      <div className="container">
        <div className="profile-layout">
          <div className="profile-sidebar">
            <div className="profile-avatar">{initials}</div>
            <h2 className="profile-name">{form.full_name || 'Traveller'}</h2>
            <p className="profile-email">{user?.email}</p>
            <button className="btn btn-secondary logout-btn" onClick={handleLogout}>🚪 Log Out</button>
          </div>

          <div className="profile-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="full_name">Full Name</label>
                <input id="full_name" type="text" className="form-input" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="home_city">Home City</label>
                <input id="home_city" type="text" className="form-input" value={form.home_city} onChange={e => setForm({...form, home_city: e.target.value})} placeholder="e.g. Mumbai, Delhi..." />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="preferred_language">Preferred Language</label>
                <select id="preferred_language" className="form-select" value={form.preferred_language} onChange={e => setForm({...form, preferred_language: e.target.value})}>
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="te">తెలుగు</option>
                  <option value="bn">বাংলা</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="travel_style">Travel Style</label>
                <select id="travel_style" className="form-select" value={form.travel_style} onChange={e => setForm({...form, travel_style: e.target.value})}>
                  <option value="budget">Budget Backpacker</option>
                  <option value="mid-range">Mid-range Comfort</option>
                  <option value="premium">Premium Luxury</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? '⏳ Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
