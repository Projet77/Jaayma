import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import VendorDashboard from './pages/dashboard/VendorDashboard';
import ProductPage from './pages/ProductPage';
import FavoritesPage from './pages/FavoritesPage';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Composant utilitaire pour protéger les pages selon le rôle
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center">Vérification de l'accès...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Si l'utilisateur n'a pas le bon rôle, on le renvoie à l'accueil
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Anciens state conservés pour la logique métier (on retire 'currentView')
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Load products (public)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/products');
        if (!response.ok) throw new Error('Erreur de réseau ou serveur injoignable');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Load favorites (Private - si user connecté)
  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!user || !token) {
        setFavorites([]);
        return;
      }
      try {
        const response = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Erreur chargement favoris:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  // Wishlist Helpers
  const toggleFavorite = async (product) => {
    const token = localStorage.getItem('token');
    if (!user || !token) {
      alert("Veuillez vous connecter pour ajouter des favoris.");
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites/${product.id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.action === 'added') {
          setFavorites(prev => [...prev, product]);
        } else {
          setFavorites(prev => prev.filter(p => p.id !== product.id));
        }
      } else {
        console.error("Erreur serveur toggle favoris");
      }
    } catch (err) {
      console.error("Erreur réseau toggle favoris:", err);
    }
  };

  // Cart Helpers
  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumSignificantDigits: 9 }).format(price);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-black font-bold">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          Chargement de la boutique...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white text-red-500 font-bold">
        Erreur : {error}
      </div>
    );
  }

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="bg-background min-h-screen selection:bg-black selection:text-white">
      {!isDashboardRoute && (
        <Navbar
          cartCount={cartItemsCount}
          favoritesCount={favorites.length}
          onSearch={(query) => {
            setSearchKeyword(query);
            navigate('/shop');
          }}
        />
      )}

      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <LandingPage setSelectedProduct={setSelectedProduct} products={products} favorites={favorites} toggleFavorite={toggleFavorite} />
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/shop" element={
            <ShopPage
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
              products={products}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
            />
          } />

          <Route path="/product/:id" element={
            <ProductPage
              selectedProduct={selectedProduct} // Peut nécessiter une mise à jour pour fetcher via l'ID dans l'URL (prochaine étape)
              addToCart={addToCart}
              goBack={() => navigate('/shop')}
              setSelectedProduct={setSelectedProduct}
              products={products}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
            />
          } />

          <Route path="/cart" element={
            <CartPage
              cart={cart}
              cartItemsCount={cartItemsCount}
              cartTotal={cartTotal}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
              formatPrice={formatPrice}
              handleCheckout={(method) => alert(`Checkout flow coming soon! Paiement sélectionné : ${method}`)}
            />
          } />

          <Route path="/favorites" element={
            <ProtectedRoute>
              <FavoritesPage
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
              />
            </ProtectedRoute>
          } />

          {/* Dashboards - Protected Routes */}
          <Route path="/dashboard-super-admin" element={
            <ProtectedRoute allowedRoles={['super-admin']}>
              <SuperAdminDashboard products={products} />
            </ProtectedRoute>
          } />

          <Route path="/dashboard-admin" element={
            <ProtectedRoute allowedRoles={['admin', 'super-admin']}>
              <AdminDashboard products={products} />
            </ProtectedRoute>
          } />

          <Route path="/dashboard-vendor" element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <VendorDashboard products={products} />
            </ProtectedRoute>
          } />

          {/* Fallback 404 simple */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;