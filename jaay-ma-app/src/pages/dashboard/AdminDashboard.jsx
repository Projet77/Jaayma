import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/core';
import { Package, ShoppingBag, AlertCircle, Plus, Search, Filter, Megaphone, Tag, ArrowRight, TrendingUp, Store, Users, Loader, X, Settings, CreditCard, Layout, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAssetUrl } from '../../utils/assetUtils';

const AdminDashboard = ({ products = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const setActiveTab = (tab) => setSearchParams({ tab });

    const [stats, setStats] = useState({ users: 0, products: 0, revenue: 0, pendingOrders: 0, recentOrders: [] });
    const [users, setUsers] = useState([]);
    const [allOrders, setAllOrders] = useState([]); // Ajout de l'état des commandes
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Modals Ajout et Edition Produit
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', brand: '', price: '', category: 'Mobile', description: '', image: '', images: [], inStock: true, stock: 10, reviews: 0, rating: 0
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Modal Utilisateur
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'client' });

    // Modals et États Promotions
    const [promos, setPromos] = useState([]);
    const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);
    const [newPromo, setNewPromo] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: '', expiresAt: '' });

    // Modal Booster Produit
    const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

    // Modal Bannières Pub
    const [banners, setBanners] = useState([]);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

    // Meta Pixel pour l'Admin
    const { user: authUser } = useAuth();
    const [metaPixelId, setMetaPixelId] = useState(authUser?.metaPixelId || '');
    const [isSavingPixel, setIsSavingPixel] = useState(false);

    const handleSavePixel = async () => {
        try {
            setIsSavingPixel(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users/${authUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ metaPixelId })
            });

            if (!res.ok) throw new Error("Erreur lors de l'enregistrement de l'ID Pixel");
            
            // On met à jour l'utilisateur dans le local storage pour reflet immédiat
            const updatedUser = await res.json();
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, metaPixelId: updatedUser.metaPixelId }));
            
            alert("✅ ID Pixel Meta configuré avec succès !");
            window.location.reload();
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSavingPixel(false);
        }
    };

    const uploadFileHandler = async (e, isEdit = false) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (files.length > 4) {
            alert("Vous ne pouvez sélectionner que 4 images au maximum.");
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        setUploadingImage(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/upload/multiple', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error("Erreur d'upload");

            const filePaths = await res.json();
            const imageUrls = filePaths.map(path => path);

            if (isEdit) {
                setEditingProduct({
                    ...editingProduct,
                    images: imageUrls,
                    image: imageUrls.length > 0 ? imageUrls[0] : ''
                });
            } else {
                setNewProduct({
                    ...newProduct,
                    images: imageUrls,
                    image: imageUrls.length > 0 ? imageUrls[0] : ''
                });
            }
        } catch (err) {
            alert("Erreur lors de l'upload des images");
            console.error(err);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newProduct)
            });
            if (!res.ok) throw new Error("Erreur lors de l'ajout du produit");
            alert("Produit ajouté avec succès !");
            setIsAddModalOpen(false);
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditProduct = async (e) => {
        // ... inchangé pour éviter les erreurs ...
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const { vendor, orderItems, favoritedBy, createdAt, updatedAt, ...productData } = editingProduct;

            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(productData)
            });
            if (!res.ok) throw new Error("Erreur lors de la modification du produit");
            alert("Produit modifié avec succès !");
            setIsEditModalOpen(false);
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erreur lors de la création de l'utilisateur");
            }

            alert("Utilisateur créé avec succès !");
            setIsAddUserModalOpen(false);
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users/${editingUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(editingUser)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erreur lors de la mise à jour");
            }

            alert("Utilisateur mis à jour !");
            setIsEditUserModalOpen(false);
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Erreur lors de la suppression");

            alert("Utilisateur supprimé !");
            window.location.reload();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAddPromo = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/promos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(newPromo)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erreur lors de la création de la promotion");
            }

            alert("Code promo créé avec succès !");
            setIsAddPromoModalOpen(false);
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePromo = async (promoId) => {
        if (!window.confirm("Changer le statut de ce code promo ?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/promos/${promoId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Erreur");
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    const handleDeletePromo = async (promoId) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce code promo ?")) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/admin/promos/${promoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Erreur");
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    const handleToggleBoost = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/${productId}/feature`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Erreur de modification du boost");
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    const handleAddBanner = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const token = localStorage.getItem('token');
            const uploadRes = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!uploadRes.ok) throw new Error("Erreur upload");
            const uploadData = await uploadRes.json();

            const res = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/banners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ imageUrl: uploadData.imageUrl })
            });
            if (!res.ok) throw new Error("Erreur création bannière");
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    const handleToggleBanner = async (bannerId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/banners/${bannerId}/toggle`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    const handleDeleteBanner = async (bannerId) => {
        if (!window.confirm("Supprimer cette bannière ?")) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/banners/${bannerId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            window.location.reload();
        } catch (err) { alert(err.message); }
    };

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Non authentifié");

                const resStats = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resUsers = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resOrders = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resPromos = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/promos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const resBanners = await fetch((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/banners?all=true', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!resStats.ok || !resUsers.ok) throw new Error("Erreur de récupération des données administrateur");

                const statsData = await resStats.json();
                const usersData = await resUsers.json();

                if (resPromos.ok) {
                    const promosData = await resPromos.json();
                    setPromos(promosData);
                }
                if (resBanners.ok) {
                    const bannersData = await resBanners.json();
                    setBanners(bannersData);
                }

                if (resOrders.ok) {
                    const ordersData = await resOrders.json();
                    setAllOrders(ordersData);
                }

                setStats(statsData);
                setUsers(usersData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    const renderOverview = () => {
        if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-neutral-400" /></div>;
        if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;

        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Banner */}
                    <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-display font-bold mb-2">Bonjour, Admin 👋</h2>
                            <p className="text-neutral-400 mb-6">Vous avez {stats.pendingOrders} nouvelles commandes à traiter aujourd'hui.</p>
                            <button onClick={() => setActiveTab('orders')} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">Gérer les commandes</button>
                        </div>
                        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    </div>

                    {/* Pending Orders */}
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg">Commandes en attente</h3>
                            <button onClick={() => setActiveTab('orders')} className="text-sm text-primary font-bold">Tout voir</button>
                        </div>
                        <div className="space-y-4">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-neutral-500 text-sm">Aucune commande en attente.</p>
                            ) : (
                                stats.recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-xs font-bold text-neutral-600">
                                                {order.id.slice(-4)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm line-clamp-1">{order.orderItems?.[0]?.product?.name || `Commande de ${order.user?.name}`}</p>
                                                <p className="text-xs text-neutral-500">{order.user?.name} • {(order.totalPrice || 0).toLocaleString()} FCFA</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${order.status === 'Livrée' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    <Card className="p-6 bg-blue-50 border-0">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-blue-900 mb-1">{stats.products}</h3>
                        <p className="text-blue-700 font-medium text-sm">Produits en stock</p>
                    </Card>

                    <Card className="p-6 bg-green-50 border-0">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-green-900 mb-1">{stats.users}</h3>
                        <p className="text-green-700 font-medium text-sm">Utilisateurs inscrits</p>
                    </Card>

                    <Card className="p-6 bg-purple-50 border-0">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-purple-900 mb-1">{(stats.revenue || 0).toLocaleString()} <span className="text-xs">FCFA</span></h3>
                        <p className="text-purple-700 font-medium text-sm">Chiffre d'affaires Global</p>
                    </Card>
                </div>
            </div>
        );
    };

    const [productFilter, setProductFilter] = useState('all');

    const getFilteredProducts = () => {
        switch (productFilter) {
            case 'in_cart':
                return [...products].sort((a, b) => b.in_cart - a.in_cart);
            case 'validated':
                return products.filter(p => p.status === 'active');
            case 'featured':
                return products.filter(p => p.is_featured);
            case 'best_sellers':
                return [...products].sort((a, b) => b.sales - a.sales);
            case 'most_viewed':
                return [...products].sort((a, b) => b.views - a.views);
            default:
                return products;
        }
    };

    const renderProducts = () => {
        const filteredProducts = getFilteredProducts();

        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-xl font-bold text-neutral-800">Gestion des Produits</h2>
                        <div className="flex gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20">
                                <Plus className="w-4 h-4" />
                                Ajouter un produit
                            </button>
                        </div>
                    </div>

                    {/* Product Stats / Filters */}
                    <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                        {[
                            { id: 'all', label: 'Tous les produits', icon: Package },
                            { id: 'in_cart', label: 'En Panier (Live)', icon: ShoppingBag },
                            { id: 'validated', label: 'Validés', icon: AlertCircle },
                            { id: 'featured', label: 'Vedettes', icon: Package },
                            { id: 'best_sellers', label: 'Top Ventes', icon: ShoppingBag },
                            { id: 'most_viewed', label: 'Plus visités', icon: Search },
                        ].map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setProductFilter(filter.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${productFilter === filter.id
                                    ? 'bg-black text-white shadow-md'
                                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                                    }`}
                            >
                                <filter.icon className="w-4 h-4" />
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Produit</th>
                                    <th className="px-6 py-4 font-semibold">Vendeur</th>
                                    <th className="px-6 py-4 font-semibold">Stats Clés</th>
                                    <th className="px-6 py-4 font-semibold">Prix</th>
                                    <th className="px-6 py-4 font-semibold">Stock</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden relative">
                                                    <img src={getAssetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                                    {product.isFeatured && (
                                                        <div className="absolute top-0 right-0 bg-yellow-400 w-3 h-3 rounded-bl-lg"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-neutral-900 flex items-center gap-1">
                                                        {product.name}
                                                        {product.isFeatured && <span title="Produit Mis en Avant" className="text-yellow-500">⭐</span>}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">{typeof product.category === 'string' ? product.category : 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600 uppercase">
                                                    {(product.vendorName || "V").charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-neutral-700 line-clamp-1">{product.vendorName || "Non Spécifié"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                <div className="flex items-center gap-1 text-blue-600 font-medium">
                                                    <Search className="w-3 h-3" /> {product.reviews || 0} avis
                                                </div>
                                                <div className="flex items-center gap-1 text-green-600 font-medium">
                                                    <Tag className="w-3 h-3" /> {(product.sales || 0).toLocaleString()} ventes
                                                </div>
                                                <div className="flex items-center gap-1 text-purple-600 font-medium">
                                                    <Package className="w-3 h-3" /> {product.in_cart || 0} paniers
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{(product.price || 0).toLocaleString()} FCFA</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${!product.inStock || product.stock === 0 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${!product.inStock || product.stock === 0 ? 0 : Math.min(product.stock * 2, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-bold ${!product.inStock || product.stock === 0 ? 'text-red-600' : 'text-neutral-500'}`}>
                                                    {product.inStock ? product.stock : "0"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.inStock
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                {product.inStock ? 'En Stock' : 'Rupture'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => { setEditingProduct(product); setIsEditModalOpen(true); }} className="text-sm font-bold text-neutral-600 hover:text-black transition-colors">Éditer</button>
                                                <button onClick={async () => {
                                                    if (window.confirm('Voulez-vous vraiment supprimer ce produit ?')) {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/${product.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
                                                            if (!res.ok) throw new Error('Erreur de suppression');
                                                            window.location.reload();
                                                        } catch (e) { alert(e.message); }
                                                    }
                                                }} className="text-sm font-bold text-neutral-400 hover:text-neutral-800 transition-colors">Supprimer</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center text-neutral-400">
                            Aucun produit trouvé dans cette catégorie.
                        </div>
                    )}
                </Card>
            </div>
        );
    };

    const renderMarketing = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Create Promotion Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                            <Tag className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Créer une Promo</h3>
                        <p className="text-purple-100 mb-8 max-w-sm">
                            Configurez des réductions, codes promo ou offres spéciales pour booster vos ventes.
                        </p>
                        <button onClick={() => setIsAddPromoModalOpen(true)} className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-100 transition-colors cursor-pointer">
                            <Plus className="w-4 h-4" />
                            Nouvelle Campagne
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mb-16"></div>
                </div>

                {/* Boost Product Card */}
                <div className="bg-black rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
                            <Megaphone className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Booster un Produit</h3>
                        <p className="text-neutral-400 mb-8 max-w-sm">
                            Mettez vos produits en avant sur la page d'accueil et les têtes de catégories avec une étoile.
                        </p>
                        <button onClick={() => setIsBoostModalOpen(true)} className="bg-neutral-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-neutral-700 transition-colors cursor-pointer">
                            <ArrowRight className="w-4 h-4" />
                            Gérer les mises en avant
                        </button>
                    </div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mb-16"></div>
                </div>
            </div>

            {/* Pixel Meta Configuration */}
            <Card className="p-6 border border-neutral-100 bg-blue-50/30">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">Pixel Meta (Facebook Ads)</h3>
                        <p className="text-neutral-500 text-sm mb-4">
                            Connectez votre Pixel Facebook pour analyser le trafic de votre plateforme et optimiser vos campagnes publicitaires (Événements envoyés : "PageView" et "AddToCart" complets).
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                placeholder="Entrez l'ID du Pixel (Ex: 1234567890123)"
                                value={metaPixelId}
                                onChange={(e) => setMetaPixelId(e.target.value)}
                                className="flex-1 px-4 py-2 bg-white border border-neutral-200 rounded-xl focus:border-blue-600 outline-none"
                            />
                            <button 
                                onClick={handleSavePixel}
                                disabled={isSavingPixel}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isSavingPixel ? 'Enregistrement...' : 'Enregistrer le Pixel'}
                            </button>
                        </div>
                        {metaPixelId && (
                            <p className="mt-2 text-xs font-medium text-green-600 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Le Pixel Meta est actuellement actif sur la plateforme.
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Active Campaigns */}
            <Card className="p-6 border border-neutral-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Codes Promo & Campagnes</h3>
                    <button onClick={() => window.location.reload()} className="text-sm text-neutral-500 hover:text-black">Rafraîchir</button>
                </div>
                <div className="space-y-4">
                    {promos.length === 0 ? (
                        <p className="text-neutral-500 text-sm text-center py-4">Aucune promotion existante.</p>
                    ) : (
                        promos.map((promo) => (
                            <div key={promo.id} className={`flex items-center justify-between p-4 rounded-xl border ${promo.isActive ? 'border-green-100 bg-green-50/30' : 'border-neutral-100 bg-neutral-50'} transition-colors`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${promo.isActive ? 'bg-green-100 text-green-600' : 'bg-neutral-200 text-neutral-500'}`}>
                                        <Tag className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-neutral-900">{promo.code}</p>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-200 text-neutral-600'}`}>
                                                {promo.isActive ? 'Actif' : 'Inactif'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            {promo.discountType === 'PERCENTAGE' ? `Réduction de ${promo.discountValue}%` : `Réduction de ${promo.discountValue} FCFA`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs font-bold text-neutral-900">
                                            Expire le :
                                        </p>
                                        <p className="text-xs text-neutral-500">
                                            {promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'Jamais'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleTogglePromo(promo.id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${promo.isActive ? 'border-orange-200 text-orange-600 hover:bg-orange-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}>
                                            {promo.isActive ? 'Désactiver' : 'Activer'}
                                        </button>
                                        <button onClick={() => handleDeletePromo(promo.id)} className="text-xs font-bold text-red-600 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Bannières Publicitaires */}
            <Card className="p-6 border border-neutral-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Bannières Page d'Accueil</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={() => window.location.reload()} className="text-sm text-neutral-500 hover:text-black">Rafraîchir</button>
                        <button onClick={() => setIsBannerModalOpen(true)} className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors">
                            <Plus className="w-4 h-4" /> Ajouter une Bannière
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {banners.length === 0 ? (
                        <p className="text-neutral-500 text-sm text-center py-4 col-span-2">Aucune bannière active.</p>
                    ) : (
                        banners.map(banner => (
                            <div key={banner.id} className={`relative rounded-xl overflow-hidden border ${banner.isActive ? 'border-primary' : 'border-neutral-200'} group`}>
                                <img src={banner.imageUrl} alt="Banner" className={`w-full h-40 object-cover ${!banner.isActive && 'grayscale opacity-50'}`} />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button onClick={() => handleToggleBanner(banner.id)} className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                                        {banner.isActive ? 'Désactiver' : 'Activer'}
                                    </button>
                                    <button onClick={() => handleDeleteBanner(banner.id)} className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                                        Supprimer
                                    </button>
                                </div>
                                <div className="absolute top-2 left-2 flex gap-2">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-lg ${banner.isActive ? 'bg-green-500 text-white' : 'bg-neutral-500 text-white'}`}>
                                        {banner.isActive ? 'Active' : 'Désactivée'}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );

    const renderUsers = () => {
        return (
            <div className="space-y-6">
                {/* Users Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Total Utilisateurs</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{users.length}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Vendeurs</p>
                                <h3 className="text-2xl font-bold text-neutral-900">
                                    {users.filter(u => u.role === 'vendor').length}
                                </h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Admins</p>
                                <h3 className="text-2xl font-bold text-neutral-900">
                                    {users.filter(u => u.role === 'admin' || u.role === 'superadmin').length}
                                </h3>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-neutral-50/50 gap-4">
                        <h3 className="font-bold text-lg">Liste des Utilisateurs</h3>
                        <div className="flex gap-4 items-center">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un utilisateur..."
                                    className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors w-64"
                                />
                            </div>
                            <button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-neutral-800 transition-colors">
                                <Plus className="w-4 h-4" />
                                Ajouter
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Utilisateur</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Rôle</th>
                                    <th className="px-6 py-4 font-semibold">Création</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${user.role === 'admin' ? 'bg-red-500' :
                                                    user.role === 'vendor' ? 'bg-purple-500' :
                                                        'bg-black'
                                                    }`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-neutral-900">{user.name}</p>
                                                    <p className="text-xs text-neutral-500">ID: {user.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin' || user.role === 'superadmin' ? 'bg-red-50 text-red-700 border-red-200' :
                                                user.role === 'vendor' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                    'bg-blue-50 text-blue-700 border-blue-200'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-xs font-bold text-neutral-600 border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                                                >
                                                    Détails
                                                </button>
                                                <button
                                                    onClick={() => { setEditingUser(user); setIsEditUserModalOpen(true); }}
                                                    className="text-xs font-bold text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-xs font-bold text-red-600 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        );
    };

    const renderOrders = () => {
        // Utilisation des vraies commandes de la BDD
        const orders = allOrders;

        // Calcul dynamique des statistiques
        const pendingCount = orders.filter(o => o.status === 'En attente').length;
        const shippedCount = orders.filter(o => o.status === 'Expédiée').length;
        const deliveredCount = orders.filter(o => o.status === 'Livrée').length;
        const cancelledCount = orders.filter(o => o.status === 'Annulée').length;

        return (
            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 border border-neutral-100">
                        <p className="text-xs text-neutral-500 font-bold uppercase">En attente</p>
                        <h3 className="text-2xl font-bold text-yellow-600 mt-1">{pendingCount}</h3>
                    </Card>
                    <Card className="p-4 border border-neutral-100">
                        <p className="text-xs text-neutral-500 font-bold uppercase">A expédier</p>
                        <h3 className="text-2xl font-bold text-blue-600 mt-1">{shippedCount}</h3>
                    </Card>
                    <Card className="p-4 border border-neutral-100">
                        <p className="text-xs text-neutral-500 font-bold uppercase">Livrées (Total)</p>
                        <h3 className="text-2xl font-bold text-green-600 mt-1">{deliveredCount}</h3>
                    </Card>
                    <Card className="p-4 border border-neutral-100">
                        <p className="text-xs text-neutral-500 font-bold uppercase">Annulées/Retournées</p>
                        <h3 className="text-2xl font-bold text-red-600 mt-1">{cancelledCount}</h3>
                    </Card>
                </div>

                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-50/50">
                        <h3 className="font-bold text-lg">Gestion des Commandes</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher commande, client..."
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                            <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-neutral-50">
                                <Filter className="w-4 h-4" />
                                Filtrer
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Commande</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Client</th>
                                    <th className="px-6 py-4 font-semibold">Paiement</th>
                                    <th className="px-6 py-4 font-semibold">Total</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-sm text-neutral-900 line-clamp-1">{order.id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold uppercase">
                                                    {(order.user?.name || 'C').charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium line-clamp-1">{order.user?.name || 'Client'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">
                                            Standard
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm text-neutral-900">
                                            {(order.totalPrice || 0).toLocaleString()} FCFA
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Confirmée' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                order.status === 'Livrée' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    order.status === 'Expédiée' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                        order.status === 'Annulée' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-black border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-medium hover:bg-neutral-50 disabled:opacity-50">Précédent</button>
                            <button className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-medium hover:bg-neutral-50">Suivant</button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    const isSuperAdmin = authUser?.role === 'super-admin';

    // --- Render Vendors (Super Admin only) ---
    const renderVendors = () => {
        const vendors = users.filter(u => u.role === 'vendor');
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Store className="w-6 h-6" /></div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Total Vendeurs</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{vendors.length}</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Chiffre d'affaires</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{(stats.revenue || 0).toLocaleString()} FCFA</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Package className="w-6 h-6" /></div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Total Produits</p>
                                <h3 className="text-2xl font-bold text-neutral-900">{stats.products || 0}</h3>
                            </div>
                        </div>
                    </Card>
                </div>
                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                        <h3 className="font-bold text-lg">Liste des Vendeurs</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Vendeur</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Pixel Meta</th>
                                    <th className="px-6 py-4 font-semibold">Inscrit le</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {vendors.length === 0 ? (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-neutral-400">Aucun vendeur trouvé.</td></tr>
                                ) : vendors.map(vendor => (
                                    <tr key={vendor.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">{vendor.name?.charAt(0).toUpperCase()}</div>
                                                <span className="font-bold text-sm">{vendor.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">{vendor.email}</td>
                                        <td className="px-6 py-4">
                                            {vendor.metaPixelId
                                                ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">✅ Configuré</span>
                                                : <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">Non configuré</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">{vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        );
    };

    // --- Render Admins list (Super Admin only) ---
    const renderAdmins = () => {
        const admins = users.filter(u => u.role === 'admin' || u.role === 'super-admin');
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Administrateurs de la plateforme</h2>
                    <button onClick={() => setIsAddUserModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-neutral-800">
                        <Plus className="w-4 h-4" /> Ajouter un Admin
                    </button>
                </div>
                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Administrateur</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Rôle</th>
                                    <th className="px-6 py-4 font-semibold">Inscrit le</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {admins.length === 0 ? (
                                    <tr><td colSpan="5" className="px-6 py-12 text-center text-neutral-400">Aucun administrateur trouvé.</td></tr>
                                ) : admins.map(admin => (
                                    <tr key={admin.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">{admin.name?.charAt(0).toUpperCase()}</div>
                                                <span className="font-bold text-sm">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">{admin.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                admin.role === 'super-admin' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>{admin.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => { setEditingUser(admin); setIsEditUserModalOpen(true); }} className="text-xs font-bold text-blue-600 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-50">Modifier</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        );
    };

    // --- Render Settings (Super Admin only) ---
    const renderSettings = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold text-neutral-800">Paramètres de la Plateforme</h2>
            <Card className="p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neutral-100 rounded-lg"><Settings className="w-5 h-5 text-neutral-700" /></div>
                    <h3 className="font-bold text-lg">Configuration Générale</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">Nom de la Plateforme</label>
                        <input type="text" defaultValue="Jaay-Ma" className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">Email de Support</label>
                        <input type="email" defaultValue="support@jaay-ma.sn" className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">Téléphone de Support</label>
                        <input type="tel" defaultValue="+221 77 000 00 00" className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-neutral-700">Devise par défaut</label>
                        <select className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black">
                            <option>FCFA (XOF)</option>
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                        </select>
                    </div>
                </div>
            </Card>
            <Card className="p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg"><CreditCard className="w-5 h-5 text-purple-700" /></div>
                    <h3 className="font-bold text-lg">Méthodes de Paiement</h3>
                </div>
                <div className="space-y-4">
                    {[
                        { name: "Orange Money", status: true, icon: "🟠" },
                        { name: "Wave", status: true, icon: "🔵" },
                        { name: "Paiement à la livraison", status: true, icon: "💵" },
                        { name: "Carte Bancaire (Stripe)", status: false, icon: "💳" }
                    ].map((method, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-neutral-100 rounded-xl">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{method.icon}</span>
                                <span className="font-bold text-neutral-900">{method.name}</span>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative ${method.status ? 'bg-green-500' : 'bg-neutral-200'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm ${method.status ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    // --- Render CMS (Super Admin only) ---
    const renderCMS = () => (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-neutral-800">Gestion du Contenu (CMS)</h2>
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
                <p className="text-amber-800 font-medium text-sm">⚠️ Cette section est en cours de développement. Les modifications ici ne sont pas encore sauvegardées en base de données.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 border border-neutral-100 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-neutral-100 rounded-lg"><Layout className="w-5 h-5 text-neutral-700" /></div>
                        <h3 className="font-bold text-lg">Navigation</h3>
                    </div>
                    <div className="space-y-2">
                        {['Accueil', 'Boutique', 'Mobile', 'Mode', 'Électronique'].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-100 group">
                                <span className="text-sm font-medium">{item}</span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-xs text-neutral-500 hover:text-black">Éditer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-6 border border-neutral-100 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg"><Image className="w-5 h-5 text-blue-700" /></div>
                        <div>
                            <h3 className="font-bold text-lg">Éditeur de Pages</h3>
                            <p className="text-xs text-neutral-500">Modifiez le texte des pages principales</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Grand Titre (Hero)</label>
                            <input type="text" defaultValue="Le Futur du E-commerce au Sénégal" className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Sous-titre</label>
                            <textarea rows="2" defaultValue="Découvrez la marketplace la plus avancée du Sénégal." className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm"></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-neutral-800">Sauvegarder (bientôt disponible)</button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    return (
        <DashboardLayout role={isSuperAdmin ? 'super-admin' : 'admin'} activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'marketing' && renderMarketing()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'orders' && renderOrders()}
            {/* Super Admin only tabs */}
            {isSuperAdmin && activeTab === 'vendors' && renderVendors()}
            {isSuperAdmin && activeTab === 'admins' && renderAdmins()}
            {isSuperAdmin && activeTab === 'settings' && renderSettings()}
            {isSuperAdmin && activeTab === 'cms' && renderCMS()}

            {/* Modal Ajout Produit */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Ajouter un nouveau produit</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-500 hover:text-black font-bold">✕</button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Nom du produit *</label>
                                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Marque *</label>
                                    <input required type="text" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Catégorie *</label>
                                    <select required value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl">
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptop">Ordinateurs</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Mode">Mode</option>
                                        <option value="Maison">Maison</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Prix (FCFA) *</label>
                                    <input required type="number" min="0" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Images du produit (Max 4) *</label>
                                <input required={!newProduct.images || newProduct.images.length === 0} type="file" multiple accept="image/*" onChange={(e) => uploadFileHandler(e, false)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl bg-white" />
                                {uploadingImage && <p className="text-xs text-neutral-500 font-medium">Chargement des images...</p>}
                                {newProduct.images && newProduct.images.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {newProduct.images.map((img, idx) => (
                                            <img key={idx} src={getAssetUrl(img)} alt={`Aperçu ${idx + 1}`} className="h-20 w-20 object-cover rounded-lg border border-neutral-200" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description *</label>
                                <textarea required rows="3" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Avis</label>
                                    <input type="number" min="0" value={newProduct.reviews} onChange={e => setNewProduct({ ...newProduct, reviews: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Note moyenne</label>
                                    <input type="number" min="0" max="5" step="0.1" value={newProduct.rating} onChange={e => setNewProduct({ ...newProduct, rating: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="inStockAdd" checked={newProduct.inStock} onChange={e => setNewProduct({ ...newProduct, inStock: e.target.checked })} />
                                    <label htmlFor="inStockAdd" className="text-sm font-bold">Produit en stock</label>
                                </div>
                                {newProduct.inStock && (
                                    <div className="flex items-center gap-2 ml-4">
                                        <label className="text-sm font-bold">Quantité disponible :</label>
                                        <input type="number" min="1" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} className="w-24 px-3 py-1 border border-neutral-200 rounded-lg text-sm" />
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-neutral-100 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-xl font-bold bg-neutral-100 text-neutral-700">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl font-bold bg-black text-white hover:bg-neutral-800 disabled:opacity-50">
                                    {isSubmitting ? 'Publication...' : 'Publier le produit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edition Produit */}
            {isEditModalOpen && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Modifier le produit</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-500 hover:text-black font-bold">✕</button>
                        </div>
                        <form onSubmit={handleEditProduct} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Nom du produit *</label>
                                    <input required type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Marque *</label>
                                    <input required type="text" value={editingProduct.brand || ''} onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Catégorie *</label>
                                    <select required value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl">
                                        <option value="Mobile">Mobile</option>
                                        <option value="Laptop">Ordinateurs</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Mode">Mode</option>
                                        <option value="Maison">Maison</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Prix (FCFA) *</label>
                                    <input required type="number" min="0" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Images du produit (Max 4)</label>
                                <input type="file" multiple accept="image/*" onChange={(e) => uploadFileHandler(e, true)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl bg-white" />
                                {uploadingImage && <p className="text-xs text-neutral-500 font-medium">Chargement des images...</p>}
                                {editingProduct.images && editingProduct.images.length > 0 ? (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {editingProduct.images.map((img, idx) => (
                                            <img key={idx} src={getAssetUrl(img)} alt={`Aperçu ${idx + 1}`} className="h-20 w-20 object-cover rounded-lg border border-neutral-200" />
                                        ))}
                                    </div>
                                ) : editingProduct.image && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        <img src={getAssetUrl(editingProduct.image)} alt="Aperçu" className="h-20 w-20 object-cover rounded-lg border border-neutral-200" />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description *</label>
                                <textarea required rows="3" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl"></textarea>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Avis</label>
                                    <input type="number" min="0" value={editingProduct.reviews} onChange={e => setEditingProduct({ ...editingProduct, reviews: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Note moyenne</label>
                                    <input type="number" min="0" max="5" step="0.1" value={editingProduct.rating} onChange={e => setEditingProduct({ ...editingProduct, rating: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="inStock" checked={editingProduct.inStock} onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} />
                                    <label htmlFor="inStock" className="text-sm font-bold">Produit en stock</label>
                                </div>
                                {editingProduct.inStock && (
                                    <div className="flex items-center gap-2 ml-4">
                                        <label className="text-sm font-bold">Quantité disponible :</label>
                                        <input type="number" min="1" value={editingProduct.stock || 0} onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })} className="w-24 px-3 py-1 border border-neutral-200 rounded-lg text-sm" />
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-neutral-100 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 rounded-xl font-bold bg-neutral-100 text-neutral-700">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl font-bold bg-black text-white hover:bg-neutral-800 disabled:opacity-50">
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Modal de Détails de l'Utilisateur */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl">
                        <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-6">Détails du compte</h3>
                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm text-neutral-500 font-medium mb-1">Nom Complet</p>
                                    <p className="font-bold text-lg text-neutral-900">{selectedUser.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-medium mb-1">Adresse Email</p>
                                    <p className="font-medium text-neutral-900">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-medium mb-1">Rôle Système</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${selectedUser.role === 'admin' || selectedUser.role === 'superadmin' ? 'bg-red-50 text-red-700 border-red-200' : selectedUser.role === 'vendor' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                        {selectedUser.role.toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-medium mb-1">Identifiant Unique (ID)</p>
                                    <p className="font-medium text-xs font-mono bg-neutral-50 p-3 rounded-lg border border-neutral-100 break-all text-neutral-600">{selectedUser.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-neutral-500 font-medium mb-1">Date d'inscription</p>
                                    <p className="font-medium text-sm text-neutral-900">
                                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-neutral-100 bg-neutral-50/50 flex justify-end">
                            <button onClick={() => setSelectedUser(null)} className="px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm">
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'Edition d'Utilisateur */}
            {isEditUserModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl p-6">
                        <button onClick={() => setIsEditUserModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                        <h3 className="text-xl font-bold mb-6">Modifier l'Utilisateur</h3>

                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Nom complet *</label>
                                <input required type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Email *</label>
                                <input required type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Rôle *</label>
                                <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none bg-white">
                                    <option value="client">Client</option>
                                    <option value="vendor">Vendeur</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>

                            <div className="pt-6 border-t border-neutral-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsEditUserModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-bold bg-black text-white hover:bg-neutral-800 disabled:opacity-50 shadow-sm transition-colors">
                                    {isSubmitting ? 'Mise à jour...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal d'Ajout d'Utilisateur */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl p-6">
                        <button onClick={() => setIsAddUserModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                        <h3 className="text-xl font-bold mb-6">Ajouter un Utilisateur</h3>

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Nom complet *</label>
                                <input required type="text" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none" placeholder="Ex: Jean Dupont" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Email *</label>
                                <input required type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none" placeholder="jean@exemple.com" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Mot de passe temporaire *</label>
                                <input required type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none" placeholder="********" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Rôle *</label>
                                <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-black outline-none bg-white">
                                    <option value="client">Client</option>
                                    <option value="vendor">Vendeur</option>
                                    <option value="admin">Administrateur</option>
                                </select>
                            </div>

                            <div className="pt-6 border-t border-neutral-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-bold bg-black text-white hover:bg-neutral-800 disabled:opacity-50 shadow-sm transition-colors">
                                    {isSubmitting ? 'Création...' : 'Créer le compte'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de création de Promo */}
            {isAddPromoModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl p-6">
                        <button onClick={() => setIsAddPromoModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                                <Tag className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold">Nouveau Code Promo</h3>
                        </div>

                        <form onSubmit={handleAddPromo} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Code (Visible par les clients) *</label>
                                <input required type="text" value={newPromo.code} onChange={e => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-purple-600 outline-none uppercase font-mono tracking-wider" placeholder="Ex: SUMMER20" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-neutral-700">Type de remise *</label>
                                    <select value={newPromo.discountType} onChange={e => setNewPromo({ ...newPromo, discountType: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-purple-600 outline-none bg-white">
                                        <option value="PERCENTAGE">Pourcentage (%)</option>
                                        <option value="FIXED">Montant Fixe (FCFA)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-neutral-700">Valeur *</label>
                                    <input required type="number" min="1" max={newPromo.discountType === 'PERCENTAGE' ? "100" : undefined} value={newPromo.discountValue} onChange={e => setNewPromo({ ...newPromo, discountValue: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-purple-600 outline-none" placeholder={newPromo.discountType === 'PERCENTAGE' ? "Ex: 20" : "Ex: 5000"} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-neutral-700">Date d'expiration (Optionnel)</label>
                                <input type="datetime-local" value={newPromo.expiresAt} onChange={e => setNewPromo({ ...newPromo, expiresAt: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:border-purple-600 outline-none" />
                            </div>

                            <div className="pt-6 border-t border-neutral-100 flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAddPromoModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 shadow-sm transition-colors">
                                    {isSubmitting ? 'Création...' : 'Créer le code'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Mise en Avant (Boost) de Produits */}
            {isBoostModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                                    <Megaphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Produits mis en avant</h3>
                                    <p className="text-sm text-neutral-500">Sélectionnez les produits à afficher en tête de page.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsBoostModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {products.length === 0 ? (
                                <p className="text-center text-neutral-500 py-8">Aucun produit disponible.</p>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {products.map((product) => (
                                        <div key={product.id} className={`flex items-center justify-between p-3 rounded-xl border ${product.isFeatured ? 'border-yellow-200 bg-yellow-50' : 'border-neutral-100'} transition-colors`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                                                    {product.image ? (
                                                        <img src={getAssetUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                            <Package className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-neutral-500">{product.brand}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleToggleBoost(product.id)}
                                                className={`px-4 py-2 shrink-0 rounded-lg font-bold text-xs transition-colors ${product.isFeatured
                                                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                    }`}
                                            >
                                                {product.isFeatured ? 'Retirer ⭐' : 'Mettre en avant'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Upload Bannière */}
            {isBannerModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl p-6">
                        <button onClick={() => setIsBannerModalOpen(false)} className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                        <h3 className="text-xl font-bold mb-6">Ajouter une Bannière</h3>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center bg-neutral-50">
                                <label className="cursor-pointer flex flex-col items-center justify-center">
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        if (e.target.files.length > 0) handleAddBanner(e.target.files[0]);
                                    }} />
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <Plus className="w-6 h-6 text-neutral-400" />
                                    </div>
                                    <p className="font-bold text-sm text-neutral-700">Cliquez pour uploader</p>
                                    <p className="text-xs text-neutral-500 mt-2">JPG, PNG ou SVG</p>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminDashboard;
