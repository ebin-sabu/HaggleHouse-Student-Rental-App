import axios from "axios"

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/'
})

// Get all Listings
export const getListings = async () => {
    const response = await api.get('property/allprops')
    return response.data
}

// Create a new user
export const createUser = async (userData) => {
    const response = await api.post('user/register', userData);
    return response.data;
};

// User login
export const loginUser = async (credentials) => {
    const response = await api.post('user/login', credentials);
    return response.data;
};

// User favourite
export const toggleFavorite = async (propertyId, userId) => {
    const response = await api.post(`user/toFav/${propertyId}`, { userId });
    return response.data;
};

// get all user favs
export const getAllFavorites = async (userId) => {
    const response = await api.post('user/allFav', { userId });
    return response.data;
};

