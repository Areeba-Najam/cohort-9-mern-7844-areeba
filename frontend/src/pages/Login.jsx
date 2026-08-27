import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome back to your notes."
      subheading="Sign in to pick up right where you left off. Everything is exactly how you left it."
    >
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-7">Enter your details to continue.</p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />

        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
        />
    
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-[#5b3df5] to-[#8b5cf6] text-white rounded-xl py-2.5 text-sm font-semibold shadow-md shadow-brand/20 hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
        New here?{' '}
        <Link to="/register" className="text-brand font-medium">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;