// NotFound.jsx
import React from 'react';
import '../styles/styles.css'; // Import your CSS file

const NotFound = () => {
    return (
        <div className="container">
            <div className="header">
                <h2>404 Not Found</h2>
            </div>
            <div className="content">
                <p>The page you're looking for does not exist.</p>
            </div>
        </div>
    );
};

export default NotFound;
