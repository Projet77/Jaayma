import axios from 'axios';

// Utilisation de l'API déployée en production sur Render
export const BASE_URL = 'https://jaay-ma-backend.onrender.com';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
