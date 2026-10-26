import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAssetUrl } from '../utils/assetUtils';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case 'EN_ATTENTE':
    case 'EN ATTENTE':
      return {
        label: 'En attente',
        classes: 'bg-amber-50 text-amber-700 border-amber-200'
      };
    case 'PAYEE':
      return {
        label: 'Payée',
        classes: 'bg-blue-50 text-blue-700 border-blue-200'
      };
    case 'EXPEDIEE':
      return {
        label: 'Expédiée',
        classes: 'bg-purple-50 text-purple-700 border-purple-200'
      };
    case 'LIVREE':
      return {
        label: 'Livrée',
        classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
      };
    case 'ANNULEE':
      return {
        label: 'Annulée',
        classes: 'bg-red-50 text-red-700 border-red-200'
      };
    default:
      return {
        label: status || 'Inconnu',
        classes: 'bg-neutral-50 text-neutral-700 border-neutral-200'
      };
  }
};

const MyOrdersPage = ({ formatPrice }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API}/api/orders/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Impossible de charger vos commandes');
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const defaultFormatPrice = (amount) => {
    if (formatPrice) return formatPrice(amount);
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(amount || 0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-surface-900 tracking-tight">Mes Commandes</h1>
          <p className="text-sm text-surface-500 mt-1">
            Consultez le statut et l'historique de tous vos achats sur Jaay-Ma
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="self-start sm:self-auto px-4 py-2 bg-surface-100 hover:bg-surface-200 text-surface-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
        >
          <span>↻</span> Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-surface-200">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-surface-500">Chargement de vos commandes...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-center">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-surface-200 border-dashed">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold text-surface-900 mb-2">Aucune commande pour le moment</h3>
          <p className="text-surface-500 text-sm mb-6 max-w-sm mx-auto">
            Vous n'avez pas encore passé de commande. Découvrez nos articles et profitez des meilleures offres au Sénégal !
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-black text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-md"
          >
            Découvrir la boutique
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const orderRef = order.id.slice(-6).toUpperCase();
            const orderDate = new Date(order.createdAt).toLocaleDateString('fr-SN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden transition-all hover:border-surface-300"
              >
                {/* Entête Commande */}
                <div className="p-5 bg-surface-50/60 border-b border-surface-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-base text-surface-900">
                      Commande #{orderRef}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badge.classes}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-surface-500">
                    <div>
                      <span>Date : </span>
                      <span className="font-medium text-surface-800">{orderDate}</span>
                    </div>
                    <div>
                      <span>Paiement : </span>
                      <span className="font-medium text-surface-800 capitalize">
                        {order.paymentMethod || 'Non spécifié'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenu : Articles */}
                <div className="p-5 divide-y divide-surface-100">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getAssetUrl(item.product?.image)}
                            alt={item.product?.name || 'Produit'}
                            className="w-16 h-16 object-cover rounded-xl border border-surface-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-surface-900">
                              {item.product?.name || 'Article du catalogue'}
                            </h4>
                            <p className="text-xs text-surface-500">
                              {item.product?.brand ? `${item.product.brand} • ` : ''}Quantité : {item.quantity}
                            </p>
                            <p className="text-xs text-primary-600 font-semibold mt-1">
                              {defaultFormatPrice(item.price)} l'unité
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-sm text-surface-900">
                            {defaultFormatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-surface-400 py-2">Détails des articles indisponibles.</p>
                  )}
                </div>

                {/* Pied de commande */}
                <div className="px-5 py-4 bg-surface-50/40 border-t border-surface-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-surface-600">
                    <span className="font-semibold text-surface-800">Livraison à : </span>
                    <span>{order.shippingAddress || 'Adresse enregistrée'}</span>
                    {order.phone && <span> • Tél : {order.phone}</span>}
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-sm">
                    <span className="text-surface-500 font-medium">Total commande :</span>
                    <span className="font-extrabold text-base text-surface-900">
                      {defaultFormatPrice(order.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
