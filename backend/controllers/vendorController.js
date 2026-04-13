const prisma = require('../config/prisma');

// @desc    Obtenir les statistiques commerciales d'un Vendor
// @route   GET /api/vendor/stats
// @access  Private/Vendor
const getVendorStats = async (req, res) => {
    try {
        const vendorId = req.user.id;

        // 1. Calcul du CA et commandes
        const orders = await prisma.order.findMany({
            where: {
                orderItems: { some: { product: { vendorId } } }
            },
            include: { user: true, orderItems: { include: { product: true } } }
        });

        const totalRevenue = orders.reduce((acc, order) => {
            const vendorItems = order.orderItems.filter(item => item.product.vendorId === vendorId);
            const orderTotal = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return acc + orderTotal;
        }, 0);

        const activeProducts = await prisma.product.count({
            where: { vendorId, inStock: true }
        });

        res.json({
            revenue: totalRevenue,
            ordersCount: orders.length,
            activeProducts,
            recentOrders: orders.slice(0, 5) // Les 5 dernières
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur côté serveur' });
    }
};

module.exports = { getVendorStats };
