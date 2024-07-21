// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';


const Home = ({ user, isLogged }) => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome to Hospital Manager</h1>
                <p>Your one-stop solution for managing hospital operations efficiently.</p>
                {isLogged?
                    <>
                    <div className="home-buttons">
                        <Link to="/appointments" className="btn btn-primary">Appointments</Link>
                        <Link to="/patients" className="btn btn-primary">Patients</Link>
                        <Link to={`/profile/${user._id}`} className="btn btn-primary">Profile</Link>
                    </div>
                    </>
                    : 
                    <div className="home-buttons">
                        <Link to="/login" className="btn btn-primary">Login</Link>
                        <Link to="/register" className="btn btn-secondary">Register</Link>
                    </div>
                }
                
            </div>
        </div>
    );
};

export default Home;
