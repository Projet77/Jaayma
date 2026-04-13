import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { default as api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUserFromStorage();
    }, []);

    const loadUserFromStorage = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('userToken');
            const storedUser = await AsyncStorage.getItem('userData');
            
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                // Set the authorization header for all future api requests
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données d'authentification:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', { email, password });
            
            if (response.data && response.data.token) {
                const { token, ...userData } = response.data;
                
                setUser(userData);
                setToken(token);
                
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true };
            }
            return { success: false, error: 'Identifiants invalides' };
        } catch (error) {
            console.error("Login erreur:", error.response?.data?.message || error.message);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur de connexion' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, password, otherData = {}) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/register', { name, email, password, role: 'user', ...otherData });
            
            if (response.data && response.data.token) {
                const { token, ...userData } = response.data;
                
                setUser(userData);
                setToken(token);
                
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true };
            }
            return { success: false, error: 'Inscription échouée' };
        } catch (error) {
            console.error("Register erreur:", error.response?.data?.message || error.message);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur lors de l\'inscription' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = async (idToken) => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/google', { idToken });
            
            if (response.data && response.data.token) {
                const { token, ...userData } = response.data;
                
                setUser(userData);
                setToken(token);
                
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(userData));
                
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true };
            }
            return { success: false, error: 'Connexion Google échouée' };
        } catch (error) {
            console.error("Google SSO erreur:", error.response?.data?.message || error.message);
            return { 
                success: false, 
                error: error.response?.data?.message || 'Erreur lors de la connexion Google' 
            };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');
            
            setUser(null);
            setToken(null);
            
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        isAuthenticated: !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
