const prisma = require('../config/prisma');

// @desc    Créer un avis sur un produit
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Veuillez fournir une note valide (entre 1 et 5)' });
        }

        // 1. Vérifier si le produit existe
        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) {
            return res.status(404).json({ message: 'Produit introuvable' });
        }

        // 2. Vérifier si l'utilisateur a déjà laissé un avis
        const alreadyReviewed = await prisma.review.findFirst({
            where: { productId, userId }
        });
        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Vous avez déjà laissé un avis sur ce produit' });
        }

        // 3. Vérifier si l'utilisateur a ACHETÉ le produit
        const hasBought = await prisma.orderItem.findFirst({
            where: {
                productId: productId,
                order: {
                    userId: userId,
                    // Idéalement on vérifierait aussi status: "Livrée", mais gardons simple pour l'instant
                }
            }
        });

        if (!hasBought) {
            return res.status(403).json({ message: 'Vous devez avoir acheté ce produit pour laisser un avis' });
        }

        // 4. Créer l'avis
        const review = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                productId,
                userId
            }
        });

        // 5. Recalculer la note moyenne et le nombre d'avis
        const allReviews = await prisma.review.findMany({ where: { productId } });
        const numReviews = allReviews.length;
        const totalRating = allReviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = totalRating / numReviews;

        await prisma.product.update({
            where: { id: productId },
            data: {
                rating: averageRating,
                reviews: numReviews
            }
        });

        res.status(201).json({ message: 'Avis ajouté avec succès', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur Serveur' });
    }
};

// @desc    Obtenir les avis d'un produit
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.id;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: { select: { name: true } } // On renvoie juste le nom pour l'affichage
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur Serveur' });
    }
};

module.exports = {
    createProductReview,
    getProductReviews
};
