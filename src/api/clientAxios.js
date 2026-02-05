// src/api/clientAxios.jsx
import axios from 'axios';

const clientAxios = axios.create({
    baseURL: 'http://localhost:4000/api' // Asegúrate que coincida con el puerto de tu server.js
});

// Este interceptor pega el token automáticamente en cada petición que hagas
clientAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default clientAxios;