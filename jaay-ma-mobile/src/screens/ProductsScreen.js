import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import ProductCardMobile from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { COLORS } from '../constants/theme';

const ProductsScreen = ({ route, navigation }) => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Toutes');

    const { toggleFavorite, isFavorite } = useWishlist();
    const { addToCart } = useCart();

    const searchQuery = route.params?.searchQuery || '';

    useEffect(() => {
        fetchAllProductsForCategories();
    }, []);

    // Gère le filtrage en appelant directement l'API
    useEffect(() => {
        fetchFilteredProducts();
    }, [searchQuery, selectedCategory]);

    const fetchAllProductsForCategories = async () => {
        try {
            const response = await api.get('/products');
            const data = response.data.data || response.data.products || response.data;
            setAllProducts(data);
        } catch (error) {
            console.error('Erreur lors de la récupération de la liste complète:', error);
        }
    };

    const fetchFilteredProducts = async () => {
        try {
            setLoading(true);
            let url = '/products?';
            if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
            if (selectedCategory && selectedCategory !== 'Toutes') url += `category=${encodeURIComponent(selectedCategory)}&`;
            
            const response = await api.get(url);
            const data = response.data.data || response.data.products || response.data;
            setProducts(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits filtrés:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const isWishlisted = isFavorite(item.id || item._id);

        return (
            <ProductCardMobile
                product={item}
                isWishlisted={isWishlisted}
                onPress={() => navigation.navigate('ProductDetail', { product: item })}
                onAddToCart={() => addToCart(item)}
                onAddToWishlist={() => toggleFavorite(item)}
            />
        );
    };

    const renderFooter = () => {
        // N'afficher ce footer que si l'on est dans une recherche
        if (!searchQuery || allProducts.length === 0) return null;

        // Détecter la catégorie du produit principal pour proposer des similaires
        let similarProducts = [];
        if (products.length > 0 && products[0].category) {
            const category = products[0].category;
            similarProducts = allProducts.filter(p => p.category === category && !products.some(match => (match.id || match._id) === (p.id || p._id))).slice(0, 6);
        }
        if (similarProducts.length === 0) {
            similarProducts = allProducts.slice(6, 12); // Fallback basique 
        }

        // Produits vus/visitées : on simule avec les 6 premiers tous confondu
        const popularProducts = allProducts.slice(0, 6);

        return (
            <View style={styles.footerContainer}>
                <View style={styles.divider} />

                {/* 1. Produits Similaires */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Produits similaires</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                        {similarProducts.map((item) => (
                            <View key={item.id || item._id} style={styles.horizontalItem}>
                                <ProductCardMobile
                                    product={item}
                                    isWishlisted={isFavorite(item.id || item._id)}
                                    onPress={() => navigation.push('ProductDetail', { product: item })}
                                    onAddToCart={() => addToCart(item)}
                                    onAddToWishlist={() => toggleFavorite(item)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* 2. Les plus visités ce mois-ci */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Les plus visités ce mois-ci</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                        {popularProducts.map((item) => (
                            <View key={item.id || item._id} style={styles.horizontalItem}>
                                <ProductCardMobile
                                    product={item}
                                    isWishlisted={isFavorite(item.id || item._id)}
                                    onPress={() => navigation.push('ProductDetail', { product: item })}
                                    onAddToCart={() => addToCart(item)}
                                    onAddToWishlist={() => toggleFavorite(item)}
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    // Extraction dynamique des catégories de la BD
    const categoriesList = ['Toutes', ...new Set(allProducts.map(p => p.category).filter(Boolean))];

    // Fonction d'association Nom -> Icône
    const getCategoryIcon = (catName) => {
        const lower = catName.toLowerCase();
        if (lower === 'toutes') return 'grid-outline';
        if (lower.includes('audio') || lower.includes('casque') || lower.includes('écouteur')) return 'headset-outline';
        if (lower.includes('mobile') || lower.includes('smartphone') || lower.includes('téléphone')) return 'phone-portrait-outline';
        if (lower.includes('laptop') || lower.includes('ordinateur') || lower.includes('pc')) return 'laptop-outline';
        if (lower.includes('mode') || lower.includes('vêtement') || lower.includes('chaussure')) return 'shirt-outline';
        if (lower.includes('accessoire') || lower.includes('montre')) return 'watch-outline';
        if (lower.includes('gaming') || lower.includes('console') || lower.includes('jeu')) return 'game-controller-outline';
        return 'pricetag-outline'; // Icône par défaut
    };

    return (
        <View style={styles.container}>
            {/* Barre des catégories (Pills) */}
            <View style={styles.categoriesWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
                    {categoriesList.map((cat, index) => {
                        const isActive = selectedCategory === cat;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.categoryPill,
                                    isActive && styles.categoryPillActive
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Ionicons 
                                    name={getCategoryIcon(cat)} 
                                    size={16} 
                                    color={isActive ? COLORS.white : '#64748b'} 
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={[
                                    styles.categoryText,
                                    isActive && styles.categoryTextActive
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {products.length === 0 ? (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>Aucun produit ne correspond à cette catégorie.</Text>
                </View>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={searchQuery ? renderFooter : null}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoriesWrapper: {
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    categoriesScroll: {
        paddingHorizontal: 16,
        gap: 8,
    },
    categoryPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 24,
        backgroundColor: '#f1f5f9', // gris clair
        marginRight: 8,
    },
    categoryPillActive: {
        backgroundColor: COLORS.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    categoryTextActive: {
        color: COLORS.white,
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    list: {
        padding: 6, // Plus petit car le composant a sa propre marge (margin: 6)
    },
    footerContainer: {
        marginTop: 20,
        paddingBottom: 40,
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e5e5',
        marginHorizontal: 16,
        marginBottom: 24,
    },
    section: {
        marginBottom: 32,
        paddingLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 16,
        marginLeft: 6,
    },
    horizontalList: {
        paddingRight: 16,
    },
    horizontalItem: {
        width: 160,
        marginRight: 12,
    },
});

export default ProductsScreen;
