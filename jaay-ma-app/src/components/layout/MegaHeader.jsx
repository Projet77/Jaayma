import React, { useState } from 'react';
import { Icons } from '../../icons';
import Button from '../ui/Button';

const MegaHeader = ({
    cartItemsCount,
    onCartClick,
    onLoginClick,
    currentUser,
    onLogout,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    mockCategories
}) => {
    const [selectedCategory, setSelectedCategory] = useState("Toutes");

    return (
        <header className="bg-white border-b border-surface-200 sticky top-0 z-50 shadow-sm">
            {/* 1. Top Bar (Utilities) */}
            <div className="bg-surface-50 border-b border-surface-200 text-xs py-1.5 hidden md:block">
                <div className="container-xl flex justify-between text-surface-500">
                    <div className="flex gap-4">
                        <span className="hover:text-primary cursor-pointer">Vendre sur Jaay-Ma</span>
                        <span className="hover:text-primary cursor-pointer">Aide & Contact</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="cursor-pointer">Français (SN)</span>
                        <span className="cursor-pointer">XOF (CFA)</span>
                    </div>
                </div>
            </div>

            {/* 2. Main Header (Logo, Search, Actions) */}
            <div className="py-4 md:py-6">
                <div className="container-xl flex items-center gap-8">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer flex-shrink-0"
                        onClick={() => setCurrentView('home')}
                    >
                        {/* Simple, Bold Logo like Amazon/Ali */}
                        <span className="text-3xl font-extrabold text-primary tracking-tight">
                            Jaay<span className="text-surface-900">-Ma</span>
                        </span>
                    </div>

                    {/* Search Bar (Giant) */}
                    <div className="flex-1 hidden md:flex max-w-2xl">
                        <div className="flex w-full border-2 border-primary rounded-lg overflow-hidden focus-within:ring-2 ring-primary/20 transition-all">
                            {/* Category Select Mock */}
                            <div className="bg-surface-50 border-r border-surface-200 px-3 flex items-center cursor-pointer hover:bg-surface-100 transition-colors group relative">
                                <span className="text-sm font-medium text-surface-700 truncate w-24">{selectedCategory}</span>
                                <Icons.ChevronDown className="w-4 h-4 text-surface-500 ml-2" />
                            </div>

                            <input
                                type="text"
                                placeholder="Que cherchez-vous aujourd'hui ?"
                                className="flex-1 px-4 py-2.5 outline-none text-surface-900 placeholder-surface-400"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <button className="bg-primary hover:bg-primary-600 text-white px-8 font-semibold transition-colors flex items-center justify-center">
                                <Icons.Search className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-6 flex-shrink-0 ml-auto md:ml-0">
                        {/* User Account */}
                        <div className="hidden md:flex flex-col cursor-pointer group relative" onClick={currentUser ? undefined : onLoginClick}>
                            <span className="text-xs text-surface-500">Bonjour, {currentUser ? currentUser.name : 'Identifiez-vous'}</span>
                            <span className="text-sm font-bold text-surface-900 flex items-center group-hover:text-primary transition-colors">
                                Compte & Listes <Icons.ChevronDown className="w-3 h-3 ml-1" />
                            </span>

                            {currentUser && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-surface-200 shadow-xl rounded-lg p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-50">
                                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 rounded">Déconnexion</button>
                                </div>
                            )}
                        </div>

                        {/* Returns & Orders (Mock) */}
                        <div className="hidden md:flex flex-col cursor-pointer">
                            <span className="text-xs text-surface-500">Retours</span>
                            <span className="text-sm font-bold text-surface-900 w-max">
                                & Commandes
                            </span>
                        </div>

                        {/* Cart */}
                        <div className="flex items-end cursor-pointer group relative" onClick={onCartClick}>
                            <div className="relative">
                                <Icons.ShoppingBag className="w-8 h-8 text-surface-900 group-hover:text-primary transition-colors" />
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cartItemsCount}
                                </span>
                            </div>
                            <span className="font-bold text-surface-900 ml-1 hidden md:block">Panier</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Navigation Bar */}
            <div className="bg-surface-800 text-white hidden md:block">
                <div className="container-xl flex items-center h-10 text-sm">
                    {/* All Categories Trigger */}
                    <div className="flex items-center gap-2 font-bold px-4 h-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors mr-4">
                        <Icons.Menu className="w-5 h-5" />
                        <span>Toutes les catégories</span>
                    </div>

                    {/* Quick Links */}
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar flex-1">
                        {['Meilleures Ventes', 'Promotions', 'Dernières Nouveautés', 'Service Client', 'Ventes Flash', 'Informatique', 'Maison'].map(link => (
                            <span key={link} className="whitespace-nowrap cursor-pointer hover:text-primary-300 transition-colors font-medium">
                                {link}
                            </span>
                        ))}
                    </div>

                    <div className="ml-auto font-bold text-primary-300 cursor-pointer hover:text-white transition-colors">
                        LIVRAISON GRATUITE dès 50k FCFA
                    </div>
                </div>
            </div>

            {/* Mobile Search (visible only on mobile) */}
            <div className="md:hidden px-4 pb-4">
                <div className="flex w-full border border-surface-300 rounded-lg overflow-hidden">
                    <input type="text" placeholder="Rechercher..." className="flex-1 px-4 py-2 outline-none" />
                    <button className="bg-primary text-white px-4"><Icons.Search /></button>
                </div>
            </div>
        </header>
    );
};

export default MegaHeader;
