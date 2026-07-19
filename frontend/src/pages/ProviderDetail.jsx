import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Clock, Heart, Award, ArrowLeft, Briefcase } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';
import BookingModal from '../components/BookingModal';
import SkeletonLoader from '../components/SkeletonLoader';

export default function ProviderDetail() {
  const { id } = useParams();
  const { user, role, isAuthenticated } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const fetchProviderDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/providers/${id}`);
      setProvider(res.data.data.provider);
      setReviews(res.data.data.reviews || []);
      if (isAuthenticated && role === 'customer' && user) {
        setIsFavorite(user.favorites?.includes(id) || false);
      }
    } catch (err) {
      showToast('Error', 'Failed to load provider profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProviderDetails(); }, [id, isAuthenticated, user]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) { showToast('Login Required', 'Please login to save favorites.', 'error'); return; }
    if (role !== 'customer') { showToast('Access Denied', 'Only customers can bookmark favorites.', 'error'); return; }
    try {
      const res = await api.post(`/customers/favorites/${id}`);
      setIsFavorite(!isFavorite);
      showToast('Saved!', res.data.message, 'success');
      if (user) {
        let updatedFavs = [...(user.favorites || [])];
        if (updatedFavs.includes(id)) updatedFavs = updatedFavs.filter((f) => f !== id);
        else updatedFavs.push(id);
        user.favorites = updatedFavs;
        localStorage.setItem('user', JSON.stringify(user));
      }
    } catch {
      showToast('Failed', 'Could not toggle favorite.', 'error');
    }
  };

  if (loading) return <SkeletonLoader type="details" />;

  if (!provider) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <div className="h-20 w-20 rounded-3xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Provider Not Found</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
          This provider profile doesn't exist or has been disabled.
        </p>
        <Link to="/providers" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">
          Back to Explore
        </Link>
      </div>
    );
  }

  const profilePhoto = provider.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200';
  const avgRating = provider.averageRating || 0;

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200">

      {/* Back Nav */}
      <div className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={15} /> Back to Listings
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Main Details ─── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Profile Card */}
            <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />

              <div className="flex flex-col sm:flex-row gap-5 items-start pt-2">
                {/* Photo */}
                <div className="relative flex-shrink-0">
                  <img
                    src={profilePhoto}
                    alt={provider.name}
                    className="h-28 w-28 rounded-2xl object-cover border border-gray-100 dark:border-slate-700 shadow-sm"
                  />
                  <span className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white dark:border-slate-850 ${provider.isAvailable ? 'bg-green-500' : 'bg-red-400'}`} />
                </div>

                {/* Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                      {provider.category}
                    </span>
                    {provider.isVerified === 'approved' && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck size={11} /> Verified
                      </span>
                    )}
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${provider.isAvailable ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                      {provider.isAvailable ? '● Available' : '● Busy'}
                    </span>
                  </div>

                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-2">
                    {provider.name}
                  </h1>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
                    <MapPin size={13} /> {provider.location}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">{avgRating.toFixed(1)}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{reviews.length} reviews</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60">
                      <div className="flex items-center justify-center gap-1">
                        <Briefcase size={13} className="text-blue-500" />
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">{provider.experience}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">yrs experience</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60">
                      <div className="flex items-center justify-center gap-1">
                        <Award size={13} className="text-green-500" />
                        <span className="font-extrabold text-sm text-gray-900 dark:text-white">{provider.completedJobsCount || 0}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">jobs done</p>
                    </div>
                  </div>
                </div>

                {/* Favorite Button */}
                {role === 'customer' && (
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2.5 rounded-xl border transition-all flex-shrink-0 ${
                      isFavorite
                        ? 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 text-red-500'
                        : 'border-gray-200 dark:border-slate-700 text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                    title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                )}
              </div>
            </div>

            {/* About */}
            {provider.description && (
              <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
                <h2 className="font-bold text-base text-gray-900 dark:text-white mb-3">About</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{provider.description}</p>
              </div>
            )}

            {/* Reviews */}
            <div className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-base text-gray-900 dark:text-white">
                  Client Reviews
                </h2>
                <span className="text-sm font-bold text-gray-400">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-10">
                  <Star size={28} className="mx-auto text-gray-200 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-slate-800">
                  {reviews.map((r) => (
                    <div key={r._id} className="py-5 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {r.customer?.profilePhoto ? (
                            <img src={r.customer.profilePhoto} alt={r.customer.name} className="h-9 w-9 rounded-full object-cover border border-gray-100 dark:border-slate-700" />
                          ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
                              {r.customer?.name ? r.customer.name.charAt(0).toUpperCase() : 'C'}
                            </span>
                          )}
                          <div>
                            <h5 className="font-semibold text-sm text-gray-900 dark:text-white">{r.customer?.name || 'Anonymous'}</h5>
                            <span className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          {Array(5).fill(0).map((_, i) => (
                            <Star key={i} size={12} className={i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-slate-700'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── Booking Sidebar ─── */}
          <div className="flex flex-col gap-4">
            <div className="sticky top-24 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm flex flex-col gap-5">

              {/* Price */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Visiting Charges</p>
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">₹{provider.chargesPerVisit}</p>
                  <p className="text-[11px] text-gray-400">per appointment</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[11px] font-bold ${provider.isAvailable ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-slate-800 text-gray-500'}`}>
                  {provider.isAvailable ? '● Available' : '● Busy'}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3 border-t border-gray-100 dark:border-slate-800 pt-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <Clock size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Working Hours</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{provider.workingHours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Service Area</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{provider.location}</p>
                  </div>
                </div>
              </div>

              {/* Booking Action */}
              {isAuthenticated ? (
                role === 'customer' ? (
                  provider.isAvailable ? (
                    <button
                      onClick={() => setBookingOpen(true)}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow hover:shadow-blue-glow-lg active:scale-95 transition-all"
                    >
                      Book Appointment
                    </button>
                  ) : (
                    <button disabled className="w-full py-3.5 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-600 font-bold text-sm cursor-not-allowed">
                      Currently Unavailable
                    </button>
                  )
                ) : (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                    Only customer accounts can book appointments.
                  </div>
                )
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="block w-full py-3.5 text-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow transition-all active:scale-95"
                  >
                    Login to Book
                  </Link>
                  <p className="text-[10px] text-gray-400 text-center">
                    Takes less than a minute to sign up
                  </p>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 border-t border-gray-100 dark:border-slate-800 pt-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">✓ Verified Pro</span>
                <span className="flex items-center gap-1">✓ No advance pay</span>
                <span className="flex items-center gap-1">✓ Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && (
        <BookingModal
          provider={provider}
          onClose={() => setBookingOpen(false)}
          onBookingSuccess={fetchProviderDetails}
        />
      )}
    </div>
  );
}
