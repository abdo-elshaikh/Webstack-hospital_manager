import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

// Create a custom hook to use the AuthContext
const useAuth = () => {
    // console.log('useAuth');
    if (!AuthContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    // Use the AuthContext to access the user and isAuthenticated state
    return useContext(AuthContext);
};

export default useAuth;
