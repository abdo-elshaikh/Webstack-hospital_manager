import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Profile from './components/Profile';
import Home from './components/Home/Home';
import Login from './components/Login';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Register from './components/Register';
import NotFound from './components/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import Admin from './components/Admin';
import { Container } from 'react-bootstrap';
import { getCurrentUser, logout } from './services/AuthService';
import './app.css';

const App = () => {
    return (
        <Router>
            <MainApp />
        </Router>
    );
};

const MainApp = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLogedIn, setIsLogedIn] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            getCurrentUser().then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    setCurrentUser(data.user);
                    setIsLogedIn(true);
                }
            });
        } else {
            setCurrentUser(user);
            setIsLogedIn(true);
        }
    }, []);

    const handleLogIn = (user) => {
        setCurrentUser(user);
        setIsLogedIn(true);
    };

    const handleLogout = async () => {
        logout().then((data) => {
            if (data.error) {
                toast.error(data.error);
            }
            setCurrentUser(null);
            setIsLogedIn(false);
            toast.success(data.message);
        })
    };

    const location = useLocation();
    const hideHeader = location.pathname.includes('/admin');
    return (
        <Container>
            {!hideHeader && <Header currentUser={currentUser} handleLogout={handleLogout} isLogedIn={isLogedIn} />}
            <Routes>
                <Route path="/" element={<Home user={currentUser} isLogged={isLogedIn} />} />
                <Route path="/login" element={<Login handleLogIn={handleLogIn} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/resetPassword/:token" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile currentUser={currentUser} />} />
                <Route path="/admin/*" element={<Admin currentUser={currentUser} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <ToastContainer position={'top-right'} />
        </Container>
    );
}

export default App;
