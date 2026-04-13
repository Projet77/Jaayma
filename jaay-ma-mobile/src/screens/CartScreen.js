import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/helpers';

const CartScreen = ({ navigation }) => {
    const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

    const handleCheckoutWhatsApp = () => {
        const phoneNumber = '+221764297495';
        
        let message = `Bonjour Jaay-Ma, je souhaite valider mon panier :\n\n`;
        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} (x${item.quantity}) - ${item.price * item.quantity} FCFA\n`;
        });
        message += `\n*TOTAL : ${cartTotal} FCFA*`;
        
        Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`)
            .catch(() => alert('Assurez-vous que WhatsApp est installé sur votre téléphone.'));
    };

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <Image
                source={{ uri: getImageUrl(item.image || item.imageUrl || item.images?.[0]) }}
                style={styles.itemImage}
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.itemPrice}>{item.price} FCFA</Text>

                <View style={styles.quantityRow}>
                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                    >
                        <Ionicons name="remove" size={16} color={COLORS.black} />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                    >
                        <Ionicons name="add" size={16} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => removeFromCart(item._id || item.id)}
            >
                <Ionicons name="trash-outline" size={24} color={COLORS.accentRed || '#ef4444'} />
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={80} color={COLORS.neutral300 || '#d4d4d4'} />
                        <Text style={styles.emptyTitle}>Votre panier est vide</Text>
                        <TouchableOpacity
                            style={styles.btnPrimary}
                            onPress={() => navigation.navigate('Catégories')}
                        >
                            <Text style={styles.btnPrimaryText}>Explorer notre catalogue</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => (item._id || item.id).toString()}
                renderItem={renderCartItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.checkoutSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{cartTotal} FCFA</Text>
                </View>
                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handleCheckoutWhatsApp}
                >
                    <Text style={styles.checkoutBtnText}>Passer la commande</Text>
                </TouchableOpacity>
            </View>
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
        paddingBottom: 20,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.neutral200 || '#e5e5e5',
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: COLORS.neutral100 || '#f5f5f5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: COLORS.primary || '#2563EB',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.neutral100 || '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 12,
        color: COLORS.black,
    },
    deleteBtn: {
        padding: 8,
    },
    checkoutSection: {
        padding: 24,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderColor: COLORS.neutral200 || '#e5e5e5',
        paddingBottom: 32, // SafeArea iPhone
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: COLORS.neutral500 || '#737373',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    checkoutBtn: {
        backgroundColor: COLORS.black,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CartScreen;
