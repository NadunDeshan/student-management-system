import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(
            'API request failed:',
            error.response?.data ?? error.message
        );

        return Promise.reject(error);
    }
);

export default api;