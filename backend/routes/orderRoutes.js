const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getVendorOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin, vendor } = require('../middleware/authMiddleware');

// Créer une commande (Client connecté)
router.post('/', protect, createOrder);

// Commandes de l'utilisateur connecté
router.get('/me', protect, getMyOrders);

// Commandes des vendeurs (Vendeur ou Admin)
router.get('/vendor', protect, vendor, getVendorOrders);

// Toutes les commandes (Admin)
router.get('/', protect, admin, getAllOrders);

// Détail d'une commande
router.get('/:id', protect, getOrderById);

// Mettre à jour le statut (Admin ou Vendeur concerné)
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
