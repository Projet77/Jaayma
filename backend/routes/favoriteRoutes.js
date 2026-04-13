const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite } = require('../controllers/favoriteController');

// Middleware d'authentification requis pour toutes ces routes
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
    .get(getFavorites);

router.route('/:productId')
    .post(toggleFavorite);

module.exports = router;
