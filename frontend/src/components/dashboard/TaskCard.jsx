import React from 'react';
import { Edit3, Trash2, Calendar, GripVertical } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
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
      className="bg-white rounded-lg shadow-md p-4 mb-4 cursor-move hover:shadow-lg transition-shadow"
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

export default TaskCard;