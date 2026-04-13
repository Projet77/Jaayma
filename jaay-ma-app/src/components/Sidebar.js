
import React from 'react';
import { mockCategories } from '../data/categories';
import { Icons } from '../icons';

const Sidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedSubcategory,
  setSelectedSubcategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  formatPrice
}) => {
  return (
    <div className="w-64 bg-white border border-surface-200 rounded-2xl p-6 hidden lg:block h-fit sticky top-24">
      <h2 className="text-lg font-bold text-surface-900 mb-6">Catégories</h2>
      <nav className="space-y-1 mb-8">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setSelectedSubcategory(null);
          }}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${!selectedCategory
              ? 'bg-primary-50 text-primary-700 font-semibold'
              : 'text-surface-600 hover:bg-surface-50 hover:text-primary-600'
            }`}
        >
          Toutes les catégories
        </button>
        {mockCategories.map(category => (
          <div key={category.id}>
            <button
              onClick={() => {
                setSelectedCategory(category.name);
                setSelectedSubcategory(null);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center space-x-3 transition-colors ${selectedCategory === category.name
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-primary-600'
                }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
            {selectedCategory === category.name && (
              <div className="ml-9 mt-1 mb-2 space-y-1 border-l-2 border-surface-100 pl-2">
                {category.subcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedSubcategory === sub
                        ? 'text-primary-600 font-medium bg-surface-50'
                        : 'text-surface-500 hover:text-primary-500'
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-surface-100 pt-6 mb-8">
        <h3 className="text-sm font-bold text-surface-900 mb-4">Filtrer par prix</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="500000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-primary-600 h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs font-medium text-surface-600 bg-surface-50 p-2 rounded-lg">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-surface-100 pt-6">
        <h3 className="text-sm font-bold text-surface-900 mb-4">Trier par</h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none text-surface-700 cursor-pointer"
          >
            <option value="relevance">Pertinence</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
            <option value="newest">Nouveautés</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-500">
            <Icons.ChevronDown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
