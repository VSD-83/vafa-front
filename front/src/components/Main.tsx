// src/components/Main.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Main: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleCreatepoll = () => {
        
        navigate('/pollcreation');
    };

    return (
        <div>
            <h1>Main Page</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCreatepoll}>Create Poll</button>
        </div>
    );
};

export default Main;
