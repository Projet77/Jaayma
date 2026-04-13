import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { Button, Card } from '../components/ui/core';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = ({ favorites, toggleFavorite, addToCart, setSelectedProduct }) => {
    const navigate = useNavigate();

    if (favorites.length === 0) {
        return (
            <div className="pt-32 pb-20 min-h-screen container mx-auto px-6">
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto py-20 bg-neutral-50 rounded-3xl border border-neutral-100">
                    <Heart className="w-16 h-16 text-neutral-300 mb-6" />
                    <h2 className="text-2xl font-display font-bold text-neutral-900 mb-3">Aucun favori</h2>
                    <p className="text-neutral-500 mb-8">
                        Vous n'avez pas encore ajouté de produits à votre liste de souhaits. Découvrez nos nouveautés !
                    </p>
                    <Button onClick={() => navigate('/shop')} variant="primary" className="rounded-full px-8">
                        Découvrir le catalogue
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">Vos Favoris</h1>
                    <p className="text-neutral-500">
                        {favorites.length} {favorites.length > 1 ? 'articles enregistrés' : 'article enregistré'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favorites.map((product) => (
                        <Card key={product.id} className="group relative border border-transparent hover:border-neutral-100 cursor-pointer" onClick={() => { setSelectedProduct(product); navigate(`/product/${product.id}`); }}>
                            <div className="aspect-[4/5] bg-[#F8F8F8] overflow-hidden relative">
                                <img
                                    src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80"}
                                    alt={product.name}
                                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                                />

                                {/* Bouton retirer des favoris */}
                                <button
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-red-50 transition-colors shadow-sm group/btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(product);
                                    }}
                                    title="Retirer des favoris"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500 group-hover/btn:scale-110 transition-transform" />
                                </button>

                                <div className="absolute inset-x-4 bottom-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product);
                                        }}
                                        className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-xl hover:bg-neutral-800 transition-colors"
                                    >
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">{product.category}</p>
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="font-medium text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="font-bold whitespace-nowrap">
                                        {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumSignificantDigits: 9 }).format(product.price)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;
