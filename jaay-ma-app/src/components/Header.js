
import React from 'react';
import { Icons } from '../icons';

const Header = ({ 
  showMobileMenu, 
  setShowMobileMenu, 
  searchQuery, 
  setSearchQuery, 
  wishlist, 
  currentUser, 
  handleLogout, 
  cartItemsCount, 
  handleCheckout, 
  setCurrentView, 
  setShowLoginModal 
}) => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <Icons.Menu />
            </button>
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentView('home')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Jaay-ma</h1>
                <p className="text-xs text-gray-600">Votre marché en ligne</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="absolute right-0 top-0 h-full px-4 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors">
                <Icons.Search />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setCurrentView('wishlist')}
              className="p-2 text-gray-700 hover:text-red-500 transition-colors relative"
            >
              <Icons.Heart />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => currentUser ? setCurrentView('orders') : setShowLoginModal(true)}
              className="p-2 text-gray-700 hover:text-blue-500 transition-colors"
            >
              <Icons.User />
            </button>
            
            <button 
              onClick={handleCheckout}
              className="p-2 text-gray-700 hover:text-green-500 transition-colors relative"
            >
              <Icons.ShoppingBag />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {currentUser && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-700">{currentUser.name}</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher des produits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <button 
              onClick={() => { setCurrentView('home'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Accueil
            </button>
            <button 
              onClick={() => { setCurrentView('categories'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Catégories
            </button>
            <button 
              onClick={() => { setCurrentView('deals'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Promotions
            </button>
            <button 
              onClick={() => { setCurrentView('about'); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              À propos
            </button>
            {!currentUser && (
              <button 
                onClick={() => { setShowLoginModal(true); setShowMobileMenu(false); }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Connexion
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
