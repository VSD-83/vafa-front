import React, { useState } from 'react';
import axios from 'axios';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/signup`, { name, password });
            alert('Sign up successful!');
        } catch (error) {
            alert('Error signing up');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
