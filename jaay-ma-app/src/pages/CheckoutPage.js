import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../icons';
import { useAuth } from '../context/AuthContext';
import { getAssetUrl } from '../utils/assetUtils';
import { trackInitiateCheckout } from '../hooks/usePixel';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CheckoutPage = ({ cart = [], setCart, formatPrice }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Dakar'
  });

  const [paymentMethod, setPaymentMethod] = useState('wave'); // 'wave', 'orange-money', 'livraison'
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Adresse, 2: Paiement, 3: Confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Mettre à jour si user charge après coup
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || 'Dakar'
      }));
    }
  }, [user]);

  // Calcul local indicatif (le vrai total sera recalculé par le serveur)
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const steps = [
    { id: 1, name: 'Livraison', complete: checkoutStep > 1 },
    { id: 2, name: 'Paiement', complete: checkoutStep > 2 },
    { id: 3, name: 'Confirmation', complete: checkoutStep === 3 }
  ];

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!shippingInfo.address.trim()) {
      setErrorMessage('Veuillez renseigner votre adresse de livraison.');
      return;
    }
    if (!shippingInfo.phone.trim()) {
      setErrorMessage('Veuillez renseigner votre numéro de téléphone.');
      return;
    }
    setCheckoutStep(2);
  };

  const handleProcessOrder = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Votre panier est vide.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Veuillez vous reconnecter pour finaliser votre commande.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          })),
          address: shippingInfo.address,
          city: shippingInfo.city,
          phone: shippingInfo.phone,
          paymentMethod: paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'enregistrement de votre commande.');
      }

      // Commande créée avec succès
      setConfirmedOrder(data);

      // VIDER LE PANIER UNIQUEMENT APRÈS LA CRÉATION RÉUSSIE
      if (setCart) {
        setCart([]);
      }

      // Gestion spécifique au mode de paiement
      if (paymentMethod === 'wave' && data.wavePaymentUrl) {
        // Ouvre le lien Wave avec le montant RENVOYÉ PAR LE SERVEUR
        window.open(data.wavePaymentUrl, '_blank');
      }

      // Passer à l'étape de confirmation
      setCheckoutStep(3);

    } catch (err) {
      console.error('Erreur commande:', err);
      setErrorMessage(err.message || 'Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultFormatPrice = (amount) => {
    if (formatPrice) return formatPrice(amount);
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(amount || 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Fil d'ariane */}
      <div className="bg-surface-50 py-3 px-4 mb-8 rounded-xl flex items-center space-x-2 text-sm text-surface-500">
        <span className="cursor-pointer hover:text-primary-600" onClick={() => navigate('/')}>Accueil</span>
        <span>›</span>
        <span className="cursor-pointer hover:text-primary-600" onClick={() => navigate('/cart')}>Panier</span>
        <span>›</span>
        <span className="font-semibold text-surface-900">Validation de commande</span>
      </div>

      {/* Stepper */}
      <div className="mb-8 bg-white p-4 rounded-2xl border border-surface-200">
        <nav className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step.id < checkoutStep || (checkoutStep === 3 && step.id === 3)
                    ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                    : step.id === checkoutStep
                      ? 'bg-black text-white shadow-md'
                      : 'bg-surface-100 text-surface-400'
                }`}>
                  {step.id < checkoutStep || (checkoutStep === 3 && step.id === 3) ? '✓' : step.id}
                </div>
                <span className={`text-sm font-semibold hidden sm:inline ${
                  step.id === checkoutStep ? 'text-surface-900' : 'text-surface-400'
                }`}>
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all ${
                  step.complete ? 'bg-green-500' : 'bg-surface-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Bannière d'erreur */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <Icons.Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm font-medium">
            {errorMessage}
          </div>
          <button onClick={() => setErrorMessage('')} className="text-red-400 hover:text-red-700">✕</button>
        </div>
      )}

      {/* Étape 1 : Coordonnées et livraison */}
      {checkoutStep === 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-surface-200 shadow-sm">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
            <span>📍</span> Adresse de livraison & Coordonnées
          </h2>

          <form onSubmit={handleShippingSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  placeholder="Ex: Cheikh Anta Diop"
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
                  Email de notification *
                </label>
                <input
                  type="email"
                  value={shippingInfo.email}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                  placeholder="nom@exemple.com"
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
                  Numéro de téléphone (Wave / OM) *
                </label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  placeholder="Ex: 77 123 45 67"
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
                  Ville / Région *
                </label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  placeholder="Dakar, Thiès, Saint-Louis..."
                  className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-700 uppercase tracking-wider mb-2">
                Adresse exacte / Quartier / Point de repère *
              </label>
              <textarea
                rows="2"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                placeholder="Ex: Mermoz, Rue 12, à côté de la pharmacie"
                className="w-full px-4 py-3 border border-surface-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-surface-100">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="text-surface-600 hover:text-black font-semibold text-sm"
              >
                ← Retour au panier
              </button>
              <button
                type="submit"
                className="bg-black hover:bg-neutral-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md"
              >
                Continuer vers le paiement →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Étape 2 : Mode de paiement & Validation */}
      {checkoutStep === 2 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-surface-200 shadow-sm">
          <h2 className="text-xl font-bold text-surface-900 mb-6 flex items-center gap-2">
            <span>💳</span> Choisissez votre moyen de paiement
          </h2>

          <div className="space-y-3 mb-8">
            {/* Wave */}
            <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              paymentMethod === 'wave' ? 'border-blue-500 bg-blue-50/40 shadow-sm' : 'border-surface-200 hover:border-surface-300'
            }`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wave"
                  checked={paymentMethod === 'wave'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    〰️
                  </div>
                  <div>
                    <span className="font-bold text-surface-900 block">Wave</span>
                    <p className="text-xs text-surface-500">Paiement instantané sécurisé par lien Wave</p>
                  </div>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">
                Recommandé ✨
              </span>
            </label>

            {/* Orange Money */}
            <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              paymentMethod === 'orange-money' ? 'border-orange-500 bg-orange-50/40 shadow-sm' : 'border-surface-200 hover:border-surface-300'
            }`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="orange-money"
                  checked={paymentMethod === 'orange-money'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-orange-600"
                />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    OM
                  </div>
                  <div>
                    <span className="font-bold text-surface-900 block">Orange Money</span>
                    <p className="text-xs text-surface-500">Paiement mobile sécurisé</p>
                  </div>
                </div>
              </div>
            </label>

            {/* Paiement à la livraison */}
            <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
              paymentMethod === 'livraison' ? 'border-green-600 bg-green-50/40 shadow-sm' : 'border-surface-200 hover:border-surface-300'
            }`}>
              <div className="flex items-center gap-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="livraison"
                  checked={paymentMethod === 'livraison'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-green-600"
                />
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    💵
                  </div>
                  <div>
                    <span className="font-bold text-surface-900 block">Paiement à la livraison</span>
                    <p className="text-xs text-surface-500">Payez en espèces à la réception de votre commande</p>
                  </div>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full">
                À réception
              </span>
            </label>
          </div>

          {/* Récapitulatif Articles */}
          <div className="bg-surface-50 p-5 rounded-2xl mb-8 border border-surface-200">
            <h3 className="font-bold text-surface-900 mb-4 text-sm uppercase tracking-wider">
              Récapitulatif de la commande ({cart.length} article{cart.length > 1 ? 's' : ''})
            </h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2 divide-y divide-surface-200">
              {cart.map(item => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={getAssetUrl(item.product.image)}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-semibold text-surface-900">{item.product.name}</p>
                      <p className="text-xs text-surface-500">Quantité : {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-surface-900">
                    {defaultFormatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-surface-200 flex justify-between items-center">
              <span className="text-base font-bold text-surface-900">Total estimé</span>
              <span className="text-xl font-extrabold text-primary-600">
                {defaultFormatPrice(cartSubtotal)}
              </span>
            </div>
            <p className="text-[11px] text-surface-500 mt-2">
              * Le montant total final est strictement validé et recalculé côté serveur à partir des tarifs de la base de données.
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-surface-100">
            <button
              type="button"
              onClick={() => setCheckoutStep(1)}
              disabled={isSubmitting}
              className="text-surface-600 hover:text-black font-semibold text-sm disabled:opacity-50"
            >
              ← Modifier l'adresse
            </button>

            <button
              onClick={handleProcessOrder}
              disabled={isSubmitting}
              className={`px-8 py-3.5 rounded-xl font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
                paymentMethod === 'wave'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
              } disabled:opacity-50`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : paymentMethod === 'wave' ? (
                <>
                  <span>Payer avec Wave</span>
                  <span>↗</span>
                </>
              ) : (
                <>
                  <span>Confirmer la commande</span>
                  <span>✓</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 : Confirmation */}
      {checkoutStep === 3 && confirmedOrder && (
        <div className="bg-white rounded-2xl p-8 border border-surface-200 shadow-sm text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 text-3xl font-bold">
            ✓
          </div>

          <h2 className="text-3xl font-bold text-surface-900 mb-2">Commande confirmée avec succès !</h2>
          <p className="text-surface-600 mb-6 max-w-md mx-auto text-sm">
            Merci pour votre confiance. Votre commande a été enregistrée sous le statut{' '}
            <span className="font-bold text-yellow-600">EN ATTENTE</span>. Un email de récapitulatif vous a été envoyé.
          </p>

          <div className="bg-surface-50 rounded-2xl p-6 mb-8 text-left max-w-lg mx-auto border border-surface-200 space-y-3 text-sm">
            <div className="flex justify-between pb-2 border-b border-surface-200">
              <span className="text-surface-500">Numéro de commande :</span>
              <span className="font-mono font-bold text-surface-900">
                #{confirmedOrder.orderRef || confirmedOrder.orderId?.slice(-6).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-surface-200">
              <span className="text-surface-500">Mode de paiement :</span>
              <span className="font-semibold text-surface-900 capitalize">
                {confirmedOrder.order?.paymentMethod || paymentMethod}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-surface-200">
              <span className="text-surface-500">Adresse de livraison :</span>
              <span className="font-medium text-surface-900 text-right max-w-[200px] truncate">
                {confirmedOrder.order?.shippingAddress || shippingInfo.address}
              </span>
            </div>
            <div className="flex justify-between pt-1 text-base">
              <span className="font-bold text-surface-900">Total réglé / dû :</span>
              <span className="font-extrabold text-green-600">
                {defaultFormatPrice(confirmedOrder.totalPrice || confirmedOrder.order?.totalPrice)}
              </span>
            </div>
          </div>

          {paymentMethod === 'wave' && confirmedOrder.wavePaymentUrl && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-lg mx-auto text-xs text-blue-800">
              💡 Le lien de paiement Wave s'est ouvert dans un nouvel onglet. Si votre bloqueur de fenêtres l'a bloqué, vous pouvez cliquer ici :{' '}
              <a
                href={confirmedOrder.wavePaymentUrl}
                target="_blank"
                rel="noreferrer"
                className="font-bold underline text-blue-700"
              >
                Ouvrir le paiement Wave
              </a>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-black hover:bg-neutral-800 text-white py-3.5 px-6 rounded-xl font-bold transition-all"
            >
              Voir mes commandes
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="flex-1 bg-surface-100 hover:bg-surface-200 text-surface-900 py-3.5 px-6 rounded-xl font-bold transition-all"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
