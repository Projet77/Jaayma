
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus, UserCircle } from 'lucide-react';
import { Button } from '../components/ui/core';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductPage = ({ selectedProduct, addToCart, goBack, setSelectedProduct, products = [], favorites = [], toggleFavorite }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    if (selectedProduct && selectedProduct.id) {
      fetch(`http://localhost:5000/api/products/${selectedProduct.id}/reviews`)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setReviews(data);
        })
        .catch(console.error);
    }
  }, [selectedProduct]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Veuillez vous connecter pour laisser un avis.");
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/products/${selectedProduct.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, comment: reviewText })
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([{...data.review, user: { name: user.name }}, ...reviews]); // Mock l'ajout direct
        setReviewText("");
        alert("Avis publié avec succès !");
      } else {
        alert(data.message || "Erreur lors de la publication de l'avis.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion.");
    }
  };

  const isFavorite = favorites.some(fav => fav.id === selectedProduct?.id);

  if (!selectedProduct) return null;

  // Mock additional images if not present
  const images = selectedProduct.images || [selectedProduct.image, selectedProduct.image, selectedProduct.image];


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-24 pb-12"
    >
      <div className="container mx-auto px-6">
        {/* Breadcrumb & Back */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm font-bold text-neutral-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la boutique
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Visual Section: Gallery & Video */}
          <div className="space-y-8">
            <motion.div
              layoutId={`product-image-${selectedProduct.id}`}
              className="aspect-square bg-neutral-100 rounded-3xl overflow-hidden relative group"
            >
              <img
                src={images[activeImage]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Video Section */}
            {selectedProduct.video && (
              <div className="rounded-3xl overflow-hidden border border-neutral-100 shadow-sm mt-8">
                <div className="bg-neutral-50 p-4 border-b border-neutral-100">
                  <h3 className="font-bold text-lg">Démonstration Vidéo</h3>
                </div>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedProduct.video.replace("watch?v=", "embed/")}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Product Details (Sticky) */}
          <div className="lg:sticky lg:top-32 h-fit space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                  {selectedProduct.category}
                </span>
                {selectedProduct.stock <= 5 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm">
                    Plus que {selectedProduct.stock} en stock !
                  </span>
                )}
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-bold text-black pt-0.5">
                    {selectedProduct.rating ? selectedProduct.rating.toFixed(1) : "0"} ({selectedProduct.reviews || 0} avis)
                  </span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-medium text-black leading-tight mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-xl text-neutral-500 font-medium">
                par <span className="text-black underline decoration-1 underline-offset-4">{selectedProduct.vendor || "La Boutique"}</span>
              </p>
            </div>

            <div className="flex items-end gap-4 border-b border-neutral-100 pb-8">
              <h2 className="text-4xl font-bold text-black">
                {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(selectedProduct.price)}
              </h2>
              {selectedProduct.oldPrice && (
                <span className="text-lg text-neutral-400 line-through mb-1">
                  {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(selectedProduct.oldPrice)}
                </span>
              )}
            </div>

            <div className="space-y-6">
              <p className="text-neutral-600 leading-relaxed text-lg">
                {selectedProduct.description || "Découvrez ce produit exceptionnel. Conçu avec précision pour répondre à vos besoins. Qualité supérieure et finition impeccable garantie."}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 uppercase font-bold mb-1">En Stock</p>
                  <p className="font-bold text-xl">{selectedProduct.stock || "50+"} unités</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl">
                  <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Référence</p>
                  <p className="font-bold text-xl">#REF-{selectedProduct.id}</p>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex gap-4 pt-4">
                <div className="flex items-center border border-neutral-200 rounded-full px-4 h-14 bg-neutral-50">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-white rounded-full transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-white rounded-full transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button className="flex-1 h-14 rounded-full text-base" onClick={() => addToCart(selectedProduct, quantity)}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ajouter au panier
                </Button>
                <button
                  className={`w-14 h-14 flex items-center justify-center border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors ${isFavorite ? 'bg-red-50 border-red-100 hover:bg-red-100' : ''}`}
                  onClick={() => toggleFavorite(selectedProduct)}
                >
                  <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                <Truck className="w-6 h-6 text-neutral-400" />
                <div>
                  <p className="font-bold text-sm">Livraison Rapide</p>
                  <p className="text-xs text-neutral-500">24h - 48h à Dakar</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-neutral-400" />
                <div>
                  <p className="font-bold text-sm">Garantie Qualité</p>
                  <p className="text-xs text-neutral-500">Satisfait ou remboursé</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Avis Clients */}
        <div className="mt-24 border-t border-neutral-100 pt-16">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-1/3">
                <h2 className="text-3xl font-display font-medium mb-6">Avis Clients</h2>
                <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl font-bold text-black">{selectedProduct.rating ? selectedProduct.rating.toFixed(1) : "0.0"}</div>
                    <div>
                        <div className="flex gap-1 text-yellow-500 mb-1">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={`w-5 h-5 ${star <= (selectedProduct.rating || 0) ? 'fill-current' : 'text-neutral-200'}`} />
                            ))}
                        </div>
                        <p className="text-sm text-neutral-500 font-medium">Basé sur {selectedProduct.reviews || 0} avis</p>
                    </div>
                </div>

                <div className="bg-neutral-50 p-6 rounded-2xl">
                    <h3 className="font-bold text-lg mb-4">Laisser un avis</h3>
                    {user ? (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Votre note</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button 
                                            key={star} 
                                            type="button" 
                                            onClick={() => setReviewRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star className={`w-8 h-8 transition-colors ${star <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-neutral-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Votre message</label>
                                <textarea 
                                    className="w-full p-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none"
                                    rows="4"
                                    placeholder="Qu'avez-vous pensé de ce produit ?"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit" className="w-full">Publier l'avis</Button>
                        </form>
                    ) : (
                        <div className="text-center p-4">
                            <p className="text-neutral-500 mb-4">Vous devez être connecté et avoir acheté cet article pour laisser un avis.</p>
                            <Button variant="secondary" onClick={() => navigate('/login')}>Se connecter</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:w-2/3 space-y-6">
                {reviews.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-neutral-100 rounded-2xl">
                        <p className="text-neutral-500 font-medium">Ce produit n'a pas encore d'avis. Soyez le premier !</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-neutral-100 last:border-0">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <UserCircle className="w-10 h-10 text-neutral-300" />
                                    <div>
                                        <p className="font-bold text-black">{review.user?.name || "Client anonyme"}</p>
                                        <div className="flex gap-1 text-yellow-500 mt-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-current' : 'text-neutral-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-neutral-400 font-medium">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-neutral-600 mt-3 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-24 border-t border-neutral-100 pt-16">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-display font-medium">Vous aimerez aussi</h2>
            <button
              onClick={() => navigate('/shop')}
              className="text-primary font-bold hover:underline"
            >
              Voir tout
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map(product => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedProduct(product);
                  navigate(`/product/${product.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden mb-4 relative">
                  <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.stock <= 5 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">Vite !</span>
                  )}
                </div>
                <h3 className="font-bold text-lg group-hover:underline">{product.name}</h3>
                <p className="text-neutral-500">
                  {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default ProductPage;
