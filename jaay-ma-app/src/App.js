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
import { motion, AnimatePresence } from 'framer-motion';
import logoUrl from './assets/logo.png';

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
  const [showSplash, setShowSplash] = useState(true);

  // Splash Screen timer minimal
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800); // Dure au moins 2.8s
    return () => clearTimeout(timer);
  }, []);

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
      {/* Splash Screen */}
      <AnimatePresence>
        {(loading || showSplash) && (
          <motion.div 
             key="splash"
             className="fixed inset-0 bg-neutral-900 flex flex-col items-center justify-center z-[100]"
             initial={{ opacity: 1 }}
             exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          >
            <motion.div
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
               className="flex flex-col items-center"
            >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"></div>
                  <motion.img 
                     src={logoUrl} 
                     alt="JaayMa Logo" 
                     className="relative w-36 h-36 object-contain drop-shadow-2xl mb-8"
                     animate={{ y: [0, -15, 0] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
                <motion.h1 
                   className="text-5xl font-display font-bold text-white tracking-tighter"
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Jaay<span className="text-primary">Ma</span>.
                </motion.h1>
                <motion.div 
                    className="mt-10 flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                    ))}
                </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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