import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import PollCreation from './PollCreation';

const Main: React.FC = () => {
    const navigate = useNavigate();
    const [showPollCreation, setShowPollCreation] = useState(false);
    const [polls, setPolls] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

    useEffect(() => {
        // Decode the token and check if the user is an admin
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setIsAdmin(decoded.isAdmin || false); // Ensure it's a boolean
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        const fetchPolls = async () => {
            try {
                const response = await fetch('http://localhost:3000/polls', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch polls');
                }
                const data = await response.json();
                setPolls(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPolls();
    }, []);

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

            {/* Only show "Create Poll" if the user is an admin */}
            {isAdmin && <button onClick={handleCreatePoll}>Create Poll</button>}
            
            {showPollCreation && <PollCreation onClose={closePollCreation} />}

            {/* Display Polls */}
            <div>
                <h2>Polls</h2>
                {polls.map(poll => (
                    <div key={poll.pollID}>
                        <h3>{poll.title}</h3>
                        <p>{poll.description}</p>
                        <p>Anonymous: {poll.isAnonymous ? 'Yes' : 'No'}</p>
                        <p>Expiration Date: {new Date(poll.expirationDate).toLocaleString()}</p>

                        {/* Fetch and display options for the poll */}
                        <OptionsList pollID={poll.pollID} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const OptionsList: React.FC<{ pollID: number }> = ({ pollID }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOptionID, setSelectedOptionID] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(`http://localhost:3000/polls/${pollID}/votes`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch options');
                }
                const data = await response.json();
                setOptions(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOptions();
    }, [pollID]);

    const castVote = async (optionID: number) => {
        try {
            const response = await fetch('http://localhost:3000/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ optionID })
            });

            if (!response.ok) {
                throw new Error('Failed to cast vote');
            }

            setSelectedOptionID(optionID);
            setHasVoted(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h4>Options</h4>
            <div>
                {options.map(option => (
                    <button
                        key={option.optionID}
                        onClick={() => castVote(option.optionID)}
                        disabled={hasVoted}
                        style={{
                            backgroundColor: selectedOptionID === option.optionID ? 'lightblue' : 'lightgray',
                            margin: '5px',
                            padding: '10px'
                        }}
                    >
                        {option.optionText}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Main;
