import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { v4 as uuidv4 } from 'uuid';

const TaskModal = ({ closeModal, status }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const { dispatch } = useAppContext();

  const handleSave = () => {
    const newTask = { id: uuidv4(), title, description: desc, status, dueDate: due };
    dispatch({ type: 'SET_TASKS', payload: prev => [...prev, newTask] });
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-80">
        <h2 className="font-bold mb-2">New Task</h2>
        <input className="border w-full p-2 mb-2" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea className="border w-full p-2 mb-2" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} />
        <input type="date" className="border w-full p-2 mb-2" value={due} onChange={e => setDue(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button onClick={closeModal} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-3 py-1 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;