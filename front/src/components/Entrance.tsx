import React from 'react';
import { useNavigate } from 'react-router-dom';

const Entrance: React.FC = () => {
    const navigate = useNavigate();

    const handleSignup = () => {
        navigate('/signup');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div>
            <h1>Welcome to the Voting System</h1>
            <button onClick={handleSignup}>Sign Up</button>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Entrance;
