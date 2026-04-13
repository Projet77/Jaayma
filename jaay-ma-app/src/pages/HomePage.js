
import React from 'react';
import { Icons } from '../icons';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/products';
import { mockCategories } from '../data/categories';
import Card from '../components/ui/Card';

const HomePage = ({
  setCurrentView,
  setSelectedCategory,
  addToWishlist,
  wishlist,
  addToCart,
  renderStars,
  formatPrice,
  setSelectedProduct
}) => (
  <div>
    {/* Hero section is now in App.js */}

    {/* Features */}
    <section className="py-12 bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Livraison rapide', desc: 'Livraison en 2-3 jours dans tout le Sénégal', icon: <Icons.Truck />, color: 'bg-green-100 text-green-600' },
            { title: 'Paiement sécurisé', desc: 'Plusieurs options de paiement sécurisées', icon: <Icons.Shield />, color: 'bg-primary-100 text-primary-600' },
            { title: 'Paiement local', desc: 'Orange Money, Wave et autres options locales', icon: <Icons.CreditCard />, color: 'bg-yellow-100 text-yellow-600' },
          ].map((feature, idx) => (
            <Card key={idx} className="text-center p-8 border-none shadow-none bg-white/50" hover={false}>
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">{feature.title}</h3>
              <p className="text-surface-500">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Featured products - App.js renders title "Produits Populaires" before passing control here if needed, 
        or we can keep it here. App.js has "Produits Populaires" title above this component content. 
        So let's just render the grid. 
    */}
    <section className="py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {/* Title is handled in App.js, but keeping "Voir tout" here or in App.js? 
                 App.js renders HomePage inside a container. 
             */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.slice(0, 8).map(product => (
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
        <div className="mt-8 text-center md:hidden">
          <button
            onClick={() => setCurrentView('all-products')}
            className="text-primary-600 font-medium hover:underline"
          >
            Voir tous les produits →
          </button>
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-surface-900 mb-10 text-center">Catégories populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {mockCategories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.name);
                setCurrentView('all-products');
              }}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-surface-200 hover:border-primary-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
              <div className="text-sm font-semibold text-surface-700 group-hover:text-primary-600">{category.name}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;
