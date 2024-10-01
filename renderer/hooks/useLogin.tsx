'use client'

import { useEffect, useState } from 'react';

const useLogin = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem('authToken');
    
    if (token === 'authToken') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    setLoading(true);
    setError(null); // Reset error state

    const log = window.localStorage.getItem('login') || 'f'
    const pass = window.localStorage.getItem('password') || 'm'

    if (
      username === log &&
      password === pass
    ) {
      sessionStorage.setItem('authToken', 'authToken');
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setError(new Error('Invalid credentials'));
    }

    setLoading(false);

    return error;
  };

  return { loading, isAuthenticated, login, error };
};

export default useLogin;
