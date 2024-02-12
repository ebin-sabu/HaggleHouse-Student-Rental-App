import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [landlord, setLandlord] = useState('');
    const navigate = useNavigate();
    const { signUp } = useAuth();

    // Function to validate form fields and show toast on error
    const validateForm = () => {
        let formIsValid = true;

        if (!name) {
            formIsValid = false;
            toast.error("Please enter your name.");
        }

        if (!email) {
            formIsValid = false;
            toast.error("Please enter your email.");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            formIsValid = false;
            toast.error("Email is not valid.");
        }

        if (!password) {
            formIsValid = false;
            toast.error("Please enter your password.");
        } else if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) {
            formIsValid = false;
            toast.error("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character (!@#$%^&*).");
        }

        if (!landlord && landlord !== 'false') {
            formIsValid = false;
            toast.error("Please select your role.");
        }

        return formIsValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return; // Stop the form from submitting if the validation fails

        try {
            await signUp({ name, email, password, landlord: landlord === 'true' });
            navigate('/'); // Navigate to home upon successful sign-up
        } catch (error) {
            toast.error("Sign Up failed: " + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <form className="login" onSubmit={handleSubmit}>
            <img className="logoLogin" width="170px" height="auto" alt="logo" src="fav.png" />
            <label>Name</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

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
            <label>Who Are you ?</label>
            <select
                value={landlord}
                onChange={(e) => setLandlord(e.target.value)}
            >
                <option value="">Select Role</option>
                <option value="true">Landlord</option>
                <option value="false">Student</option>
            </select>

            <div className="d-grid gap-2">
                <Button type="submit" variant="warning">Sign Up</Button>
            </div>
        </form>

    );
};

export default SignUp;
