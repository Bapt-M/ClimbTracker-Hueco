import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hold-pink border-2 border-climb-dark shadow-neo mb-4 -rotate-3">
            <span className="material-symbols-outlined text-white text-[40px] rotate-3">terrain</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-climb-dark mb-3">
            ClimbTracker
          </h1>
          <p className="text-climb-dark/60 font-bold">
            Bienvenue ! Connectez-vous pour continuer
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border-2 border-climb-dark shadow-neo p-8">
          <h2 className="text-2xl font-extrabold text-climb-dark mb-6">
            Connexion
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-hold-pink/10 border-2 border-hold-pink/30 text-hold-pink text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-extrabold text-climb-dark mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-climb-dark/20 bg-cream text-climb-dark font-bold placeholder:text-climb-dark/40 focus:outline-none focus:border-climb-dark transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-extrabold text-climb-dark mb-2"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-climb-dark/20 bg-cream text-climb-dark font-bold placeholder:text-climb-dark/40 focus:outline-none focus:border-climb-dark transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hold-blue text-white font-extrabold py-4 px-6 rounded-xl border-2 border-climb-dark shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-climb-dark/60 font-bold">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="font-extrabold text-hold-pink hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-6 p-4 rounded-2xl bg-white border-2 border-climb-dark/20">
          <p className="text-xs font-extrabold text-climb-dark mb-2">
            Comptes de test :
          </p>
          <ul className="text-xs text-climb-dark/60 font-bold space-y-1">
            <li>• climber1@climbtracker.com / password123</li>
            <li>• climber2@climbtracker.com / password123</li>
            <li>• opener1@climbtracker.com / password123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
