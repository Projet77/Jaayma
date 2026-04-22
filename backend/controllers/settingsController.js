const prisma = require('../config/prisma');

// @desc    Obtenir les paramètres du système
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        let settings = await prisma.systemSettings.findUnique({
            where: { id: "singleton" }
        });

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: { id: "singleton" }
            });
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
        const { platformName, supportEmail, supportPhone, defaultCurrency, paymentMethods, heroTitle, heroSubtitle, navigationItems } = req.body;
        
        const settings = await prisma.systemSettings.upsert({
            where: { id: "singleton" },
            update: {
                ...(platformName && { platformName }),
                ...(supportEmail && { supportEmail }),
                ...(supportPhone && { supportPhone }),
                ...(defaultCurrency && { defaultCurrency }),
                ...(paymentMethods && { paymentMethods }),
                ...(heroTitle && { heroTitle }),
                ...(heroSubtitle && { heroSubtitle }),
                ...(navigationItems && { navigationItems })
            },
            create: {
                id: "singleton",
                platformName,
                supportEmail,
                supportPhone,
                defaultCurrency,
                paymentMethods,
                heroTitle,
                heroSubtitle,
                navigationItems
            }
        });

        res.json(settings);
    } catch (error) {
        console.error('Erreur updateSettings:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour des paramètres', error: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
