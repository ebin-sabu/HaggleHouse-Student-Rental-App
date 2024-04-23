import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser } from '../api/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            if (token && user && user.tokenExpiration) {
                const tokenExpiration = new Date(user.tokenExpiration).getTime();
                const currentTime = new Date().getTime();
                const remainingTime = tokenExpiration - currentTime;
                if (remainingTime <= 0) {
                    // Token expired, log the user out
                    logout();
                    // Redirect user to login page
                    window.location.href = '/login'; // You may use your router to navigate
                }
            }
        };

        const interval = setInterval(checkTokenValidity, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const logout = () => {
        toast("Bye, " + currentUser.name + '!', {
            hideProgressBar: false,
            progress: undefined,
            theme: "dark",
        })
        localStorage.clear();
        setCurrentUser(null);
        setIsAuthenticated(false);
    };

    const setUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const signUp = async (formData) => {
        try {
            const response = await createUser(formData); // createUser expects FormData
            const { user, token } = response;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setCurrentUser(user);
            setIsAuthenticated(true);
            toast.success("Sign up successful!");
            return response;
        } catch (error) {
            toast.error("Sign up failed: " + error.response.data.message);
            throw error;
        }
    };

    const value = {
        currentUser,
        isAuthenticated,
        logout,
        setUser,
        signUp
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


