import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, MapPin, Briefcase, Clock } from 'lucide-react';

export default function ProviderCard({ provider }) {
  const profilePhoto = provider.profilePhoto || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150';
  const isAvailable = provider.isAvailable;

  return (
    <div className="group relative rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">

      {/* Availability Badge */}
      <div className="absolute top-3.5 right-3.5 z-10">
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
          isAvailable
            ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-900'
            : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-500 border border-gray-200 dark:border-slate-700'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${isAvailable ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          {isAvailable ? 'Available' : 'Busy'}
        </span>
      </div>

      {/* Header */}
      <div className="pt-5 px-5 pb-3 flex gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={profilePhoto}
            alt={provider.name}
            className="h-14 w-14 rounded-2xl object-cover border border-gray-100 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Info */}
        <div className="flex-grow min-w-0 pt-0.5">
          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 mb-1.5">
            {provider.category}
          </span>
          <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 leading-tight">
            {provider.name}
            {provider.isVerified === 'approved' && (
              <ShieldCheck size={13} className="text-blue-500 fill-blue-100 dark:fill-blue-950/30 flex-shrink-0" />
            )}
          </h4>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {Array(5).fill(0).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.round(provider.averageRating || 0)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200 dark:text-slate-700'}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
              {provider.averageRating?.toFixed(1) || 'New'}
            </span>
            <span className="text-[10px] text-gray-400">
              ({provider.completedJobsCount || 0} jobs)
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      {provider.description && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 px-5 pb-3 line-clamp-2 leading-relaxed">
          {provider.description}
        </p>
      )}

      {/* Divider */}
      <div className="mx-5 border-t border-gray-100 dark:border-slate-800" />

      {/* Meta Row */}
      <div className="px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1 text-[10px] text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <MapPin size={10} className="text-gray-400" />
            {provider.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase size={10} className="text-gray-400" />
            {provider.experience} yrs experience
          </span>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-medium">per visit</p>
          <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 leading-tight">
            ₹{provider.chargesPerVisit}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4 pt-1">
        <Link
          to={`/providers/${provider._id}`}
          className="block w-full py-2.5 text-center rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 text-xs font-bold text-gray-700 dark:text-gray-200 transition-all duration-200"
        >
          View Profile & Book
        </Link>
      </div>
    </div>
  );
}
