import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signup.module.css';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password }),
        });

        if (response.ok) {
            navigate('/login');
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sign Up</h1>
            <input
                className={styles.input}
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className={styles.button} onClick={handleSignup}>Sign Up</button>
        </div>
    );
};

export default Signup;
