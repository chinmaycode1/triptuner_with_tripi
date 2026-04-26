import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { showToast } from './Toast';
import './AuthModal.css';

export default function AuthModal({ mode, onClose }) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState(mode || 'login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (tab === 'signup' && !form.fullName.trim()) e.fullName = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            throw new Error('Invalid email or password. Please try again.');
          } else if (error.message.includes('Email not confirmed')) {
            throw new Error('Please verify your email before logging in. Check your inbox.');
          }
          throw error;
        }
        showToast('Welcome back! 🎉', 'success');
        onClose();
      } else {
        const { data, error } = await signUp(form.email, form.password, form.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('This email is already registered. Please log in instead.');
          }
          throw error;
        }
        
        // Check if email confirmation is required
        if (data?.user && !data.session) {
          showToast('Account created! Please check your email to verify your account. ✅', 'success');
        } else {
          showToast('Account created and logged in! 🎉', 'success');
        }
        onClose();
      }
    } catch (err) {
      showToast(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) showToast(error.message, 'error');
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Authentication">
      <div className="modal-bg" onClick={onClose} />
      <div className="modal-content">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <h2>✈️ TripTuner</h2>
          <p>Plan your perfect India adventure</p>
        </div>

        <div className="modal-tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'login'} className={`modal-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Log In</button>
          <button role="tab" aria-selected={tab === 'signup'} className={`modal-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {tab === 'signup' && (
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input id="fullName" type="text" className="form-input" placeholder="Rahul Sharma" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} aria-describedby={errors.fullName ? 'fullName-error' : undefined} />
              {errors.fullName && <span id="fullName-error" className="field-error" role="alert">{errors.fullName}</span>}
            </div>
          )}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input id="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} aria-describedby={errors.email ? 'email-error' : undefined} />
            {errors.email && <span id="email-error" className="field-error" role="alert">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input id="password" type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} aria-describedby={errors.password ? 'password-error' : undefined} />
            {errors.password && <span id="password-error" className="field-error" role="alert">{errors.password}</span>}
          </div>
          <button type="submit" className="btn btn-primary modal-submit" disabled={loading}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? '🚀 Log In' : '✨ Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
