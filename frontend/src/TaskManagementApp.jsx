import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import { Plus, Edit3, Trash2, Calendar, User, Lock, Mail, LogOut, GripVertical } from 'lucide-react';

// Context for global state management
const AppContext = createContext();

// Reducer for state management
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, tasks: [] };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload)
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  tasks: [],
  loading: false,
  error: null
};

// Context Provider Component
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing token on app load
  useEffect(() => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');

  if (token && userData && userData !== "undefined") {
    try {
      dispatch({ type: 'SET_USER', payload: JSON.parse(userData) });
    } catch (error) {
      console.error("Failed to parse userData from localStorage:", error);
      localStorage.removeItem('userData'); 
    }
  }
}, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// API service
const API_BASE_URL = 'http://localhost:8080/api'; // Adjust this to your backend URL

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

// Login Component
const LoginPage = () => {
  const { dispatch } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (isLogin) {
        response = await apiService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await apiService.signup(formData);
      }

      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        dispatch({ type: 'SET_USER', payload: response.user });
      } else {
        setError(response.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join our task management platform'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="inline w-4 h-4 mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="inline w-4 h-4 mr-2" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your age"
                required
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Task Modal Component
const TaskModal = ({ isOpen, onClose, task, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    dueDate: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        dueDate: ''
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'inprogress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-white rounded-lg shadow-md p-4 mb-4 cursor-move hover:shadow-lg transition-shadow ${
        draggedOver ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-800 flex-1">{task.title}</h3>
        <GripVertical className="w-4 h-4 text-gray-400 ml-2" />
      </div>
      
      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status === 'todo' ? 'To Do' : 
           task.status === 'inprogress' ? 'In Progress' : 'Completed'}
        </span>
        <span className="text-xs text-gray-500 flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(task.dueDate)}
        </span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
        >
          <Edit3 className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
    </div>
  );
};

// Task Column Component
const TaskColumn = ({ title, status, tasks, onTaskDrop, onEdit, onDelete }) => {
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    onTaskDrop(taskId, status);
  };

  const getColumnColor = () => {
    switch (status) {
      case 'todo':
        return 'bg-gray-50 border-gray-200';
      case 'inprogress':
        return 'bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 p-4 rounded-lg border-2 ${getColumnColor()} ${
        draggedOver ? 'border-blue-400 bg-blue-50' : ''
      }`}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        {title} ({tasks.length})
      </h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { state, dispatch } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await apiService.getTasks();
      console.log(response)
      console.log("response.tasks")
      if (response) {
        dispatch({ type: 'SET_TASKS', payload: response });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await apiService.createTask(taskData);
      if (response) {
        dispatch({ type: 'ADD_TASK', payload: response });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' });
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await apiService.updateTask(editingTask._id, taskData);
      if (response) {
        dispatch({ type: 'UPDATE_TASK', payload: response });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiService.deleteTask(taskId);
        dispatch({ type: 'DELETE_TASK', payload: taskId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
      }
    }
  };

  const handleTaskDrop = async (taskId, newStatus) => {
    const task = state.tasks.find(t => t._id === taskId);
    if (task && task.status !== newStatus) {
      try {
        const response = await apiService.updateTask(taskId, { ...task, status: newStatus });
        if (response) {
          dispatch({ type: 'UPDATE_TASK', payload: response });
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update task status' });
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleModalSave = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const todoTasks = state.tasks.filter(task => task.status === 'todo');
  const inProgressTasks = state.tasks.filter(task => task.status === 'inprogress');
  const completedTasks = state.tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>New Task</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-5 h-5" />
                <span>{state.user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {state.error}
          </div>
        )}

        {state.loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Loading tasks...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TaskColumn
              title="To Do"
              status="todo"
              tasks={todoTasks}
              onTaskDrop={handleTaskDrop}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              title="In Progress"
              status="inprogress"
              tasks={inProgressTasks}
              onTaskDrop={handleTaskDrop}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
            <TaskColumn
              title="Completed"
              status="completed"
              tasks={completedTasks}
              onTaskDrop={handleTaskDrop}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          </div>
        )}
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        task={editingTask}
        onSave={handleModalSave}
      />
    </div>
  );
};

// Main App Component
const App = () => {
  const { state } = useApp();

  return (
    <div className="App">
      {state.isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
};

// Root Component with Provider
const TaskManagementApp = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default TaskManagementApp;