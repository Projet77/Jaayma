import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactPixel from 'react-facebook-pixel';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Hook centralise pour le Meta Pixel (Facebook Pixel).
 * - Initialise le Pixel depuis les SystemSettings (public, sans auth)
 * - Declenche PageView a chaque changement de route (SPA fix)
 * - Fonctionne pour tous les visiteurs, connectes ou non
 */
export function usePixel() {
  const location = useLocation();
  const initialized = useRef(false);
  const pixelIdRef = useRef(null);

  useEffect(() => {
    if (initialized.current) return;
    const initPixel = async () => {
      try {
        const res = await fetch(`${API}/api/settings`);
        if (!res.ok) return;
        const settings = await res.json();
        const pixelId = settings?.metaPixelId;
        if (pixelId && pixelId.trim() !== '') {
          pixelIdRef.current = pixelId.trim();
          ReactPixel.init(pixelIdRef.current, undefined, {
            autoConfig: true,
            debug: process.env.NODE_ENV === 'development',
          });
          ReactPixel.pageView();
          initialized.current = true;
          console.log('[Pixel] Initialise avec ID:', pixelIdRef.current);
        }
      } catch (err) {
        console.warn('[Pixel] Impossible de charger les settings:', err.message);
      }
    };
    initPixel();
  }, []);

  useEffect(() => {
    if (initialized.current) {
      ReactPixel.pageView();
    }
  }, [location.pathname]);
}

export function trackViewContent(product) {
  if (!product) return;
  try {
    ReactPixel.track('ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category || 'General',
      content_type: 'product',
      currency: 'XOF',
      value: product.price,
    });
  } catch (e) {}
}

export function trackAddToCart(product, qty) {
  if (!product) return;
  try {
    ReactPixel.track('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      currency: 'XOF',
      value: product.price * (qty || 1),
      num_items: qty || 1,
    });
  } catch (e) {}
}

export function trackInitiateCheckout(cartItems, total) {
  if (!cartItems || cartItems.length === 0) return;
  try {
    ReactPixel.track('InitiateCheckout', {
      content_ids: cartItems.map(function(item) { return item.product.id; }),
      contents: cartItems.map(function(item) { return { id: item.product.id, quantity: item.quantity, item_price: item.product.price }; }),
      num_items: cartItems.reduce(function(acc, item) { return acc + item.quantity; }, 0),
      currency: 'XOF',
      value: total,
    });
  } catch (e) {}
}

export function trackPurchase(cartItems, total, orderId) {
  if (!cartItems || cartItems.length === 0) return;
  try {
    ReactPixel.track('Purchase', {
      content_ids: cartItems.map(function(item) { return item.product.id; }),
      contents: cartItems.map(function(item) { return { id: item.product.id, quantity: item.quantity, item_price: item.product.price }; }),
      num_items: cartItems.reduce(function(acc, item) { return acc + item.quantity; }, 0),
      currency: 'XOF',
      value: total,
      order_id: orderId || undefined,
    });
  } catch (e) {}
}

export function trackAddToWishlist(product) {
  if (!product) return;
  try {
    ReactPixel.track('AddToWishlist', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.category || 'General',
      currency: 'XOF',
      value: product.price,
    });
  } catch (e) {}
}

export function trackSearch(searchString) {
  if (!searchString || !searchString.trim()) return;
  try {
    ReactPixel.track('Search', { search_string: searchString.trim() });
  } catch (e) {}
}
