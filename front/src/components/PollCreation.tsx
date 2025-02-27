import React, { useState } from 'react';

interface Option {
    name: string;
}

const PollCreation: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
    const [options, setOptions] = useState<Option[]>([{ name: '' }, { name: '' }]); // Start with two options
    const [expirationDate, setExpirationDate] = useState<string>('');

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].name = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { name: '' }]); // Add a new option
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Validation
        if (title.trim() === '' || options.length < 2 || options.some(option => option.name.trim() === '') || expirationDate.trim() === '') {
            alert('Please fill in all fields. You must have at least a title, two options, and an expiration date.');
            return;
        }

        // Prepare the poll data
        const pollData = {
            title,
            description,
            isAnonymous,
            expirationDate,
            options: options.map(option => option.name), // Extract names from options
        };

        try {
            const response = await fetch('http://localhost:3000/polls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Get JWT from local storage
                },
                body: JSON.stringify(pollData),
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Poll created successfully! Poll ID: ${result.pollID}`);
                // Reset form
                setTitle('');
                setDescription('');
                setIsAnonymous(false);
                setOptions([{ name: '' }, { name: '' }]); // Reset to two options
                setExpirationDate('');
            } else {
                const errorData = await response.json();
                alert(`Error creating poll: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating poll:', error);
            alert('An error occurred while creating the poll.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create a Poll</h2>
            <div>
                <label>Title:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    Is Anonymous
                </label>
            </div>
            <div>
                <h4>Options:</h4>
                {options.map((option, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            value={option.name}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addOption}>Add Option</button>
            </div>
            <div>
                <label>Expiration Date:</label>
                <input
                    type="datetime-local"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Poll</button>
        </form>
    );
};

export default PollCreation;
