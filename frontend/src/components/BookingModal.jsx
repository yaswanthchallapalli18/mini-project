import React, { useState, useContext } from 'react';
import { X, Calendar, Clock, MapPin, Phone, FileText, IndianRupee, Sparkles } from 'lucide-react';
import api from '../services/api';
import { NotificationContext } from '../context/NotificationContext';

export default function BookingModal({ provider, onClose, onBookingSuccess }) {
  const { showToast } = useContext(NotificationContext);

  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM',
  ];

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !address || !phone) {
      showToast('Missing Fields', 'Please fill in all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/bookings', {
        providerId: provider._id,
        bookingDate,
        bookingTime,
        address,
        phone,
        notes,
      });
      showToast('Booking Sent! 🎉', 'Your request has been sent to the provider.', 'success');
      if (onBookingSuccess) onBookingSuccess(res.data.data);
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit booking request.';
      showToast('Booking Failed', errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden animate-scale-in-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Sparkles size={16} className="text-blue-200" />
              Book Appointment
            </h3>
            <p className="text-[11px] text-blue-100 mt-0.5">with {provider.name} · {provider.category}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Price Summary */}
        <div className="mx-6 mt-4 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Estimated Cost</p>
            <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 mt-0.5">₹{provider.chargesPerVisit}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-blue-500 dark:text-blue-400">Pay after service</p>
            <p className="text-[10px] text-blue-500 dark:text-blue-400">No advance required</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 flex flex-col gap-3.5 max-h-[60vh] overflow-y-auto">

          <div className="grid grid-cols-2 gap-3">
            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={11} /> Date *
              </label>
              <input
                type="date"
                min={today}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {/* Time */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock size={11} /> Time Slot *
              </label>
              <select
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className={inputClass}
                required
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Phone size={11} /> Contact Number *
            </label>
            <input
              type="tel"
              placeholder="+91 98765 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <MapPin size={11} /> Service Address *
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Flat 12, Shree Apartments, Indiranagar, Bengaluru"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputClass} resize-none`}
              required
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <FileText size={11} /> Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="Describe the issue, special instructions, or access details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-blue-glow transition-all active:scale-95 disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Booking...
                </span>
              ) : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
