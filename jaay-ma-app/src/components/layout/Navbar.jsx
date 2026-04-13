import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, Menu, X, User, Bell, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount, favoritesCount = 0, onCartClick, onSearch, transparent = false }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effet Debounce pour la recherche
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products?search=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.slice(0, 5)); // On garde max 5 suggestions
                }
            } catch (error) {
                console.error("Erreur de recherche auto", error);
            } finally {
                setIsSearching(false);
            }
        }, 300); // Délai de 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, isNotificationsOpen]); // Rafraîchit quand on ouvre la cloche

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications(); // Met à jour l'UI
        } catch (e) { console.error(e); }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchNotifications();
            setIsNotificationsOpen(false);
        } catch (e) { console.error(e); }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Fermeture des menus au clic à l'extérieur
    const navRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setIsProfileOpen(false);
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>

            <motion.nav
                ref={navRef}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !transparent ? 'bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        {/* Logo */}
                        <Link to="/" className="text-2xl font-display font-bold tracking-tight">
                            Jaay<span className="text-primary">Ma</span>.
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <Link to="/shop" className="hover:text-primary transition-colors">Nouveautés</Link>
                            <Link to="/shop?category=hommes" className="hover:text-primary transition-colors">Hommes</Link>
                            <Link to="/shop?category=femmes" className="hover:text-primary transition-colors">Femmes</Link>
                            <Link to="/shop?category=technologie" className="hover:text-primary transition-colors">Technologie</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="p-2 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Notifications Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 hover:bg-black/5 rounded-full transition-colors relative"
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                                            <p className="text-sm font-bold text-neutral-900">Notifications</p>
                                            {unreadCount > 0 && (
                                                <span onClick={markAllAsRead} className="text-[10px] uppercase font-bold text-primary cursor-pointer hover:underline">
                                                    Tout marquer comme lu
                                                </span>
                                            )}
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-neutral-400 text-sm">
                                                    Aucune notification
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => !notif.isRead && markAsRead(notif.id)}
                                                        className={`px-4 py-3 hover:bg-neutral-50 border-b border-neutral-50 last:border-0 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                                    >
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className={`text-sm ${!notif.isRead ? 'font-bold text-black' : 'font-medium text-neutral-700'}`}>{notif.title}</p>
                                                            <span className="text-[10px] text-neutral-400">
                                                                {new Date(notif.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-neutral-500 line-clamp-2">{notif.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="border-t border-neutral-100 py-1 text-center">
                                            <button className="w-full px-4 py-2 text-xs font-bold text-neutral-500 hover:text-black">Voir tout l'historique</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 p-2 hover:bg-black/5 rounded-full transition-colors border border-transparent aria-expanded:border-neutral-200"
                                aria-expanded={isProfileOpen}
                            >
                                <User className="w-5 h-5" />
                                {user && <span className="text-sm font-bold text-neutral-800">{user.name?.split(' ')[0]}</span>}
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-100 py-2 overflow-hidden"
                                    >
                                        {user ? (
                                            <>
                                                <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                                                    <p className="text-sm font-bold text-neutral-900">{user.name}</p>
                                                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                                                </div>
                                                <div className="py-1">
                                                    {user.role === 'admin' && (
                                                        <button onClick={() => { setIsProfileOpen(false); navigate('/dashboard-admin'); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Tableau de Bord Admin</button>
                                                    )}
                                                    {user.role === 'vendor' && (
                                                        <button onClick={() => { setIsProfileOpen(false); navigate('/dashboard-vendor'); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Espace Vendeur</button>
                                                    )}
                                                    {user.role === 'super-admin' && (
                                                        <button onClick={() => { setIsProfileOpen(false); navigate('/dashboard-super-admin'); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Panel Super Admin</button>
                                                    )}
                                                    <button onClick={() => { setIsProfileOpen(false); navigate('/favorites'); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                                                        <span>Mes favoris</span>
                                                        {favoritesCount > 0 && <span className="bg-red-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">{favoritesCount}</span>}
                                                    </button>
                                                    <button onClick={() => { setIsProfileOpen(false); alert('Page en construction'); }} className="w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Paramètres</button>
                                                </div>
                                                <div className="border-t border-neutral-100 py-1">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-neutral-50"
                                                    >
                                                        Déconnexion
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/50">
                                                    <p className="text-sm font-bold text-neutral-900">Bienvenue !</p>
                                                    <p className="text-xs text-neutral-500 truncate">Connectez-vous à votre compte</p>
                                                </div>
                                                <div className="py-1">
                                                    <button
                                                        onClick={() => { setIsProfileOpen(false); navigate('/login'); }}
                                                        className="w-full text-left px-4 py-2 text-sm font-bold text-primary hover:bg-neutral-50"
                                                    >
                                                        Se connecter
                                                    </button>
                                                    <button
                                                        onClick={() => { setIsProfileOpen(false); navigate('/signup'); }}
                                                        className="w-full text-left px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                                                    >
                                                        S'inscrire
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Favorites Button */}
                        <button onClick={() => navigate('/favorites')} className="relative p-2 hover:bg-black/5 rounded-full transition-colors group">
                            <Heart className={`w-5 h-5 group-hover:scale-110 transition-transform ${favoritesCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
                            {favoritesCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {favoritesCount}
                                </span>
                            )}
                        </button>

                        {/* Cart Button */}
                        <button onClick={() => navigate('/cart')} className="relative p-2 hover:bg-black/5 rounded-full transition-colors group">
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col items-center pt-32 px-6"
                    >
                        <button
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute top-8 right-8 p-2 rounded-full hover:bg-neutral-100"
                        >
                            <X className="w-8 h-8 text-neutral-500" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="w-full max-w-3xl"
                        >
                            <div className="relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-8 h-8 text-neutral-300" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    className="w-full bg-transparent border-b-2 border-neutral-100 text-4xl md:text-5xl font-display font-medium py-6 pl-20 pr-6 outline-none placeholder:text-neutral-200 text-neutral-900 focus:border-primary transition-colors"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (onSearch) onSearch(searchQuery);
                                            setIsSearchOpen(false);
                                        }
                                    }}
                                />
                            </div>

                            <div className="mt-12">
                                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-6">
                                    {searchQuery ? (isSearching ? "Recherche en cours..." : "Correspondances") : "Suggestions"}
                                </p>
                                
                                {!searchQuery ? (
                                    <div className="flex flex-wrap gap-3">
                                        {['iPhone 15 Pro', 'AirPods Max', 'MacBook Air', 'PS5 Slim', 'Nike Dunk Low'].map(tag => (
                                            <button
                                                key={tag}
                                                onClick={() => {
                                                    setSearchQuery(tag);
                                                    if (onSearch) onSearch(tag);
                                                    setIsSearchOpen(false);
                                                }}
                                                className="px-6 py-3 rounded-full bg-neutral-50 hover:bg-neutral-100 text-neutral-600 font-medium transition-colors"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto pr-4">
                                        {suggestions.length > 0 ? suggestions.map(product => (
                                            <button
                                                key={product.id}
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    navigate(`/product/${product.id}`);
                                                }}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 transition-colors w-full text-left"
                                            >
                                                <div className="h-16 w-16 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-black text-lg">{product.name}</h4>
                                                    <p className="text-sm text-neutral-500 uppercase font-medium">{product.category}</p>
                                                </div>
                                                <div className="font-bold text-black whitespace-nowrap">
                                                    {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(product.price)}
                                                </div>
                                            </button>
                                        )) : !isSearching && (
                                            <p className="text-neutral-500">Aucune correspondance trouvée pour "{searchQuery}".</p>
                                        )}
                                        {suggestions.length > 0 && (
                                            <button 
                                                onClick={() => {
                                                    if (onSearch) onSearch(searchQuery);
                                                    setIsSearchOpen(false);
                                                }}
                                                className="mt-4 text-center text-sm font-bold text-primary hover:underline"
                                            >
                                                Voir tous les résultats pour "{searchQuery}"
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white z-[60] p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <span className="text-2xl font-bold">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-8 h-8" /></button>
                        </div>

                        <div className="flex flex-col gap-6 text-2xl font-medium">
                            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Nouveautés</Link>
                            <Link to="/shop?category=hommes" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Hommes</Link>
                            <Link to="/shop?category=femmes" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Femmes</Link>
                            <Link to="/shop?category=technologie" onClick={() => setIsMobileMenuOpen(false)} className="border-b border-gray-100 pb-4">Technologie</Link>
                            {user ? (
                                <>
                                    <button onClick={() => { setIsMobileMenuOpen(false); setIsProfileOpen(true); }} className="text-left font-bold py-2">Mon Compte</button>
                                    <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-left border-t border-gray-100 font-bold pt-4 text-red-500">Déconnexion</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="text-left font-bold text-primary">Connexion</button>
                                    <button onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }} className="text-left font-bold border-t border-gray-100 pt-4">Créer un compte</button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
