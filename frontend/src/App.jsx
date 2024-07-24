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
    const [isLogged, setIsLogged] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
                setIsLogged(true);
            } else {
                try {
                    const { user } = await getCurrentUser();
                    setCurrentUser(user);
                    setIsLogged(true);
                } catch (error) {
                    toast.error('Failed to fetch current user');
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogIn = async (user) => {
        setCurrentUser(user);
        setIsLogged(true);
    };

    const handleLogout = async () => {
        try {
            const data = await logout();
            if (data.error) {
                toast.error(data.error);
            } else {
                setCurrentUser(null);
                setIsLogged(false);
                toast.success(data.success);
            }
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const showHeader = !location.pathname.startsWith('/admin');

    return (
        <Container fluid className="d-flex flex-column min-vh-100">
            {showHeader && <Header currentUser={currentUser} isLogged={isLogged} onLogout={handleLogout} />}
            <Container fluid as="main" className="flex-grow-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={handleLogIn} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin/*" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
            <Footer />
            <ToastContainer />
        </Container>
    );
};

export default App;
