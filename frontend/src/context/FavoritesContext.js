import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllFavorites, toggleFavorite } from '../api/axios';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const FavoritesContext = createContext();

export function useFavorites() {
    return useContext(FavoritesContext);
}

export const FavoritesProvider = ({ children }) => {
    const { currentUser, isAuthenticated } = useAuth();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (isAuthenticated && currentUser) {
            getAllFavorites(currentUser.id).then(setFavorites).catch(console.error);
        }
    }, [currentUser, isAuthenticated]);

    const handleToggleFavorite = async (propertyId) => {
        if (isAuthenticated && currentUser) {
            try {
                const isCurrentlyFavorited = favorites.some(fav => fav.id === propertyId);
                const newFavorites = isCurrentlyFavorited
                    ? favorites.filter(fav => fav.id !== propertyId)
                    : [...favorites, { id: propertyId }];
                setFavorites(newFavorites);

                const result = await toggleFavorite(propertyId, currentUser.id);
                toast.success(result.message);
                const updatedFavorites = await getAllFavorites(currentUser.id);
                setFavorites(updatedFavorites);

            } catch (error) {
                console.error('Failed to toggle favorite:', error);
                toast.error("Failed to toggle favorite");
                // Revert to the original favorites state in case of error
                setFavorites(favorites);
            }
        } else {
            toast.error("You must be logged in to favorite properties.");
        }
    };


    return (
        <FavoritesContext.Provider value={{ favorites, handleToggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};