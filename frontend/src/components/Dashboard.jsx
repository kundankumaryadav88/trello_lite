import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Calendar, User, Lock, Mail, LogOut, GripVertical } from 'lucide-react';
import { useApp } from '../context/AppContext';
import  apiService  from '../services/apiService';
import TaskModal from './TaskModal';
import TaskColumn from './TaskColumn';


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


export default Dashboard;