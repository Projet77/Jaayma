const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { OAuth2Client } = require('google-auth-library');

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
            }
        });

        // Générer une notification de bienvenue
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: "Bienvenue sur Jaay-Ma !",
                message: "Merci de nous avoir rejoints. Votre compte a été créé avec succès. Commencez dès maintenant à explorer nos meilleures offres."
            }
        });

        if (user) {
            res.status(201).json({
                _id: user.id, // Garder _id pour la rétrocompatibilité (frontend)
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
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
                token: generateToken(user.id),
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
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
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ message: 'Missing Google ID Token' });
        }

        // Vérification du token via g-auth-library
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            // audience: process.env.GOOGLE_CLIENT_ID, // Mieux vaut vérifier l'audience en prod
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Chercher si l'utilisateur existe déjà
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Création silencieuse d'un compte avec un mot de passe aléatoire indéchiffrable
            const salt = await bcrypt.genSalt(10);
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await prisma.user.create({
                data: {
                    name: name || 'Google User',
                    email,
                    password: hashedPassword,
                    role: 'client',
                }
            });

            // Notification de bienvenue
            await prisma.notification.create({
                data: {
                    userId: user.id,
                    title: "Bienvenue sur Jaay-Ma !",
                    message: "Merci d'avoir utilisé Google pour vous connecter. Votre profil est prêt."
                }
            });
        }

        // On renvoie un JWT Jaay-Ma classique
        res.json({
            _id: user.id,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            picture: picture || null,
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Erreur Google Login:", error);
        res.status(401).json({ message: 'Invalid or expired Google Token' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    googleLogin,
};
