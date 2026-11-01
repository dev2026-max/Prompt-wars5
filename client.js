import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000,
});

export const EventAPI = {
  // Events
  listEvents: () => api.get('/events').then(r => r.data),
  getEvent: (id) => api.get(`/events/${id}`).then(r => r.data),
  createEvent: (data) => api.post('/events', data).then(r => r.data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data).then(r => r.data),
  deleteEvent: (id) => api.delete(`/events/${id}`).then(r => r.data),

  // Planner
  generatePlan: (eventId) => api.post('/planner/generate', { event_id: eventId }).then(r => r.data),
  previewPlan: (eventData) => api.post('/planner/preview', eventData).then(r => r.data),
  getSavedPlan: (eventId) => api.get(`/planner/${eventId}`).then(r => r.data),

  // Chat
  sendMessage: (content, eventId = null) => api.post('/chat', { content, event_id: eventId }).then(r => r.data),
  getChatHistory: (eventId = null) => api.get('/chat/history', { params: { event_id: eventId } }).then(r => r.data),
  clearChatHistory: (eventId = null) => api.delete('/chat/history', { params: { event_id: eventId } }).then(r => r.data),

  // Guests
  listGuests: (eventId) => api.get('/guests', { params: { event_id: eventId } }).then(r => r.data),
  getGuestSummary: (eventId) => api.get(`/guests/summary/${eventId}`).then(r => r.data),
  addGuest: (data) => api.post('/guests', data).then(r => r.data),
  updateGuest: (id, data) => api.put(`/guests/${id}`, data).then(r => r.data),
  deleteGuest: (id) => api.delete(`/guests/${id}`).then(r => r.data),
};

export default api;
