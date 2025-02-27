// src/components/Entrance.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Entrance: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Welcome to the Voting System</h1>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
    );
};

export default Entrance;
