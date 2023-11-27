import axios from "axios"

export const api = axios.create({
    baseURL: 'http://localhost:8000/api/residency'
})

export const getListings = async () => {
    const response = await api.get('/allresd')
    return response.data
}