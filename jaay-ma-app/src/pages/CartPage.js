import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../icons';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

const CartPage = ({ cart, cartItemsCount, cartTotal, updateCartQuantity, removeFromCart, formatPrice, handleCheckout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('Orange Money');

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "221764297495"; // Numéro WhatsApp du client

    let text = `Bonjour Jaay-Ma ! 👋\nJe souhaite passer une commande.\n\n`;
    if (user && user.name) {
      text += `👤 *Client :* ${user.name}\n`;
    }
    text += `📦 *Nombre de pièces :* ${cartItemsCount}\n\n`;
    text += `*🛍️ DÉTAIL DE LA COMMANDE :*\n`;

    cart.forEach((item, index) => {
      text += `${index + 1}. *${item.product.name}* (x${item.quantity})\n`;
      text += `   Prix unitaire: ${formatPrice(item.product.price)}\n`;
      if (item.product.image) {
        const imgUrl = item.product.image.startsWith('http') ? item.product.image : `${window.location.origin}${item.product.image}`;
        text += `   Aperçu : ${imgUrl}\n`;
      }
      text += `\n`;
    });

    text += `*💳 Mode de paiement choisi :* ${paymentMethod}\n`;
    text += `*💰 TOTAL À PAYER :* ${formatPrice(cartTotal)}\n\n`;
    text += `Merci de m'indiquer la marche à suivre pour la livraison !`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 animate-fade-in">
      <div className="bg-surface-50 py-4 mb-8 rounded-xl px-4">
        <div className="flex items-center space-x-2 text-sm text-surface-500">
          <span className="cursor-pointer hover:text-primary-600" onClick={() => navigate('/')}>Accueil</span>
          <span className="text-surface-300">›</span>
          <span className="font-medium text-surface-900">Panier</span>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-surface-200 border-dashed">
          <div className="text-7xl mb-6 opacity-80">🛒</div>
          <h3 className="text-2xl font-bold text-surface-900 mb-2">Votre panier est vide</h3>
          <p className="text-surface-500 mb-8 max-w-md mx-auto">Il semblerait que vous n'ayez pas encore ajouté de produits. Explorez notre catalogue pour trouver votre bonheur.</p>
          <Button
            onClick={() => navigate('/shop')}
            variant="primary"
            size="lg"
          >
            Continuer vos achats
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-surface-900">Votre panier ({cartItemsCount} article{cartItemsCount !== 1 ? 's' : ''})</h2>

            <div className="space-y-4">
              {cart.map(item => (
                <Card key={item.product.id} className="p-4 flex items-center gap-4 transition-all duration-300 hover:border-primary-200" hover={false}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-surface-900 truncate">{item.product.name}</h3>
                    <p className="text-sm text-surface-500 mb-1">{item.product.brand}</p>
                    <p className="text-lg font-bold text-primary-600">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-surface-400 hover:text-red-500 p-1 transition-colors"
                      title="Retirer du panier"
                    >
                      <Icons.X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center border border-surface-200 rounded-lg overflow-hidden bg-surface-50">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-200 text-surface-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold bg-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-surface-200 text-surface-600 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-surface-200 shadow-lg sticky top-24">
              <h3 className="text-lg font-bold text-surface-900 mb-6">Récapitulatif</h3>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-surface-600">
                  <span>Sous-total</span>
                  <span className="font-medium text-surface-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-surface-600">
                  <span>Livraison</span>
                  <span className="text-green-600 font-medium">Gratuite</span>
                </div>
                <div className="flex justify-between text-surface-600">
                  <span>Taxes estimées</span>
                  <span className="text-surface-900">Incluses</span>
                </div>
              </div>

              {/* Sélecteur de Paiement */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-surface-900 mb-3">Moyen de paiement</h4>
                <div className="space-y-3">
                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Orange Money' ? 'border-orange-500 bg-orange-50/30' : 'border-surface-200 hover:border-surface-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="Orange Money" checked={paymentMethod === 'Orange Money'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-orange-500 border-surface-300 focus:ring-orange-500" />
                      <span className="font-bold text-sm text-surface-900">Orange Money</span>
                    </div>
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xs uppercase">OM</div>
                  </label>
                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Wave' ? 'border-blue-500 bg-blue-50/30' : 'border-surface-200 hover:border-surface-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="Wave" checked={paymentMethod === 'Wave'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-blue-500 border-surface-300 focus:ring-blue-500" />
                      <span className="font-bold text-sm text-surface-900">Wave</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">〰️</div>
                  </label>
                  <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'Carte' ? 'border-green-500 bg-green-50/30' : 'border-surface-200 hover:border-surface-300'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="payment" value="Carte" checked={paymentMethod === 'Carte'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-green-500 border-surface-300 focus:ring-green-500" />
                      <span className="font-bold text-sm text-surface-900">Carte Bancaire</span>
                    </div>
                    <Icons.CreditCard className="w-6 h-6 text-surface-500" />
                  </label>
                </div>
              </div>

              <div className="border-t border-dashed border-surface-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-surface-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>

              <Button
                onClick={() => handleCheckout(paymentMethod)}
                variant="primary"
                size="lg"
                className="w-full shadow-xl shadow-primary-500/20"
              >
                Passer la commande
              </Button>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full mt-3 flex items-center justify-center gap-2 border-2 border-[#25D366] text-[#25D366] font-bold py-3 rounded-xl hover:bg-green-50 transition-colors"
                title="Valider la commande sur WhatsApp"
              >
                <Icons.Phone className="w-5 h-5" />
                Commander via WhatsApp
              </button>

              <p className="text-xs text-center text-surface-400 mt-4 flex items-center justify-center gap-1">
                <Icons.Shield className="w-3 h-3" /> Paiement 100% sécurisé
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
