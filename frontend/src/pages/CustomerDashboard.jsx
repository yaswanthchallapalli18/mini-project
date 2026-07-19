import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, Phone, Trash2, Star, MessageSquarePlus, User, Heart, Upload, AlertCircle, FileText, ChevronRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import ChatDrawer from '../components/ChatDrawer';
import { MessageSquare } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, updateProfile } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const { pathname } = useLocation();

  // Compute activeTab from URL path
  let activeTab = 'overview';
  if (pathname.includes('/bookings')) activeTab = 'bookings';
  else if (pathname.includes('/favorites')) activeTab = 'favorites';
  else if (pathname.includes('/settings')) activeTab = 'settings';

  const handleTabClick = (tab) => {
    if (tab === 'overview') navigate('/customer');
    else navigate(`/customer/${tab}`);
  };

  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal States
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Settings Edit States
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(user?.profilePhoto || '');
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBooking, setChatBooking] = useState(null);

  const handleOpenChat = (booking) => {
    setChatBooking(booking);
    setChatOpen(true);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const bookingsRes = await api.get('/bookings/customer');
      setBookings(bookingsRes.data.data);

      const favoritesRes = await api.get('/customers/favorites');
      setFavorites(favoritesRes.data.data);
    } catch (err) {
      console.error('Error fetching customer dashboard data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      showToast('Booking Cancelled 🚫', 'The service appointment has been cancelled.', 'success');
      fetchDashboardData();
    } catch (err) {
      showToast('Action Failed', err.response?.data?.message || 'Failed to cancel booking.', 'error');
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
    setReviewOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Validation Error', 'Please type a review comment.', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post('/reviews', {
        bookingId: selectedBooking._id,
        rating,
        comment,
      });

      showToast('Review Submitted ⭐', 'Thank you for your rating and feedback!', 'success');
      setReviewOpen(false);
      fetchDashboardData();
    } catch (err) {
      showToast('Submission Failed', err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdatingSettings(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('location', location);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      await updateProfile(formData, true);
      showToast('Profile Updated ✅', 'Your settings have been saved.', 'success');
    } catch (err) {
      showToast('Save Failed', err.message || 'Failed to save changes.', 'error');
    } finally {
      setUpdatingSettings(false);
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
        return base + 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900';
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="flex bg-slate-50/50 dark:bg-slate-950 min-h-[calc(100vh-4rem)] transition-colors duration-200">
      
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Navigation Tabs (Mobile View Side-Toggler) */}
        <div className="md:hidden flex overflow-x-auto gap-2 border-b border-gray-200 dark:border-slate-800 pb-3 mb-6 scrollbar-none">
          {['overview', 'bookings', 'favorites', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
              }`}
            >
              {tab === 'favorites' ? 'Favorites' : tab}
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
                
                {/* Greeting Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-blue-glow p-6 flex flex-col sm:flex-row gap-5 items-center justify-between">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                  <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
                    {user?.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-white/20 shadow-md"
                      />
                    ) : (
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white font-extrabold text-xl border-2 border-white/20 shadow-md">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                    <div>
                      <h2 className="text-xl font-bold">Welcome back, {user?.name || 'Customer'}!</h2>
                      <p className="text-xs text-blue-100 mt-1">Book services and track bookings from your dashboard.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/providers')}
                    className="relative z-10 px-5 py-2.5 bg-white text-blue-600 font-bold rounded-xl text-xs hover:bg-blue-50 transition-colors shadow-sm active:scale-95 transition-all"
                  >
                    Book a Service
                  </button>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Total Requests</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{bookings.length}</h3>
                  </div>
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Pending Actions</span>
                    <h3 className="text-2xl font-extrabold text-amber-500 mt-1">
                      {bookings.filter((b) => b.status === 'pending').length}
                    </h3>
                  </div>
                  <div className="p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Saved Experts</span>
                    <h3 className="text-2xl font-extrabold text-red-500 mt-1">{favorites.length}</h3>
                  </div>
                </div>

                {/* Recent Bookings Section */}
                <div className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Upcoming Bookings</h3>
                    {bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length > 3 && (
                      <button onClick={() => handleTabClick('bookings')} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                        View All
                      </button>
                    )}
                  </div>
                  
                  {bookings.filter((b) => ['pending', 'accepted'].includes(b.status)).length === 0 ? (
                    <div className="text-center py-10 text-xs text-gray-400 dark:text-slate-500 flex flex-col items-center gap-2">
                      <Calendar size={20} className="text-gray-300 dark:text-slate-700" />
                      No upcoming appointments scheduled.
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
                              <img
                                src={b.provider?.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80'}
                                alt="Provider"
                                className="h-10 w-10 rounded-lg object-cover border border-gray-200/50 dark:border-slate-700"
                              />
                              <div>
                                <h4 className="font-bold text-gray-900 dark:text-white leading-snug">{b.provider?.name}</h4>
                                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider block mt-0.5">
                                  {b.serviceName}
                                </span>
                                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mt-1 flex-wrap">
                                  <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                  <span className="flex items-center gap-1"><Clock size={11} /> {b.bookingTime}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3.5 self-end sm:self-center">
                              <span className={getStatusBadgeClass(b.status)}>{b.status}</span>
                              <span className="font-extrabold text-sm text-gray-900 dark:text-white">₹{b.charges}</span>
                              <button
                                onClick={() => handleOpenChat(b)}
                                className="p-2 rounded-xl text-blue-650 hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-transparent hover:border-blue-100 transition-all"
                                title="Chat with Provider"
                              >
                                <MessageSquare size={14} />
                              </button>
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => handleCancelBooking(b._id)}
                                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 transition-all"
                                  title="Cancel Request"
                                >
                                  <Trash2 size={14} />
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

            {/* Bookings View */}
            {activeTab === 'bookings' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Booking History</h2>
                  <p className="text-xs text-gray-400 mt-0.5">View status, track history, and review completed services.</p>
                </div>

                {bookings.length === 0 ? (
                  <div className="p-12 text-center border rounded-2xl border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                    <Calendar size={24} className="text-gray-300 dark:text-slate-700" />
                    <p className="text-xs text-gray-400">No booking requests found.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {bookings.map((b) => (
                      <div
                        key={b._id}
                        className="p-5 rounded-2xl border border-gray-100 dark:border-slate-850 bg-white dark:bg-slate-850 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs shadow-sm hover:border-gray-200 transition-all"
                      >
                        <div className="flex gap-4">
                          <img
                            src={b.provider?.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100'}
                            alt={b.provider?.name}
                            className="h-12 w-12 rounded-xl object-cover border border-gray-100 dark:border-slate-700"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{b.provider?.name}</h4>
                              <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 px-1.5 py-0.5 rounded">ID: {b.bookingId}</span>
                            </div>
                            <span className="inline-block px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/20 text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1.5 uppercase tracking-wider">
                              {b.serviceName}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-500 dark:text-gray-400 mt-2.5">
                              <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(b.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="flex items-center gap-1.5"><Clock size={12} /> {b.bookingTime}</span>
                              <span className="flex items-center gap-1.5 sm:col-span-2"><MapPin size={12} /> {b.address}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-3.5 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-slate-800">
                          <div className="text-left sm:text-right">
                            <span className={getStatusBadgeClass(b.status)}>{b.status}</span>
                            <div className="font-extrabold text-base text-gray-900 dark:text-white mt-1.5">₹{b.charges}</div>
                          </div>

                          <div className="flex gap-2">
                            {/* Chat Option */}
                            <button
                              onClick={() => handleOpenChat(b)}
                              className="px-3 py-1.5 rounded-lg border border-blue-200 text-blue-600 dark:border-slate-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 text-[10px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <MessageSquare size={12} /> Chat
                            </button>

                            {/* Cancel Option */}
                            {['pending', 'accepted'].includes(b.status) && (
                              <button
                                onClick={() => handleCancelBooking(b._id)}
                                className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-[10px] font-bold transition-colors"
                              >
                                Cancel Request
                              </button>
                            )}

                            {/* Review option */}
                            {b.status === 'completed' && (
                              <button
                                onClick={() => handleOpenReview(b)}
                                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
                              >
                                <MessageSquarePlus size={12} /> Rate Service
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

            {/* Favorites View */}
            {activeTab === 'favorites' && (
              <div className="flex flex-col gap-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Saved Service Providers</h2>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Quick access to book service with your preferred partners.</p>
                </div>

                {favorites.length === 0 ? (
                  <div className="text-center py-12 border rounded-2xl border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2">
                    <Heart size={24} className="text-gray-300 dark:text-slate-700" />
                    <p className="text-xs text-gray-400">You haven't bookmarked any providers yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {favorites.map((p) => (
                      <div
                        key={p._id}
                        className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 p-5 flex flex-col gap-4 shadow-sm hover:border-gray-200 transition-all group"
                      >
                        <div className="flex gap-3">
                          <img
                            src={p.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80'}
                            alt={p.name}
                            className="h-11 w-11 rounded-xl object-cover border border-gray-100 dark:border-slate-700"
                          />
                          <div>
                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                              {p.category}
                            </span>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1 group-hover:text-blue-600 transition-colors">{p.name}</h4>
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-yellow-400 font-bold">
                              <Star size={11} className="fill-current" />
                              <span className="text-gray-600 dark:text-gray-300 text-[11px]">
                                {p.averageRating?.toFixed(1) || 'New'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-50 dark:border-slate-800 pt-3 flex justify-between items-center text-[11px] text-gray-500">
                          <span>Rate: <b className="text-gray-800 dark:text-gray-200">₹{p.chargesPerVisit}/visit</b></span>
                          <span>Loc: <b className="text-gray-800 dark:text-gray-200">{p.location}</b></span>
                        </div>
                        <button
                          onClick={() => navigate(`/providers/${p._id}`)}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold active:scale-95 transition-all shadow-sm"
                        >
                          View & Book
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings View */}
            {activeTab === 'settings' && (
              <div className="flex flex-col gap-5 max-w-xl">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Settings</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage your personal contact details and profile picture.</p>
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
                      <Upload size={13} /> Upload New Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

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

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={updatingSettings}
                    className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {updatingSettings ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Saving Changes...
                      </>
                    ) : 'Save Profile Settings'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Review Dialog Modal */}
      {reviewOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setReviewOpen(false)}>
          <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-gray-150 dark:border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden animate-scale-in-center" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-1.5">
                <MessageSquarePlus size={18} className="text-blue-500" />
                Leave a Review
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                Rate your service experience with <b>{selectedBooking.provider?.name}</b>.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
              
              {/* Rating selection (Stars representation) */}
              <div className="flex flex-col gap-1.5 items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Rating Score</label>
                <div className="flex gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-200 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Review Comment</label>
                <textarea
                  rows="3"
                  placeholder="Share details of your experience (e.g. quality, behavior, punctuality)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none placeholder:text-gray-400"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setReviewOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-blue-glow transition-all active:scale-95 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

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
