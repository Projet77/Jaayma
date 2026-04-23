import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Footer = () => {
    const [settings, setSettings] = useState({
        platformName: 'Jaay-Ma',
        supportEmail: 'support@jaay-ma.sn',
        supportPhone: '+221 77 000 00 00',
        whatsappNumber: '+221 77 000 00 00',
        facebookUrl: '',
        instagramUrl: '',
        tiktokUrl: '',
        twitterUrl: '',
    });

    useEffect(() => {
        fetch(`${API}/api/settings`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) setSettings(prev => ({ ...prev, ...data })); })
            .catch(() => { });
    }, []);

    const whatsappLink = `https://wa.me/${settings.whatsappNumber?.replace(/\D/g, '')}`;

    return (
        <footer className="bg-black text-white py-20 border-t border-white/10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <h2 className="text-3xl font-display font-bold mb-4">
                        Jaay<span className="text-primary">Ma</span>.
                    </h2>
                    <p className="text-neutral-400 max-w-sm mb-3">
                        La plateforme de commerce la plus avancée d'Afrique de l'Ouest. Conçue pour l'excellence.
                    </p>
                    {settings.supportPhone && (
                        <a href={`tel:${settings.supportPhone}`} className="text-neutral-300 hover:text-white text-sm mb-1 block">
                            📞 {settings.supportPhone}
                        </a>
                    )}
                    {settings.supportEmail && (
                        <a href={`mailto:${settings.supportEmail}`} className="text-neutral-300 hover:text-white text-sm mb-6 block">
                            ✉️ {settings.supportEmail}
                        </a>
                    )}
                    <div className="flex gap-3 mt-2">
                        {settings.facebookUrl && (
                            <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors"
                                title="Facebook">
                                <span className="font-bold text-sm">f</span>
                            </a>
                        )}
                        {settings.instagramUrl && (
                            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 hover:opacity-80 flex items-center justify-center transition-opacity"
                                title="Instagram">
                                <span className="text-xs">📷</span>
                            </a>
                        )}
                        {settings.tiktokUrl && (
                            <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
                                title="TikTok">
                                <span className="text-xs">♪</span>
                            </a>
                        )}
                        {settings.twitterUrl && (
                            <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors"
                                title="Twitter/X">
                                <span className="text-xs font-bold">X</span>
                            </a>
                        )}
                        {settings.whatsappNumber && (
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-500 flex items-center justify-center transition-colors"
                                title="WhatsApp">
                                <span className="text-xs">💬</span>
                            </a>
                        )}
                        {!settings.facebookUrl && !settings.instagramUrl && !settings.tiktokUrl && !settings.twitterUrl && (
                            <>
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                                <div className="w-10 h-10 rounded-full bg-white/10" />
                            </>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Explorer</h4>
                    <ul className="space-y-4 text-neutral-400 text-sm">
                        <li><Link to="/shop" className="hover:text-white transition-colors">Nouveautés</Link></li>
                        <li><Link to="/shop" className="hover:text-white transition-colors">Collections</Link></li>
                        <li><Link to="/shop" className="hover:text-white transition-colors">Ventes Flash</Link></li>
                        <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Aide</h4>
                    <ul className="space-y-4 text-neutral-400 text-sm">
                        <li className="cursor-pointer hover:text-white transition-colors">Suivre ma commande</li>
                        <li className="cursor-pointer hover:text-white transition-colors">Retours</li>
                        <li className="cursor-pointer hover:text-white transition-colors">FAQ</li>
                        <li>
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-xs">
                <p>© 2025 {settings.platformName}. Tous droits réservés.</p>
                <div className="flex gap-6">
                    <span className="cursor-pointer hover:text-white transition-colors">Confidentialité</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Conditions</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
