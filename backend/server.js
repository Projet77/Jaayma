const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Product Routes
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Favorite Routes
const favoriteRoutes = require('./routes/favoriteRoutes');
app.use('/api/favorites', favoriteRoutes);

// Admin Routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Vendor Routes
const vendorRoutes = require('./routes/vendorRoutes');
app.use('/api/vendor', vendorRoutes);

// Upload Route
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

// Banner Routes
const bannerRoutes = require('./routes/bannerRoutes');
app.use('/api/banners', bannerRoutes);

// Notification Routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Rendre le dossier 'uploads' statique
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Base Route
app.get('/', (req, res) => {
    res.send('Jaay-Ma Backend Running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
