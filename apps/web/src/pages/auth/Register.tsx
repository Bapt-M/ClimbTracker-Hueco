import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';

export const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();
  const { isDark, toggle } = useDarkMode();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (passwordError) setPasswordError('');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-mono-50 dark:bg-black px-4 py-12">
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-mono-900 dark:text-white mb-2">
            ClimbTracker
          </h1>
          <p className="text-mono-500">
            Créez votre compte pour commencer
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white/70 dark:bg-mono-900 backdrop-blur-xl rounded-2xl border border-mono-200/50 dark:border-mono-800 p-8 shadow-card">
          <h2 className="text-2xl font-bold text-mono-900 dark:text-white mb-6">
            Inscription
          </h2>

          {/* Error Message */}
          {(error || passwordError) && (
            <div className="mb-4 p-4 rounded-xl bg-urgent/10 border border-urgent/20 text-urgent text-sm">
              {error || passwordError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-mono-900 dark:text-white mb-2"
              >
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
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
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-mono-500">
                Au moins 8 caractères
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-mono-900 dark:text-white mb-2"
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-mono-200/50 dark:border-mono-800 bg-white/70 dark:bg-mono-900 backdrop-blur-xl text-mono-900 dark:text-white placeholder:text-mono-400 focus:outline-none focus:border-mono-400 dark:focus:border-mono-600 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-mono-900 dark:bg-white text-white dark:text-black font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-mono-200 dark:bg-mono-800"></div>
            <span className="text-sm text-mono-500">ou</span>
            <div className="flex-1 h-px bg-mono-200 dark:bg-mono-800"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-mono-500">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-semibold text-mono-900 dark:text-white hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
