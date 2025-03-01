import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './entrance.module.css';

const Entrance: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to the Voting System</h1>
            <div className={styles.buttonContainer}>
                <button className={styles.button} onClick={() => navigate('/login')}>Login</button>
                <button className={styles.button} onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
        </div>
    );
};

export default Entrance;
