// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Entrance from './components/Entrance';
import Login from './components/Login';
import Signup from './components/Signup';
import Main from './components/Main';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Entrance />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/main" element={<Main />} />
            </Routes>
        </Router>
    );
};

export default App;
