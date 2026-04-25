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

export const saveTrip = (tripData) =>
  api.post('/api/trips', tripData).then(r => r.data);

export const deleteTrip = (id) =>
  api.delete(`/api/trips/${id}`).then(r => r.data);

export const getDestinations = (filters = {}) =>
  api.get('/api/destinations', { params: filters }).then(r => r.data);

export default api;
