const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Configuration Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Stockage Cloudinary pour image unique
const storageSingle = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'jaay-ma/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    },
});

// Stockage Cloudinary pour images multiples
const storageMultiple = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'jaay-ma/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    },
});

const uploadSingle = multer({ storage: storageSingle });
const uploadMultiple = multer({ storage: storageMultiple });

// POST /api/upload — Image unique
router.post('/', protect, uploadSingle.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier uploadé.' });
        }
        // Cloudinary retourne l'URL complète dans req.file.path
        res.json({ imageUrl: req.file.path });
    } catch (error) {
        console.error('Erreur upload Cloudinary:', error);
        res.status(500).json({ message: 'Erreur lors de l\'upload.' });
    }
});

// POST /api/upload/multiple — Jusqu'à 4 images
router.post('/multiple', protect, uploadMultiple.array('images', 4), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Aucun fichier uploadé.' });
        }
        const imageUrls = req.files.map(file => file.path);
        res.json({ imageUrls });
    } catch (error) {
        console.error('Erreur upload multiple Cloudinary:', error);
        res.status(500).json({ message: 'Erreur lors de l\'upload.' });
    }
});

module.exports = router;
