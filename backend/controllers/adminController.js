const prisma = require('../config/prisma');

// @desc    Obtenir les statistiques globales (Admin)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const usersCount = await prisma.user.count();
        const productsCount = await prisma.product.count();

        const orders = await prisma.order.findMany();
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        const pendingOrders = orders.filter(o => o.status === 'En attente').length;

        // Récupérer les 5 dernières commandes
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true } } }
        });

        res.json({
            users: usersCount,
            products: productsCount,
            revenue: totalRevenue,
            pendingOrders,
            recentOrders
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur côté serveur' });
    }
};

// @desc    Obtenir la liste de tous les utilisateurs
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur côté serveur' });
    }
};

// @desc    Obtenir toutes les commandes (Admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { name: true, email: true } } }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur côté serveur' });
    }
};

module.exports = { getAdminStats, getAdminUsers, getAdminOrders };
