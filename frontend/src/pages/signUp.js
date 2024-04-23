import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [landlord, setLandlord] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const fileInputRef = useRef();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        } else if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*-_]/.test(password)) {
            formIsValid = false;
            toast.error("Password must be at least 8 characters long, include an uppercase letter, a number, and a special character (!@#$%^&*-_).");
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

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('landlord', landlord);
        if (profilePic) {
            formData.append('profilePic', profilePic); // Field name should match the backend expectation
        }

        try {
            const response = await signUp(formData); // Pass formData to signUp instead of an object
            const { user, token } = response;
            localStorage.setItem('token', token);
            navigate('/'); // Navigate to home upon successful sign-up
        } catch (error) {
            toast.error("Sign Up failed: " + (error.response ? error.response.data.message : error.message));
        } finally {
            setIsSubmitting(false); // End submission, hide spinner
        }
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]); // Update state with selected file
    };

    return (
        <form className="login" style={{ fontFamily: "Poppins", fontWeight: 500 }} onSubmit={handleSubmit}>
            <img className="logoLogin" width="170px" height="auto" alt="logo" src="fav.png" />
            <label>Profile Picture</label>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" // Accept only image files
            />
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
                {isSubmitting ? (
                    <Button variant="warning" disabled>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        Submitting...
                    </Button>
                ) : (
                    <Button type="submit" variant="warning" style={{ fontFamily: "Poppins", fontWeight: 600 }}>Sign Up</Button>
                )}
            </div>
            <p><br />Already a User? <Link to="/login">Log in</Link></p>
        </form>


    );
};

export default SignUp;
