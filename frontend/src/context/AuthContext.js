import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUser } from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true);
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        setCurrentUser(null);
        setIsAuthenticated(false);
        // Optionally redirect to login or home page as needed
    };

    const setUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        setCurrentUser(user);
        setIsAuthenticated(true);
    };

    const signUp = async ({ name, email, password, landlord }) => {
        try {
            const response = await createUser({ name, email, password, landlord });
            const { user, token } = response;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setCurrentUser(user);
            setIsAuthenticated(true);
            return response;
        } catch (error) {
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
