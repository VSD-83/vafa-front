import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './login.module.css';

const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);

            // Decode and log the token
            const decodedToken = jwtDecode(data.token);
            console.log("Decoded Token:", decodedToken); // 🔍 Debugging log

            if (decodedToken.isAdmin === undefined) {
                console.error("❌ isAdmin is missing from the JWT!");
            }

            navigate('/main');
        } else {
            alert('Invalid credentials');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
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
            <button className={styles.button} onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
