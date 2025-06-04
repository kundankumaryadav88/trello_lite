import React, { useState } from 'react';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

const TaskColumn = ({ status, tasks }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">{status}</h2>
        <button onClick={() => setShowModal(true)} className="text-sm bg-green-500 text-white px-2 py-1 rounded">Add</button>
      </div>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
      {showModal && <TaskModal closeModal={() => setShowModal(false)} status={status} />}
    </div>
  );
};

export default TaskColumn;