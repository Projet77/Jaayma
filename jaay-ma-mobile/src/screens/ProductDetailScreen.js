import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, ActivityIndicator, TextInput, Alert } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext'; // Si existant, ou un moyen d'avoir le token
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import ProductCardMobile from '../components/ProductCard';

const ProductDetailScreen = ({ route, navigation }) => {
    const { product } = route.params;
    const { addToCart } = useCart();
    const { toggleFavorite, isFavorite } = useWishlist();

    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    const handleWhatsAppOrder = () => {
        // Numéro fourni par le client
        const phoneNumber = '+221764297495';
        const message = `Bonjour Jaay-Ma, je souhaite commander ce produit : ${product.name} à ${product.price} FCFA. Pouvez-vous me confirmer sa disponibilité ?`;

        Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`)
            .catch(() => alert('Assurez-vous que WhatsApp est installé sur votre téléphone.'));
    };

    const [similarProducts, setSimilarProducts] = useState([]);
    const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const incrementQuantity = () => setQuantity(q => q + 1);
    const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            try {
                // Récupération de tous les produits (peut être optimisé sur le backend ensuite)
                const response = await api.get('/products');
                let allProducts = [];
                if (Array.isArray(response.data)) {
                    allProducts = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    allProducts = response.data.data;
                } else if (response.data && Array.isArray(response.data.products)) {
                    allProducts = response.data.products;
                }

                if (allProducts.length > 0) {
                    // Filtrage local par catégorie, en excluant le produit actuel
                    const currentId = product.id || product._id;
                    const filtered = allProducts.filter(p => p.category === product.category && (p.id || p._id) !== currentId);
                    setSimilarProducts(filtered.slice(0, 10));
                }
            } catch (error) {
                console.error("Erreur chargement produits similaires", error);
            } finally {
                setIsLoadingSimilar(false);
            }
        };

        if (product && product.category) {
            setIsLoadingSimilar(true);
            fetchSimilarProducts();
        } else {
            setIsLoadingSimilar(false);
        }
    }, [product]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/products/${product.id || product._id}/reviews`);
                setReviews(res.data);
            } catch (err) {
                console.log("Erreur chargement avis", err);
            }
        };
        fetchReviews();
    }, [product]);

    const submitReview = async () => {
        if (!reviewText.trim()) return Alert.alert('Erreur', 'Veuillez écrire un commentaire.');
        
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return Alert.alert('Attention', 'Vous devez être connecté.');

            const res = await api.post(`/products/${product.id || product._id}/reviews`, {
                rating: reviewRating,
                comment: reviewText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setReviews([{...res.data.review, user: { name: "Moi" }}, ...reviews]);
            setReviewText('');
            Alert.alert('Succès', 'Votre avis a été publié !');
        } catch (error) {
            Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la publication.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: getImageUrl(product.image || product.imageUrl || product.images?.[0]) }}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{product.name}</Text>
                    <Text style={styles.price}>{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(product.price)}</Text>
                </View>

                {/* Rating Display */}
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#eab308" />
                    <Text style={styles.ratingText}>
                        {product.rating ? product.rating.toFixed(1) : "0"} ({product.reviews || 0} avis)
                    </Text>
                </View>

                {product.category && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>
                )}

                <View style={styles.divider} />

                {/* Sélecteur de Quantité */}
                <View style={styles.quantityContainer}>
                    <Text style={styles.quantityLabel}>Quantité :</Text>
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity onPress={decrementQuantity} style={styles.qtyBtn}>
                            <Ionicons name="remove" size={20} color={COLORS.black} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{quantity}</Text>
                        <TouchableOpacity onPress={incrementQuantity} style={styles.qtyBtn}>
                            <Ionicons name="add" size={20} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Barre d'actions remontée ici */}
                <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                        style={styles.actionButtonSecondary}
                        onPress={() => toggleFavorite(product)}
                    >
                        <Ionicons
                            name={isFavorite(product.id || product._id) ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite(product.id || product._id) ? COLORS.accentRed : COLORS.black}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButtonPrimary}
                        onPress={() => {
                            addToCart(product, quantity);
                            alert(`${quantity} article(s) ajouté(s)!`);
                        }}
                    >
                        <Ionicons name="cart-outline" size={24} color={COLORS.white} />
                        <Text style={styles.actionText}>Ajouter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsAppOrder}>
                        <Ionicons name="logo-whatsapp" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.description}>
                    {product.description || 'Aucune description disponible pour ce produit.'}
                </Text>

                {/* Section Avis ajoutée */}
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Avis Clients ({reviews.length})</Text>
                
                <View style={styles.reviewForm}>
                    <Text style={{fontWeight: 'bold', marginBottom: 5}}>Laissez un avis</Text>
                    <View style={{flexDirection: 'row', marginBottom: 10}}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                                <Ionicons name={star <= reviewRating ? "star" : "star-outline"} size={24} color="#eab308" />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TextInput 
                        style={styles.reviewInput} 
                        placeholder="Qu'avez-vous pensé de ce produit ?"
                        value={reviewText}
                        onChangeText={setReviewText}
                        multiline
                    />
                    <TouchableOpacity style={styles.reviewSubmitBtn} onPress={submitReview}>
                        <Text style={styles.reviewSubmitText}>Publier</Text>
                    </TouchableOpacity>
                </View>

                {reviews.slice(0,3).map(rev => (
                    <View key={rev.id} style={styles.reviewCard}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{fontWeight: 'bold'}}>{rev.user?.name || "Client"}</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Ionicons name="star" size={12} color="#eab308" />
                                <Text style={{fontSize: 10, marginLeft: 2}}>{rev.rating}</Text>
                            </View>
                        </View>
                        <Text style={{fontSize: 12, color: '#666', marginTop: 5}}>{rev.comment}</Text>
                    </View>
                ))}

                {/* Section Produits Similaires ajoutée après les avis */}
                <View style={styles.similarSection}>
                    <Text style={styles.similarSectionTitle}>Produits Similaires</Text>
                    {isLoadingSimilar ? (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
                    ) : similarProducts.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarScroll}>
                            {similarProducts.map((item) => (
                                <View key={item.id || item._id} style={styles.similarItem}>
                                    <ProductCardMobile
                                        product={item}
                                        onPress={() => navigation.push('ProductDetail', { product: item })}
                                        onAddToCart={() => addToCart(item)}
                                        onAddToWishlist={() => toggleFavorite(item)}
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noSimilarText}>Aucun produit similaire trouvé.</Text>
                    )}
                </View>
            </View>


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    image: {
        width: '100%',
        height: 350,
    },
    content: {
        padding: SIZES.padding,
        paddingBottom: 40,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    title: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: SIZES.h2,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    categoryBadge: {
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: SIZES.radius,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    categoryText: {
        color: COLORS.textLight,
        fontSize: SIZES.body2,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.lightGray,
        marginVertical: 15,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 20,
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.lightGray,
    },
    quantityLabel: {
        fontSize: SIZES.body1,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        borderRadius: 25,
        backgroundColor: '#fafafa',
    },
    qtyBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 30,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 10,
    },
    description: {
        fontSize: SIZES.body1,
        color: COLORS.textLight,
        lineHeight: 24,
    },
    similarSection: {
        marginTop: 30,
        marginBottom: 10,
    },
    similarSectionTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 15,
    },
    similarScroll: {
        paddingRight: 15,
    },
    similarItem: {
        width: 160, // Légèrement plus petit qu'une carte pleine largeur
        marginRight: 15,
    },
    noSimilarText: {
        color: COLORS.textLight,
        fontStyle: 'italic',
        marginTop: 10,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
        marginTop: -5,
    },
    actionButtonSecondary: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.neutral200 || '#e5e5e5',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
    },
    actionButtonPrimary: {
        flex: 1,
        height: 50,
        backgroundColor: COLORS.black,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 12,
    },
    actionText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 8,
    },
    whatsappButton: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.accentGreen || '#25D366',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whatsappText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: SIZES.body1,
        marginLeft: 10,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: 5,
    },
    reviewForm: {
        backgroundColor: '#fafafa',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    reviewInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 10,
        height: 80,
        textAlignVertical: 'top',
        marginBottom: 10,
    },
    reviewSubmitBtn: {
        backgroundColor: COLORS.black,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    reviewSubmitText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    reviewCard: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    }
});

export default ProductDetailScreen;
