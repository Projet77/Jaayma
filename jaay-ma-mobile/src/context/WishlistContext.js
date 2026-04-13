import React, { createContext, useState, useContext, useEffect } from 'react';
import { default as api } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchFavorites();
        } else {
            setWishlistItems([]);
        }
    }, [isAuthenticated]);

    const fetchFavorites = async () => {
        try {
            const res = await api.get('/favorites');
            if (res.data && Array.isArray(res.data)) {
                // L'API retourne soit des objets entiers soit des Product populés.
                // On s'assure d'extraire le produit s'il est emballé dans un objet { product: {...} }
                const products = res.data.map(fav => fav.product ? fav.product : fav);
                setWishlistItems(products);
            }
        } catch (error) {
            console.error("Erreur chargement favoris:", error);
        }
    };

    const toggleFavorite = async (product) => {
        const productId = product.id || product._id;
        const isFav = isFavorite(productId);

        // Mise à jour optimiste (UI instanné)
        if (isFav) {
            setWishlistItems(prev => prev.filter(item => (item.id || item._id) !== productId));
        } else {
            setWishlistItems(prev => [...prev, product]);
        }

        // Si connecté, on synchronise avec la Base de données
        if (isAuthenticated) {
            try {
                if (isFav) {
                    await api.delete(`/favorites/${productId}`);
                } else {
                    await api.post('/favorites', { productId });
                }
            } catch (error) {
                console.error("Erreur synchro favori:", error);
                // Rollback éventuel (omis pour la fluidité, mais loggé)
            }
        }
    };

    const isFavorite = (productId) => {
        if (!productId) return false;
        return wishlistItems.some(item => (item.id || item._id) === productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            toggleFavorite,
            isFavorite,
            wishlistCount: wishlistItems.length
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
