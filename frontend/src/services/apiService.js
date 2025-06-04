const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiService = {
  async signup(userData) {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  async getTasks() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // const data = await response.json();
    // console.log(data)
    return response.json();
  },

  async createTask(taskData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  async updateTask(taskId, taskData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskData)
    });
    return response.json();
  },

  async deleteTask(taskId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};

export default apiService;