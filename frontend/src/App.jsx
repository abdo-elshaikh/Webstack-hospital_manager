// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home';
import Admin from './pages/Admin';
import Staff from './pages/Staff';
import Profile from './components/Profile';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Register from './components/Auth/Register';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Active from './components/Auth/Active';
import AuthPage from './components/Auth/Auth';
import Unauthorized from './components/Unauthorized';
import { ROLES } from './constants/roles';
import { AuthProvider } from './contexts/AuthContext';
import './app.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <MainApp />
            </AuthProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Router>
    );
};

const MainApp = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/*" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/activate/:token" element={<Active />} />
            <Route path="/auth/*" element={<AuthPage />} />

            {/* Protected Routes */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute allowedRoles={['user', 'admin', 'staff']}>
                        <Profile />
                    </PrivateRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute allowedRoles={['admin']}>
                        <Admin />
                    </PrivateRoute>
                }
            />

            {/* Staff Routes */}
            <Route
                path="/staff/*"
                element={
                    <PrivateRoute allowedRoles={['staff', 'admin']}>
                        <Staff />
                    </PrivateRoute>
                }
            />

            {/* Error and Unauthorized Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
