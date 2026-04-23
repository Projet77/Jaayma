
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, SlidersHorizontal, Heart } from 'lucide-react';
import { getAssetUrl } from '../utils/assetUtils';
import { Button, Card } from '../components/ui/core';
import { useNavigate } from 'react-router-dom';

const ShopPage = ({ addToCart, setSelectedProduct, products = [], favorites = [], toggleFavorite, searchKeyword = '', setSearchKeyword }) => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("Tous");
    const [sortOption, setSortOption] = useState("Nouveautés");
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [shopProducts, setShopProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchShopProducts = async () => {
            setIsLoading(true);
            try {
                let url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products?`;
                const params = new URLSearchParams();
                
                if (searchKeyword) params.append('search', searchKeyword);
                if (selectedCategory && selectedCategory !== "Tous") params.append('category', selectedCategory);
                
                let apiSort = 'newest';
                if (sortOption === "Prix croissant") apiSort = 'price_asc';
                if (sortOption === "Prix décroissant") apiSort = 'price_desc';
                params.append('sort', apiSort);

                const response = await fetch(url + params.toString());
                const data = await response.json();
                setShopProducts(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des produits", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchShopProducts();
    }, [searchKeyword, selectedCategory, sortOption]);

    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-20">
            <div className="container mx-auto px-6">

                {/* Immersive Hero Header */}
                <div className="mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-[12vw] leading-[0.8] font-display font-medium text-black -ml-1 tracking-tighter"
                    >
                        COLLECTION
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-6 mt-8 border-t border-black/10 pt-8"
                    >
                        <p className="max-w-md text-lg text-neutral-500 font-medium leading-relaxed">
                            Découvrez notre sélection exclusive de produits technologiques, mode et maison. Qualité garantie et livraison rapide partout au Sénégal.
                        </p>

                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-black">{shopProducts.length} PRODUITS</span>
                        </div>
                    </motion.div>
                </div>

                {/* Tools Bar */}
                <div className="sticky top-20 z-30 bg-neutral-50/80 backdrop-blur-xl py-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-neutral-200">
                    {/* Categories (Pills) */}
                    <motion.div
                        className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar"
                    >
                        <div className="flex gap-2 w-full md:w-auto">
                            {['Tous', 'Audio', 'Laptop', 'Mode', 'Gaming', 'Mobile', 'Photo'].map((cat, i) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? 'bg-black text-white'
                                        : 'bg-white text-neutral-500 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-300'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {searchKeyword && (
                            <div className="flex items-center gap-2 bg-neutral-100 px-4 py-2 rounded-full whitespace-nowrap">
                                <span className="text-xs text-neutral-600 font-medium">Recherche : "{searchKeyword}"</span>
                                <button
                                    onClick={() => setSearchKeyword('')}
                                    className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center hover:bg-neutral-300 transition-colors"
                                >
                                    <span className="text-[10px] text-neutral-700 font-bold">X</span>
                                </button>
                            </div>
                        )}
                    </motion.div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="secondary" className="rounded-full gap-2 border border-neutral-200 bg-white hover:bg-neutral-100 flex-1 md:flex-none justify-center">
                            <SlidersHorizontal className="w-4 h-4" /> Filtres
                        </Button>
                        <div className="relative flex-1 md:flex-none">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="w-full bg-white rounded-full px-4 py-2.5 flex items-center justify-between border border-neutral-200 gap-2 hover:bg-neutral-50 transition-colors"
                            >
                                <span className="text-[11px] font-bold text-neutral-600 uppercase">Trier: {sortOption}</span>
                                <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 md:left-auto left-0 top-full mt-2 w-48 bg-white border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                                    >
                                        {['Nouveautés', 'Prix croissant', 'Prix décroissant'].map(option => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setSortOption(option);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortOption === option ? 'bg-neutral-50 font-bold text-black' : 'text-neutral-600 font-medium hover:bg-neutral-50 hover:text-black'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : shopProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <h2 className="text-2xl font-bold mb-4">Aucun résultat trouvé</h2>
                        <p className="text-neutral-500 mb-8">Nous n'avons pas trouvé de produits correspondant à vos critères.</p>
                        <Button onClick={() => { setSearchKeyword(''); setSelectedCategory('Tous'); }} className="bg-black text-white hover:bg-neutral-800">
                            Réinitialiser les filtres
                        </Button>
                    </div>
                ) : (
                <motion.layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-12 gap-x-8">
                    <AnimatePresence mode="popLayout">
                        {shopProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                key={product.id}
                                className="group"
                            >
                                <Card
                                    className="border-0 shadow-none bg-transparent p-0 overflow-visible h-full flex flex-col cursor-pointer group"
                                    onClick={() => {
                                        setSelectedProduct(product);
                                        navigate(`/product/${product.id}`);
                                    }}
                                >
                                    <div className="relative aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden mb-6">
                                        <img
                                            src={getAssetUrl(product.image)}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                        />
                                        {product.is_featured && (
                                            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                                                Populaire
                                            </span>
                                        )}
                                        <button
                                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors shadow-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(product);
                                            }}
                                        >
                                            <Heart className={`w-4 h-4 ${favorites.some(f => f.id === product.id) ? 'fill-red-500 text-red-500' : 'text-neutral-500'}`} />
                                        </button>
                                        <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToCart(product);
                                                }}
                                                className="flex-1 bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 shadow-xl"
                                            >
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-base leading-tight group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
                                            <span className="font-medium text-sm whitespace-nowrap">{new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(product.price)}</span>
                                        </div>
                                        <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wide font-bold">{typeof product.category === 'string' ? product.category : (product.category?.name || 'Général')}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.layout>
                )}
            </div >
            </div >
        </div >
    );
};

export default ShopPage;
