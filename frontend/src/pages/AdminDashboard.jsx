import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert, Users, Calendar, FileText, IndianRupee, TrendingUp, CheckCircle, XCircle, Eye, Settings, CheckCircle2, Trash2
} from 'lucide-react';
import api from '../services/api';
import { NotificationContext } from '../context/NotificationContext';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminDashboard() {
  const { showToast } = useContext(NotificationContext);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Compute activeTab from URL path
  let activeTab = 'overview';
  if (pathname.includes('/analytics')) activeTab = 'analytics';
  else if (pathname.includes('/verifications')) activeTab = 'verifications';
  else if (pathname.includes('/bookings')) activeTab = 'bookings';
  else if (pathname.includes('/users')) activeTab = 'users';
  else if (pathname.includes('/settings')) activeTab = 'settings';

  const handleTabClick = (tab) => {
    if (tab === 'overview') navigate('/admin');
    else navigate(`/admin/${tab}`);
  };

  const [stats, setStats] = useState(null);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // System Settings Panel Mock Configurations
  const [platformCommission, setPlatformCommission] = useState(15);
  const [systemEmail, setSystemEmail] = useState('admin@servnexa.in');
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/dashboard');
      setStats(statsRes.data.stats);

      const pendingRes = await api.get('/admin/providers/pending');
      setPendingProviders(pendingRes.data.data);

      const bookingsRes = await api.get('/admin/bookings');
      setBookings(bookingsRes.data.data);

      const customersRes = await api.get('/admin/users');
      setCustomers(customersRes.data.data);

      const providersRes = await api.get('/admin/providers');
      setProvidersList(providersRes.data.data);
    } catch (err) {
      console.error('Error fetching admin dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (pathname.includes('/analytics')) {
      fetchAnalytics();
    }
  }, [pathname]);

  // Approve / Reject verification
  const handleVerifyProvider = async (providerId, newStatus) => {
    const actionText = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${actionText} this service provider?`)) return;

    try {
      await api.put(`/admin/providers/${providerId}/verify`, { status: newStatus });
      showToast(
        'Verification Complete ✅',
        `Provider status has been set to ${newStatus}.`,
        'success'
      );
      fetchAdminData();
    } catch (err) {
      showToast('Action Failed', err.response?.data?.message || 'Failed to verify provider.', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this customer account and all associated bookings?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      showToast('Customer Deleted 🗑️', 'The account has been removed.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Action Failed', err.response?.data?.message || 'Failed to delete customer.', 'error');
    }
  };

  const handleDeleteProvider = async (providerId) => {
    if (!window.confirm("Are you sure you want to permanently delete this service provider and all associated bookings?")) return;
    try {
      await api.delete(`/admin/providers/${providerId}`);
      showToast('Provider Deleted 🗑️', 'The provider profile has been removed.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Action Failed', err.response?.data?.message || 'Failed to delete provider.', 'error');
    }
  };

  // Mock save settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setTimeout(() => {
      showToast('Settings Saved ✅', 'Platform configurations updated successfully.', 'success');
      setSavingSettings(false);
    }, 800);
  };

  const getStatusBadgeClass = (status) => {
    const base = 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ';
    switch (status) {
      case 'completed':
        return base + 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900';
      case 'accepted':
        return base + 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200 dark:border-blue-900';
      case 'rejected':
        return base + 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-900';
      case 'cancelled':
        return base + 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-450 border border-gray-200 dark:border-slate-700';
      default:
        return base + 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900';
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="flex bg-slate-50/50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Workspace */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Mobile menu tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 border-b border-gray-200 dark:border-slate-800 pb-3 mb-6 scrollbar-none">
          {['overview', 'analytics', 'verifications', 'bookings', 'users', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
              }`}
            >
              {tab === 'verifications' ? 'Verifications' : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <div className="animate-fade-in max-w-5xl mx-auto flex flex-col gap-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="flex flex-col gap-6">
                
                {/* Greeting Panel */}
                <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-lg flex flex-col justify-between sm:flex-row gap-5 items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                      <ShieldAlert size={20} className="text-blue-500 fill-blue-500/10" />
                      Platform Administration Control
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">Review partner verifications, inspect bookings, and system operational stats.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-3 py-1 rounded-full">
                      System Operational
                    </span>
                  </div>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Total Customers */}
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Total Customers</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">{stats.totalCustomers}</h3>
                    </div>
                  </div>

                  {/* Total Providers */}
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 dark:bg-slate-900 text-green-600 dark:text-green-400 rounded-xl">
                      <Users size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Service Partners</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                        {stats.totalProviders} <span className="text-[10px] text-amber-500 font-semibold">({stats.pendingProviders} pend)</span>
                      </h3>
                    </div>
                  </div>

                  {/* Total Booking counts */}
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-slate-900 text-purple-600 dark:text-purple-400 rounded-xl">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Total Bookings</span>
                      <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">{stats.totalBookings}</h3>
                    </div>
                  </div>

                  {/* Revenue */}
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 dark:bg-slate-900 text-amber-600 dark:text-amber-400 rounded-xl">
                      <IndianRupee size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">Platform Comm. (15%)</span>
                      <h3 className="text-lg font-extrabold text-blue-600 mt-0.5">
                        ₹{stats.platformCommission} <span className="text-[10px] text-gray-400 font-normal">(₹{stats.totalRevenue} volume)</span>
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Booking Status breakdown charts using native HTML elements */}
                <div className="rounded-2xl border border-gray-100 dark:border-slate-800 p-6 bg-white dark:bg-slate-850 shadow-sm">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <TrendingUp size={16} /> Booking Distribution by Status
                  </h3>
                  
                  <div className="flex flex-col gap-4">
                    {Object.keys(stats.statusCounts || {}).map((status) => {
                      const count = stats.statusCounts[status];
                      const pct = stats.totalBookings > 0 ? (count / stats.totalBookings) * 100 : 0;
                      return (
                        <div key={status} className="flex items-center gap-4 text-xs font-semibold">
                          <span className="w-20 capitalize text-gray-500 dark:text-gray-400">{status}</span>
                          <div className="flex-grow h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className={`h-full rounded-full transition-all duration-500 ${
                                status === 'completed'
                                  ? 'bg-green-500'
                                  : status === 'accepted'
                                  ? 'bg-blue-600'
                                  : status === 'pending'
                                  ? 'bg-yellow-505'
                                  : 'bg-red-500'
                              }`}
                            ></div>
                          </div>
                          <span className="w-10 text-right text-gray-900 dark:text-white">{count} ({Math.round(pct)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Joined statistics breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
                  {/* Customers by Location */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-slate-800/80 bg-white dark:bg-slate-850 shadow-sm">
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Joined Customers by Location</h3>
                    <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
                      {(stats.customersByLocation || []).map((loc, idx) => (
                        <div key={loc._id || idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-slate-400 font-semibold">{loc._id || 'Unknown Location'}</span>
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-650 dark:text-blue-400 font-bold rounded-md">{loc.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Providers by Location */}
                  <div className="p-5 rounded-2xl border border-gray-155 dark:border-slate-800/80 bg-white dark:bg-slate-850 shadow-sm">
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Joined Providers by Location</h3>
                    <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
                      {(stats.providersByLocation || []).map((loc, idx) => (
                        <div key={loc._id || idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-slate-400 font-semibold">{loc._id || 'Unknown Location'}</span>
                          <span className="px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-bold rounded-md">{loc.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Providers by Category */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-slate-800/80 bg-white dark:bg-slate-850 shadow-sm">
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Providers by Category</h3>
                    <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
                      {(stats.providersByCategory || []).map((cat, idx) => (
                        <div key={cat._id || idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-slate-400 font-semibold">{cat._id}</span>
                          <span className="px-2 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold rounded-md">{cat.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Providers by Verification Status */}
                  <div className="p-5 rounded-2xl border border-gray-150 dark:border-slate-800/80 bg-white dark:bg-slate-850 shadow-sm">
                    <h3 className="font-bold text-xs text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Providers Verification Status</h3>
                    <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto">
                      {(stats.providersByVerification || []).map((v, idx) => (
                        <div key={v._id || idx} className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 dark:text-slate-400 font-semibold capitalize">{v._id}</span>
                          <span className={`px-2 py-0.5 font-bold rounded-md ${
                            v._id === 'approved' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : v._id === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
                          }`}>{v.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Advanced Business Analytics</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Explore detailed trends, hourly distribution, retention metrics, and partner performance.</p>
                </div>

                {analyticsLoading ? (
                  <div className="flex justify-center items-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
                      <p className="text-xs text-gray-400 font-semibold">Loading analytics data...</p>
                    </div>
                  </div>
                ) : !analytics ? (
                  <div className="flex justify-center items-center py-24">
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-sm text-gray-500 font-semibold">No analytics data available.</p>
                      <button onClick={fetchAnalytics} className="text-xs text-blue-600 font-bold hover:underline">Retry</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* ── 1. Daily Bookings + Revenue — Dual SVG Area Chart ── */}
                    <div className="lg:col-span-2 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white">Daily Bookings & Revenue <span className="text-[10px] text-gray-400 font-normal ml-1">(Last 30 days)</span></h3>
                        <div className="flex items-center gap-4 text-[11px] font-semibold">
                          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"/>Bookings</span>
                          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"/>Revenue (₹)</span>
                        </div>
                      </div>
                      {(() => {
                        const data = analytics.dailyStats || [];
                        if (data.length === 0) return (
                          <div className="h-56 flex items-center justify-center text-xs text-gray-400">No bookings in the last 30 days</div>
                        );
                        const W = 700; const H = 180; const PAD = 10;
                        const maxB = Math.max(...data.map(d => d.bookingsCount), 1);
                        const maxR = Math.max(...data.map(d => d.revenue), 1);
                        const bPts = data.map((d, i) => {
                          const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2);
                          const y = H - PAD - (d.bookingsCount / maxB) * (H - PAD * 3);
                          return [x, y];
                        });
                        const rPts = data.map((d, i) => {
                          const x = PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2);
                          const y = H - PAD - (d.revenue / maxR) * (H - PAD * 3);
                          return [x, y];
                        });
                        const bLine = bPts.map(([x, y]) => `${x},${y}`).join(' ');
                        const rLine = rPts.map(([x, y]) => `${x},${y}`).join(' ');
                        const bArea = `${PAD},${H - PAD} ${bLine} ${W - PAD},${H - PAD}`;
                        const rArea = `${PAD},${H - PAD} ${rLine} ${W - PAD},${H - PAD}`;
                        return (
                          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-56" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="bGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></linearGradient>
                              <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
                            </defs>
                            {[0.25, 0.5, 0.75, 1].map(f => (
                              <line key={f} x1={PAD} y1={H - PAD - f * (H - PAD * 3)} x2={W - PAD} y2={H - PAD - f * (H - PAD * 3)} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4,4"/>
                            ))}
                            <polygon points={bArea} fill="url(#bGrad)"/>
                            <polyline points={bLine} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
                            <polygon points={rArea} fill="url(#rGrad)"/>
                            <polyline points={rLine} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round"/>
                            {bPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6"/>)}
                            {rPts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" fill="#10b981"/>)}
                          </svg>
                        );
                      })()}
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold uppercase tracking-wider px-1">
                        <span>{analytics.dailyStats?.[0]?._id || '30 days ago'}</span>
                        <span>{analytics.dailyStats?.[analytics.dailyStats.length - 1]?._id || 'Today'}</span>
                      </div>
                    </div>

                    {/* ── 2. Monthly Revenue Growth — SVG Rect Bar Chart ── */}
                    <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Monthly Revenue Growth</h3>
                      {(() => {
                        const data = analytics.monthlyStats || [];
                        if (data.length === 0) return <div className="h-52 flex items-center justify-center text-xs text-gray-400">No monthly data yet</div>;
                        const W = 320; const H = 160; const BAR_GAP = 8;
                        const barW = Math.max(10, (W - BAR_GAP * (data.length + 1)) / data.length);
                        const maxRev = Math.max(...data.map(d => d.revenue), 100);
                        return (
                          <div className="flex flex-col gap-2">
                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-44" preserveAspectRatio="xMidYMid meet">
                              <defs>
                                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#6366f1"/>
                                  <stop offset="100%" stopColor="#3b82f6"/>
                                </linearGradient>
                              </defs>
                              {data.map((m, i) => {
                                const barH = Math.max(4, (m.revenue / maxRev) * (H - 30));
                                const x = BAR_GAP + i * (barW + BAR_GAP);
                                const y = H - 20 - barH;
                                return (
                                  <g key={m._id || i}>
                                    <rect x={x} y={y} width={barW} height={barH} rx="4" fill="url(#barGrad)" opacity="0.9"/>
                                    <text x={x + barW / 2} y={y - 3} textAnchor="middle" fontSize="7" fill="#6366f1" fontWeight="700">₹{m.revenue}</text>
                                    <text x={x + barW / 2} y={H - 5} textAnchor="middle" fontSize="7" fill="#94a3b8" fontWeight="600">{(m._id || '').slice(5)}</text>
                                  </g>
                                );
                              })}
                            </svg>
                            <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 font-semibold">
                              <span>Total Bookings: <b className="text-gray-700 dark:text-gray-200">{data.reduce((s, d) => s + d.bookingsCount, 0)}</b></span>
                              <span>Total Revenue: <b className="text-emerald-600">₹{data.reduce((s, d) => s + d.revenue, 0)}</b></span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* ── 3. Peak Booking Hours — SVG Line Chart ── */}
                    <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Peak Booking Hours <span className="text-[10px] text-gray-400 font-normal">(24-hr)</span></h3>
                      {(() => {
                        const hoursMap = {};
                        for (let h = 0; h < 24; h++) hoursMap[h] = 0;
                        (analytics.peakHours || []).forEach(d => { hoursMap[Number(d._id)] = d.count; });
                        const W = 320; const H = 140; const PAD = 10;
                        const hours = Array.from({ length: 24 }, (_, h) => h);
                        const maxVal = Math.max(...hours.map(h => hoursMap[h]), 1);
                        const pts = hours.map(h => {
                          const x = PAD + (h / 23) * (W - PAD * 2);
                          const y = H - PAD - (hoursMap[h] / maxVal) * (H - PAD * 2.5);
                          return `${x},${y}`;
                        }).join(' ');
                        const area = `${PAD},${H - PAD} ${pts} ${W - PAD},${H - PAD}`;
                        const peakHour = hours.reduce((best, h) => hoursMap[h] > hoursMap[best] ? h : best, 0);
                        return (
                          <div className="flex flex-col gap-2">
                            <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36" preserveAspectRatio="none">
                              <defs>
                                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3"/><stop offset="100%" stopColor="#a78bfa" stopOpacity="0"/></linearGradient>
                              </defs>
                              {[0.33, 0.66, 1].map(f => (
                                <line key={f} x1={PAD} y1={H - PAD - f * (H - PAD * 2.5)} x2={W - PAD} y2={H - PAD - f * (H - PAD * 2.5)} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3,3"/>
                              ))}
                              <polygon points={area} fill="url(#hoursGrad)"/>
                              <polyline points={pts} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                              <span className="text-gray-400">12 AM</span>
                              <span className="text-purple-500">🕐 Peak: {peakHour}:00 ({hoursMap[peakHour]} bookings)</span>
                              <span className="text-gray-400">11 PM</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* ── 4. Customer Retention — Donut Chart ── */}
                    <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Customer Retention</h3>
                      <div className="flex items-center justify-around gap-4">
                        <div className="relative h-36 w-36 flex items-center justify-center flex-shrink-0">
                          {(() => {
                            const total = Math.max(analytics.retention?.totalCustomers || 0, 1);
                            const repeat = analytics.retention?.repeatCustomers || 0;
                            const single = analytics.retention?.singleCustomers || 0;
                            const R = 48; const CX = 60; const CY = 60; const circ = 2 * Math.PI * R;
                            const repeatDash = (repeat / total) * circ;
                            const singleDash = (single / total) * circ;
                            return (
                              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#f1f5f9" strokeWidth="14" className="dark:stroke-slate-800"/>
                                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e0e7ff" strokeWidth="14"
                                  strokeDasharray={`${singleDash} ${circ - singleDash}`}
                                  strokeDashoffset={-repeatDash}
                                />
                                <circle cx={CX} cy={CY} r={R} fill="none" stroke="#3b82f6" strokeWidth="14"
                                  strokeDasharray={`${repeatDash} ${circ - repeatDash}`}
                                  strokeLinecap="butt"
                                />
                              </svg>
                            );
                          })()}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                              {Math.round(((analytics.retention?.repeatCustomers || 0) / Math.max(analytics.retention?.totalCustomers || 1, 1)) * 100)}%
                            </span>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Repeat Rate</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="h-3 w-3 rounded-sm bg-blue-500 flex-shrink-0"/>
                              <span className="text-gray-600 dark:text-gray-300 font-semibold">Repeat Customers</span>
                            </div>
                            <span className="text-2xl font-extrabold text-gray-900 dark:text-white ml-5">{analytics.retention?.repeatCustomers || 0}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="h-3 w-3 rounded-sm bg-indigo-200 flex-shrink-0"/>
                              <span className="text-gray-600 dark:text-gray-300 font-semibold">One-time Customers</span>
                            </div>
                            <span className="text-2xl font-extrabold text-gray-900 dark:text-white ml-5">{analytics.retention?.singleCustomers || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── 5. Popular Services — Horizontal Bar Chart ── */}
                    <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Popular Services</h3>
                      {analytics.popularServices?.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-xs text-gray-400">No booking data yet</div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          {(analytics.popularServices || []).slice(0, 7).map((item, idx) => {
                            const maxCount = Math.max(...(analytics.popularServices || []).map(s => s.count), 1);
                            const pct = Math.round((item.count / maxCount) * 100);
                            const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];
                            return (
                              <div key={item._id || idx} className="flex items-center gap-3 text-xs">
                                <span className="w-28 text-gray-600 dark:text-gray-300 font-semibold truncate flex-shrink-0">{item._id || 'General'}</span>
                                <div className="flex-grow h-4 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div style={{ width: `${pct}%` }} className={`h-full rounded-full ${colors[idx % colors.length]} transition-all duration-700`}/>
                                </div>
                                <span className="w-8 text-right font-bold text-gray-900 dark:text-white flex-shrink-0">{item.count}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* ── 6. Provider Performance — Table ── */}
                    <div className="lg:col-span-2 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4">Provider Performance <span className="text-[10px] text-gray-400 font-normal">(Top 5 by jobs completed)</span></h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse min-w-[500px]">
                          <thead>
                            <tr className="border-b-2 border-gray-100 dark:border-slate-700">
                              <th className="pb-3 text-left text-gray-400 font-bold uppercase tracking-wider">Partner</th>
                              <th className="pb-3 text-left text-gray-400 font-bold uppercase tracking-wider">Category</th>
                              <th className="pb-3 text-left text-gray-400 font-bold uppercase tracking-wider">Location</th>
                              <th className="pb-3 text-center text-gray-400 font-bold uppercase tracking-wider">Jobs Done</th>
                              <th className="pb-3 text-center text-gray-400 font-bold uppercase tracking-wider">Rating</th>
                              <th className="pb-3 text-left text-gray-400 font-bold uppercase tracking-wider">Performance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                            {(analytics.providerPerformance || []).map((p, idx) => {
                              const maxJobs = Math.max(...(analytics.providerPerformance || []).map(x => x.completedJobsCount || 0), 1);
                              const jobsPct = Math.round(((p.completedJobsCount || 0) / maxJobs) * 100);
                              return (
                                <tr key={p._id || idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                  <td className="py-3">
                                    <div className="flex items-center gap-2.5">
                                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-[10px] font-extrabold flex items-center justify-center flex-shrink-0">
                                        {p.name?.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="font-semibold text-gray-900 dark:text-white">{p.name}</span>
                                    </div>
                                  </td>
                                  <td className="py-3">
                                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 font-bold">{p.category}</span>
                                  </td>
                                  <td className="py-3 text-gray-500 dark:text-gray-400">{p.location}</td>
                                  <td className="py-3 text-center font-bold text-gray-900 dark:text-white">{p.completedJobsCount || 0}</td>
                                  <td className="py-3 text-center">
                                    <span className="font-bold text-amber-500">★ {p.averageRating?.toFixed(1) || '—'}</span>
                                  </td>
                                  <td className="py-3 w-32">
                                    <div className="h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div style={{ width: `${jobsPct}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"/>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                        {(analytics.providerPerformance || []).length === 0 && (
                          <div className="py-10 text-center text-xs text-gray-400">No approved providers found</div>
                        )}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* Pending Verifications Tab */}
            {activeTab === 'verifications' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Pending Partner Approvals</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Verify uploaded credentials and details for service partner applications.</p>
                </div>

                {pendingProviders.length === 0 ? (
                  <div className="p-12 text-center border rounded-2xl border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                    <ShieldAlert size={24} className="text-gray-300 dark:text-slate-700" />
                    <p className="text-xs text-gray-400">No partner verifications pending at this moment.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {pendingProviders.map((p) => (
                      <div
                        key={p._id}
                        className="p-5 rounded-2xl border border-gray-100 dark:border-slate-850 bg-white dark:bg-slate-850 flex flex-col md:flex-row justify-between md:items-center gap-5 text-xs shadow-sm hover:border-gray-200 transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={p.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                            alt={p.name}
                            className="h-12 w-12 rounded-xl object-cover border border-gray-200/50 dark:border-slate-750"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{p.name}</h4>
                              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full">
                                {p.category}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-400 mt-2.5">
                              <span>📧 {p.email}</span>
                              <span>📞 {p.phone}</span>
                              <span>📍 {p.location}</span>
                              <span>💼 {p.experience} Yrs Exp</span>
                            </div>
                          </div>
                        </div>

                        {/* ID Document view and action buttons */}
                        <div className="flex items-center md:flex-col md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
                          {p.governmentId && (
                            <a
                              href={p.governmentId}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 font-bold text-[10px] transition-colors"
                            >
                              <Eye size={12} /> View Gov ID Proof
                            </a>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleVerifyProvider(p._id, 'approved')}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                            >
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button
                              onClick={() => handleVerifyProvider(p._id, 'rejected')}
                              className="px-4 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                            >
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Manage Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">All Bookings</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Audit, view, and inspect all service bookings recorded across the platform.</p>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                  <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="p-4">ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Provider</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Date/Time</th>
                        <th className="p-4">Charges</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-gray-200">
                      {bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition-colors">
                          <td className="p-4 font-mono font-bold text-[10px] text-gray-400">{b.bookingId}</td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900 dark:text-white">{b.customer?.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{b.customer?.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-gray-900 dark:text-white">{b.provider?.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{b.provider?.email}</div>
                          </td>
                          <td className="p-4 font-semibold text-gray-800 dark:text-slate-350">{b.serviceName}</td>
                          <td className="p-4">
                            <div>{new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{b.bookingTime}</div>
                          </td>
                          <td className="p-4 font-bold text-gray-900 dark:text-white">₹{b.charges}</td>
                          <td className="p-4">
                            <span className={getStatusBadgeClass(b.status)}>{b.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Manage Users Tab */}
            {activeTab === 'users' && (
              <div className="flex flex-col gap-8">
                
                {/* Customers Listing */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Customers Directory ({customers.length})</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Manage customer credentials and account information records.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                    <table className="w-full text-left text-xs border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Location</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-gray-200">
                        {customers.map((c) => (
                          <tr key={c._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition-colors">
                            <td className="p-4 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                              {c.profilePhoto ? (
                                <img
                                  src={c.profilePhoto}
                                  alt="C"
                                  className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-slate-700 shadow-sm"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 font-bold text-[10px] border">
                                  {c.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {c.name}
                            </td>
                            <td className="p-4">{c.email}</td>
                            <td className="p-4">{c.phone}</td>
                            <td className="p-4">{c.location}</td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(c._id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                title="Delete Customer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Service Providers Listing */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">Service Partners Directory ({providersList.length})</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Manage partner listings, verification status, and ratings.</p>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                    <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 text-gray-400 font-bold uppercase tracking-wider">
                          <th className="p-4">Name</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Experience</th>
                          <th className="p-4">Rating</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-gray-700 dark:text-gray-200">
                        {providersList.map((p) => (
                          <tr key={p._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition-colors">
                            <td className="p-4 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                              {p.profilePhoto ? (
                                <img
                                  src={p.profilePhoto}
                                  alt="P"
                                  className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-slate-700 shadow-sm"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 font-bold text-[10px] border">
                                  {p.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              {p.name}
                            </td>
                            <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">{p.category}</td>
                            <td className="p-4">{p.location}</td>
                            <td className="p-4">{p.experience} Years</td>
                            <td className="p-4">
                              <span className="flex items-center gap-1 font-bold text-gray-800 dark:text-gray-200">
                                <TrendingUp size={12} className="text-yellow-500" />
                                {p.averageRating?.toFixed(1) || 'New'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`font-bold capitalize ${p.isVerified === 'approved' ? 'text-green-600 dark:text-green-400' : p.isVerified === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                                {p.isVerified}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                onClick={() => handleDeleteProvider(p._id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                title="Delete Provider"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Platform Configurations</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Configure commissions fee, transactional email endpoints and system credentials.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="flex flex-col gap-4">
                  {/* Commission */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Platform Commission Fee (%)</label>
                    <input
                      type="number"
                      value={platformCommission}
                      onChange={(e) => setPlatformCommission(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* System Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">System Notification Email</label>
                    <input
                      type="email"
                      value={systemEmail}
                      onChange={(e) => setSystemEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {savingSettings ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Saving Configurations...
                      </>
                    ) : 'Save Configurations'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
