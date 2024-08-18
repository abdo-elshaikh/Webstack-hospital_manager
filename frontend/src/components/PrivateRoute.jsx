import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const PrivateRoute = ({ allowedRoles, children }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        toast.info('Please login first');
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        toast.info('You do not have permission to access this page');
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
