import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hold-green border-2 border-climb-dark shadow-neo mb-4 rotate-3">
            <span className="material-symbols-outlined text-white text-[40px] -rotate-3">terrain</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-climb-dark mb-2">
            ClimbTracker
          </h1>
          <p className="text-climb-dark/60 font-bold">
            Créez votre compte pour commencer
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl border-2 border-climb-dark shadow-neo p-8">
          <h2 className="text-2xl font-extrabold text-climb-dark mb-6">
            Inscription
          </h2>

          {/* Error Message */}
          {(error || passwordError) && (
            <div className="mb-4 p-4 rounded-xl bg-hold-pink/10 border-2 border-hold-pink/30 text-hold-pink text-sm font-bold">
              {error || passwordError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-extrabold text-climb-dark mb-2"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-climb-dark/20 bg-cream text-climb-dark font-bold placeholder:text-climb-dark/40 focus:outline-none focus:border-climb-dark transition-colors"
                placeholder="John Doe"
              />
            </div>

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
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border-2 border-climb-dark/20 bg-cream text-climb-dark font-bold placeholder:text-climb-dark/40 focus:outline-none focus:border-climb-dark transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1.5 text-xs text-climb-dark/60 font-bold">
                Au moins 8 caractères
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-extrabold text-climb-dark mb-2"
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
                className="w-full px-4 py-3 rounded-xl border-2 border-climb-dark/20 bg-cream text-climb-dark font-bold placeholder:text-climb-dark/40 focus:outline-none focus:border-climb-dark transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-hold-green text-white font-extrabold py-4 px-6 rounded-xl border-2 border-climb-dark shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-climb-dark/20"></div>
            <span className="text-sm text-climb-dark/60 font-bold">ou</span>
            <div className="flex-1 h-px bg-climb-dark/20"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-climb-dark/60 font-bold">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-extrabold text-hold-blue hover:underline"
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
