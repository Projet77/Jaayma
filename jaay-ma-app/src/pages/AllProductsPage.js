import React from 'react';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import { Icons } from '../icons';

const AllProductsPage = ({
  selectedCategory,
  selectedSubcategory,
  searchQuery,
  filteredProducts,
  setSelectedCategory,
  setSelectedSubcategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  formatPrice,
  addToWishlist,
  wishlist,
  addToCart,
  renderStars,
  setSelectedProduct,
  setCurrentView
}) => (
  <div className="max-w-7xl mx-auto">
    {/* Breadcrumb & Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div className="flex items-center space-x-2 text-sm text-surface-500 mb-2">
          <span className="cursor-pointer hover:text-primary-600" onClick={() => setCurrentView('home')}>Accueil</span>
          <span className="text-surface-300">›</span>
          <span className="font-medium text-surface-900">Tous les produits</span>
        </div>
        <h1 className="text-3xl font-bold text-surface-900">
          {selectedCategory ? selectedCategory : 'Catalogue'}
        </h1>
      </div>
      <div className="text-surface-500 text-sm">
        {filteredProducts.length} résultat{filteredProducts.length > 1 ? 's' : ''}
      </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-8">
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory}
        setSelectedSubcategory={setSelectedSubcategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        sortBy={sortBy}
        setSortBy={setSortBy}
        formatPrice={formatPrice}
      />

      <div className="flex-1">
        {/* Filters summary */}
        {(selectedSubcategory || searchQuery) && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {selectedSubcategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                {selectedSubcategory}
                <button onClick={() => setSelectedSubcategory(null)} className="hover:text-primary-900"><Icons.X className="w-4 h-4" /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-100 text-surface-700 text-sm font-medium">
                Recherche: "{searchQuery}"
                {/* Note: Clearing search is usually done in Header, handled by App.js state */}
              </span>
            )}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-surface-200 border-dashed">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-surface-500 max-w-sm mx-auto">Nous n'avons trouvé aucun résultat correspondant à vos critères. Essayez de modifier vos filtres.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedSubcategory(null);
                setPriceRange([0, 500000]);
              }}
              className="mt-6 text-primary-600 font-medium hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToWishlist={addToWishlist}
                wishlist={wishlist}
                addToCart={addToCart}
                renderStars={renderStars}
                formatPrice={formatPrice}
                setSelectedProduct={setSelectedProduct}
                setCurrentView={setCurrentView}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default AllProductsPage;