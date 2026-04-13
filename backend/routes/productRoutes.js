const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductFeature
} = require('../controllers/productController');
const {
    createProductReview,
    getProductReviews
} = require('../controllers/reviewController');

const { protect, vendor } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, vendor, createProduct);
router.route('/:id').get(getProductById).put(protect, vendor, updateProduct).delete(protect, vendor, deleteProduct);
router.route('/:id/feature').put(protect, vendor, toggleProductFeature);
router.route('/:id/reviews').get(getProductReviews).post(protect, createProductReview);

module.exports = router;
