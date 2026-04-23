const prisma = require('../config/prisma');

// @desc    Obtenir les paramètres publics (réseaux sociaux, contact footer)
// @route   GET /api/settings
// @access  Public
const getPublicSettings = async (req, res) => {
    try {
        let settings = await prisma.systemSettings.findUnique({ where: { id: "singleton" } });
        if (!settings) {
            settings = await prisma.systemSettings.create({ data: { id: "singleton" } });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Erreur', error: error.message });
    }
};

// @desc    Obtenir les paramètres admin
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        let settings = await prisma.systemSettings.findUnique({ where: { id: "singleton" } });
        if (!settings) {
            settings = await prisma.systemSettings.create({ data: { id: "singleton" } });
        }
        res.json(settings);
    } catch (error) {
        console.error('Erreur getSettings:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des paramètres', error: error.message });
    }
};

// @desc    Mettre à jour les paramètres du système
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const {
            platformName, supportEmail, supportPhone, whatsappNumber,
            defaultCurrency, paymentMethods, heroTitle, heroSubtitle,
            navigationItems, facebookUrl, instagramUrl, tiktokUrl, twitterUrl
        } = req.body;

        const settings = await prisma.systemSettings.upsert({
            where: { id: "singleton" },
            update: {
                ...(platformName !== undefined && { platformName }),
                ...(supportEmail !== undefined && { supportEmail }),
                ...(supportPhone !== undefined && { supportPhone }),
                ...(whatsappNumber !== undefined && { whatsappNumber }),
                ...(defaultCurrency !== undefined && { defaultCurrency }),
                ...(paymentMethods !== undefined && { paymentMethods }),
                ...(heroTitle !== undefined && { heroTitle }),
                ...(heroSubtitle !== undefined && { heroSubtitle }),
                ...(navigationItems !== undefined && { navigationItems }),
                ...(facebookUrl !== undefined && { facebookUrl }),
                ...(instagramUrl !== undefined && { instagramUrl }),
                ...(tiktokUrl !== undefined && { tiktokUrl }),
                ...(twitterUrl !== undefined && { twitterUrl }),
            },
            create: {
                id: "singleton",
                platformName: platformName || "Jaay-Ma",
                supportEmail: supportEmail || "support@jaay-ma.sn",
                supportPhone: supportPhone || "+221 77 000 00 00",
                whatsappNumber: whatsappNumber || "+221 77 000 00 00",
                facebookUrl: facebookUrl || "",
                instagramUrl: instagramUrl || "",
                tiktokUrl: tiktokUrl || "",
                twitterUrl: twitterUrl || "",
            }
        });

        res.json(settings);
    } catch (error) {
        console.error('Erreur updateSettings:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour des paramètres', error: error.message });
    }
};

module.exports = {
    getPublicSettings,
    getSettings,
    updateSettings
};
