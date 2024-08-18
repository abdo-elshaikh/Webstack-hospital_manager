import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // Optionally: Check for user data in local storage or API on initial load
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = async (token, user, keepLoggedIn) => {
        console.log(token, user, keepLoggedIn);
        try {
            if (keepLoggedIn) {
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                toast.info(`Logged in as ${user.name} keep logged in`);
            } else {
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('user', JSON.stringify(user));
                toast.info(`Logged in as ${user.name} not keep logged in`);
            }
            setUser(user);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const handleLogout = () => {
        // Optionally: Clear user data from local storage or API
        try {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
