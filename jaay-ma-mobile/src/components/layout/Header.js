import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { COLORS } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
    const navigation = useNavigation();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, token } = useAuth();
    
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [allProducts, setAllProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // Fetch notifications
    useEffect(() => {
        if (user && token) {
            const fetchNotifs = async () => {
                try {
                    const res = await api.get('/notifications');
                    setNotifications(res.data);
                } catch (error) {
                    console.log('Erreur fetch notifs:', error);
                }
            };
            fetchNotifs();
        } else {
            setNotifications([]);
        }
    }, [user, token]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Charger les produits une seule fois quand on active la recherche
    useEffect(() => {
        if (isSearchActive && allProducts.length === 0) {
            const fetchProducts = async () => {
                try {
                    const response = await api.get('/products');
                    const data = response.data.data || response.data.products || response.data;
                    setAllProducts(Array.isArray(data) ? data : []);
                } catch (error) {
                    console.log('Erreur fetch suggesions:', error);
                }
            };
            fetchProducts();
        }
    }, [isSearchActive]);

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        if (text.trim().length > 0) {
            const query = text.toLowerCase();
            const filtered = allProducts.filter(p =>
                (p.name && p.name.toLowerCase().includes(query)) ||
                (p.category && p.category.toLowerCase().includes(query)) ||
                (p.brand && p.brand.toLowerCase().includes(query))
            );
            // On limite aux 5 meilleures suggestions
            setSuggestions(filtered.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (product) => {
        setIsSearchActive(false);
        setSearchQuery('');
        setSuggestions([]);
        Keyboard.dismiss();
        navigation.navigate('Catégories', { screen: 'ProductDetail', params: { product } });
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Naviguer vers l'onglet des produits et passer le paramètre de recherche
            navigation.navigate('Catégories', {
                screen: 'ProductsList',
                params: { searchQuery: searchQuery.trim() }
            });
            setIsSearchActive(false);
            setSuggestions([]);
            Keyboard.dismiss();
            setSearchQuery('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.mainRow}>
                {/* Si la recherche n'est PAS active, afficher le Logo */}
                {!isSearchActive && (
                    <View style={styles.logoContainer} onTouchEnd={() => navigation.navigate('Accueil')}>
                        <Image source={require('../../../assets/logo.png')} style={styles.headerLogoImage} resizeMode="contain" />
                        <Text style={styles.logoTextSecondary}>Jaay</Text>
                        <Text style={styles.logoTextPrimary}>Ma</Text>
                        <Text style={styles.logoTextSecondary}>.</Text>
                    </View>
                )}

                {/* Si la recherche EST active, afficher la barre étirée */}
                {isSearchActive ? (
                    <View style={styles.searchActiveContainer}>
                        <TouchableOpacity onPress={() => setIsSearchActive(false)} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={22} color={COLORS.black} />
                        </TouchableOpacity>
                        <TextInput
                            autoFocus
                            placeholder="Rechercher des produits, marques..."
                            style={styles.searchInputActive}
                            placeholderTextColor={COLORS.neutral400}
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity onPress={handleSearch} style={styles.searchBtnActive}>
                            <Ionicons name="search" size={18} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Sinon, icônes loupe et cloche à droite */
                    <View style={styles.rightIconsContainer}>
                        <TouchableOpacity style={styles.searchIconOnly} onPress={() => setIsSearchActive(true)}>
                            <Ionicons name="search" size={24} color={COLORS.black} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.searchIconOnly} onPress={() => navigation.navigate('Notifications')}>
                            <Ionicons name="notifications-outline" size={24} color={COLORS.black} />
                            {unreadCount > 0 && (
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Liste Goutte d'eau (Dropdown) des Suggestions */}
            {isSearchActive && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    {suggestions.map((item) => (
                        <TouchableOpacity
                            key={item.id || item._id}
                            style={styles.suggestionItem}
                            onPress={() => handleSuggestionClick(item)}
                        >
                            <Ionicons name="search-outline" size={16} color={COLORS.neutral400} style={{ marginRight: 10 }} />
                            <View style={styles.suggestionTextContainer}>
                                <Text style={styles.suggestionName} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.suggestionCategory}>{item.category} • {item.brand}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        paddingTop: 35, // Légèrement réduit pour iOS/Android Status bar
        paddingBottom: 8,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        zIndex: 100,
    },
    mainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40, // Hauteur fixe compacte
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    headerLogoImage: {
        width: 26,
        height: 26,
        marginRight: 6,
        borderRadius: 6,
    },
    logoTextPrimary: {
        fontSize: 18, // Réduit légèrement
        fontWeight: '900',
        color: COLORS.primary || '#2563EB',
        letterSpacing: -0.5,
    },
    logoTextSecondary: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.black,
        letterSpacing: -0.5,
    },
    searchIconOnly: {
        padding: 5,
        backgroundColor: COLORS.neutral100,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
    rightIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: COLORS.accentRed || '#ef4444',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
    notificationBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        paddingHorizontal: 3,
    },
    searchActiveContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.neutral200 || '#e5e5e5',
        borderRadius: 8,
        backgroundColor: COLORS.white,
        height: '100%',
    },
    backBtn: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInputActive: {
        flex: 1,
        height: '100%',
        fontSize: 14,
        color: COLORS.black,
    },
    searchBtnActive: {
        backgroundColor: COLORS.black,
        height: '100%',
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    // --- Styles Suggestion Dropdown ---
    suggestionsContainer: {
        position: 'absolute',
        top: 85, // En dessous du Header
        left: 12,
        right: 12,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 999, // Très élevé pour passer au-dessus de tout l'écran
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: COLORS.neutral200 || '#e5e5e5',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    suggestionCategory: {
        fontSize: 11,
        color: COLORS.neutral400,
        marginTop: 2,
    }
});

export default Header;
