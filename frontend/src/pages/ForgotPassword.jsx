import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Mail, HelpCircle, ArrowLeft, Key } from 'lucide-react';
import api from '../services/api';
import { NotificationContext } from '../context/NotificationContext';

export default function ForgotPassword() {
  const { showToast } = useContext(NotificationContext);

  const [role, setRole] = useState('customer'); // 'customer' or 'provider'
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Validation Error', 'Please enter your email address.', 'error');
      return;
    }

    setLoading(true);
    setGeneratedToken('');
    try {
      const res = await api.post('/auth/forgot-password', { email, role });
      showToast('Token Generated', 'Mock password reset token generated successfully.', 'success');
      if (res.data.resetToken) {
        setGeneratedToken(res.data.resetToken);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to request password reset.';
      showToast('Request Failed', errMsg, 'error');
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
            <HelpCircle size={22} />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Forgot password?</h2>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            Enter your email address and we will generate a temporary token to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Role switcher */}
          <div className="flex rounded-lg bg-gray-100 dark:bg-slate-900 p-1 mb-2 text-xs font-bold text-gray-500">
            <button
              type="button"
              onClick={() => {
                setRole('customer');
                setGeneratedToken('');
              }}
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
              onClick={() => {
                setRole('provider');
                setGeneratedToken('');
              }}
              className={`flex-1 py-1.5 rounded-md transition-all ${
                role === 'provider'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'hover:text-gray-700 dark:hover:text-white'
              }`}
            >
              Provider
            </button>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Email Address *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Requesting...' : 'Generate Reset Token'}
          </button>
        </form>

        {/* Display generated reset token */}
        {generatedToken && (
          <div className="mt-6 p-4 rounded-xl bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-900/30 text-xs">
            <h4 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-1">
              <Key size={14} /> Recovery Token Generated:
            </h4>
            <p className="font-mono bg-white dark:bg-slate-900 p-2 border rounded-lg mt-2 text-center text-sm font-semibold select-all">
              {generatedToken}
            </p>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Copy this token and go to the{' '}
              <Link to="/reset-password" className="text-blue-600 hover:underline font-bold">
                Reset Password Page
              </Link>{' '}
              to configure your new password.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
