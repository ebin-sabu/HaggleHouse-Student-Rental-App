import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { loginUser } from '../api/axios'; // Make sure this path matches your project structure
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await loginUser({ email, password });
            const { user, token } = response;

            // Store the token in localStorage
            localStorage.setItem('token', token);
            setUser(user);

            // Redirect to the homepage after successful login
            navigate('/');
        } catch (error) {
            toast.error("Invalid Email or Password!");
        }
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <img className="logoLogin" width="170px" height="auto" alt="logo" src="fav.png" />
            <h3>Login</h3>

            <label>Email</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="d-grid gap-2">
                <Button type="submit" variant="warning">Login</Button>
            </div>
        </form>
    );
};

export default Login;
