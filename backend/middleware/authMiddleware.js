const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Récupérer l'utilisateur depuis la BDD (sans le mot de passe)
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true, role: true }
            });

            if (!req.user) {
                return res.status(401).json({ message: 'Utilisateur introuvable.' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token invalide ou expiré.' });
        }
    } else {
        res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    }
};

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
    }
};

const vendor = (req, res, next) => {
    if (req.user && (req.user.role === 'vendor' || req.user.role === 'admin' || req.user.role === 'super-admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Accès refusé. Droits vendeur requis.' });
    }
};

module.exports = { protect, admin, vendor };
