export const fakeLogin = async (email, password) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id: 'user1', email });
    }, 1000);
  });
};

export const fetchTasks = async () => {
  return [
    { id: '1', title: 'Design UI', description: 'Create mockups', status: 'To Do', dueDate: '2025-06-10' },
    { id: '2', title: 'Setup DB', description: 'Install MongoDB', status: 'In Progress', dueDate: '2025-06-12' },
  ];
};