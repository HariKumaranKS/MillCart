import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('millcart_token'));
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users/profile`);
            setUser(res.data);
        } catch (error) {
            console.error('Profile fetch error:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        const { user, token } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('millcart_token', token);
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
        const { user, token } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('millcart_token', token);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('millcart_token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, signup, logout, fetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
