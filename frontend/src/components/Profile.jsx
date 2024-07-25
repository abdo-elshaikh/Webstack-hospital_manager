// src/components/Profile.js
import {Card, CardBody, CardFooter, CardHeader, CardImg} from 'react-bootstrap'
import '../styles/profile.css';

const Profile = ({currentUser}) => {
    
    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile">
            <Card className="profile-card">
                <CardHeader>
                    <CardImg src='/avatar.svg' alt={currentUser.name} />
                </CardHeader>
                <CardBody>
                    <h1>{currentUser.name}</h1>
                    <p>Email: {currentUser.email}</p>
                    <p>Role: {currentUser.role}</p>
                </CardBody>
                <CardFooter>
                    <button className="btn btn-primary">Edit Profile</button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Profile;
