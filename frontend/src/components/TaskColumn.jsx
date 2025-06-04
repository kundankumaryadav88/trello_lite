import React, { useState } from 'react'
import TaskCard from './TaskCard';



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


export default TaskColumn
