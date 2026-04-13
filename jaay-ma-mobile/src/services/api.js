import axios from 'axios';

// Mettez l'adresse IP locale de votre ordinateur ici (ex: 192.168.1.15)
// Sur votre ordinateur, tapez 'ipconfig' dans le terminal pour trouver l'adresse IPV4
export const BASE_URL = 'http://192.168.1.53:5000';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
