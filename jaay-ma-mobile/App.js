import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/constants/theme';
import { useFonts } from 'expo-font';
import { Outfit_500Medium, Outfit_900Black } from '@expo-google-fonts/outfit';
import { PlusJakartaSans_400Regular, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import WishlistScreen from './src/screens/WishlistScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

import { CartProvider, useCart } from './src/context/CartContext';
import { WishlistProvider, useWishlist } from './src/context/WishlistContext';
import { AuthProvider } from './src/context/AuthContext';

// Composants Globaux
import Header from './src/components/layout/Header';
import SplashScreenAnim from './src/screens/SplashScreenAnim';

const Stack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack pour la navigation des produits
const ProductsStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProductsList" component={ProductsScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
    );
};

const TabNavigatorComponent = () => {
    const { cartItems } = useCart();
    const { wishlistItems } = useWishlist();
    const cartCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 1), 0) || 0;
    const wishlistCount = wishlistItems?.length || 0;

    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    header: () => <Header title={route.name} />,
                    tabBarActiveTintColor: COLORS.black,
                    tabBarInactiveTintColor: COLORS.neutral400,
                    tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
                    tabBarStyle: { height: 86, paddingBottom: 5, paddingTop: 5 },
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === 'Accueil') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Catégories') {
                            iconName = focused ? 'grid' : 'grid-outline';
                        } else if (route.name === 'Panier') {
                            iconName = focused ? 'cart' : 'cart-outline';
                        } else if (route.name === 'Favoris') {
                            iconName = focused ? 'heart' : 'heart-outline';
                        } else if (route.name === 'Profil') {
                            iconName = focused ? 'person' : 'person-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Accueil" component={HomeScreen} />
                <Tab.Screen name="Catégories" component={ProductsStack} />
                <Tab.Screen 
                    name="Panier" 
                    component={CartScreen} 
                    options={{
                        tabBarBadge: cartCount > 0 ? cartCount : null,
                        tabBarBadgeStyle: { backgroundColor: '#ef4444', color: '#fff', fontSize: 10 }
                    }}
                />
                <Tab.Screen 
                    name="Favoris" 
                    component={WishlistScreen} 
                    options={{
                        tabBarBadge: wishlistCount > 0 ? wishlistCount : null,
                        tabBarBadgeStyle: { backgroundColor: '#ef4444', color: '#fff', fontSize: 10 }
                    }}
                />
                <Tab.Screen name="Profil" component={ProfileScreen} />
            </Tab.Navigator>
    );
};

const MainNavigation = () => {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                <RootStack.Screen name="MainTabs" component={TabNavigatorComponent} />
                <RootStack.Screen name="Notifications" component={NotificationsScreen} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default function App() {
    let [fontsLoaded] = useFonts({
        Outfit_500Medium,
        Outfit_900Black,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
    });

    const [isSplashVisible, setIsSplashVisible] = useState(true);

    if (!fontsLoaded) {
        return null;
    }

    if (isSplashVisible) {
        return <SplashScreenAnim onFinish={() => setIsSplashVisible(false)} />;
    }

    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <MainNavigation />
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
}
