import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export function useAuth(): AuthState & { logout: () => void } {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, isLoading, token, logout };
}
