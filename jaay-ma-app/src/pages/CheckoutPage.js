
import React, { useState } from 'react';
import { Icons } from '../icons';

const CheckoutPage = ({ 
  currentUser, 
  cart, 
  cartTotal, 
  formatPrice, 
  setOrderSummary, 
  setCart, 
  setShowCheckout, 
  setCurrentView, 
  checkoutStep, 
  setCheckoutStep, 
  completeCheckout 
}) => {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('orange-money');

  const steps = [
    { id: 1, name: 'Adresse', complete: checkoutStep > 1 },
    { id: 2, name: 'Paiement', complete: checkoutStep > 2 },
    { id: 3, name: 'Confirmer', complete: false }
  ];

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setCheckoutStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-100 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <span>Accueil</span>
            <span>›</span>
            <span>Panier</span>
            <span>›</span>
            <span className="font-medium">Commande</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <nav className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id < checkoutStep 
                    ? 'bg-green-500 text-white' 
                    : step.id === checkoutStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 text-sm ${
                  step.id <= checkoutStep ? 'text-green-600 font-medium' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  step.complete ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {checkoutStep === 1 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Adresse de livraison</h2>
          <form onSubmit={handleShippingSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                <input
                  type="text"
                  value={shippingInfo.postalCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Continuer
              </button>
            </div>
          </form>
        </div>
      )}

      {checkoutStep === 2 && (
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Méthode de paiement</h2>
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4 mb-6">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="orange-money"
                  checked={paymentMethod === 'orange-money'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <Icons.OrangeMoney />
                  <span className="ml-2 font-medium">Orange Money</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="wave"
                  checked={paymentMethod === 'wave'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <Icons.Wave />
                  <span className="ml-2 font-medium">Wave</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <Icons.CreditCard />
                  <span className="ml-2 font-medium">Carte bancaire</span>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <Icons.Shield />
                  <span className="ml-2 font-medium">Paiement à la livraison</span>
                </div>
              </label>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Récapitulatif de la commande</h3>
              <div className="space-y-2 text-sm">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between">
                    <span>{item.product.name} (x{item.quantity})</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setCheckoutStep(1)}
                className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Retour
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Confirmer le paiement
              </button>
            </div>
          </form>
        </div>
      )}

      {checkoutStep === 3 && (
        <div className="bg-white rounded-lg p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h2>
            <p className="text-gray-600 mb-6">Votre commande a été prise en compte. Vous recevrez un email de confirmation.</p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Détails de la commande</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Référence:</span>
                  <span>JM{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString('fr-SN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={completeCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
              >
                Continuer les achats
              </button>
              <button
                onClick={() => setCurrentView('orders')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Voir mes commandes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
