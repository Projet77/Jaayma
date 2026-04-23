import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Phone, MapPin, Building2, Mail, Save, ArrowLeft, Loader } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        shopName: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            city: user.city || '',
            shopName: user.shopName || '',
        });
    }, [user, navigate]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API}/api/auth/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(form)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Erreur de mise à jour');
            }

            const updated = await res.json();
            // Mettre à jour le localStorage pour le AuthContext
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updated }));

            setSuccess('✓ Profil mis à jour avec succès !');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const roleLabels = { client: 'Client', vendor: 'Vendeur', admin: 'Administrateur', 'super-admin': 'Super Administrateur' };
    const roleColors = { client: 'bg-blue-100 text-blue-800', vendor: 'bg-purple-100 text-purple-800', admin: 'bg-orange-100 text-orange-800', 'super-admin': 'bg-red-100 text-red-800' };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-neutral-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-neutral-900">Mon Profil</h1>
                        <p className="text-sm text-neutral-500">Gérez vos informations personnelles</p>
                    </div>
                </div>

                {/* Avatar + Role */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm mb-6 flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900">{user.name}</h2>
                        <p className="text-sm text-neutral-500 mb-2">{user.email}</p>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColors[user.role] || 'bg-neutral-100 text-neutral-600'}`}>
                            {roleLabels[user.role] || user.role}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm space-y-5">
                    <h3 className="font-bold text-neutral-800 text-base border-b border-neutral-100 pb-3">Informations personnelles</h3>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">{success}</div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">{error}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Nom complet
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5" /> Email
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                disabled
                                className="w-full px-4 py-2.5 border border-neutral-100 rounded-xl text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5" /> Téléphone
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                placeholder="+221 77 000 00 00"
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" /> Ville
                            </label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={e => setForm({ ...form, city: e.target.value })}
                                placeholder="Dakar"
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Adresse
                        </label>
                        <input
                            type="text"
                            value={form.address}
                            onChange={e => setForm({ ...form, address: e.target.value })}
                            placeholder="Quartier, Rue..."
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                        />
                    </div>

                    {(user.role === 'vendor' || user.role === 'admin' || user.role === 'super-admin') && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5" /> Nom de la boutique
                            </label>
                            <input
                                type="text"
                                value={form.shopName}
                                onChange={e => setForm({ ...form, shopName: e.target.value })}
                                placeholder="Ma Boutique"
                                className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 text-sm"
                        >
                            {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { logout && logout(); navigate('/'); }}
                            className="px-6 py-2.5 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-sm"
                        >
                            Déconnexion
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
