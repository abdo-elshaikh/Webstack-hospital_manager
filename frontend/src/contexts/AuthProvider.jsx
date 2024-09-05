import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create AuthContext
export const AuthContext = createContext();

// Create AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (token, user, keepLoggedIn) => {
    try {
      if (keepLoggedIn) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
      }

      setUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Login failed. Please try again.');
      return false;
    }
  };

  const handleLogout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Logout failed. Please try again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export { AuthProvider, AuthContext };
