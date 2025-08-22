import axios from 'axios';

const API_URL = "https://movies-api.eric-brito.workers.dev/movies";

export const getMovies = async () => {
    const response = await axios.get(API_URL);
    return response.data;
}