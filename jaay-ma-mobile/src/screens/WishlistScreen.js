import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const WishlistScreen = ({ navigation }) => {
    const { wishlistItems, toggleFavorite, isFavorite } = useWishlist();
    const { addToCart } = useCart();

    if (wishlistItems.length === 0) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.emptyContainer}>
                        <Ionicons name="heart-outline" size={80} color={COLORS.neutral300 || '#d4d4d4'} />
                        <Text style={styles.emptyTitle}>Vos favoris sont vides</Text>
                        <Text style={styles.emptyDesc}>Enregistrez les articles que vous aimez pour plus tard.</Text>

                        <TouchableOpacity
                            style={styles.btnPrimary}
                            onPress={() => navigation.navigate('Catégories')}
                        >
                            <Text style={styles.btnPrimaryText}>Explorer les produits</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={wishlistItems}
                keyExtractor={(item) => (item._id || item.id).toString()}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 16 }}
                contentContainerStyle={{ paddingVertical: 16 }}
                renderItem={({ item }) => (
                    <View style={{ width: '48%', marginBottom: 16 }}>
                        <ProductCard
                            product={item}
                            isWishlisted={isFavorite(item.id || item._id)}
                            onPress={() => navigation.navigate('Catégories', { screen: 'ProductDetail', params: { product: item } })}
                            onAddToCart={() => addToCart(item)}
                            onAddToWishlist={() => toggleFavorite(item)}
                        />
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.black,
        marginTop: 24,
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: COLORS.neutral500,
        textAlign: 'center',
        marginBottom: 32,
    },
    btnPrimary: {
        backgroundColor: COLORS.primary || '#2563EB',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    btnPrimaryText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    }
});

export default WishlistScreen;
