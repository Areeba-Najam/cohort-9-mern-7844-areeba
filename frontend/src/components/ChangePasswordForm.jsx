import { useState } from 'react';
import api from '../services/api';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');
    try {
      await api.patch('/auth/change-password', { currentPassword, newPassword });
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
      <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Change password</h2>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      {message && <p className="text-xs text-green-700 mb-2">{message}</p>}
      <input
        type="password"
        required
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm mb-2"
      />
      <input
        type="password"
        required
        minLength={6}
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm mb-3"
      />
      <button
        type="submit"
        disabled={submitting}
        className="text-sm bg-brand text-white rounded-lg px-4 py-2 disabled:opacity-60"
      >
        {submitting ? 'Updating...' : 'Update password'}
      </button>
    </form>
  );
}

export default ChangePasswordForm;