import React from 'react';

const TaskCard = ({ task }) => (
  <div className="bg-white p-3 rounded shadow mb-2">
    <h3 className="font-bold">{task.title}</h3>
    <p>{task.description}</p>
    <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
  </div>
);

export default TaskCard;