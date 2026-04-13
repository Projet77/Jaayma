import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card } from '../../components/ui/core';
import { Plus, Package, ShoppingBag, Search, Wallet, BarChart3, Upload, Loader } from 'lucide-react';

const VendorDashboard = ({ products = [] }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const setActiveTab = (tab) => setSearchParams({ tab });

    // États pour les données dynamiques
    const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, activeProducts: 0, recentOrders: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', brand: '', price: '', category: 'Mobile', description: '', image: '', images: [], inStock: true, stock: 10, reviews: 0, rating: 0
    });
    const [uploadingImage, setUploadingImage] = useState(false);

    const uploadFileHandler = async (e) => {
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
            const res = await fetch('http://localhost:5000/api/upload/multiple', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (!res.ok) throw new Error("Erreur d'upload");

            const filePaths = await res.json();
            const imageUrls = filePaths.map(path => `http://localhost:5000${path}`);

            setNewProduct({
                ...newProduct,
                images: imageUrls,
                image: imageUrls.length > 0 ? imageUrls[0] : ''
            });
        } catch (err) {
            alert("Erreur lors de l'upload des images");
            console.error(err);
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        const fetchVendorStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Non authentifié");

                const res = await fetch('http://localhost:5000/api/vendor/stats', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Erreur de récupération des statistiques");

                const data = await res.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVendorStats();
    }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newProduct)
            });
            if (!res.ok) throw new Error("Erreur lors de l'ajout du produit");

            alert("Produit ajouté avec succès !");
            setIsAddModalOpen(false);
            // Recharger la page pour voir le nouveau produit
            window.location.reload();
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    // Stats Card Component
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

    const renderOverview = () => {
        if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader className="w-8 h-8 animate-spin text-neutral-400" /></div>;
        if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;

        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Chiffre d'Affaires"
                        value={stats.revenue.toLocaleString() + " FCFA"}
                        change={0}
                        icon={Wallet}
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Commandes"
                        value={stats.ordersCount}
                        change={0}
                        icon={ShoppingBag}
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Produits Actifs"
                        value={stats.activeProducts}
                        icon={Package}
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Note Boutique"
                        value="4.8/5"
                        icon={BarChart3}
                        color="bg-orange-500"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">Commandes Récentes</h3>
                            <button className="text-sm text-neutral-500 hover:text-black font-medium">Voir tout</button>
                        </div>
                        <div className="space-y-4">
                            {stats.recentOrders.length === 0 ? (
                                <p className="text-neutral-500 text-sm py-4">Aucune commande récente.</p>
                            ) : (
                                stats.recentOrders.map((order, i) => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-white border border-neutral-100 rounded-xl hover:shadow-sm transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center font-bold text-neutral-600 text-xs text-center">
                                                {order.id.slice(-4)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-neutral-900 line-clamp-1">{order.orderItems?.[0]?.product?.name || 'Commande'}</p>
                                                <p className="text-xs text-neutral-500">{order.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-sm text-neutral-900">{(order.totalPrice || 0).toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.status === 'Livrée' ? 'bg-green-100 text-green-700' :
                                                order.status === 'En attente' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <Card className="p-6 bg-black text-white rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold mb-2">Solde Disponible</h3>
                            <p className="text-neutral-400 text-sm mb-6">Montant prêt à être retiré vers votre compte Mobile Money.</p>
                            <h2 className="text-4xl font-mono font-bold mb-8">{stats.revenue.toLocaleString()} <span className="text-lg text-neutral-500">FCFA</span></h2>
                            <button className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">
                                Demander un retrait
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    </Card>
                </div>
            </div>
        );
    };

    const renderProducts = () => {
        // Filter pseudo-products for this vendor
        const myProducts = products.slice(0, 5); // Mocking "my products"

        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold text-neutral-800">Mes Produits</h2>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter un produit
                    </button>
                </div>

                {/* Filters */}
                <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                    {['Tous', 'En vente', 'Rupture', 'En attente de validation'].map((filter) => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === 'Tous' ? 'bg-black text-white' : 'bg-white border border-neutral-200 text-neutral-600'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Produit</th>
                                    <th className="px-6 py-4 font-semibold">Prix</th>
                                    <th className="px-6 py-4 font-semibold">Stock</th>
                                    <th className="px-6 py-4 font-semibold">Ventes</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {myProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-neutral-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-neutral-900">{product.name}</p>
                                                    <p className="text-xs text-neutral-500">{product.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-sm">{product.price.toLocaleString()} FCFA</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm ${product.stock < 5 ? 'text-red-600 font-bold' : 'text-neutral-600'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-600">
                                            {product.sales || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${product.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                {product.status === 'active' ? 'En ligne' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-xs font-bold text-neutral-500 hover:text-black underline">Modifier</button>
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

    const renderOrders = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-neutral-800">Gestion des Commandes</h2>
            {/* Using same structure as admin but simpler for vendor focus */}
            <Card className="p-0 border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-neutral-50/50">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase tracking-wider border-b border-neutral-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Produit</th>
                                <th className="px-6 py-4 font-semibold">Client</th>
                                <th className="px-6 py-4 font-semibold">Total</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {[1, 2, 3, 4].map((_, i) => (
                                <tr key={i} className="group hover:bg-neutral-50">
                                    <td className="px-6 py-4 text-sm text-neutral-500">20 Jan 2024</td>
                                    <td className="px-6 py-4 font-medium text-sm">Produit Exemple {i + 1}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600">Client Test</td>
                                    <td className="px-6 py-4 font-bold text-sm">15,000 FCFA</td>
                                    <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-bold">À expédier</span></td>
                                    <td className="px-6 py-4 text-right"><button className="px-3 py-1 bg-black text-white text-xs rounded-lg font-bold">Voir</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const renderWallet = () => (
        <div className="space-y-8">
            <h2 className="text-xl font-bold text-neutral-800">Mon Portefeuille</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 bg-black text-white rounded-3xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-neutral-400 mb-2">Solde Total</p>
                        <h2 className="text-5xl font-mono font-bold mb-4">{stats.revenue.toLocaleString()} <span className="text-xl">FCFA</span></h2>
                        <div className="flex gap-4 mt-8">
                            <button className="flex-1 bg-white text-black py-3 rounded-xl font-bold hover:bg-neutral-200 transition-colors">Retirer</button>
                            <button className="flex-1 bg-neutral-800 text-white py-3 rounded-xl font-bold border border-neutral-700 hover:bg-neutral-700">Historique</button>
                        </div>
                    </div>
                </Card>
                <div className="space-y-4">
                    <h3 className="font-bold text-lg">Retraits Récents</h3>
                    {[
                        { date: '15 Jan 2024', amount: '50,000 FCFA', status: 'Traité', method: 'Orange Money' },
                        { date: '01 Jan 2024', amount: '120,000 FCFA', status: 'Traité', method: 'Wave' },
                    ].map((tx, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white border border-neutral-100 rounded-xl">
                            <div>
                                <p className="font-bold text-neutral-900">Retrait vers {tx.method}</p>
                                <p className="text-xs text-neutral-500">{tx.date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-red-600">-{tx.amount}</p>
                                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">{tx.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-2xl space-y-8">
            <h2 className="text-xl font-bold text-neutral-800">Paramètres de la Boutique</h2>
            <Card className="p-6 border border-neutral-100">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center border-2 border-dashed border-neutral-300 cursor-pointer hover:border-black transition-colors">
                            <Upload className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-neutral-900">Logo de la boutique</h3>
                            <p className="text-xs text-neutral-500">Recommandé: 400x400px</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Nom de la boutique</label>
                            <input type="text" defaultValue="Ma Boutique" className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Téléphone</label>
                            <input type="tel" defaultValue="+221 77 ..." className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold">Description</label>
                            <textarea rows="3" defaultValue="Une brève description..." className="w-full px-4 py-2 border border-neutral-200 rounded-xl" />
                        </div>
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-neutral-800">Enregistrer</button>
                </div>
            </Card>
        </div>
    );

    return (
        <DashboardLayout role="vendor" activeTab={activeTab} onTabChange={setActiveTab}>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'wallet' && renderWallet()}
            {activeTab === 'settings' && renderSettings()}

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
                                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" placeholder="Ex: iPhone 15 Pro" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Marque *</label>
                                    <input required type="text" value={newProduct.brand} onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" placeholder="Ex: Apple" />
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
                                    <input required type="number" min="0" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" placeholder="Ex: 850000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Images du produit (Max 4) *</label>
                                <input required={!newProduct.images || newProduct.images.length === 0} type="file" multiple accept="image/*" onChange={(e) => uploadFileHandler(e)} className="w-full px-4 py-2 border border-neutral-200 rounded-xl bg-white" />
                                {uploadingImage && <p className="text-xs text-neutral-500 font-medium">Chargement des images...</p>}
                                {newProduct.images && newProduct.images.length > 0 && (
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {newProduct.images.map((img, idx) => (
                                            <img key={idx} src={img} alt={`Aperçu ${idx + 1}`} className="h-20 w-20 object-cover rounded-lg border border-neutral-200" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Description *</label>
                                <textarea required rows="3" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full px-4 py-2 border border-neutral-200 rounded-xl" placeholder="Décrivez votre produit..."></textarea>
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="inStockVendorAdd" checked={newProduct.inStock} onChange={e => setNewProduct({ ...newProduct, inStock: e.target.checked })} />
                                    <label htmlFor="inStockVendorAdd" className="text-sm font-bold">Produit en stock</label>
                                </div>
                                {newProduct.inStock && (
                                    <div className="flex items-center gap-2 ml-4">
                                        <label className="text-sm font-bold">Quantité disponible :</label>
                                        <input type="number" min="1" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })} className="w-24 px-3 py-1 border border-neutral-200 rounded-lg text-sm" />
                                    </div>
                                )}
                            </div>
                            <div className="pt-4 border-t border-neutral-100 flex justify-end gap-4">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-2 rounded-xl font-bold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors">Annuler</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-xl font-bold bg-black hover:bg-neutral-800 text-white transition-colors disabled:opacity-50">
                                    {isSubmitting ? 'Publication...' : 'Publier le produit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default VendorDashboard;
