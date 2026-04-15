import React from 'react';
import { getAssetUrl } from '../utils/assetUtils';
import { Icons } from '../icons';

const ProductCard = ({
  product,
  addToWishlist,
  wishlist,
  addToCart,
  renderStars,
  formatPrice,
  setSelectedProduct,
  setCurrentView
}) => {
  const isWishlisted = wishlist.find(item => item.id === product.id);

  return (
    <div
      className="bg-white border border-surface-200 rounded-lg p-3 hover:shadow-card-hover transition-all duration-200 group relative flex flex-col h-full cursor-pointer"
      onClick={() => {
        setSelectedProduct(product);
        setCurrentView('product');
      }}
    >
      {/* Image */}
      <div className="relative mb-3 aspect-square bg-surface-50 rounded-md overflow-hidden">
        <img
          src={getAssetUrl(product.images[0])}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
        />
        {product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-accent-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="text-xs text-surface-500 mb-1">{product.brand}</div>
        <h3 className="text-sm font-medium text-surface-900 leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400 text-xs">
            {renderStars(product.rating)}
          </div>
          <span className="text-[10px] text-surface-400">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-surface-900">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-surface-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          {product.inStock && (
            <p className="text-[10px] text-accent-green font-medium">En stock</p>
          )}
        </div>
      </div>

      {/* Hover Actions (Overlay) */}
      <div className="absolute inset-x-0 bottom-0 p-3 bg-white/95 backdrop-blur-sm border-t border-surface-100 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 flex flex-col gap-2 z-10 shadow-lg rounded-b-lg">
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="w-full bg-primary hover:bg-primary-600 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"
        >
          <Icons.ShoppingBag className="w-4 h-4" /> Ajouter
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); addToWishlist(product); }}
          className={`w-full border border-surface-200 hover:bg-surface-50 text-xs font-medium py-2 rounded flex items-center justify-center gap-2 ${isWishlisted ? 'text-accent-red' : 'text-surface-600'}`}
        >
          {isWishlisted ? <Icons.HeartFilled className="w-4 h-4" /> : <Icons.Heart className="w-4 h-4" />}
          {isWishlisted ? 'Retirer' : 'Sauvegarder'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
