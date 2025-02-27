// src/components/Main.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <h1>Main Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Main;
