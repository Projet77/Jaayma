const nodemailer = require('nodemailer');

/**
 * Configure Nodemailer based on environment setup 
 * Usage of standard SMTP usually from Gmail or Resend/SendGrid
 */
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL || process.env.GOOGLE_EMAIL, 
        pass: process.env.SMTP_PASSWORD || process.env.GOOGLE_APP_PASSWORD,
    },
});

/**
 * Envoie un email de manière asynchrone.
 * 
 * @param {Object} options Options de l'email
 * @param {string} options.to Destinataire
 * @param {string} options.subject Sujet de l'email
 * @param {string} options.html Contenu HTML formatté
 */
const sendEmail = async (options) => {
    // Si la configuration SMTP n'est pas définie dans l'environnement,
    // on log simplement dans la console pour ne pas bloquer l'inscription.
    if (!process.env.SMTP_EMAIL && !process.env.GOOGLE_EMAIL) {
        console.warn('⚠️ Configuration SMTP manquante.');
        console.warn('📧 Email simulé à:', options.to);
        console.warn('📌 Sujet:', options.subject);
        return;
    }

    try {
        const mailOptions = {
            from: `"${process.env.FROM_NAME || 'Jaay-Ma'}" <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email envoyé: ${info.messageId} à ${options.to}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error.message);
        // On ne jette pas l'erreur pour ne pas faire planter l'API d'inscription, 
        // ce qui est une bonne pratique pour les emails asynchrones.
    }
};

module.exports = sendEmail;
