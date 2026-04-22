import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Store,
    ShieldCheck,
    Megaphone,
    Layout,
    ShoppingBag,
    CreditCard,
    Search,
    Bell
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, isActive, onClick, isCollapsed }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
            ? 'bg-black text-white shadow-lg shadow-black/20'
            : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'
            }`}
    >
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-black'} `} />
        {!isCollapsed && (
            <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-base whitespace-nowrap overflow-hidden"
            >
                {label}
            </motion.span>
        )}
    </button>
);

const DashboardLayout = ({ role = 'admin', children, activeTab: externalActiveTab, onTabChange }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [internalActiveTab, setInternalActiveTab] = useState('overview');

    // Use external control if provided, otherwise internal state
    const activeTab = externalActiveTab || internalActiveTab;
    const setActiveTab = onTabChange || setInternalActiveTab;

    // Define menu items based on role
    const menus = {
        'super-admin': [
            { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
            { id: 'orders', label: 'Commandes', icon: ShoppingBag },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'products', label: 'Produits', icon: Package },
            { id: 'vendors', label: 'Vendeurs', icon: Store },
            { id: 'marketing', label: 'Marketing & Pubs', icon: Megaphone },
            { id: 'cms', label: 'Gestion du Site', icon: Layout },
            { id: 'admins', label: 'Administrateurs', icon: ShieldCheck },
            { id: 'settings', label: 'Paramètres Système', icon: Settings },
        ],
        'admin': [
            { id: 'overview', label: 'Tableau de bord', icon: LayoutDashboard },
            { id: 'products', label: 'Produits', icon: Package },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'marketing', label: 'Promotions', icon: Megaphone },
            { id: 'orders', label: 'Commandes', icon: ShoppingBag },
        ],
        'vendor': [
            { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
            { id: 'products', label: 'Mes Produits', icon: Package },
            { id: 'orders', label: 'Commandes', icon: ShoppingBag },
            { id: 'wallet', label: 'Portefeuille', icon: CreditCard },
            { id: 'settings', label: 'Paramètres Boutique', icon: Settings },
        ]
    };

    // Fallback for icons that might not be imported if I missed one in the generic list above
    // But I imported most common ones. Let's make sure ShieldCheck is there or use fallback.
    // I missed importing ShieldCheck and User in the top import. Fixing that in the actual code string below.

    const currentMenu = menus[role] || menus['admin'];

    return (
        <div className="min-h-screen bg-neutral-50 flex">
            {/* Sidebar */}
            <motion.aside
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-white border-r border-neutral-100 h-screen sticky top-0 flex flex-col z-40 hidden md:flex"
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-white font-bold font-display">J</span>
                        </div>
                        {isSidebarOpen && (
                            <span className="font-display font-bold text-xl tracking-tight">JaayMa<span className="text-neutral-400">.</span></span>
                        )}
                    </div>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-neutral-50 rounded-lg text-neutral-400">
                        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {currentMenu.map(item => (
                        <SidebarItem
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeTab === item.id}
                            isCollapsed={!isSidebarOpen}
                            onClick={() => setActiveTab(item.id)}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-neutral-100">
                    <SidebarItem
                        icon={LogOut}
                        label="Retour au site"
                        isCollapsed={!isSidebarOpen}
                        onClick={() => navigate('/')}
                    />
                </div>
            </motion.aside>

            {/* Mobile Sidebar Overlay would go here (simplified for now) */}

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Header */}
                <header className="bg-white border-b border-neutral-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
                    <h1 className="text-2xl font-bold capitalize text-neutral-900">
                        {currentMenu.find(m => m.id === activeTab)?.label}
                    </h1>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-primary w-64 transition-all"
                            />
                        </div>
                        <button className="p-2 hover:bg-neutral-50 rounded-full relative">
                            <Bell className="w-5 h-5 text-neutral-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full ring-2 ring-white shadow-lg cursor-pointer"></div>
                    </div>
                </header>

                {/* Dashboard Content Area */}
                <div className="p-8 max-w-7xl mx-auto">
                    {children ? children : (
                        <div className="text-center py-20">
                            <h2 className="text-xl text-neutral-400">Contenu de {activeTab}...</h2>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};



export default DashboardLayout;
