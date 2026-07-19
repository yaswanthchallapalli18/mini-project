import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowLeft, KeyRound } from 'lucide-react';
import api from '../services/api';
import { NotificationContext } from '../context/NotificationContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { showToast } = useContext(NotificationContext);

  const [role, setRole] = useState('customer'); // 'customer' or 'provider'
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || !password || !confirmPassword) {
      showToast('Validation Error', 'All fields are required.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Validation Error', 'Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { role, token, password });
      showToast('Password Updated', 'Your password has been changed successfully. Please login.', 'success');
      navigate('/login');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid or expired reset token.';
      showToast('Reset Failed', errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/40">
      <div className="w-full max-w-md rounded-3xl border border-gray-200/80 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-2xl p-8 glass">
        
        {/* Back Link */}
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6">
          <ArrowLeft size={12} /> Back to Login
        </Link>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto mb-3">
            <KeyRound size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Reset Password</h2>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Enter the recovery token you copied and specify your new account password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Role Switcher */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-slate-900 p-1 mb-2 text-xs font-bold text-gray-500">
            <button
              type="button"
              onClick={() => setRole('customer')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                role === 'customer'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setRole('provider')}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                role === 'provider'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              Provider
            </button>
          </div>

          {/* Reset Token */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Reset Token *</label>
            <input
              type="text"
              placeholder="Paste generated token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none font-mono"
              required
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">New Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={14} />
              </span>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
              />
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Confirm New Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={14} />
              </span>
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/10 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? 'Resetting Password...' : 'Save New Password'}
          </button>
        </form>

      </div>
    </div>
  );
}
