import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PollCreation from './PollCreation';

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [showPollCreation, setShowPollCreation] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleCreatePoll = () => {
        setShowPollCreation(true);
    };

    const closePollCreation = () => {
        setShowPollCreation(false);
    };

    return (
        <div>
            <h1>Main Page</h1>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleCreatePoll}>Create Poll</button>
            {showPollCreation && <PollCreation onClose={closePollCreation} />}
        </div>
    );
};

export default Main;
