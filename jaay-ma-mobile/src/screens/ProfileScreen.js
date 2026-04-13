import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Image } from 'react-native';
import { COLORS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { useAuth } from '../context/AuthContext';
import { default as api } from '../services/api';
import { getImageUrl } from '../utils/helpers';

const ProfileScreen = ({ navigation }) => {
    const { user, login, register, logout, isAuthenticated, isLoading, loginWithGoogle } = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [popularProducts, setPopularProducts] = useState([]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchPopularProducts();
        } else {
            // Configuration INIT Google SignIn (Commenté pour Expo Go)
            // Remplace "VOTRE_CLIENT_ID_WEB" par la vraie clé de la console Google Cloud.
            /* GoogleSignin.configure({
                webClientId: 'VOTRE_CLIENT_ID_WEB.apps.googleusercontent.com',
                offlineAccess: true,
            }); */
        }
    }, [isAuthenticated]);

    const fetchPopularProducts = async () => {
        try {
            const response = await api.get('/products?featured=true');
            if (response.data && response.data.success) {
                setPopularProducts(response.data.data);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des produits populaires :", error);
        }
    };

    const handleAuth = async () => {
        setErrorMsg('');
        setAuthLoading(true);
        let res;
        if (isLoginView) {
            if (!email || !password) {
                setAuthLoading(false);
                return setErrorMsg('Veuillez remplir tous les champs');
            }
            res = await login(email, password);
        } else {
            if (!firstName || !lastName || !email || !password) {
                setAuthLoading(false);
                return setErrorMsg('Veuillez remplir les champs obligatoires');
            }
            const fullName = `${firstName} ${lastName}`.trim();
            res = await register(fullName, email, password, { phone, address, city });
        }
        
        setAuthLoading(false);
        if (!res.success) {
            setErrorMsg(res.error || 'Une erreur est survenue');
        }
    };

    const handleGoogleLogin = async () => {
        Alert.alert(
            "Indisponible sur Expo Go", 
            "La connexion avec Google utilise du code natif (Java/Swift) qui ne peut pas tourner dans l'émulateur basique d'Expo Go.\n\nMais ne t'en fais pas, la logique est écrite : elle fonctionnera parfaitement une fois l'application compilée en vrai .APK ou .AAB (via EAS Build) ! 🎉"
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerAll]}>
                <ActivityIndicator size="large" color={COLORS.primary || '#000'} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <ScrollView contentContainerStyle={styles.scrollAuth}>
                <View style={styles.authContainer}>
                    <View style={styles.authHeader}>
                        <Ionicons name="lock-closed-outline" size={60} color={COLORS.black} />
                        <Text style={styles.authTitle}>
                            {isLoginView ? 'Connexion' : 'Créer un compte'}
                        </Text>
                        <Text style={styles.authSubtitle}>
                            Gérez vos commandes, favoris et vos adresses depuis un seul endroit.
                        </Text>
                    </View>

                    {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                    {/* CHAMP EMAIL (Commun) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Adresse e-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="nom@exemple.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* CHAMPS SPÉCIFIQUES INSCRIPTION */}
                    {!isLoginView && (
                        <>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>Prénom</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Jean"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Nom</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Dupont"
                                        value={lastName}
                                        onChangeText={setLastName}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Téléphone</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+221 77 123 45 67"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Adresse</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123 Rue de la Liberté"
                                    value={address}
                                    onChangeText={setAddress}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Ville</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Dakar"
                                    value={city}
                                    onChangeText={setCity}
                                />
                            </View>
                        </>
                    )}

                    {/* CHAMP MOT DE PASSE (Commun) */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.authBtn} onPress={handleAuth} disabled={authLoading}>
                        {authLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.authBtnText}>
                                {isLoginView ? 'Se connecter' : 'S\'inscrire'}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setIsLoginView(!isLoginView)} style={styles.toggleBtn}>
                        <Text style={styles.toggleBtnText}>
                            {isLoginView ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.orDividerContainer}>
                        <View style={styles.orDivider} />
                        <Text style={styles.orText}>OU</Text>
                        <View style={styles.orDivider} />
                    </View>

                    <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} disabled={authLoading}>
                        <Ionicons name="logo-google" size={20} color={COLORS.black} style={styles.googleIcon} />
                        <Text style={styles.googleBtnText}>Continuer avec Google</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    const renderMenuItem = (icon, title, onPress, value = null) => (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}>
            <View style={styles.menuItemLeft}>
                <Ionicons name={icon} size={24} color={COLORS.surface500 || '#6b7280'} />
                <Text style={styles.menuItemTitle}>{title}</Text>
            </View>
            <View style={styles.menuItemRight}>
                {value && <Text style={styles.menuItemValue}>{value}</Text>}
                <Ionicons name="chevron-forward" size={20} color={COLORS.surface300 || '#d1d5db'} />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Profile */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                </View>
                <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </View>

            {/* Menu List */}
            <View style={styles.menuSection}>
                {renderMenuItem("person-outline", "Mon profil", () => {})}
                {renderMenuItem("cube-outline", "Mes commandes", () => {})}
                {renderMenuItem("location-outline", "Mon adresse de livraison", () => {})}
                {renderMenuItem("document-text-outline", "Politiques légales", () => {})}
                {renderMenuItem("information-circle-outline", "Version de l'application", () => {}, "1.0.0")}
                
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={COLORS.accentRed || '#ef4444'} />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>

            {/* Popular Products Carousel */}
            {popularProducts.length > 0 && (
                <View style={styles.popularSection}>
                    <Text style={styles.popularTitle}>Produits Populaires 🔥</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={popularProducts}
                        keyExtractor={(item) => (item._id || item.id).toString()}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.popularCard}
                                onPress={() => navigation.navigate('Catégories', { screen: 'ProductDetail', params: { product: item } })}
                            >
                                <Image source={{ uri: getImageUrl(item.image) }} style={styles.popularImage} />
                                <View style={styles.popularInfo}>
                                    <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.popularPrice}>{item.price} FCFA</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface50 || '#f9fafb',
    },
    centerAll: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollAuth: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: COLORS.white,
    },
    authContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    authHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    authTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.black,
        marginTop: 16,
        marginBottom: 8,
    },
    authSubtitle: {
        fontSize: 14,
        color: COLORS.surface500 || '#6b7280',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    errorText: {
        color: COLORS.accentRed || '#ef4444',
        textAlign: 'center',
        marginBottom: 16,
        backgroundColor: null, // Removed background color
        padding: 10,
        borderRadius: 8,
        overflow: 'hidden',
        fontWeight: '500', // Added font weight
    },
    row: {
        flexDirection: 'row',
        width: '100%',
    },
    inputGroup: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: COLORS.black,
    },
    authBtn: {
        backgroundColor: COLORS.black,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    authBtnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    orDividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    orDivider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.surface200 || '#e5e7eb',
    },
    orText: {
        color: COLORS.surface400 || '#9ca3af',
        paddingHorizontal: 16,
        fontWeight: '600',
    },
    googleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.surface200 || '#e5e7eb',
    },
    googleIcon: {
        marginRight: 12,
    },
    googleBtnText: {
        color: COLORS.black,
        fontSize: 16,
        fontWeight: 'bold',
    },
    toggleBtn: {
        marginTop: 20,
        alignItems: 'center',
    },
    toggleBtnText: {
        color: COLORS.primary || '#2563EB',
        fontWeight: '600',
        fontSize: 14,
    },
    profileHeader: {
        backgroundColor: COLORS.white,
        alignItems: 'center',
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderColor: COLORS.surface200 || '#e5e7eb',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: COLORS.surface500 || '#6b7280',
    },
    menuSection: {
        backgroundColor: COLORS.white,
        marginTop: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.surface200 || '#e5e7eb',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.surface100 || '#f3f4f6',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemTitle: {
        fontSize: 16,
        color: COLORS.surface900 || '#111827',
        marginLeft: 16,
        fontWeight: '500',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuItemValue: {
        fontSize: 14,
        color: COLORS.surface400 || '#9ca3af',
        marginRight: 8,
    },
    logoutItem: {
        borderBottomWidth: 0,
    },
    logoutText: {
        fontSize: 16,
        color: COLORS.accentRed || '#ef4444',
        marginLeft: 16,
        fontWeight: '600',
        flex: 1,
    },
    popularSection: {
        marginTop: 24,
        marginBottom: 40,
    },
    popularTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginLeft: 20,
        marginBottom: 16,
    },
    popularCard: {
        width: 140,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginRight: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.surface200 || '#e5e7eb',
    },
    popularImage: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
    },
    popularInfo: {
        padding: 10,
    },
    popularName: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 4,
    },
    popularPrice: {
        fontSize: 12,
        color: COLORS.primary || '#2563EB',
        fontWeight: 'bold',
    }
});

export default ProfileScreen;
