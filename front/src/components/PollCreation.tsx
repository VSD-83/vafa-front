import React, { useState } from 'react';

const PollCreation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [expirationDate, setExpirationDate] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [error, setError] = useState('');

    const handleAddOption = () => {
        setOptions([...options, '']);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        const filledOptions = options.filter(option => option.trim() !== '');
        if (title.trim() === '' || description.trim() === '' || filledOptions.length < 2 || expirationDate.trim() === '') {
            setError('Please fill all fields and provide at least two options.');
            return;
        }
    
        setError(''); // Clear any previous error
    
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:3000/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    isAnonymous,
                    expirationDate,
                    options: filledOptions
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to create poll');
            }
    

            const data = await response.json();
            console.log("Created Poll ID:", data.pollID);
    
            onClose();
        } catch (err) {
            console.error(err);
            setError('Error creating poll');
        }
    };
    
    

    return (
        <div>
            <h2>Create Poll</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <div>
                    <label>Is Anonymous:</label>
                    <input type="checkbox" checked={isAnonymous} onChange={() => setIsAnonymous(!isAnonymous)} />
                </div>
                <div>
                    <label>Expiration Date:</label>
                    <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} required />
                </div>
                <div>
                    <label>Options:</label>
                    {options.map((option, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                required
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddOption}>Add Option</button>
                </div>
                <button type="submit">Create Poll</button>
                <button type="button" onClick={onClose}>X</button>
            </form>
        </div>
    );
};

export default PollCreation;
