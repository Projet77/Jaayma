
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Google Client ID configuré via variable d'environnement
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = React.useState('');
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleLogin = async () => {
    setError('');
    try {
      const user = await login(loginForm.email, loginForm.password);
      if (user.role === 'super-admin') navigate('/dashboard-super-admin');
      else if (user.role === 'admin') navigate('/dashboard-admin');
      else if (user.role === 'vendor') navigate('/dashboard-vendor');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleCallback = React.useCallback(async (response) => {
    try {
      const user = await loginWithGoogle(response.credential);
      if (user.role === 'super-admin') navigate('/dashboard-super-admin');
      else if (user.role === 'admin') navigate('/dashboard-admin');
      else if (user.role === 'vendor') navigate('/dashboard-vendor');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle, navigate]);

  React.useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    // Fonction pour initialiser Google une fois le script chargé
    const initGoogle = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) {
         window.google.accounts.id.initialize({
           client_id: GOOGLE_CLIENT_ID.trim(),
           callback: handleGoogleCallback,
         });
         
         window.google.accounts.id.renderButton(
           document.getElementById('google-btn-container'),
           { theme: 'outline', size: 'large', width: '100%', text: 'continue_with' }
         );
      }
    };

    // Si le script Google est déjà chargé
    if (window.google) {
      initGoogle();
    } else {
      // Sinon attendre qu'il charge
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval);
          initGoogle();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [handleGoogleCallback]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">

        {/* Left Column: Image & Branding */}
        <div className="relative hidden lg:block bg-black">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2600&auto=format&fit=crop"
            alt="E-commerce experience"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-black font-display font-bold text-xl">J</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tight">JaayMa.</span>
            </div>
            <h2 className="text-4xl font-display font-bold mb-4 leading-tight">La nouvelle ère du shopping en ligne.</h2>
            <p className="text-neutral-300 text-lg">Gérez votre boutique, analysez vos ventes et faites grandir votre business avec nos outils dédiés.</p>
          </div>
        </div>

        {/* Right Column: Login Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Bon retour 👋</h1>
            <p className="text-neutral-500">Connectez-vous pour accéder à votre espace.</p>
          </div>

          {/* Bouton Google Officiel Rendered by JS */}
          <div className="mb-4 w-full flex justify-center">
             <div id="google-btn-container" className="w-full relative z-10 flex justify-center items-center h-12">
                {!window.google && !GOOGLE_CLIENT_ID ? (
                  <p className="text-sm text-neutral-500">Google Login Non Configuré</p>
                ) : (
                  <span className="w-5 h-5 border-2 border-neutral-300 border-t-black rounded-full animate-spin"></span>
                )}
             </div>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-100"></div></div>
            <div className="relative flex justify-center"><span className="px-2 bg-white text-xs text-neutral-400">OU</span></div>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg font-medium border border-red-100">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Adresse Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                placeholder="nom@exemple.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-neutral-700">Mot de passe</label>
                <button type="button" className="text-xs font-semibold text-primary hover:text-black hover:underline">Mot de passe oublié ?</button>
              </div>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black hover:bg-neutral-800 text-white py-4 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Connexion
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center bg-neutral-50 p-6 rounded-2xl">
            <p className="text-neutral-500 mb-4 text-sm">Vous n'avez pas encore de compte ?</p>
            <button
              onClick={() => navigate('/signup')}
              className="w-full bg-white border-2 border-neutral-200 text-neutral-900 py-3 rounded-xl font-bold hover:border-black transition-colors"
            >
              Créer un compte
            </button>
          </div>

        </div>
      </div>
    </div>
  )
};

export default LoginPage;
