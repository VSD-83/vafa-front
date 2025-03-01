import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import PollCreation from './PollCreation';
import styles from './Main.module.css';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';  // Importing the Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
        <div className={styles.mainContainer}>
            <h1 className={styles.mainTitle}>Main Page</h1>
            <div className={styles.pollActionButtons}>
                <button className={styles.button} onClick={handleLogout}>Logout</button>

                {/* Only show "Create Poll" if the user is an admin */}
                {isAdmin && <button className={styles.button} onClick={handleCreatePoll}>Create Poll</button>}
            </div>

            {showPollCreation && <PollCreation onClose={closePollCreation} />}

            {/* Display Polls */}
            <div>
                <h2>Polls</h2>
                {polls.map(poll => {
                    console.log("Rendering poll:", poll); // Debugging log
                    return (
                        <div key={poll.pollid} className={styles.pollContainer}>
                            <h3 className={styles.pollTitle}>{poll.title}</h3>
                            <p className={styles.pollDescription}>{poll.description}</p>
                            <p className={styles.pollAnonymous}>Anonymous: {poll.isanonymous ? 'Yes' : 'No'}</p>
                            <p className={styles.pollExpiration}>
                                Expiration Date: {new Date(poll.expirationdate).toLocaleString()}
                            </p>

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
                        setSelectedOptionID(data.selectedOptionID);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchOptions();
        fetchVoteCounts();
        checkIfVoted();
    }, [pollID, selectedOptionID]);

    const castVote = async (optionID: number) => {
        if (hasVoted && selectedOptionID === optionID) {
            return; // Don't vote again for the same option
        }
    
        try {
            // Cast the vote by sending the optionID to the backend
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
    
            setSelectedOptionID(optionID); // Update selected option
            setHasVoted(true); // Set the user as having voted
        } catch (error) {
            console.error(error);
        }
    };
    

    const totalVotes = Object.values(voteCounts).reduce((acc, count) => acc + count, 0);

    return (
        <div className={styles.optionList}>
            <h4>Options</h4>
            {options.map(option => (
                <div key={option.optionID} className={styles.optionItem}>
                    <input
                        type="radio"
                        id={`option-${option.optionID}`}
                        name="pollOption"
                        value={option.optionID}
                        checked={selectedOptionID === option.optionID}
                        onChange={() => castVote(option.optionID)}
                    />
                    <label htmlFor={`option-${option.optionID}`}>{option.optionText}</label>
                    <span className={styles.voteCount}>{voteCounts[option.optionID] || 0} votes</span>
                </div>
            ))}
        </div>
    );
};

export default Main;
