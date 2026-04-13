const prisma = require('../config/prisma');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { featured, search, category, minPrice, maxPrice, sort } = req.query;
        let whereClause = {};

        // 1. Filtre mis en avant
        if (featured === 'true') {
            whereClause.isFeatured = true;
        }

        // 2. Recherche textuelle globale
        if (search) {
            whereClause.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        // 3. Filtre par Catégorie
        if (category) {
            whereClause.category = category;
        }

        // 4. Filtre par Prix (Min et/ou Max)
        if (minPrice || maxPrice) {
            whereClause.price = {};
            if (minPrice) whereClause.price.gte = parseFloat(minPrice);
            if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
        }

        // 5. Tri (Sorting)
        let orderByClause = { createdAt: 'desc' }; // Tri par défaut (les plus récents)
        if (sort) {
            switch (sort) {
                case 'price_asc':
                    orderByClause = { price: 'asc' };
                    break;
                case 'price_desc':
                    orderByClause = { price: 'desc' };
                    break;
                case 'rating_desc':
                    orderByClause = { rating: 'desc' };
                    break;
                case 'newest':
                default:
                    orderByClause = { createdAt: 'desc' };
                    break;
            }
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            include: { vendor: { select: { name: true } } },
            orderBy: orderByClause
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', detail: error.message, stack: error.stack });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        // Prisma errors for invalid UUID usually have a specific code, but handling general errors here:
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = async (req, res) => {
    try {
        const { name, brand, price, originalPrice, category, description, image, images, inStock, stock, reviews, rating } = req.body;

        const parsedPrice = parseFloat(price);
        const parsedOriginalPrice = originalPrice ? parseFloat(originalPrice) : null;

        if (isNaN(parsedPrice)) {
            return res.status(400).json({ message: 'Le prix est invalide' });
        }

        const product = await prisma.product.create({
            data: {
                name,
                brand,
                price: parsedPrice,
                originalPrice: !isNaN(parsedOriginalPrice) ? parsedOriginalPrice : null,
                category,
                description,
                image: image || (images && images.length > 0 ? images[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80"),
                images: images || [],
                inStock: inStock === 'true' || inStock === true,
                stock: !isNaN(parseInt(stock, 10)) ? parseInt(stock, 10) : 0,
                reviews: !isNaN(parseInt(reviews, 10)) ? parseInt(reviews, 10) : 0,
                rating: !isNaN(parseFloat(rating)) ? parseFloat(rating) : 0,
                vendorId: req.user.id
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Données produit invalides ou erreur système' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (product) {
            const { name, brand, price, originalPrice, category, description, image, images, inStock, stock, reviews, rating } = req.body;

            const dataToUpdate = {};
            if (name !== undefined) dataToUpdate.name = name;
            if (brand !== undefined) dataToUpdate.brand = brand;
            if (category !== undefined) dataToUpdate.category = category;
            if (description !== undefined) dataToUpdate.description = description;

            if (price !== undefined) {
                const parsedPrice = parseFloat(price);
                if (!isNaN(parsedPrice)) dataToUpdate.price = parsedPrice;
            }
            if (originalPrice !== undefined) {
                if (originalPrice === null || originalPrice === "") {
                    dataToUpdate.originalPrice = null;
                } else {
                    const parsed = parseFloat(originalPrice);
                    if (!isNaN(parsed)) dataToUpdate.originalPrice = parsed;
                }
            }

            if (image !== undefined) dataToUpdate.image = image;
            if (images !== undefined) {
                dataToUpdate.images = images;
                if (!image && images.length > 0) {
                    dataToUpdate.image = images[0];
                }
            }

            if (inStock !== undefined) dataToUpdate.inStock = inStock === 'true' || inStock === true;
            if (stock !== undefined) {
                const parsedStock = parseInt(stock, 10);
                if (!isNaN(parsedStock)) dataToUpdate.stock = parsedStock;
            }
            if (reviews !== undefined) {
                const parsedReviews = parseInt(reviews, 10);
                if (!isNaN(parsedReviews)) dataToUpdate.reviews = parsedReviews;
            }
            if (rating !== undefined) {
                const parsedRating = parseFloat(rating);
                if (!isNaN(parsedRating)) dataToUpdate.rating = parsedRating;
            }

            const updatedProduct = await prisma.product.update({
                where: { id: req.params.id },
                data: dataToUpdate
            });
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (product) {
            await prisma.product.delete({
                where: { id: req.params.id }
            });
            res.status(200).json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle product feature status
// @route   PUT /api/products/:id/feature
// @access  Private/Vendor/Admin
const toggleProductFeature = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: req.params.id },
            data: { isFeatured: !product.isFeatured }
        });

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductFeature,
};
