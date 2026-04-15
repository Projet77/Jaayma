const express = require('express');
const { getAdminStats, getAdminUsers, getAdminOrders, updateUser, deleteUser } = require('../controllers/adminController');
const { getPromos, createPromo, togglePromoStatus, deletePromo } = require('../controllers/promoController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes protégées pour l'Admin
router.route('/stats').get(protect, admin, getAdminStats);
router.route('/users').get(protect, admin, getAdminUsers);
router.route('/users/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);
router.route('/orders').get(protect, admin, getAdminOrders);

// Routes Promotions pour l'Admin
router.route('/promos')
    .get(protect, admin, getPromos)
    .post(protect, admin, createPromo);
router.route('/promos/:id')
    .put(protect, admin, togglePromoStatus)
    .delete(protect, admin, deletePromo);

module.exports = router;
