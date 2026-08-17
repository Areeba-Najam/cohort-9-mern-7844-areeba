import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-gray-950 px-6 py-10">
      <div className="max-w-md mx-auto">
        <Link to="/dashboard" className="text-sm text-brand mb-6 inline-block">
          ← Back to notes
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5b3df5] to-[#8b5cf6] text-white flex items-center justify-center text-2xl font-semibold mb-5">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{user?.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{user?.email}</p>

          <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm text-gray-600 dark:text-gray-300">Appearance</span>
            <ThemeToggle />
          </div>

          <button
            onClick={logout}
            className="w-full mt-6 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl py-2.5 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;