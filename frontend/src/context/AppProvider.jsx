import React, { useEffect, useReducer } from 'react';
import { AppContext } from './AppContext';
import { appReducer, initialState } from './appReducer';

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData && userData !== 'undefined') {
      try {
        dispatch({ type: 'SET_USER', payload: JSON.parse(userData) });
      } catch (error) {
        console.error('Failed to parse userData from localStorage:', error);
        localStorage.removeItem('userData');
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
