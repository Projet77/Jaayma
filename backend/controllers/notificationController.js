const prisma = require('../config/prisma');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Default create Notification (internal use & test)
// @route   POST /api/notifications
// @access  Private/Admin
const createNotification = async (req, res) => {
    try {
        const { userId, title, message } = req.body;

        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message
            }
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notifId = req.params.id;

        const notification = await prisma.notification.findUnique({
            where: { id: notifId }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
        }

        if (notification.userId !== req.user.id) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const updated = await prisma.notification.update({
            where: { id: notifId },
            data: { isRead: true }
        });

        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });

        res.json({ message: 'Toutes les notifications ont été lues' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getNotifications,
    createNotification,
    markAsRead,
    markAllAsRead
};
