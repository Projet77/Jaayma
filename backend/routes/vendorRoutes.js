const express = require('express');
const { getVendorStats } = require('../controllers/vendorController');
const { protect, vendor } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes protégées pour le Vendor
router.route('/stats').get(protect, vendor, getVendorStats);

module.exports = router;
