
import React from 'react';
import { Icons } from '../icons';

const WishlistPage = ({ wishlist, addToWishlist, addToCart, renderStars, formatPrice, setSelectedProduct, setCurrentView }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-gray-100 py-4 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm">
          <span>Accueil</span>
          <span>›</span>
          <span className="font-medium">Liste de souhaits</span>
        </div>
      </div>
    </div>

    {wishlist.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Votre liste de souhaits est vide</h3>
        <p className="text-gray-600 mb-6">Ajoutez des produits à votre liste de souhaits pour les sauvegarder.</p>
        <button
          onClick={() => setCurrentView('home')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Découvrir les produits
        </button>
      </div>
    ) : (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Liste de souhaits ({wishlist.length} article{wishlist.length !== 1 ? 's' : ''})</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => addToWishlist(product)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white text-red-500"
                >
                  <Icons.Heart />
                </button>
              </div>
              
              <div className="p-4">
                <h3 
                  className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-green-600"
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentView('product');
                  }}
                >
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                
                <button
                  onClick={() => {
                    addToCart(product);
                    addToWishlist(product);
                  }}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md font-medium"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default WishlistPage;
