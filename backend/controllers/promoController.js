const prisma = require('../config/prisma');

// @desc    Obtenir la liste des codes promo
// @route   GET /api/admin/promos
// @access  Private/Admin
const getPromos = async (req, res) => {
    try {
        const promos = await prisma.promoCode.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(promos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur côté serveur' });
    }
};

// @desc    Créer un code promo
// @route   POST /api/admin/promos
// @access  Private/Admin
const createPromo = async (req, res) => {
    try {
        const { code, discountType, discountValue, expiresAt } = req.body;

        if (!code || !discountType || !discountValue) {
            return res.status(400).json({ message: 'Veuillez remplir les champs obligatoires' });
        }

        // Vérifier si le code existe déjà
        const promoExists = await prisma.promoCode.findUnique({
            where: { code: code.toUpperCase() },
        });

        if (promoExists) {
            return res.status(400).json({ message: 'Ce code promo existe déjà' });
        }

        const promo = await prisma.promoCode.create({
            data: {
                code: code.toUpperCase(),
                discountType,
                discountValue: parseFloat(discountValue),
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                isActive: true,
            },
        });

        res.status(201).json(promo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la création du code promo' });
    }
};

// @desc    Activer/Désactiver une promo
// @route   PUT /api/admin/promos/:id
// @access  Private/Admin
const togglePromoStatus = async (req, res) => {
    try {
        const promo = await prisma.promoCode.findUnique({
            where: { id: req.params.id },
        });

        if (!promo) {
            return res.status(404).json({ message: 'Code promo non trouvé' });
        }

        const updatedPromo = await prisma.promoCode.update({
            where: { id: req.params.id },
            data: {
                isActive: !promo.isActive,
            },
        });

        res.json(updatedPromo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};

// @desc    Supprimer un code promo
// @route   DELETE /api/admin/promos/:id
// @access  Private/Admin
const deletePromo = async (req, res) => {
    try {
        const promo = await prisma.promoCode.findUnique({
            where: { id: req.params.id },
        });

        if (!promo) {
            return res.status(404).json({ message: 'Code promo non trouvé' });
        }

        await prisma.promoCode.delete({
            where: { id: req.params.id },
        });

        res.json({ message: 'Code promo supprimé' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};

module.exports = {
    getPromos,
    createPromo,
    togglePromoStatus,
    deletePromo,
};
