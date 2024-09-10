// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// app components
import Home from './pages/HomePage';
import Admin from './pages/AdminPage';
import Staff from './pages/StaffPage';
import Auth from './pages/AuthPage';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import { AuthProvider } from './contexts/AuthProvider';
import './app.css';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/*" element={<Home />} />
                    <Route path="/home" element={<Navigate to="/*" />} />
                    <Route path="/profile" element={<PrivateRoute allowedRoles={['admin', 'staff', 'user']} element={Profile} />} />
                    <Route path="/auth/*" element={<Auth />} />
                    <Route path="/admin/*" element={<PrivateRoute allowedRoles={['admin']} element={Admin} />} />
                    <Route path="/staff/*" element={<PrivateRoute allowedRoles={['staff', 'admin']} element={Staff} />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"

            />
        </Router>
    );
};

export default App;

