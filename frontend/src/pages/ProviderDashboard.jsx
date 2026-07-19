import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Phone, Check, X, Star, User, IndianRupee, TrendingUp, Award, Upload, Settings, Bell, ChevronRight, CheckCircle2
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import ChatDrawer from '../components/ChatDrawer';
import { MessageSquare } from 'lucide-react';

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const { user, updateProfile } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const { pathname } = useLocation();

  // Compute activeTab from URL path
  let activeTab = 'overview';
  if (pathname.includes('/jobs')) activeTab = 'jobs';
  else if (pathname.includes('/history')) activeTab = 'history';
  else if (pathname.includes('/settings')) activeTab = 'settings';

  const handleTabClick = (tab) => {
    if (tab === 'overview') navigate('/provider');
    else navigate(`/provider/${tab}`);
  };

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Settings Form States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [chargesPerVisit, setChargesPerVisit] = useState(user?.chargesPerVisit || '');
  const [workingHours, setWorkingHours] = useState(user?.workingHours || '');
  const [description, setDescription] = useState(user?.description || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(user?.profilePhoto || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  const handleOpenChat = (booking) => {
    setChatBooking(booking);
    setChatOpen(true);
  };

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/provider');
      setBookings(res.data.data);
    } catch (err) {
      console.error('Error fetching provider bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const handleToggleAvailability = async (newVal) => {
    try {
      await updateProfile({ isAvailable: newVal });
      showToast(
        'Availability Updated 🔄',
        `You are now marked as ${newVal ? 'Available' : 'Unavailable'} for new jobs.`,
        'success'
      );
    } catch (err) {
      showToast('Toggle Failed', 'Failed to toggle availability status.', 'error');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const confirmationMsg =
      newStatus === 'completed'
        ? 'Are you sure you want to mark this job as completed? This adds to your history.'
        : newStatus === 'rejected'
        ? 'Are you sure you want to decline this booking request?'
        : 'Are you sure you want to accept this booking request?';

    if (!window.confirm(confirmationMsg)) return;

    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      showToast(
        'Status Updated ✅',
        `Booking request has been ${newStatus}.`,
        'success'
      );
      fetchProviderData();
    } catch (err) {
      showToast('Action Failed', err.response?.data?.message || 'Failed to update job status.', 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('chargesPerVisit', chargesPerVisit);
      formData.append('workingHours', workingHours);
      formData.append('description', description);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      await updateProfile(formData, true);
      showToast('Profile Saved ✅', 'Your provider account info has been updated.', 'success');
    } catch (err) {
      showToast('Save Failed', err.message || 'Failed to update profile info.', 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const calculateEarnings = () => {
    const completedBookings = bookings.filter((b) => b.status === 'completed');
    return completedBookings.reduce((sum, b) => sum + b.charges, 0);
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
        return base + 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400 border border-gray-200 dark:border-slate-700';
      default:
        return base + 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-905';
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="flex bg-slate-50/50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Workspace Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Mobile Submenu tabs */}
        <div className="md:hidden flex overflow-x-auto gap-2 border-b border-gray-200 dark:border-slate-800 pb-3 mb-6 scrollbar-none">
          {['overview', 'jobs', 'history', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
              }`}
            >
              {tab === 'jobs' ? "Today's Jobs" : tab}
            </button>
          ))}
        </div>

        {loading ? (
          <SkeletonLoader type="table" count={5} />
        ) : (
          <div className="animate-fade-in max-w-5xl mx-auto flex flex-col gap-6">
            
            {/* Overview View */}
            {(activeTab === 'overview' || !activeTab) && (
              <div className="flex flex-col gap-6">
                
                {/* Visual Greeting Header with Toggle Availability Banner */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-5 items-center justify-between">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <img
                      src={profilePhotoPreview || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                      alt={user?.name}
                      className="h-14 w-14 rounded-2xl object-cover border border-gray-100 dark:border-slate-700"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 justify-center sm:justify-start">
                        {user?.name}
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          user?.isVerified === 'approved' ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20 dark:text-yellow-400'
                        }`}>
                          {user?.isVerified} Verification
                        </span>
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">Partner Portal · Service Category: {user?.category}</p>
                    </div>
                  </div>

                  {/* Toggle availability switch */}
                  <div className="flex items-center gap-3.5 p-2 px-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-gray-200/50 dark:border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Live Bookings:
                    </span>
                    <button
                      onClick={() => handleToggleAvailability(!user?.isAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        user?.isAvailable ? 'bg-blue-600' : 'bg-gray-200 dark:bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user?.isAvailable ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Provider stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                      <TrendingUp size={12} className="text-blue-500" /> Revenue
                    </span>
                    <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">₹{calculateEarnings()}</h3>
                  </div>

                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" /> Rating
                    </span>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                      {user?.averageRating || 'New'}
                    </h3>
                  </div>

                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                      <Award size={12} className="text-green-500" /> Jobs Done
                    </span>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                      {user?.completedJobsCount || 0}
                    </h3>
                  </div>

                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex items-center gap-1">
                      <Bell size={12} className="text-yellow-500" /> Pending Requests
                    </span>
                    <h3 className="text-2xl font-extrabold text-amber-500 mt-1">
                      {bookings.filter((b) => b.status === 'pending').length}
                    </h3>
                  </div>
                </div>

                {/* Active Jobs panel */}
                <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Active Jobs Overview</h3>
                    {bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length > 3 && (
                      <button onClick={() => handleTabClick('jobs')} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        View All
                      </button>
                    )}
                  </div>
                  
                  {bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length === 0 ? (
                    <div className="text-center py-10 text-xs text-gray-400 dark:text-slate-500">
                      No active booking schedules right now.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3.5">
                      {bookings
                        .filter((b) => ['pending', 'accepted'].includes(b.status))
                        .slice(0, 3)
                        .map((b) => (
                          <div
                            key={b._id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/40 gap-4 text-xs hover:border-gray-200 transition-colors"
                          >
                            <div className="flex gap-3">
                              {b.customer?.profilePhoto ? (
                                <img
                                  src={b.customer.profilePhoto}
                                  alt="Customer"
                                  className="h-10 w-10 rounded-lg object-cover border border-gray-200/50 dark:border-slate-700"
                                />
                              ) : (
                                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-gray-400 font-bold border border-gray-200/50 dark:border-slate-700">
                                  {b.customer?.name?.charAt(0).toUpperCase() || 'C'}
                                </div>
                              )}
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white">{b.customer?.name}</h4>
                                <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                                  <MapPin size={10} /> {b.address}
                                </span>
                                <div className="flex items-center gap-3 text-gray-400 mt-1">
                                  <span>📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  <span>⏰ {b.bookingTime}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3.5 self-end sm:self-center">
                              <span className={getStatusBadgeClass(b.status)}>{b.status}</span>
                              <span className="font-extrabold text-sm text-gray-900 dark:text-white">₹{b.charges}</span>
                              <button
                                onClick={() => handleOpenChat(b)}
                                className="p-2 rounded-xl text-blue-650 hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-transparent hover:border-blue-100 transition-all"
                                title="Chat with Customer"
                              >
                                <MessageSquare size={14} />
                              </button>
                              {b.status === 'pending' ? (
                                <div className="flex gap-1.5">
                                  <button
                                    onClick={() => handleStatusChange(b._id, 'accepted')}
                                    className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg border border-green-200"
                                    title="Accept Job"
                                  >
                                    <Check size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(b._id, 'rejected')}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                                    title="Decline Job"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(b._id, 'completed')}
                                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[10px] transition-colors"
                                >
                                  Complete Job
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Manage Jobs View */}
            {activeTab === 'jobs' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Active Jobs Schedule</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage incoming client requests and complete accepted bookings.</p>
                </div>

                {bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length === 0 ? (
                  <div className="p-12 text-center border rounded-2xl border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                    <Calendar size={24} className="text-gray-300 dark:text-slate-700" />
                    <p className="text-xs text-gray-400">No active bookings scheduled.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings
                      .filter((b) => ['pending', 'accepted'].includes(b.status))
                      .map((b) => (
                        <div
                          key={b._id}
                          className="p-5 rounded-2xl border border-gray-100 dark:border-slate-850 bg-white dark:bg-slate-850 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs shadow-sm hover:border-gray-200 transition-all"
                        >
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              {b.customer?.profilePhoto ? (
                                <img
                                  src={b.customer.profilePhoto}
                                  alt="Customer"
                                  className="h-12 w-12 rounded-xl object-cover border border-gray-200/50 dark:border-slate-700"
                                />
                              ) : (
                                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 font-extrabold text-lg border border-gray-200/50 dark:border-slate-700">
                                  {b.customer?.name?.charAt(0).toUpperCase() || 'C'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{b.customer?.name}</h4>
                                <span className="text-[9px] font-mono text-gray-400 bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">ID: {b.bookingId}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-400 mt-2.5">
                                <span className="flex items-center gap-1.5">📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span className="flex items-center gap-1.5">⏰ {b.bookingTime}</span>
                                <span className="flex items-center gap-1.5 sm:col-span-2"><MapPin size={12} /> {b.address}</span>
                                <span className="flex items-center gap-1.5 sm:col-span-2"><Phone size={12} /> {b.phone}</span>
                              </div>
                              {b.notes && (
                                <p className="mt-3 p-2.5 bg-gray-50 dark:bg-slate-900 border rounded-lg text-gray-500 dark:text-gray-400 italic text-[11px]">
                                  Notes: "{b.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
                            <div className="text-left sm:text-right">
                              <span className={getStatusBadgeClass(b.status)}>{b.status}</span>
                              <div className="font-extrabold text-base text-gray-900 dark:text-white mt-1.5 font-bold">Earnings: ₹{b.charges}</div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOpenChat(b)}
                                className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 dark:border-slate-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 text-[10px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <MessageSquare size={12} /> Chat
                              </button>
                              {b.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(b._id, 'accepted')}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(b._id, 'rejected')}
                                    className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-xs font-bold"
                                  >
                                    Decline
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleStatusChange(b._id, 'completed')}
                                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-blue-glow transition-all active:scale-95"
                                >
                                  Mark Completed
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Job History View */}
            {activeTab === 'history' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job logs & History</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Logs of all previous service requests finished on the platform.</p>
                </div>

                {bookings.filter((b) => ['completed', 'rejected', 'cancelled'].includes(b.status)).length === 0 ? (
                  <div className="p-12 text-center border rounded-2xl border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                    <Calendar size={24} className="text-gray-300 dark:text-slate-700" />
                    <p className="text-xs text-gray-400">No logs found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings
                      .filter((b) => ['completed', 'rejected', 'cancelled'].includes(b.status))
                      .map((b) => (
                        <div
                          key={b._id}
                          className="p-5 rounded-2xl border border-gray-100 dark:border-slate-850 bg-white dark:bg-slate-850 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs shadow-sm opacity-95 hover:border-gray-200 transition-all"
                        >
                          <div className="flex gap-4">
                            <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 font-extrabold text-base border border-gray-200/50 dark:border-slate-700">
                              {b.customer?.name?.charAt(0).toUpperCase() || 'C'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-sm text-gray-900 dark:text-white">{b.customer?.name}</h4>
                                <span className="text-[9px] font-mono text-gray-400 bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">ID: {b.bookingId}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-400 mt-2">
                                <span>📅 {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                <span>⏰ {b.bookingTime}</span>
                                <span>📍 {b.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-2.5">
                            <span className={getStatusBadgeClass(b.status)}>{b.status}</span>
                            <div className="font-extrabold text-base text-gray-900 dark:text-white mb-2">₹{b.charges}</div>
                            <button
                              onClick={() => handleOpenChat(b)}
                              className="px-3 py-1 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-[10px] font-bold flex items-center gap-1 transition-all"
                            >
                              <MessageSquare size={12} /> Chat
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings View */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Partner Profile Settings</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Configure your charges per visit, scheduling availability, and description bio.</p>
                </div>

                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  {/* Photo picker */}
                  <div className="flex items-center gap-4 p-4 border border-gray-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-850">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Preview"
                        className="h-16 w-16 rounded-2xl object-cover border border-gray-200 dark:border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-gray-300 border border-gray-200 dark:border-slate-700">
                        <User size={24} />
                      </div>
                    )}
                    <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors shadow-sm">
                      <Upload size={13} /> Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>

                    {/* Charges Per Visit */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Charges Per Visit (₹)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                          <IndianRupee size={14} />
                        </span>
                        <input
                          type="number"
                          value={chargesPerVisit}
                          onChange={(e) => setChargesPerVisit(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Working Hours</label>
                      <input
                        type="text"
                        value={workingHours}
                        onChange={(e) => setWorkingHours(e.target.value)}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Location (City)</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Description / Bio</label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-250 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none placeholder:text-gray-400"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {updatingProfile ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Saving Profile...
                      </>
                    ) : 'Save Partner Profile'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Real-time Chat Drawer Overlay */}
      {chatOpen && chatBooking && (
        <ChatDrawer
          booking={chatBooking}
          onClose={() => setChatOpen(false)}
        />
      )}

    </div>
  );
}
