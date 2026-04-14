
import React from 'react';
import { ArrowRight } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = React.useState({ email: '', password: '' });
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = React.useState('');

  const handleLogin = async () => {
    setError('');

    // Real API Login
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

  const handleGoogleLogin = async () => {
    setError('');
    try {
      // Note: Pour que la connexion Google fonctionne pleinement, il faut configurer
      // Google Identity Services et obtenir un idToken. Pour l'instant, on informé l'utilisateur
      // de s'inscrire d'abord si le compte n'existe pas.
      const user = await loginWithGoogle('google-signin-not-fully-configured');
      if (user.role === 'super-admin') navigate('/dashboard-super-admin');
      else if (user.role === 'admin') navigate('/dashboard-admin');
      else if (user.role === 'vendor') navigate('/dashboard-vendor');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

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



          <button
            type="button"
            id="google-login-btn"
            className="w-full bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all mb-6 shadow-sm"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuer avec Google
          </button>

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
