// src/components/Header.jsx
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = ({ isLogged, user, handleLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handelLogOutNav = () => {
        handleLogout();
        navigate('/login');
    }

    return (
        <header className="header">
            <nav className="navbar">
                    <Link className="navbar-brand" to="/">HSI^</Link>
                    <button className="navbar-toggler" type="button" onClick={handleMenu}>
                        <span className="navbar-toggler-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100">
                                <path d="M93,35.5v-11c0-3.584-2.916-6.5-6.5-6.5h-69c-3.584,0-6.5,2.916-6.5,6.5v11c0,2.317,1.222,4.349,3.052,5.5 C12.222,42.151,11,44.183,11,46.5v11c0,2.317,1.222,4.349,3.052,5.5C12.222,64.151,11,66.183,11,68.5v11c0,3.584,2.916,6.5,6.5,6.5 h69c3.584,0,6.5-2.916,6.5-6.5v-11c0-2.317-1.222-4.349-3.052-5.5C91.778,61.849,93,59.817,93,57.5v-11 c0-2.317-1.222-4.349-3.052-5.5C91.778,39.849,93,37.817,93,35.5z" opacity=".35"></path><path fill="#f2f2f2" d="M91,33.5v-11c0-3.584-2.916-6.5-6.5-6.5h-69C11.916,16,9,18.916,9,22.5v11 c0,2.317,1.222,4.349,3.052,5.5C10.222,40.151,9,42.183,9,44.5v11c0,2.317,1.222,4.349,3.052,5.5C10.222,62.151,9,64.183,9,66.5v11 c0,3.584,2.916,6.5,6.5,6.5h69c3.584,0,6.5-2.916,6.5-6.5v-11c0-2.317-1.222-4.349-3.052-5.5C89.778,59.849,91,57.817,91,55.5v-11 c0-2.317-1.222-4.349-3.052-5.5C89.778,37.849,91,35.817,91,33.5z"></path><rect width="69" height="11" x="15.5" y="22.5" fill="#70bfff"></rect><path fill="#40396e" d="M84.5,35h-69c-0.828,0-1.5-0.671-1.5-1.5v-11c0-0.829,0.672-1.5,1.5-1.5h69 c0.828,0,1.5,0.671,1.5,1.5v11C86,34.329,85.328,35,84.5,35z M17,32h66v-8H17V32z"></path><rect width="69" height="11" x="15.5" y="44.5" fill="#70bfff"></rect><path fill="#40396e" d="M84.5,57h-69c-0.828,0-1.5-0.671-1.5-1.5v-11c0-0.829,0.672-1.5,1.5-1.5h69 c0.828,0,1.5,0.671,1.5,1.5v11C86,56.329,85.328,57,84.5,57z M17,54h66v-8H17V54z"></path><g><rect width="69" height="11" x="15.5" y="66.5" fill="#70bfff"></rect><path fill="#40396e" d="M84.5,79h-69c-0.828,0-1.5-0.671-1.5-1.5v-11c0-0.829,0.672-1.5,1.5-1.5h69 c0.828,0,1.5,0.671,1.5,1.5v11C86,78.329,85.328,79,84.5,79z M17,76h66v-8H17V76z"></path></g>
                            </svg>
                        </span>
                    </button>
                    {/* nav bar */}
                    <div className={`navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {isLogged ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to= {`/profile/${user._id}`}>Profile</Link>
                                    </li>
                                    {user.role === 'admin' && (
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/admin">Admin</Link>
                                        </li>
                                    )}
                                    <li className="nav-item">
                                        <button className="nav-link" onClick={handelLogOutNav}>Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
            </nav>
        </header>
    );
};

Header.propTypes = {
    user: PropTypes.object,
    handleLogout: PropTypes.func.isRequired,
    isLogged: PropTypes.bool.isRequired,
};

export default Header;
