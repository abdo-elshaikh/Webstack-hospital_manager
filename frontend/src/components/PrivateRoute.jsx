import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../contexts/useAuth'; // Replace with the correct path

const PrivateRoute = ({ element: Element, allowedRoles: roles, ...rest }) => {
  let { user, isAuthenticated } = useAuth();
  // console.log('PrivateRoute', user, isAuthenticated);

  if (!isAuthenticated) {
    // check if user is authenticated
    user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (!user) {
      toast.error('Please login to access this page');
      return <Navigate to="/auth/login" replace />;
    }
  }

  if (!roles?.includes(user?.role)) {
    console.log('You do not have permission to access this page');
    return <Navigate to="/unauthorized" replace />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;
