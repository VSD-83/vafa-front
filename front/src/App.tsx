import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Entrance from './components/Entrance';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Entrance />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
};

export default App;
