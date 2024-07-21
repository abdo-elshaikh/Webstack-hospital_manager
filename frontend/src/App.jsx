// src/App.jsx
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile';
import Home from './components/Home';
import Login from './components/Login';
import ForgotPassword from "./components/ForgotPassword";
import Register from './components/Register';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './components/Admin';

import { getCurrentUser, logout } from './services/AuthService';
import { BrowserRouter as Router, Route, Routes, json } from 'react-router-dom';
import './app.css';

const App = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLogged, setIsLogged] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsLogged(false);
        setCurrentUser(null);
    }

    const handleLogIn = async (user) => {
        setIsLogged(true);
        setCurrentUser(user);
    }

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setCurrentUser(JSON.parse(user));
            // console.log(currentUser._id);
            setIsLogged(true);
        } else {
            getCurrentUser().then((response) => {
                if (response.error) {
                    setIsLogged(false);
                    setCurrentUser(null);
                } else {
                    setIsLogged(true);
                    setCurrentUser(response.user);
                }
            });
        }
    }, []);


    return (
        <Router>
            <Header user={currentUser} handleLogout={handleLogout} isLogged={isLogged} />
            <ToastContainer position="top-right"
                autoClose={3000} hideProgressBar newestOnTop
                closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <div className="main">
                <Routes>
                    <Route path="/" element={<Home user={currentUser} isLogged={isLogged} />} />
                    <Route path="/login" element={<Login handleLogIn={handleLogIn} />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
            <Footer />
        </Router>
    );
}
export default App;
