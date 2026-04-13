import { BASE_URL } from '../services/api';

/**
 * Corrige l'URL de l'image pour l'application mobile.
 * Remplace notamment 'localhost' renvoyé par le backend par l'IP locale (BASE_URL)
 * afin que l'image s'affiche correctement sur le téléphone/émulateur.
 */
export const getImageUrl = (url) => {
    if (!url) return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    // Remplacer les antislash (Windows) par des slash normaux
    let normalizedUrl = url.replace(/\\/g, '/');

    // Si c'est déjà une URL externe (Cloudinary, Unsplash, etc.)
    if (normalizedUrl.startsWith('http') && !normalizedUrl.includes('localhost')) {
        return normalizedUrl;
    }

    // Si l'URL contient api/... on l'enlève car l'image est à la racine (/uploads)
    let cleanUrl = normalizedUrl;
    if (cleanUrl.startsWith('/api/')) {
        cleanUrl = cleanUrl.replace('/api/', '/');
    }

    // Le serveur de base (sans /api)
    const serverUrl = BASE_URL;

    // Si le backend renvoie une URL complète avec localhost
    if (normalizedUrl.includes('localhost')) {
        return normalizedUrl.replace(/http:\/\/localhost:\d+/, serverUrl);
    }

    // Assurer un seul slash de début
    if (!cleanUrl.startsWith('/')) {
        cleanUrl = `/${cleanUrl}`;
    }

    return `${serverUrl}${cleanUrl}`;
};
