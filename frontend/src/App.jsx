import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './pages/Dashboard';
import { AppProvider } from './context/AppContext';

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;