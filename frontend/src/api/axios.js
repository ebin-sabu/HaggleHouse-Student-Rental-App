import axios from "axios"

export const api = axios.create({
    baseURL: 'https://hagglehouse.fly.dev/api/'
})

export const getListings = async () => {
    const response = await api.get('residency/allresd')
    return response.data
}