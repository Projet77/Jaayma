const prisma = require('../config/prisma');

// @desc    Get all active banners (for public facing) or all banners (for admin)
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res) => {
    try {
        const { all } = req.query; // If ?all=true is passed, returns all banners regardless of status (Admin use)

        let whereClause = {};
        if (all !== 'true') {
            whereClause = { isActive: true };
        }

        const banners = await prisma.banner.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res) => {
    try {
        const { imageUrl, linkUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: 'Veuillez fournir une image.' });
        }

        const banner = await prisma.banner.create({
            data: {
                imageUrl,
                linkUrl: linkUrl || null,
                isActive: true,
            },
        });

        res.status(201).json(banner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Toggle banner active status
// @route   PUT /api/banners/:id/toggle
// @access  Private/Admin
const toggleBannerStatus = async (req, res) => {
    try {
        const banner = await prisma.banner.findUnique({
            where: { id: req.params.id }
        });

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        const updatedBanner = await prisma.banner.update({
            where: { id: req.params.id },
            data: { isActive: !banner.isActive }
        });

        res.json(updatedBanner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res) => {
    try {
        const banner = await prisma.banner.findUnique({
            where: { id: req.params.id }
        });

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        await prisma.banner.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Bannière supprimée' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getBanners,
    createBanner,
    toggleBannerStatus,
    deleteBanner
};
