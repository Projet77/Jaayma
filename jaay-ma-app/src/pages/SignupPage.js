
import React from 'react';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [signupForm, setSignupForm] = React.useState({
        prenom: '',
        nom: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateNaissance: '',
        telephone: '',
        adresse: '',
        ville: '',
        role: 'client'
    });

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleSignup = async () => {
        if (signupForm.password !== signupForm.confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        try {
            const userData = {
                name: `${signupForm.prenom} ${signupForm.nom}`,
                ...signupForm
            };
            await register(userData);
            alert(`Compte créé avec succès !`);

            // Redirect based on role
            if (signupForm.role === 'vendor') navigate('/dashboard-vendor');
            else navigate('/');
        } catch (err) {
            alert("Erreur lors de l'inscription: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 animate-fade-in text-neutral-800">
            <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

                {/* Left Column: Image & Branding */}
                <div className="relative hidden lg:block bg-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?q=80&w=2600&auto=format&fit=crop"
                        alt="Join Branding"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <span className="text-black font-display font-bold text-xl">J</span>
                            </div>
                            <span className="font-display font-bold text-2xl tracking-tight">JaayMa.</span>
                        </div>
                        <h2 className="text-4xl font-display font-bold mb-4 leading-tight">Rejoignez la communauté.</h2>
                        <p className="text-neutral-300 text-lg">Créez votre compte aujourd'hui et profitez d'une expérience de shopping personnalisée.</p>
                    </div>
                </div>

                {/* Right Column: Signup Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center overflow-y-auto max-h-screen">

                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Créer un compte ✨</h1>
                        <p className="text-neutral-500">Remplissez le formulaire ci-dessous pour commencer.</p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Prénom</label>
                                <input
                                    type="text"
                                    value={signupForm.prenom}
                                    onChange={(e) => setSignupForm({ ...signupForm, prenom: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="Jean"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Nom</label>
                                <input
                                    type="text"
                                    value={signupForm.nom}
                                    onChange={(e) => setSignupForm({ ...signupForm, nom: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="Dupont"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-1.5">Adresse Email</label>
                            <input
                                type="email"
                                value={signupForm.email}
                                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="nom@exemple.com"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Date de naissance</label>
                                <input
                                    type="date"
                                    value={signupForm.dateNaissance}
                                    onChange={(e) => setSignupForm({ ...signupForm, dateNaissance: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Téléphone</label>
                                <input
                                    type="tel"
                                    value={signupForm.telephone}
                                    onChange={(e) => setSignupForm({ ...signupForm, telephone: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                    placeholder="+221 77 123 45 67"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-1.5">Adresse</label>
                            <input
                                type="text"
                                value={signupForm.adresse}
                                onChange={(e) => setSignupForm({ ...signupForm, adresse: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="123 Rue de la Liberté"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-1.5">Ville</label>
                            <input
                                type="text"
                                value={signupForm.ville}
                                onChange={(e) => setSignupForm({ ...signupForm, ville: e.target.value })}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                placeholder="Dakar"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={signupForm.password}
                                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all pr-10"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1.5">Confirmer</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={signupForm.confirmPassword}
                                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                                        className={`w-full px-4 py-3 bg-neutral-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all pr-10 ${signupForm.confirmPassword && signupForm.password !== signupForm.confirmPassword
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-neutral-200'
                                            }`}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Je souhaite être :</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setSignupForm({ ...signupForm, role: 'client' })}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${signupForm.role === 'client' ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                                >
                                    <p className="font-bold text-sm">Client</p>
                                    <p className="text-xs text-neutral-500">Pour acheter</p>
                                </div>
                                <div
                                    onClick={() => setSignupForm({ ...signupForm, role: 'vendor' })}
                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${signupForm.role === 'vendor' ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-200'}`}
                                >
                                    <p className="font-bold text-sm">Vendeur</p>
                                    <p className="text-xs text-neutral-500">Pour vendre</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-neutral-800 text-white py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                        >
                            S'inscrire
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center pb-4">
                        <p className="text-neutral-500 text-sm">
                            Vous avez déjà un compte ?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-black font-bold hover:underline"
                            >
                                Se connecter
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default SignupPage;
