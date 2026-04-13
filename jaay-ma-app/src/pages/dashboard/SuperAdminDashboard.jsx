import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/core';
import { TrendingUp, Users, Activity, DollarSign, Package, ShoppingBag, AlertCircle, Plus, Search, Megaphone, Image, Layout, Store, Settings, CreditCard, Upload } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            {change && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${change > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {change > 0 ? '+' : ''}{change}%
                </span>
            )}
        </div>
        <h3 className="text-neutral-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
    </Card>
);

const SuperAdminDashboard = ({ products = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const setActiveTab = (tab) => setSearchParams({ tab });
    const [productFilter, setProductFilter] = useState('all');

    // --- Product Logic ---
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
                            <button className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20">
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
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                    {product.is_featured && (
                                                        <div className="absolute top-0 right-0 bg-yellow-400 w-3 h-3 rounded-bl-lg"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-neutral-900">{product.name}</p>
                                                    <p className="text-xs text-neutral-500">{product.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                    {product.vendor.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium text-neutral-700">{product.vendor}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                <div className="flex items-center gap-1 text-blue-600 font-medium">
                                                    <Search className="w-3 h-3" /> {product.views.toLocaleString()} vues
                                                </div>
                                                <div className="flex items-center gap-1 text-green-600 font-medium">
                                                    <ShoppingBag className="w-3 h-3" /> {product.sales.toLocaleString()} ventes
                                                </div>
                                                <div className="flex items-center gap-1 text-purple-600 font-medium">
                                                    <Package className="w-3 h-3" /> {product.in_cart} paniers
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{product.price.toLocaleString()} FCFA</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${product.stock < 10 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-600' : 'text-neutral-500'}`}>
                                                    {product.stock}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'active'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : product.status === 'out_of_stock'
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {product.status === 'active' ? 'Validé' : product.status === 'out_of_stock' ? 'Rupture' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-sm font-medium text-neutral-400 hover:text-black transition-colors">Éditer</button>
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

    const renderUsers = () => (
        <>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-1">
                <h2 className="text-xl font-bold text-neutral-800">Gestion des Utilisateurs</h2>
                <div className="flex gap-2">
                    <select className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="all">Tous les rôles</option>
                        <option value="client">Clients</option>
                        <option value="vendor">Vendeurs</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black w-64"
                    />
                </div>
            </div>

            <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Utilisateur</th>
                                <th className="px-6 py-4 font-semibold">Rôle</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date d'inscription</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {[
                                { name: 'Moussa Diop', email: 'moussa@gmail.com', role: 'Vendeur', status: 'Actif', date: '12 Jan 2024', avatar: 'bg-blue-100 text-blue-600' },
                                { name: 'Fatou Ndiaye', email: 'fatou.shop@hotmail.com', role: 'Vendeur', status: 'En attente', date: '15 Jan 2024', avatar: 'bg-orange-100 text-orange-600' },
                                { name: 'Jean Dupont', email: 'j.dupont@yahoo.fr', role: 'Client', status: 'Actif', date: '18 Jan 2024', avatar: 'bg-green-100 text-green-600' },
                                { name: 'Amina Sow', email: 'amina.s@gmail.com', role: 'Client', status: 'Banni', date: '10 Dec 2023', avatar: 'bg-red-100 text-red-600' },
                                { name: 'Modou Lo', email: 'modou.lo@orange.sn', role: 'Vendeur', status: 'Actif', date: '20 Jan 2024', avatar: 'bg-purple-100 text-purple-600' },
                            ].map((user, i) => (
                                <tr key={i} className="group hover:bg-neutral-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.avatar}`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-neutral-900">{user.name}</p>
                                                <p className="text-xs text-neutral-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'Vendeur' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'Actif' ? 'bg-green-50 text-green-700 border-green-200' :
                                            user.status === 'En attente' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Actif' ? 'bg-green-500' :
                                                user.status === 'En attente' ? 'bg-orange-500' :
                                                    'bg-red-500'
                                                }`}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-500">
                                        {user.date}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.status === 'En attente' && (
                                                <button className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Valider">
                                                    <Activity className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 bg-neutral-100 text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors" title="Éditer">
                                                <Users className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Bannir">
                                                <TrendingUp className="w-4 h-4 rotate-180" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Affichage de 5 sur 128 utilisateurs</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-medium hover:bg-neutral-50 disabled:opacity-50">Précédent</button>
                        <button className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-xs font-medium hover:bg-neutral-50">Suivant</button>
                    </div>
                </div>
            </Card>
        </>
    );

    const renderOverview = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Revenu Total"
                    value="125M XOF"
                    change={12}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Utilisateurs Actifs"
                    value="24.5k"
                    change={8}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Nouveaux Vendeurs"
                    value="128"
                    change={-2}
                    icon={TrendingUp}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Taux de Conversion"
                    value="3.2%"
                    change={5}
                    icon={Activity}
                    color="bg-orange-500"
                />
            </div>

            {/* Can add more overview widgets here later */}
            <Card className="p-6 border border-neutral-100 shadow-sm">
                <h3 className="text-lg font-bold mb-4">Aperçu rapide</h3>
                <p className="text-neutral-500">Sélectionnez un onglet dans la barre latérale pour gérer les détails.</p>
            </Card>
        </div>
    );

    const renderMarketing = () => (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Banner Management */}
                <Card className="md:col-span-2 p-6 border border-neutral-100">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Image className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg">Bannières d'accueil</h3>
                        </div>
                        <button className="text-sm font-bold text-black border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-50">
                            + Ajouter
                        </button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: "Promo Tabaski", location: "Carrousel Principal", views: "12k", clicks: "2.4k", status: "Active", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070" },
                            { title: "Nouveautés Tech", location: "Bannière Secondaire", views: "8k", clicks: "900", status: "Active", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001" },
                            { title: "Soldes d'Hiver", location: "Carrousel Principal", views: "45k", clicks: "8k", status: "Inactif", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" },
                        ].map((banner, i) => (
                            <div key={i} className="flex gap-4 p-4 border border-neutral-100 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="w-32 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-neutral-900">{banner.title}</h4>
                                            <p className="text-xs text-neutral-500">{banner.location}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${banner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                                            }`}>
                                            {banner.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-600">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {banner.views} vues</span>
                                        <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {banner.clicks} clics</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Ad Sections Config */}
                <div className="space-y-6">
                    <Card className="p-6 border-0 bg-gradient-to-br from-black to-neutral-800 text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <Layout className="w-6 h-6 text-white" />
                            <h3 className="font-bold text-lg">Sections Pub</h3>
                        </div>
                        <p className="text-neutral-400 text-sm mb-6">
                            Gérez les sections promotionnelles visibles sur la page d'accueil (ex: "Produits Vedettes", "Offres Spéciales").
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <span className="font-medium">Top Ventes</span>
                                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <span className="font-medium">Offres Flash</span>
                                <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <span className="font-medium">Nouveautés</span>
                                <div className="w-10 h-6 bg-neutral-600 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
                            </div>
                        </div>
                        <button className="w-full mt-6 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-neutral-100">
                            Configurer l'accueil
                        </button>
                    </Card>

                    <Card className="p-6 border border-neutral-100">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Megaphone className="w-4 h-4 text-purple-600" />
                            Demandes de Boost
                        </h3>
                        <div className="space-y-3">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="p-3 bg-neutral-50 rounded-xl">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-black">Samsung Store</span>
                                        <span className="text-[10px] text-neutral-400">Il y a 2h</span>
                                    </div>
                                    <p className="text-xs text-neutral-600 mb-2">Souhaite booster "Galaxy S24 Ultra" pour 7 jours.</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-1 bg-black text-white text-xs rounded-lg">Accepter</button>
                                        <button className="flex-1 py-1 border border-neutral-200 text-xs rounded-lg hover:bg-white">Refuser</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

    const renderVendors = () => {
        // Mock data for vendors
        const vendors = [
            { id: 1, name: 'Samsung Store', products: 45, stock: 1280, sales: '14.5M', status: 'Actif', rating: 4.8 },
            { id: 2, name: 'Mode Sénégal', products: 120, stock: 540, sales: '3.2M', status: 'Actif', rating: 4.5 },
            { id: 3, name: 'Tech Zone', products: 12, stock: 45, sales: '850k', status: 'En attente', rating: 0 },
            { id: 4, name: 'Electro World', products: 85, stock: 2300, sales: '28M', status: 'Actif', rating: 4.9 },
        ];

        return (
            <div className="space-y-6">
                {/* Vendor Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <Store className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Total Vendeurs</p>
                                <h3 className="text-2xl font-bold text-neutral-900">128</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">CA Vendeurs</p>
                                <h3 className="text-2xl font-bold text-neutral-900">85M FCFA</h3>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6 border border-neutral-100">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-neutral-500 text-sm font-medium">Vendeurs en attente</p>
                                <h3 className="text-2xl font-bold text-neutral-900">12</h3>
                            </div>
                        </div>
                    </Card>
                </div>

                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                        <h3 className="font-bold text-lg">Liste des Vendeurs</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un vendeur..."
                                className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors w-64"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Vendeur</th>
                                    <th className="px-6 py-4 font-semibold">Performance</th>
                                    <th className="px-6 py-4 font-semibold">Stock Total</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {vendors.map((vendor) => (
                                    <tr key={vendor.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                                    {vendor.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-neutral-900">{vendor.name}</p>
                                                    <p className="text-xs text-neutral-500">{vendor.products} produits</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs space-y-1">
                                                <div className="font-medium text-neutral-900">{vendor.sales} CA</div>
                                                <div className="text-neutral-500 flex items-center gap-1">
                                                    ⭐ {vendor.rating > 0 ? vendor.rating : 'N/A'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-black"
                                                        style={{ width: `${Math.min((vendor.stock / 2000) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-neutral-700">{vendor.stock}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${vendor.status === 'Actif'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {vendor.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-black border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
                                                Gérer
                                            </button>
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


    const renderSettings = () => (
        <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-xl font-bold text-neutral-800">Paramètres de la Plateforme</h2>

            {/* General Settings */}
            <Card className="p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-neutral-100 rounded-lg">
                        <Settings className="w-5 h-5 text-neutral-700" />
                    </div>
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

            {/* Finance & Commissions */}
            <Card className="p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-700" />
                    </div>
                    <h3 className="font-bold text-lg">Finances & Commissions</h3>
                </div>
                <div className="space-y-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
                        <div className="mt-1 text-yellow-600">⚠️</div>
                        <p className="text-sm text-yellow-800">
                            La modification des taux de commission affectera toutes les nouvelles transactions. Les transactions en cours ne seront pas impactées.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700">Commission Vendeur (%)</label>
                            <div className="relative">
                                <input type="number" defaultValue="5" className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">%</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700">Frais Fixe par Vente</label>
                            <div className="relative">
                                <input type="number" defaultValue="100" className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">FCFA</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-700">Seuil Retrait Minimum</label>
                            <div className="relative">
                                <input type="number" defaultValue="5000" className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">FCFA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Payment Gateways */}
            <Card className="p-6 border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-purple-700" />
                    </div>
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
                            <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${method.status ? 'bg-green-500' : 'bg-neutral-200'}`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${method.status ? 'right-1' : 'left-1'}`}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
                <button className="px-6 py-3 border border-neutral-200 rounded-xl font-bold text-sm hover:bg-neutral-50">Annuler</button>
                <button className="px-6 py-3 bg-black text-white rounded-xl font-bold text-sm hover:bg-neutral-800 shadow-lg shadow-black/20">Enregistrer les modifications</button>
            </div>
        </div>
    );

    const renderCMS = () => (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-neutral-800">Gestion du Contenu (CMS)</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Navigation Management */}
                <Card className="p-6 border border-neutral-100 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                            <Layout className="w-5 h-5 text-neutral-700" />
                        </div>
                        <h3 className="font-bold text-lg">Navigation</h3>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm">Menu Principal</h4>
                                <button className="text-xs font-bold text-blue-600 hover:underline">Ajouter</button>
                            </div>
                            <div className="space-y-2">
                                {['Accueil', 'Boutique', 'Homme', 'Femme', 'Electro'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-100 group">
                                        <span className="text-sm font-medium">{item}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-xs text-neutral-500 hover:text-black">Éditer</button>
                                            <button className="text-xs text-red-500 hover:text-red-700">Suppr.</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm">Footer (Pied de page)</h4>
                                <button className="text-xs font-bold text-blue-600 hover:underline">Ajouter</button>
                            </div>
                            <div className="space-y-2">
                                {['À propos', 'Contact', 'CGV', 'Politique de confidentialité'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-100 group">
                                        <span className="text-sm font-medium">{item}</span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-xs text-neutral-500 hover:text-black">Éditer</button>
                                            <button className="text-xs text-red-500 hover:text-red-700">Suppr.</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Page Content Editor */}
                <Card className="p-6 border border-neutral-100 lg:col-span-2">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Image className="w-5 h-5 text-blue-700" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Éditeur de Pages</h3>
                                <p className="text-xs text-neutral-500">Modifiez le texte et les images des pages</p>
                            </div>
                        </div>
                        <select className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm font-bold focus:outline-none">
                            <option>Page d'Accueil</option>
                            <option>Page À propos</option>
                            <option>Page Contact</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        {/* Section Hero */}
                        <div className="p-4 border border-neutral-200 rounded-xl space-y-4">
                            <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg -m-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Section Hero (Haut de page)</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Grand Titre</label>
                                    <input type="text" defaultValue="Le Futur du E-commerce" className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Image de fond</label>
                                    <div className="flex gap-2">
                                        <input type="text" defaultValue="hero_banner_v3.jpg" className="flex-1 px-4 py-2 border border-neutral-200 rounded-lg text-sm text-neutral-500" disabled />
                                        <button className="px-3 py-2 bg-neutral-100 rounded-lg hover:bg-neutral-200">
                                            <Upload className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold">Sous-titre / Description</label>
                                    <textarea rows="2" defaultValue="Découvrez la marketplace la plus avancée du Sénégal. Des milliers de produits, une livraison rapide et un service client exceptionnel." className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Section About */}
                        <div className="p-4 border border-neutral-200 rounded-xl space-y-4">
                            <div className="flex justify-between items-center bg-neutral-50 p-2 rounded-lg -m-2 mb-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Section "Pourquoi Nous"</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-9 h-5 bg-neutral-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input type="text" defaultValue="Livraison Rapide" className="px-4 py-2 border border-neutral-200 rounded-lg text-sm" />
                                <input type="text" defaultValue="Paiement Sécurisé" className="px-4 py-2 border border-neutral-200 rounded-lg text-sm" />
                                <input type="text" defaultValue="Service Client 24/7" className="px-4 py-2 border border-neutral-200 rounded-lg text-sm" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                            <button className="px-6 py-2 border border-neutral-200 text-sm font-bold rounded-lg hover:bg-neutral-50">Prévisualiser</button>
                            <button className="px-6 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-neutral-800">Publier les changements</button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );

    return (
        <DashboardLayout role="super-admin" activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'marketing' && renderMarketing()}
            {activeTab === 'cms' && renderCMS()}
            {activeTab === 'vendors' && renderVendors()}
            {activeTab === 'settings' && renderSettings()}
        </DashboardLayout>
    );
};

export default SuperAdminDashboard;
