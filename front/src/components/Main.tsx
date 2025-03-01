import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import PollCreation from './PollCreation';
import axios from 'axios';

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
                {polls.map(poll => {
                    console.log("Rendering poll:", poll); // Debugging log
                    return (
                        <div key={poll.pollid}> {/* Use pollid instead of pollID */}
                            <h3>{poll.title}</h3>
                            <p>{poll.description}</p>
                            <p>Anonymous: {poll.isanonymous ? 'Yes' : 'No'}</p>
                            <p>Expiration Date: {new Date(poll.expirationdate).toLocaleString()}</p>

                            <OptionsList pollID={poll.pollid} /> {/* Use pollid here */}
                        </div>
                    );
                })}


            </div>
        </div>
    );
};

const OptionsList: React.FC<{ pollID: number }> = ({ pollID }) => {
    const [options, setOptions] = useState<any[]>([]);
    const [selectedOptionID, setSelectedOptionID] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [voteCounts, setVoteCounts] = useState<{ [key: number]: number }>({});

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch(`http://localhost:3000/polls/${pollID}/options`, {
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

        const fetchVoteCounts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/polls/${pollID}/vote-counts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch vote counts');
                }

                const data = await response.json();
                const counts: { [key: number]: number } = {};
                data.forEach((voteData: { optionID: number, voteCount: number }) => {
                    counts[voteData.optionID] = voteData.voteCount;
                });

                setVoteCounts(counts);
                console.log("Vote counts:", counts); // Log the counts to see the result
            } catch (error) {
                console.error(error);
            }
        };

        const checkIfVoted = async () => {
            try {
                const response = await fetch(`http://localhost:3000/votes/status`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.hasVoted) {
                        setHasVoted(true);
                        setSelectedOptionID(data.selectedOptionID);  // Set the option they voted for
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchOptions();
        fetchVoteCounts();
        checkIfVoted();
    }, [pollID]);

    const castVote = async (optionID: number) => {
        if (hasVoted && selectedOptionID === optionID) {
            // Prevent re-voting for the same option
            return;
        }

        try {
            const voteResponse = await fetch('http://localhost:3000/votes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ optionID })
            });

            if (!voteResponse.ok) {
                throw new Error('Failed to cast vote');
            }

            // Update the selected option
            setSelectedOptionID(optionID);
            setHasVoted(true); // Mark user as voted
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h4>Options</h4>
            <div>
                {options.map(option => (
                    <div key={option.optionid}>
                        <input
                            type="radio"
                            id={`option-${option.optionid}`}
                            name="pollOption"
                            value={option.optionid}
                            checked={selectedOptionID === option.optionid}
                            onChange={() => castVote(option.optionid)} // Allow selection change
                        />
                        <label htmlFor={`option-${option.optionid}`}>
                            {option.optiontext}
                        </label>
                        {/* Display the number of votes */}
                        <span> ({voteCounts[option.optionid] || 0} votes)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};












export default Main;
