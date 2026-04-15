/**
 * Gère les URLs des assets (images, vidéos) pour assurer la compatibilité
 * entre les environnements local et de production.
 * 
 * @param {string} path - Le chemin de l'image (relatif ou absolu)
 * @returns {string} - L'URL complète de l'asset
 */
export const getAssetUrl = (path) => {
    if (!path) return '';
    
    // Si c'est déjà une URL absolue (ex: unsplash, cloudinary, ou déjà traité)
    if (path.startsWith('http')) {
        return path;
    }
    
    // Si le chemin commence par '/', on l'utilise tel quel avec l'API_URL
    // Sinon on ajoute un '/'
    const safePath = path.startsWith('/') ? path : `/${path}`;
    
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    return `${apiUrl}${safePath}`;
};
