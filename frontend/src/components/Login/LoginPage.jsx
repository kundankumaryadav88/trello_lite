import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fakeLogin } from '../../services/apiService';
import { useAppContext } from '../../context/AppContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await fakeLogin(email, password);
    dispatch({ type: 'LOGIN', payload: user });
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 mb-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2" />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2">Login</button>
    </div>
  );
};

export default LoginPage;