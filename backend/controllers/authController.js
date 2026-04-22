const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { OAuth2Client } = require('google-auth-library');
const sendEmail = require('../utils/sendEmail');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, ...otherData } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await prisma.user.findUnique({ where: { email } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'client',
                phone: otherData.phone || null,
                address: otherData.address || null,
                city: otherData.city || null,
                shopName: otherData.shopName || null,
            }
        });

        // Générer une notification de bienvenue in-app
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: "Bienvenue sur Jaay-Ma !",
                message: "Merci de nous avoir rejoints. Votre profil est créé avec succès."
            }
        });

        // Envoyer l'email de bienvenue
        const emailHtml = `
            <h2>Bienvenue sur Jaay-Ma, ${name} ! 🎉</h2>
            <p>Nous sommes ravis de vous compter parmi nous.</p>
            <p>Votre compte a bien été créé avec l'adresse <strong>${email}</strong>.</p>
            <br/>
            <p>Vous pouvez dès à présent explorer nos produits et finaliser vos achats en toute sécurité.</p>
            <br/>
            <p>L'équipe Jaay-Ma.</p>
        `;
        
        // Exécution en arrière-plan sans bloquer (await retiré)
        sendEmail({
            to: email,
            subject: 'Bienvenue sur Jaay-Ma !',
            html: emailHtml
        });

        if (user) {
            res.status(201).json({
                _id: user.id, // Garder _id pour la rétrocompatibilité (frontend)
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopName: user.shopName,
                token: generateToken(user.id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await prisma.user.findUnique({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopName: user.shopName,
                metaPixelId: user.metaPixelId,
                token: generateToken(user.id),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    shopName: user.shopName,
                    metaPixelId: user.metaPixelId
                }
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });

        if (user) {
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopName: user.shopName,
                metaPixelId: user.metaPixelId,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate with Google (connexion uniquement, pas d'inscription automatique)
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'Token Google manquant.' });
        }

        const clientId = process.env.GOOGLE_CLIENT_ID;

        if (!clientId) {
            console.error('GOOGLE_CLIENT_ID non configuré sur le serveur !');
            return res.status(500).json({ message: 'Configuration Google manquante sur le serveur. Contactez l\'administrateur.' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: clientId, // Vérification stricte de l'audience
        });

        const payload = ticket.getPayload();
        const { email } = payload;

        // Chercher si l'utilisateur existe DÉJÀ (il doit avoir rempli le formulaire avant)
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({
                message: `Aucun compte trouvé pour ${email}. Veuillez d'abord vous inscrire via le formulaire en renseignant votre adresse et votre téléphone.`
            });
        }

        res.json({
            _id: user.id,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            metaPixelId: user.metaPixelId,
            token: generateToken(user.id),
            user: { id: user.id, name: user.name, email: user.email, role: user.role, metaPixelId: user.metaPixelId }
        });

    } catch (error) {
        console.error("Erreur Google Login:", error.message);
        res.status(401).json({ message: 'Token Google invalide ou expiré. Assurez-vous que GOOGLE_CLIENT_ID est configuré sur le serveur.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleLogin,
};
