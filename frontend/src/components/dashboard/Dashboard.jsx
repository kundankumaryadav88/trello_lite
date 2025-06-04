import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { fetchTasks } from '../services/apiService';
import TaskColumn from '../components/Task/TaskColumn';

const Dashboard = () => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    (async () => {
      const tasks = await fetchTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    })();
  }, []);

  const groupedTasks = ['To Do', 'In Progress', 'Completed'].map(status => ({
    status,
    tasks: state.tasks.filter(t => t.status === status),
  }));

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {groupedTasks.map(group => (
        <TaskColumn key={group.status} status={group.status} tasks={group.tasks} />
      ))}
    </div>
  );
};

export default Dashboard;