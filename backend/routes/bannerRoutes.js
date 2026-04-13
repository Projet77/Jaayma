const express = require('express');
const router = express.Router();
const {
    getBanners,
    createBanner,
    toggleBannerStatus,
    deleteBanner
} = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getBanners)
    .post(protect, admin, createBanner);

router.route('/:id/toggle')
    .put(protect, admin, toggleBannerStatus);

router.route('/:id')
    .delete(protect, admin, deleteBanner);

module.exports = router;
