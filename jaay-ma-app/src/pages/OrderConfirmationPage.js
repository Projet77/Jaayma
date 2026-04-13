
import React from 'react';

const OrderConfirmationPage = ({ orderSummary, formatPrice, setCurrentView }) => {
  if (!orderSummary) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-100 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm">
            <span>Accueil</span>
            <span>›</span>
            <span>Commande</span>
            <span>›</span>
            <span className="font-medium">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
        <p className="text-gray-600 mb-6">Merci pour votre achat. Votre commande a été prise en compte.</p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
          <h2 className="text-lg font-semibold mb-4">Détails de la commande</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Numéro de commande:</span>
              <span className="font-medium">{orderSummary.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">{orderSummary.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-semibold text-green-600">{formatPrice(orderSummary.total)}</span>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">Articles commandés</h3>
          <div className="space-y-2">
            {orderSummary.items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} (x{item.quantity})</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => setCurrentView('home')}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
          >
            Continuer vos achats
          </button>
          <button
            onClick={() => setCurrentView('orders')}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
          >
            Voir toutes mes commandes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
