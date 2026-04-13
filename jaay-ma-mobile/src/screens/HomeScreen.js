import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import ProductCardMobile from '../components/ProductCard';
import { getImageUrl } from '../utils/helpers';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
const { width, height } = Dimensions.get('window');

const COLORS = {
    black: '#000000',
    white: '#ffffff',
    primary: 'hsl(221.2, 83.2%, 53.3%)',
    bg: '#F4F2ED',
    neutral50: '#fafafa',
    neutral100: '#f5f5f5',
    neutral200: '#e5e5e5',
    neutral300: '#d4d4d4',
    neutral400: '#a3a3a3',
    neutral500: '#737373',
    accentRed: '#ef4444',
    accentGreen: '#22c55e',
};

// Marques pour le carrousel textuel
const BRANDS = ['APPLE', 'SAMSUNG', 'NIKE', 'SONY', 'ADIDAS', 'DYSON', 'LG', 'CANON', 'BOSE'];

const HomeScreen = ({ navigation }) => {
    const [banners, setBanners] = useState([]);
    const [products, setProducts] = useState([]); // Ajout du state "products"
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { toggleFavorite, isFavorite } = useWishlist();
    const { addToCart } = useCart();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // 1. Charger les bannières
            const bannerRes = await api.get('/banners');
            setBanners(bannerRes.data || []);

            // 2. Charger quelques produits pour la section "Populaires"
            const prodRes = await api.get('/products');
            let allProducts = [];
            if (Array.isArray(prodRes.data)) {
                allProducts = prodRes.data;
            } else if (prodRes.data && Array.isArray(prodRes.data.data)) {
                allProducts = prodRes.data.data;
            } else if (prodRes.data && Array.isArray(prodRes.data.products)) {
                allProducts = prodRes.data.products;
            }
            // Prendre les produits
            if (allProducts.length > 0) {
                setProducts(allProducts); // Sauvegarder tous les produits
                setPopularProducts(allProducts.slice(0, 6));
            }
        } catch (error) {
            console.error("Erreur de chargement Home:", error);
        } finally {
            setLoading(false);
        }
    };

    // Extraction des catégories uniques
    const categories = [...new Set(products.map(p => p.category))];

    // Valeur animée pour le scroll (Effet Parallax Framer Motion)
    const scrollY = useRef(new Animated.Value(0)).current;

    // Calcul du translateY pour l'arrière-plan (Vitesse divisée par 2)
    const translateY = scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: [0, 250],
        extrapolate: 'clamp' // Empêche le texte de descendre à l'infini
    });

    const translateY1 = scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: [0, 200],
        extrapolate: 'clamp'
    });

    const translateY2 = scrollY.interpolate({
        inputRange: [0, 500],
        outputRange: [0, -150],
        extrapolate: 'clamp'
    });

    return (
        <Animated.ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
        >
            {/* 1. HEADER PERSONNALISÉ (Désormais géré dans App.js ou en composant isolé) */}
            {/* Si vous avez enlevé les headers natifs, vous pouvez le décommenter ici */}
            {/* <Header title="JaayMa." /> */}

            {/* 2. HERO SECTION */}
            <View style={styles.heroSection}>
                {/* 1. Images flottantes (zIndex: 1, derrière le texte JAAY-MA) */}
                <Animated.Image
                    source={{ uri: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' }}
                    style={[styles.floatingImgLeft, { transform: [{ translateY: translateY1 }, { rotate: '-6deg' }] }]}
                />

                <Animated.Image
                    source={{ uri: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' }}
                    style={[styles.floatingImgRight, { transform: [{ translateY: translateY2 }, { rotate: '6deg' }] }]}
                />

                {/* 2. Texte JAAY-MA avec Parallax (zIndex: 2, par-dessus les images) */}
                <Animated.View style={[styles.heroBackgroundContainer, { transform: [{ translateY }] }]} pointerEvents="none">
                    <Text style={styles.heroBackgroundText}>JAAY-MA</Text>
                </Animated.View>

                {/* 3. Carte Contenu Principale (zIndex: 3, devant tout pour masquer partiellement JAAY-MA via l'opacité) */}
                <View style={[styles.heroContent, { elevation: 10 }]}>
                    <Text style={styles.heroTitle}>
                        Le Futur du{'\n'}<Text style={styles.heroTitleItalic}>Shopping</Text>.
                    </Text>
                    <Text style={styles.heroSubtitle}>
                        Une expérience d'achat repensée. Plus fluide, plus rapide, plus immersif. Bienvenue sur la marketplace de nouvelle génération.
                    </Text>
                </View>

                {/* 4. Boutons superposés (zIndex: 3, sous la boîte comme sur la capture Web) */}
                <View style={[styles.heroBtnGroup, { elevation: 10 }]}>
                    <TouchableOpacity
                        style={styles.btnPrimary}
                        onPress={() => navigation.navigate('Catégories')}
                    >
                        <Text style={styles.btnPrimaryText}>Explorer la collection</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnOutline}
                        onPress={() => { }}
                    >
                        <Text style={styles.btnOutlineText}>En savoir plus</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 3. BANNERS PUBE (Slide Horizontal) */}
            {banners.length > 0 && (
                <View style={styles.bannersSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width * 0.8 + 16} // Ajustement pour le 'snap'
                        decelerationRate="fast"
                        contentContainerStyle={styles.bannersScroll}
                    >
                        {banners.map(banner => (
                            <View key={banner._id || banner.id} style={[styles.bannerWrapper, { width: width * 0.8 }]}>
                                <Image
                                    source={{ uri: getImageUrl(banner.imageUrl) }}
                                    style={styles.bannerImage}
                                    resizeMode="cover"
                                />
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* 3. TICKER: MARQUES (Défilement des marques) */}
            <View style={styles.brandsSection}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {BRANDS.concat(BRANDS).map((brand, i) => (
                        <Text key={i} style={styles.brandText}>{brand}</Text>
                    ))}
                </ScrollView>
            </View>

            {/* 4. SECTION: LES PLUS POPULAIRES */}
            <View style={styles.popularSection}>
                <View style={styles.popularHeader}>
                    <Text style={styles.popularTitle}>
                        Les Plus <Text style={styles.popularTitleItalic}>Populaires</Text>.
                    </Text>
                    <Text style={styles.popularSubtitle}>Ce que tout le monde s'arrache en ce moment.</Text>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={280 + 16}
                    decelerationRate="fast"
                    contentContainerStyle={styles.popularScroll}
                >
                    {popularProducts.map((product, i) => (
                        <View key={product.id?.toString() || i.toString()} style={styles.popularItemWrapper}>
                            <ProductCardMobile
                                product={product}
                                isWishlisted={isFavorite(product.id || product._id)}
                                onPress={() => navigation.navigate('Catégories', { screen: 'ProductDetail', params: { product } })}
                                onAddToCart={() => addToCart(product)}
                                onAddToWishlist={() => toggleFavorite(product)}
                            />
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* SECTION NOTRE CATALOGUE: Par Catégorie */}
            <View style={styles.catalogSection}>
                <View style={styles.catalogHeader}>
                    <Text style={styles.catalogTitle}>
                        Notre <Text style={styles.catalogTitleMuted}>Catalogue</Text>
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Catégories')}>
                        <Text style={styles.catalogViewAllBtn}>Voir tout</Text>
                    </TouchableOpacity>
                </View>

                {categories.map((category) => {
                    const categoryProducts = products.filter(p => p.category === category).slice(0, 4);
                    // On n'affiche la catégorie que si elle a des produits
                    if (categoryProducts.length === 0) return null;

                    return (
                        <View key={category} style={styles.categoryBlock}>
                            <View style={styles.categoryTitleRow}>
                                <View style={styles.categoryDivider} />
                                <Text style={styles.categoryLabel}>{category}</Text>
                                <View style={styles.categoryDivider} />
                            </View>

                            <View style={styles.categoryGrid}>
                                {categoryProducts.map((product) => (
                                    <View key={product.id?.toString() || Math.random().toString()} style={styles.categoryGridItem}>
                                        <ProductCardMobile
                                            product={product}
                                            isWishlisted={isFavorite(product.id || product._id)}
                                            onPress={() => navigation.navigate('Catégories', { screen: 'ProductDetail', params: { product } })}
                                            onAddToCart={() => addToCart(product)}
                                            onAddToWishlist={() => toggleFavorite(product)}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* 5. AVANTAGES (Value Proposition) */}
            <View style={styles.valueSection}>
                <View style={styles.valueItem}>
                    <View style={styles.valueIconContainer}>
                        <Ionicons name="shield-checkmark" size={28} color={COLORS.black} />
                    </View>
                    <Text style={styles.valueTitle}>Garantie Totale</Text>
                    <Text style={styles.valueDesc}>Chaque produit est vérifié. Satisfait ou remboursé. Sans question.</Text>
                </View>

                <View style={styles.valueItem}>
                    <View style={styles.valueIconContainer}>
                        <Ionicons name="trending-up" size={28} color={COLORS.black} />
                    </View>
                    <Text style={styles.valueTitle}>Prix Équitables</Text>
                    <Text style={styles.valueDesc}>Direct fournisseur. Pas d'intermédiaires inutiles. Juste le bon prix.</Text>
                </View>

                <View style={styles.valueItem}>
                    <View style={styles.valueIconContainer}>
                        <Ionicons name="flash" size={28} color={COLORS.black} />
                    </View>
                    <Text style={styles.valueTitle}>Livraison Éclair</Text>
                    <Text style={styles.valueDesc}>Commandé avant 14h, livré le lendemain. Partout au Sénégal.</Text>
                </View>
            </View>

        </Animated.ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    // --- HERO ---
    heroSection: {
        backgroundColor: COLORS.bg,
        minHeight: height * 0.15, // Hauteur massive comme un vrai plein écran
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingVertical: 10,
    },
    heroBackgroundContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2, // Layer intermédiaire : pardessus images (1), derrière box blanche (3)
        elevation: 2,
    },
    heroBackgroundText: {
        fontFamily: 'Outfit_900Black',
        fontSize: 100, // Titre un peu réajusté pour que les lettres (J et MA) accrochent bien
        color: '#0B0D12',
        opacity: 0.95,
        letterSpacing: -10,
        textAlign: 'center',
        width: '300%',
        textTransform: 'uppercase',
    },
    heroContent: {
        backgroundColor: 'rgba(244, 242, 237, 0.42)', // Transparence ré-ajustée pour laisser transparaître le JAAY-MA comme demandé
        padding: 40,
        borderRadius: 24,
        alignItems: 'center',
        width: '92%',
        zIndex: 3, // Passe devant tout (images et texte géant)
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    floatingImgLeft: {
        position: 'absolute',
        left: -30,
        top: '25%', // Ajusté pour que le J passe dessus
        width: 140,
        height: 200,
        borderRadius: 24,
        resizeMode: 'cover',
        zIndex: 1, // En dessous de tout
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
    },
    floatingImgRight: {
        position: 'absolute',
        right: -30,
        top: '35%', // Ajusté pour que le M A passe dessus
        width: 150,
        height: 190,
        borderRadius: 24,
        resizeMode: 'cover',
        zIndex: 1, // En dessous de tout
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.25,
        shadowRadius: 25,
        backgroundColor: '#D10024', // Nike Red BG as in web picture
    },
    heroTitle: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 48, // text-5xl
        color: COLORS.black,
        textAlign: 'center',
        lineHeight: 52,
        marginBottom: 20,
        letterSpacing: -1.5,
    },
    heroTitleItalic: {
        color: COLORS.primary,
        fontStyle: 'italic',
        fontFamily: 'Outfit_500Medium',
    },
    heroSubtitle: {
        fontFamily: 'PlusJakartaSans_700Bold', // font-bold
        fontSize: 16, // text-lg
        color: COLORS.black,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 5,
    },
    heroBtnGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12, // flex gap-4
        zIndex: 3, // Surpasse images+texte
    },
    btnPrimary: {
        backgroundColor: COLORS.black,
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 50, // rounded-full
    },
    btnPrimaryText: {
        fontFamily: 'PlusJakartaSans_500Medium', // medium as requested by visual weight
        fontSize: 15,
        color: COLORS.white,
    },
    btnOutline: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 50, // rounded-full
        borderWidth: 1.5,
        borderColor: COLORS.black,
    },
    btnOutlineText: {
        fontFamily: 'PlusJakartaSans_500Medium', // medium as visual weight
        fontSize: 15,
        color: COLORS.black,
    },
    // --- BANNERS ---
    bannersSection: {
        marginBottom: 32,
    },
    bannersScroll: {
        paddingHorizontal: 16,
    },
    bannerWrapper: {
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.neutral200,
        backgroundColor: COLORS.white,
    },
    bannerImage: {
        width: '100%',
        height: 200,
    },
    // --- CATALOGUE CATEGORIES ---
    catalogSection: {
        marginBottom: 40,
        paddingHorizontal: 5,
    },
    catalogHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 24,
    },
    catalogTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.black,
    },
    catalogTitleMuted: {
        color: COLORS.neutral400,
        fontWeight: '500',
    },
    catalogViewAllBtn: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    categoryBlock: {
        marginBottom: 32,
    },
    categoryTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    categoryDivider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.neutral200,
    },
    categoryLabel: {
        marginHorizontal: 12,
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: COLORS.black,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryGridItem: {
        width: '50%', // Affiche 2 par 2
        marginBottom: 16,
    },
    // --- BRANDS TICKER ---
    brandsSection: {
        paddingVertical: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.neutral200,
        backgroundColor: COLORS.white,
    },
    brandText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.neutral300,
        marginHorizontal: 16,
        letterSpacing: -1,
    },
    // --- POPULAR ---
    popularSection: {
        paddingVertical: 24,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.neutral100,
    },
    popularHeader: {
        paddingHorizontal: 24,
        marginBottom: 18,
    },
    popularTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        letterSpacing: -1,
    },
    popularTitleItalic: {
        color: COLORS.primary,
        fontStyle: 'italic',
    },
    popularSubtitle: {
        fontSize: 12,
        color: COLORS.neutral500,
        marginTop: 2,
    },
    popularScroll: {
        paddingHorizontal: 16,
        gap: 16,
    },
    popularItemWrapper: {
        width: 280,
        position: 'relative',
    },
    // --- VALUE PROPOSITION ---
    valueSection: {
        padding: 32,
        backgroundColor: COLORS.white,
        gap: 32,
    },
    valueItem: {
        alignItems: 'center',
        textAlign: 'center',
    },
    valueIconContainer: {
        width: 64,
        height: 64,
        backgroundColor: COLORS.neutral100,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    valueTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.black,
    },
    valueDesc: {
        fontSize: 14,
        color: COLORS.neutral500,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 16,
    }
});

export default HomeScreen;
