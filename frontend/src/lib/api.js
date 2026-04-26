import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (e) {}
  return config;
});

export const chatWithTripi = (messages, language = 'en', sessionId = null) =>
  api.post('/api/chat', { messages, language, sessionId }).then(r => r.data);

export const generateTrip = (params) =>
  api.post('/api/chat/generate-trip', params).then(r => r.data);

export const getSavedTrips = () =>
  api.get('/api/trips').then(r => r.data);

// New PDF-based save function
export const saveTripAsPDF = async (destination, pdfBlob) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create filename: userId-destination-timestamp.pdf
    const timestamp = Date.now();
    const cleanDestination = destination.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const filename = `${user.id}-${cleanDestination}-${timestamp}.pdf`;

    // Convert blob to base64
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Remove data:application/pdf;base64, prefix
        resolve(base64String);
      };
      reader.readAsDataURL(pdfBlob);
    });

    // Send to backend
    const response = await api.post('/api/trips', {
      destination,
      pdfBlob: base64,
      filename
    });

    return response.data;
  } catch (error) {
    console.error('Save trip error:', error);
    throw error;
  }
};

// Legacy function for backward compatibility (now uses PDF approach)
export const saveTrip = async (tripData) => {
  // For now, throw an error to force migration to PDF approach
  throw new Error('Please use saveTripAsPDF instead. Legacy saveTrip is deprecated.');
};

export const deleteTrip = (id) =>
  api.delete(`/api/trips/${id}`).then(r => r.data);

export const getDestinations = (filters = {}) =>
  api.get('/api/destinations', { params: filters }).then(r => r.data);

export default api;
