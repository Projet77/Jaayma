import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../utils/helpers';

// Définition des couleurs calquées sur le thème Tailwind "Jaay-Ma"
const COLORS = {
    white: '#ffffff',
    primary: 'hsl(221.2, 83.2%, 53.3%)', // Bleu par défaut Tailwind/Radix de jaay-ma-app
    surface50: '#f9fafb',
    surface100: '#f3f4f6',
    surface200: '#e5e7eb',
    surface400: '#9ca3af',
    surface500: '#6b7280',
    surface900: '#111827',
    accentRed: '#ef4444', // Rouge des promos "accent-red"
    accentGreen: '#22c55e', // Vert "En stock" "accent-green"
    yellow: '#facc15', // Étoiles
};

const ProductCardMobile = ({
    product,
    onPress,
    onAddToCart,
    onAddToWishlist,
    isWishlisted = false
}) => {
    // Formatage du prix
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-SN', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price).replace('XOF', 'FCFA');
    };

    // Calcul du % de réduction
    const getDiscountPercent = () => {
        if (product.originalPrice > product.price) {
            return Math.round((1 - product.price / product.originalPrice) * 100);
        }
        return 0;
    };

    // Rendu des étoiles
    const renderStars = (rating = 0) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating - fullStars >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Ionicons key={i} name="star" size={12} color={COLORS.yellow} />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<Ionicons key={i} name="star-half" size={12} color={COLORS.yellow} />);
            } else {
                stars.push(<Ionicons key={i} name="star-outline" size={12} color={COLORS.surface200} />);
            }
        }
        return stars;
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Conteneur Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: getImageUrl(product.image || product.imageUrl || product.images?.[0]) }}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* Badge Promo */}
                {getDiscountPercent() > 0 && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{getDiscountPercent()}%</Text>
                    </View>
                )}

                {/* Bouton Favoris (en haut à droite) */}
                <TouchableOpacity
                    style={styles.wishlistBtnTop}
                    onPress={onAddToWishlist}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={18}
                        color={isWishlisted ? COLORS.accentRed : COLORS.surface500}
                    />
                </TouchableOpacity>
            </View>

            {/* Contenu Texte */}
            <View style={styles.contentContainer}>
                {product.brand && (
                    <Text style={styles.brand}>{product.brand}</Text>
                )}

                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {product.name}
                </Text>

                {/* Notes (Rating) */}
                <View style={styles.ratingContainer}>
                    <View style={styles.starsWrapper}>
                        {renderStars(product.rating || 5)}
                    </View>
                    <Text style={styles.reviewsCount}>({product.reviews || 0})</Text>
                </View>

                {/* Prix */}
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatPrice(product.price)}</Text>
                    {product.originalPrice > product.price && (
                        <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.surface200,
        margin: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1, // Carré "aspect-square"
        backgroundColor: COLORS.surface50,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        position: 'relative',
        overflow: 'hidden',
        padding: 10,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    discountBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.accentRed,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    contentContainer: {
        padding: 12,
        flex: 1,
    },
    brand: {
        fontSize: 12,
        color: COLORS.surface500,
        marginBottom: 4,
    },
    name: {
        fontSize: 14,
        fontWeight: '500', // font-medium
        color: COLORS.surface900,
        lineHeight: 20,
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    starsWrapper: {
        flexDirection: 'row',
        marginRight: 4,
    },
    reviewsCount: {
        fontSize: 10,
        color: COLORS.surface400,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 'auto', // Pousse vers le bas
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.surface900,
        marginRight: 3,
    },
    originalPrice: {
        fontSize: 11,
        color: COLORS.surface400,
        textDecorationLine: 'line-through',
    },
    wishlistBtnTop: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: COLORS.white,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    }
});

export default ProductCardMobile;
