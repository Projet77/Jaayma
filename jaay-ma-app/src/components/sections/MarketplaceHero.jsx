import React from 'react';
import { Icons } from '../../icons';
import Button from '../ui/Button';
import { mockCategories } from '../../data/categories';

const MarketplaceHero = ({ currentUser }) => {
    return (
        <div className="bg-surface-50 py-6">
            <div className="container-xl grid grid-cols-12 gap-6 h-[400px]">

                {/* COL 1: Categories (Left) - 20% */}
                <div className="hidden lg:block col-span-2 bg-white rounded-lg shadow-card overflow-y-auto custom-scrollbar h-full">
                    <ul className="py-2">
                        {mockCategories.slice(0, 10).map((cat, i) => (
                            <li key={i} className="group flex items-center justify-between px-4 py-2.5 hover:bg-surface-50 hover:text-primary cursor-pointer transition-colors text-sm font-medium text-surface-700">
                                <div className="flex items-center gap-3">
                                    <span className="text-surface-400 group-hover:text-primary">{cat.icon}</span>
                                    <span className="truncate">{cat.name}</span>
                                </div>
                                <Icons.ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover:opacity-100" />
                            </li>
                        ))}
                        <li className="px-4 py-2.5 text-primary font-bold cursor-pointer hover:underline text-sm flex items-center gap-2">
                            Voir toutes les catégories <Icons.ChevronDown className="w-3 h-3" />
                        </li>
                    </ul>
                </div>

                {/* COL 2: Main Slider (Center) - 60% */}
                <div className="col-span-12 lg:col-span-8 h-full relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-900 to-primary-900 rounded-lg shadow-card overflow-hidden">
                        {/* Background Image Placeholder */}
                        <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

                        <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-16 text-white max-w-2xl">
                            <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded mb-4 w-max">VENTE FLASH</span>
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                                La technologie <br /> à portée de main
                            </h1>
                            <p className="text-lg md:text-xl text-surface-100 mb-8 font-medium">
                                Jusqu'à <span className="text-primary-300 font-bold">-40%</span> sur les smartphones et ordinateurs.
                            </p>
                            <div className="flex gap-4">
                                <Button className="bg-white text-surface-900 hover:bg-surface-100 border-none px-8">Acheter maintenant</Button>
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8">Voir les offres</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COL 3: User Widget (Right) - 20% */}
                <div className="hidden lg:flex col-span-2 flex-col gap-4 h-full">
                    {/* User Card */}
                    <div className="bg-white rounded-lg shadow-card p-4 flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-surface-100 mb-3 flex items-center justify-center text-3xl">
                            {currentUser ? '👋' : '👤'}
                        </div>
                        <p className="text-sm text-surface-500 mb-1">Bienvenue sur Jaay-Ma</p>
                        <h3 className="font-bold text-surface-900 mb-4 px-2 truncate w-full">
                            {currentUser ? currentUser.name : 'Visiteur'}
                        </h3>

                        {currentUser ? (
                            <div className="flex gap-2 w-full">
                                <Button size="sm" variant="secondary" className="flex-1 text-xs">Commandes</Button>
                                <Button size="sm" variant="secondary" className="flex-1 text-xs">Compte</Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 w-full">
                                <Button size="sm" className="w-full">Se connecter</Button>
                                <Button variant="secondary" className="w-full bg-primary-50 text-primary hover:bg-primary-100 px-3 py-1.5 text-sm">S'inscrire</Button>
                            </div>
                        )}
                    </div>

                    {/* Small Promo */}
                    <div className="bg-[#FFF4E5] rounded-lg shadow-card p-4 h-1/3 flex flex-col justify-center items-center text-center">
                        <h4 className="font-bold text-primary-800 mb-1">Livraison Express</h4>
                        <p className="text-xs text-primary-700 mb-2">Abonnez-vous à Premium</p>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs shadow-lg transform hover:scale-110 transition-transform cursor-pointer">🚀</div>
                    </div>
                </div>

            </div>

            {/* Quick Stats / Trust Signals below Hero */}
            <div className="container-xl mt-6">
                <div className="bg-white rounded-lg shadow-card grid grid-cols-4 divide-x divide-surface-100 py-6">
                    {[
                        { icon: <Icons.Shield />, title: 'Paiement Sécurisé', desc: 'Transactions cryptées' },
                        { icon: <Icons.Truck />, title: 'Livraison Rapide', desc: 'Partout au Sénégal' },
                        { icon: <Icons.Phone />, title: 'Support 24/7', desc: 'Toujours là pour vous' },
                        { icon: <Icons.Heart />, title: 'Produits Authentiques', desc: 'Garantie qualité' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 justify-center px-4">
                            <div className="text-primary bg-primary-50 p-3 rounded-full">{item.icon}</div>
                            <div>
                                <h4 className="font-bold text-surface-900 text-sm">{item.title}</h4>
                                <p className="text-xs text-surface-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketplaceHero;
