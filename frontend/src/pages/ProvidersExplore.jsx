import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, AlertCircle, X, ChevronDown, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import ProviderCard from '../components/ProviderCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { AuthContext } from '../context/AuthContext';

const CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter',
  'AC Repair', 'Washing Machine Repair', 'Refrigerator Repair',
  'Pest Control', 'Gardening', 'Home Cleaning', 'Appliance Repair',
];

const LOCATION_DATA = {
  'Andhra Pradesh': [
    'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam',
    'Srikakulam', 'Sri Potti Sriramulu Nellore', 'Visakhapatnam', 'Vizianagaram', 'West Godavari',
    'YSR Kadapa', 'Annamayya', 'Bapatla', 'Eluru', 'Kakinada', 'Konaseema', 'Nandyal', 'NTR',
    'Palnadu', 'Parvathipuram Manyam', 'Sri Sathya Sai', 'Tirupati', 'Alluri Sitharama Raju', 'Anakapalli',
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Jayashankar Bhupalpally',
    'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam', 'Kumuram Bheem Asifabad', 'Mahabubabad',
    'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
    'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy',
    'Siddipet', 'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Hanamkonda', 'Yadadri Bhuvanagiri',
  ],
};

export default function ProvidersExplore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role } = useContext(AuthContext);

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [isAvailableOnly, setIsAvailableOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Location text is set from district selection
  const locationText = selectedDistrict || selectedState;

  const activeFilterCount = [category, locationText, maxPrice, minRating, isAvailableOnly].filter(Boolean).length;

  const fetchFilteredProviders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (searchText) params.location = searchText;
      if (locationText) params.location = locationText;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;
      if (isAvailableOnly) params.isAvailable = 'true';

      const res = await api.get('/providers', { params });
      setProviders(res.data.data);
    } catch (err) {
      console.error('Error fetching providers:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSearchText(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    fetchFilteredProviders();
  }, [category, searchText, selectedState, selectedDistrict, maxPrice, minRating, isAvailableOnly]);

  const handleClearFilters = () => {
    setCategory(''); setSearchText('');
    setSelectedState(''); setSelectedDistrict('');
    setMaxPrice(''); setMinRating(''); setIsAvailableOnly(false);
    setSearchParams({});
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal size={15} /> Filters
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-[11px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* Service Category */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service Type</label>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setSearchParams(e.target.value ? { category: e.target.value } : {}); }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* State Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">State</label>
        <div className="relative">
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('');
            }}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
          >
            <option value="">All States</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Telangana">Telangana</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* District Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">District</label>
        <div className="relative">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All Districts</option>
            {selectedState && LOCATION_DATA[selectedState].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {!selectedState && (
          <p className="text-[10px] text-gray-400 italic">Select a state first</p>
        )}
      </div>

      {/* Max Price */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Charges</label>
          {maxPrice && (
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">₹{maxPrice}</span>
          )}
        </div>
        <input
          type="range"
          min="200"
          max="2000"
          step="50"
          value={maxPrice || '2000'}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full h-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 accent-blue-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
          <span>₹200</span>
          <span>₹2000+</span>
        </div>
      </div>

      {/* Min Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Minimum Rating</label>
        <div className="relative">
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
          >
            <option value="">Any Rating</option>
            <option value="4.5">4.5 ★ and above</option>
            <option value="4.0">4.0 ★ and above</option>
            <option value="3.5">3.5 ★ and above</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Available Today */}
      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
        <div className={`relative h-5 w-9 rounded-full transition-colors ${isAvailableOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}`}>
          <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isAvailableOnly ? 'translate-x-4' : 'translate-x-0'}`} />
          <input
            type="checkbox"
            checked={isAvailableOnly}
            onChange={(e) => setIsAvailableOnly(e.target.checked)}
            className="sr-only"
          />
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Available Today Only</span>
      </label>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen transition-colors duration-200">
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">

          {/* Back to Dashboard — shown to logged-in customers */}
          {role === 'customer' && (
            <Link
              to="/customer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors"
            >
              <ArrowLeft size={13} />
              Back to Dashboard
            </Link>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {category ? `${category} Providers` : 'All Service Providers'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {loading ? 'Searching...' : `${providers.length} verified professional${providers.length !== 1 ? 's' : ''} found`}
                {(selectedDistrict || selectedState) && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                    in {selectedDistrict || selectedState}
                  </span>
                )}
              </p>
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Filter size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {category && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-900">
                  {category}
                  <button onClick={() => { setCategory(''); setSearchParams({}); }}><X size={11} /></button>
                </span>
              )}
              {selectedState && !selectedDistrict && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-900">
                  📍 {selectedState}
                  <button onClick={() => { setSelectedState(''); setSelectedDistrict(''); }}><X size={11} /></button>
                </span>
              )}
              {selectedDistrict && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-900">
                  📍 {selectedDistrict}, {selectedState}
                  <button onClick={() => setSelectedDistrict('')}><X size={11} /></button>
                </span>
              )}
              {maxPrice && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-900">
                  Max ₹{maxPrice}
                  <button onClick={() => setMaxPrice('')}><X size={11} /></button>
                </span>
              )}
              {isAvailableOnly && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-medium border border-green-100 dark:border-green-900">
                  ✓ Available Now
                  <button onClick={() => setIsAvailableOnly(false)}><X size={11} /></button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">

        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm">
            <FilterPanel />
          </div>
        </aside>

        {/* Mobile Filters Panel */}
        {mobileFilterOpen && (
          <div className="lg:hidden mb-4 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-premium animate-slide-down">
            <FilterPanel />
          </div>
        )}

        {/* Results Grid */}
        <main className="flex-grow min-w-0">
          {loading ? (
            <SkeletonLoader type="card" count={6} />
          ) : providers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 rounded-3xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <AlertCircle size={32} className="text-gray-300 dark:text-slate-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No providers found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm">
                Try adjusting your filters — select a different district, increase the max price, or remove the rating requirement.
              </p>
              <button
                onClick={handleClearFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-blue-glow transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {providers.map((p) => (
                <ProviderCard key={p._id} provider={p} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
