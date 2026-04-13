const prisma = require('../config/prisma');

// @desc    Obtenir tous les favoris (Wishlist) de l'utilisateur connecté
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
    try {
        const favorites = await prisma.favorite.findMany({
            where: { userId: req.user.id },
            include: {
                product: true // Inclure les infos du produit
            }
        });

        res.status(200).json(favorites.map(fav => fav.product));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des favoris' });
    }
};

// @desc    Ajouter ou Retirer un produit des favoris (Toggle)
// @route   POST /api/favorites/:productId
// @access  Private
const toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        // Véfifier si le produit existe
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: 'Produit introuvable' });
        }

        // Vérifier si le favori existe déjà
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId: userId,
                    productId: productId
                }
            }
        });

        if (existingFavorite) {
            // Le produit est déjà en favoris, on le retire
            await prisma.favorite.delete({
                where: { id: existingFavorite.id }
            });
            return res.status(200).json({ message: 'Produit retiré des favoris', action: 'removed', productId });
        } else {
            // Le produit n'est pas en favoris, on l'ajoute
            await prisma.favorite.create({
                data: {
                    userId: userId,
                    productId: productId
                }
            });
            return res.status(201).json({ message: 'Produit ajouté aux favoris', action: 'added', productId });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout/suppression en favoris' });
    }
};

module.exports = {
    getFavorites,
    toggleFavorite
};
