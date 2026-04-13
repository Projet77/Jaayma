import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-20 border-t border-white/10">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <h2 className="text-3xl font-display font-bold mb-6">Jaay<span className="text-primary">Ma</span>.</h2>
                    <p className="text-neutral-400 max-w-sm mb-8">
                        La plateforme de commerce la plus avancée d'Afrique de l'Ouest. Conçue pour l'excellence.
                    </p>
                    <div className="flex gap-4">
                        {/* Socials placeholder */}
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Explorer</h4>
                    <ul className="space-y-4 text-neutral-400 text-sm">
                        <li>Nouveautés</li>
                        <li>Collections</li>
                        <li>Ventes Flash</li>
                        <li>Blog</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-6">Aide</h4>
                    <ul className="space-y-4 text-neutral-400 text-sm">
                        <li>Suivre ma commande</li>
                        <li>Retours</li>
                        <li>FAQ</li>
                        <li>Contact</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex justify-between text-neutral-500 text-xs">
                <p>&copy; 2025 Jaay-Ma Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <span className="cursor-pointer hover:text-white transition-colors">Confidentialité</span>
                    <span className="cursor-pointer hover:text-white transition-colors">Conditions</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
