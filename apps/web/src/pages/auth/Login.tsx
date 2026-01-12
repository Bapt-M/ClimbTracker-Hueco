import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { isDark, toggle } = useDarkMode();

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-mono-50 dark:bg-black px-4">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggle}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-mono-200 dark:hover:bg-mono-800 transition-colors"
      >
        <span className="material-symbols-outlined text-mono-900 dark:text-white text-[22px]">
          {isDark ? 'light_mode' : 'dark_mode'}
        </span>
      </button>

      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold tracking-tight text-mono-900 dark:text-white mb-3">
            ClimbTracker
          </h1>
          <p className="text-mono-500">
            Bienvenue ! Connectez-vous pour continuer
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 dark:bg-mono-900 backdrop-blur-xl rounded-2xl border border-mono-200/50 dark:border-mono-800 p-8 shadow-card">
          <h2 className="text-2xl font-bold text-mono-900 dark:text-white mb-6">
            Connexion
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 rounded-xl bg-urgent/10 border border-urgent/20 text-urgent text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-mono-900 dark:text-white mb-2"
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
                className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/60 dark:bg-mono-900 backdrop-blur-md text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-mono-900 dark:text-white mb-2"
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
                className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/60 dark:bg-mono-900 backdrop-blur-md text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-mono-900 dark:bg-white text-white dark:text-black font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-mono-500">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="font-semibold text-mono-900 dark:text-white hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-6 p-4 rounded-xl bg-white/70 dark:bg-mono-900 backdrop-blur-xl border border-mono-200/50 dark:border-mono-800 shadow-card">
          <p className="text-xs font-semibold text-mono-900 dark:text-white mb-2">
            Comptes de test :
          </p>
          <ul className="text-xs text-mono-500 space-y-1">
            <li>• climber1@climbtracker.com / password123</li>
            <li>• climber2@climbtracker.com / password123</li>
            <li>• opener1@climbtracker.com / password123</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
