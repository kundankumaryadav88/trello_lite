import React from 'react';
import { useApp } from './context/AppContext';
import Dashboard from './components/Dashboard';
import LoginPage from './components/LoginPage';
const App = () => {
  const { state } = useApp();

  return (
    <div className="App">
      {state.isAuthenticated ? <Dashboard /> : <LoginPage />}
    </div>
  );
};
export default App;