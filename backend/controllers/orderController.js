const prisma = require('../config/prisma');
const sendEmail = require('../utils/sendEmail');

// Helper pour formater les prix
const formatFCFA = (amount) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(amount);
};

// @desc    Créer une nouvelle commande
// @route   POST /api/orders
// @access  Private (Client connecté)
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, address, city, phone, paymentMethod } = req.body;

        const rawItems = items || req.body.orderItems || [];
        if (!rawItems || rawItems.length === 0) {
            return res.status(400).json({ message: 'Le panier est vide. Veuillez ajouter des articles.' });
        }

        const deliveryPhone = phone || req.user.phone || '';
        const fullAddress = [address || shippingAddress, city].filter(Boolean).join(', ') || 'Adresse non spécifiée';
        const chosenPaymentMethod = paymentMethod || 'livraison';

        // 1. Récupérer tous les IDs des produits demandés
        const parsedItems = rawItems.map(item => ({
            productId: item.productId || item.product?.id || item.id,
            quantity: Math.max(1, parseInt(item.quantity, 10) || 1)
        }));

        const productIds = parsedItems.map(i => i.productId);
        const productsFromDb = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        const productMap = new Map();
        productsFromDb.forEach(p => productMap.set(p.id, p));

        // 2. Vérification d'existence et des stocks
        for (const item of parsedItems) {
            const product = productMap.get(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Le produit sélectionné (${item.productId}) n'existe pas.` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Stock insuffisant pour "${product.name}". Disponible : ${product.stock}, demandé : ${item.quantity}.`
                });
            }
        }

        // 3. Recalcul STRICT du total côté serveur (ne jamais faire confiance au prix envoyé)
        let calculatedTotal = 0;
        const verifiedOrderItems = parsedItems.map(item => {
            const product = productMap.get(item.productId);
            const lineTotal = product.price * item.quantity;
            calculatedTotal += lineTotal;
            return {
                productId: product.id,
                quantity: item.quantity,
                price: product.price
            };
        });

        // 4. Transaction Prisma pour créer Order, OrderItems, décrémenter le stock et créer la Notification
        const result = await prisma.$transaction(async (tx) => {
            // Adresse incluant le téléphone pour garantie de transmission
            const addressWithPhone = deliveryPhone && !fullAddress.includes(deliveryPhone)
                ? `${fullAddress} (Tél: ${deliveryPhone})`
                : fullAddress;

            const orderCreateData = {
                userId: req.user.id,
                totalPrice: Math.round(calculatedTotal),
                status: 'EN_ATTENTE',
                paymentMethod: chosenPaymentMethod,
                shippingAddress: addressWithPhone,
                orderItems: {
                    create: verifiedOrderItems
                }
            };

            // Si le client Prisma a déjà été régénéré avec le champ phone
            const orderFields = prisma._dmmf?.modelMap?.Order?.fields?.map(f => f.name) || [];
            if (orderFields.includes('phone') || tx.order?.fields?.phone) {
                orderCreateData.phone = deliveryPhone;
            }

            // Créer la commande
            const newOrder = await tx.order.create({
                data: orderCreateData,
                include: {
                    orderItems: {
                        include: {
                            product: {
                                select: { id: true, name: true, image: true, brand: true, price: true, vendorId: true }
                            }
                        }
                    },
                    user: {
                        select: { id: true, name: true, email: true, phone: true }
                    }
                }
            });

            // Décrémenter les stocks des produits
            for (const item of verifiedOrderItems) {
                const currentProduct = productMap.get(item.productId);
                const updatedStock = currentProduct.stock - item.quantity;
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: updatedStock,
                        inStock: updatedStock > 0
                    }
                });
            }

            // Créer une notification pour l'utilisateur
            const orderRef = newOrder.id.slice(-6).toUpperCase();
            await tx.notification.create({
                data: {
                    userId: req.user.id,
                    title: 'Commande confirmée',
                    message: `Votre commande #${orderRef} d'un montant de ${formatFCFA(newOrder.totalPrice)} a bien été enregistrée. Statut : EN ATTENTE.`
                }
            });

            return newOrder;
        });

        // 5. Envoi d'un email au client avec Nodemailer (asynchrone sans bloquer en cas d'erreur SMTP)
        const orderRef = result.id.slice(-6).toUpperCase();
        const itemsListHtml = result.orderItems.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product?.name || 'Article'}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatFCFA(item.price * item.quantity)}</td>
            </tr>
        `).join('');

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #16a34a; text-align: center;">Merci pour votre commande sur Jaay-Ma !</h2>
                <p>Bonjour <strong>${req.user.name || 'Cher client'}</strong>,</p>
                <p>Votre commande <strong>#${orderRef}</strong> a bien été enregistrée avec le statut <strong>EN ATTENTE</strong>.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Récapitulatif de votre commande :</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: #e5e7eb; text-align: left;">
                                <th style="padding: 8px;">Article</th>
                                <th style="padding: 8px; text-align: center;">Qté</th>
                                <th style="padding: 8px; text-align: right;">Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsListHtml}
                        </tbody>
                    </table>
                    <p style="text-align: right; font-size: 16px; font-weight: bold; margin-top: 15px;">
                        Total : <span style="color: #16a34a;">${formatFCFA(result.totalPrice)}</span>
                    </p>
                </div>

                <div style="margin: 20px 0;">
                    <p><strong>Mode de paiement :</strong> ${result.paymentMethod}</p>
                    <p><strong>Adresse de livraison :</strong> ${result.shippingAddress}</p>
                    <p><strong>Téléphone de contact :</strong> ${result.phone || 'Non renseigné'}</p>
                </div>

                <p style="color: #666; font-size: 13px;">Nous vous tiendrons informé dès que votre commande sera expédiée.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="text-align: center; color: #888; font-size: 12px;">© ${new Date().getFullYear()} Jaay-Ma Sénégal. Tous droits réservés.</p>
            </div>
        `;

        sendEmail({
            to: req.user.email,
            subject: `Confirmation de votre commande #${orderRef} - Jaay-Ma`,
            html: emailHtml
        }).catch(err => console.error("Erreur envoi email création commande:", err));

        // 6. Si Wave, fournir l'URL Wave avec le montant calculé par le serveur
        const WAVE_BASE_URL = 'https://pay.wave.com/m/M_sn_6xTx7wYHi-8V/c/sn/';
        const wavePaymentUrl = `${WAVE_BASE_URL}?amount=${result.totalPrice}`;

        res.status(201).json({
            message: 'Commande enregistrée avec succès',
            order: result,
            orderId: result.id,
            orderRef,
            totalPrice: result.totalPrice,
            wavePaymentUrl
        });

    } catch (error) {
        console.error('Erreur lors de la création de la commande :', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande.', error: error.message });
    }
};

// @desc    Obtenir l'historique des commandes du client connecté
// @route   GET /api/orders/me
// @access  Private (Client)
const getMyOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, image: true, brand: true, price: true, category: true }
                        }
                    }
                }
            }
        });

        res.json(orders);
    } catch (error) {
        console.error('Erreur getMyOrders :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de vos commandes.' });
    }
};

// @desc    Obtenir les commandes contenant les produits du vendeur connecté
// @route   GET /api/orders/vendor
// @access  Private (Vendeur ou Admin)
const getVendorOrders = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';

        const whereCondition = isAdmin
            ? {}
            : {
                orderItems: {
                    some: { product: { vendorId } }
                }
            };

        // Filtre optionnel par statut
        if (req.query.status) {
            whereCondition.status = req.query.status.toUpperCase();
        }

        const orders = await prisma.order.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, image: true, brand: true, price: true, vendorId: true }
                        }
                    }
                }
            }
        });

        // Pour les vendeurs non-admin, on peut aussi annoter les items qui leur appartiennent
        const formattedOrders = orders.map(order => {
            const vendorItems = isAdmin 
                ? order.orderItems 
                : order.orderItems.filter(item => item.product?.vendorId === vendorId);
            
            const vendorTotal = vendorItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            return {
                ...order,
                vendorItems,
                vendorTotal: isAdmin ? order.totalPrice : vendorTotal
            };
        });

        res.json(formattedOrders);
    } catch (error) {
        console.error('Erreur getVendorOrders :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes du vendeur.' });
    }
};

// @desc    Obtenir toutes les commandes (Admin) avec filtre par statut
// @route   GET /api/orders
// @access  Private (Admin)
const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query;

        const where = {};
        if (status && status !== 'ALL') {
            where.status = status.toUpperCase();
        }

        const orders = await prisma.order.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                },
                orderItems: {
                    include: {
                        product: {
                            select: { id: true, name: true, image: true, brand: true, price: true, vendorId: true }
                        }
                    }
                }
            }
        });

        res.json(orders);
    } catch (error) {
        console.error('Erreur getAllOrders :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de toutes les commandes.' });
    }
};

// @desc    Obtenir les détails d'une commande par son ID
// @route   GET /api/orders/:id
// @access  Private (Client propriétaire, Vendeur concerné ou Admin)
const getOrderById = async (req, res) => {
    try {
        const order = await prisma.order.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { id: true, name: true, email: true, phone: true } },
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Commande non trouvée' });
        }

        const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';
        const isOwner = order.userId === req.user.id;
        const isConcernedVendor = order.orderItems.some(i => i.product?.vendorId === req.user.id);

        if (!isAdmin && !isOwner && !isConcernedVendor) {
            return res.status(403).json({ message: 'Accès non autorisé à cette commande.' });
        }

        res.json(order);
    } catch (error) {
        console.error('Erreur getOrderById :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la commande.' });
    }
};

// @desc    Mettre à jour le statut d'une commande
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin ou Vendeur concerné)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['EN_ATTENTE', 'PAYEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];
        const normalizedStatus = status ? status.toUpperCase() : '';

        if (!allowedStatuses.includes(normalizedStatus)) {
            return res.status(400).json({
                message: `Statut invalide. Statuts autorisés : ${allowedStatuses.join(', ')}`
            });
        }

        // Récupérer la commande avec ses items et l'utilisateur
        const existingOrder = await prisma.order.findUnique({
            where: { id },
            include: {
                user: true,
                orderItems: {
                    include: { product: true }
                }
            }
        });

        if (!existingOrder) {
            return res.status(404).json({ message: 'Commande introuvable.' });
        }

        // Vérification des droits : Admin ou Vendeur ayant un produit dans la commande
        const isAdmin = req.user.role === 'admin' || req.user.role === 'super-admin';
        const isConcernedVendor = existingOrder.orderItems.some(item => item.product?.vendorId === req.user.id);

        if (!isAdmin && !isConcernedVendor) {
            return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier le statut de cette commande.' });
        }

        // Si passage à ANNULEE et qu'elle n'était pas déjà annulée, restaurer le stock
        const shouldRestoreStock = normalizedStatus === 'ANNULEE' && existingOrder.status !== 'ANNULEE';

        const updatedOrder = await prisma.$transaction(async (tx) => {
            if (shouldRestoreStock) {
                for (const item of existingOrder.orderItems) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { increment: item.quantity },
                            inStock: true
                        }
                    });
                }
            }

            const order = await tx.order.update({
                where: { id },
                data: { status: normalizedStatus },
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                    orderItems: {
                        include: { product: true }
                    }
                }
            });

            // Créer une notification pour le client
            const orderRef = order.id.slice(-6).toUpperCase();
            const statusLabels = {
                'EN_ATTENTE': 'En attente',
                'PAYEE': 'Payée',
                'EXPEDIEE': 'Expédiée',
                'LIVREE': 'Livrée',
                'ANNULEE': 'Annulée'
            };
            const label = statusLabels[normalizedStatus] || normalizedStatus;

            await tx.notification.create({
                data: {
                    userId: existingOrder.userId,
                    title: `Commande #${orderRef} : ${label}`,
                    message: `Le statut de votre commande #${orderRef} a été mis à jour vers : ${label}.`
                }
            });

            return order;
        });

        // Envoi d'un email Nodemailer au client informant du changement de statut
        const orderRef = updatedOrder.id.slice(-6).toUpperCase();
        const statusColors = {
            'EN_ATTENTE': '#eab308',
            'PAYEE': '#0284c7',
            'EXPEDIEE': '#8b5cf6',
            'LIVREE': '#16a34a',
            'ANNULEE': '#dc2626'
        };
        const statusBadgeColor = statusColors[normalizedStatus] || '#333';

        const statusEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #111; text-align: center;">Mise à jour de votre commande</h2>
                <p>Bonjour <strong>${existingOrder.user?.name || 'Cher client'}</strong>,</p>
                <p>Le statut de votre commande <strong>#${orderRef}</strong> a évolué :</p>
                
                <div style="text-align: center; margin: 25px 0;">
                    <span style="display: inline-block; background-color: ${statusBadgeColor}; color: #ffffff; padding: 10px 24px; border-radius: 20px; font-weight: bold; font-size: 16px;">
                        ${normalizedStatus}
                    </span>
                </div>

                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0 0 8px 0;"><strong>Référence :</strong> #${orderRef}</p>
                    <p style="margin: 0 0 8px 0;"><strong>Montant total :</strong> ${formatFCFA(updatedOrder.totalPrice)}</p>
                    <p style="margin: 0;"><strong>Mode de livraison/paiement :</strong> ${updatedOrder.paymentMethod}</p>
                </div>

                <p style="color: #666; font-size: 13px;">Vous pouvez suivre l'historique complet de vos commandes directement depuis votre espace personnel Jaay-Ma.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="text-align: center; color: #888; font-size: 12px;">© ${new Date().getFullYear()} Jaay-Ma Sénégal</p>
            </div>
        `;

        sendEmail({
            to: existingOrder.user.email,
            subject: `Votre commande #${orderRef} est maintenant ${normalizedStatus} - Jaay-Ma`,
            html: statusEmailHtml
        }).catch(err => console.error("Erreur envoi email mise à jour statut:", err));

        res.json({
            message: 'Statut de la commande mis à jour avec succès.',
            order: updatedOrder
        });

    } catch (error) {
        console.error('Erreur updateOrderStatus :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut.', error: error.message });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getVendorOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};
