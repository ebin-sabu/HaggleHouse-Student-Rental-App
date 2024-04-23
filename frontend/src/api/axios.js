import axios from "axios"

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/'
    // baseURL: 'https://hagglehouse-sg-7c9a4ded1fdc.herokuapp.com/api/'
    // baseURL: 'https://hagglehouse-pro-08a548c3843b.herokuapp.com/api/'
})

// Intercept every request from the axios instance
api.interceptors.request.use((config) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
    if (token) {
        // If the token exists, add it to the request's Authorization header
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// API requests for Handling User ----------------------------------

// createUser new
export const createUser = async (userData) => {
    const response = await api.post('user/register', userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
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

// Function to handle creating a new property
export const createProperty = async (formData) => {
    try {
        const response = await api.post('property/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error creating property:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// Function to update a property
export const updateProperty = async (propertyId, formData) => {
    try {
        const response = await api.patch(`property/update/${propertyId}`, formData);

        return response.data;
    } catch (error) {
        console.error('Error updating property:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// API requests for Bids ----------------------------------

// submitting bids
export const submitBid = async (bidData) => {
    const response = await api.post('user/bid', bidData);
    return response.data;
};

// Fetch all bids for a user
export const getAllBidsForUser = async (userId) => {
    const response = await api.post('user/myBids', { userId });
    return response.data;
};

// Fetch all bids for a property
export const getBidsForProperty = async (propertyId) => {
    try {
        const response = await api.get(`user/allbids/${propertyId}`);
        return response.data; // Assuming the backend sends back a JSON object with the bids
    } catch (error) {
        console.error('Error fetching bids for property:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// API request to accept a bid
export const acceptBid = async (bidId) => {
    try {
        const response = await api.post('user/acceptBid', { bidId });
        return response.data;
    } catch (error) {
        console.error('Error accepting bid:', error.response ? error.response.data : error.message);
        throw error;
    }
};

// API request to reject a bid
export const rejectBid = async (bidId) => {
    try {
        const response = await api.post('user/rejectBid', { bidId });
        return response.data;
    } catch (error) {
        console.error('Error rejecting bid:', error.response ? error.response.data : error.message);
        throw error;
    }
};


// API requests for group management ----------------------------------

// Create Group
export const createGroup = async (groupData) => {
    const response = await api.post('user/createGroup', groupData);
    return response.data;
};

// Join Group
export const joinGroup = async (joinData) => {
    const response = await api.post('user/joinGroup', joinData);
    return response.data;
};

// Leave Group
export const leaveGroup = async (userId) => {
    const response = await api.post('user/leaveGroup', { userId });
    return response.data;
};

// Get Group Details
export const getGroupDetails = async (userId) => {
    const response = await api.post('user/getMyGroup', { userId });
    return response.data;
};

// API requests to fetch data ----------------------------------

// Get all Listings
export const getListings = async () => {
    const response = await api.get('property/allprops')
    return response.data
}

// Fetch properties created by a specific landlord
export const getPropertiesByLandlord = async (userId) => {
    const response = await api.get(`property/myProperty/${userId}`);
    return response.data;
};


// Fetch details for a single property
export const getPropertyDetails = async (id) => {
    try {
        const response = await api.get(`property/my/${id}`);
        return response.data;

    } catch (error) {
        console.error('Error creating property:', error.response ? error.response.data : error.message);
        throw error;
    }
};

