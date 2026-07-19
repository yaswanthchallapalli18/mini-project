import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const TABS = ['customer', 'provider', 'admin'];

const tabConfig = {
  customer: {
    label: 'Customer',
    icon: User,
    description: 'Book home services easily',
    color: 'blue',
  },
  provider: {
    label: 'Provider',
    icon: ShieldCheck,
    description: 'Manage your service jobs',
    color: 'green',
  },
  admin: {
    label: 'Admin',
    icon: Zap,
    description: 'Platform administration',
    color: 'purple',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [activeTab, setActiveTab] = useState('customer');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrUsername || !password) {
      showToast('Missing Fields', 'Please fill in all fields.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(emailOrUsername, password, activeTab);
      if (rememberMe) localStorage.setItem('rememberMe', 'true');
      else localStorage.removeItem('rememberMe');

      showToast('Welcome back! 👋', 'Login successful.', 'success');
      if (activeTab === 'admin') navigate('/admin');
      else if (activeTab === 'provider') navigate('/provider');
      else navigate('/customer');
    } catch (err) {
      showToast('Login Failed', err.message || 'Invalid credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-10 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">

        {/* Logo badge */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-blue-glow group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Serv<span className="text-blue-600">Nexa</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            New here?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500 font-semibold">
              Create an account
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gray-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-premium p-6">

          {/* Tab Switcher */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-slate-900 mb-6">
            {TABS.map((tab) => {
              const cfg = tabConfig[tab];
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setEmailOrUsername(''); }}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>

          {/* Role description */}
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 mb-5 -mt-2">
            {tabConfig[activeTab].description}
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            {/* Email / Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {activeTab === 'admin' ? 'Username' : 'Email Address'}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  {activeTab === 'admin' ? <User size={15} /> : <Mail size={15} />}
                </span>
                <input
                  type={activeTab === 'admin' ? 'text' : 'email'}
                  name={activeTab === 'admin' ? 'username' : 'email'}
                  placeholder={activeTab === 'admin' ? 'e.g. admin' : 'your@email.com'}
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className={inputClass}
                  autoComplete={activeTab === 'admin' ? 'username' : 'email'}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                {activeTab !== 'admin' && (
                  <Link to="/forgot-password" className="text-[11px] text-blue-600 hover:text-blue-500 font-semibold">
                    Forgot?
                  </Link>
                )}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock size={15} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-11`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label className="flex items-center gap-2.5 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow hover:shadow-blue-glow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <span className="text-blue-500 cursor-pointer hover:underline">Terms of Service</span>
          {' & '}
          <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
