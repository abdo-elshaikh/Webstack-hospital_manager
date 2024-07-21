// src/components/Profile.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserById } from '../services/AdminService';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const Profile = ({currentUser}) => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const response = await getUserById(id);
            if (response.error) {
                setError(response.error);
            } else {
                setUser(response);
            }
        }
        fetchUser();
    }, [id]);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main-container">
            <div className="profile-header">
                <h2>Profile</h2>
            </div>
            <div className="container profile-info">
                <div className='profile-image'>
                    {/* image from public file */}
                    <img src="/avatar.svg" alt="profile" />
                </div>
                <div>
                    <h2>{user.name}</h2>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                    <p>Active: {user.isActive ? 'Active' : 'Inactive'}</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
