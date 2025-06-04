import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    return response.data;
  },

  async signup(userData) {
    const response = await api.post('/signup', userData);
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
  },

  getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};