import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, ShieldCheck, Mail, Lock, Phone, MapPin, Upload, Briefcase, Clock, FileText, IndianRupee, Sparkles, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { NotificationContext } from '../context/NotificationContext';

const locationData = {
  "Andhra Pradesh": [
    "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", 
    "Srikakulam", "Sri Potti Sriramulu Nellore", "Visakhapatnam", "Vizianagaram", "West Godavari", 
    "YSR Kadapa", "Annamayya", "Bapatla", "Eluru", "Kakinada", "Konaseema", "Nandyal", "NTR", 
    "Palnadu", "Parvathipuram Manyam", "Sri Sathya Sai", "Tirupati", "Alluri Sitharama Raju", "Anakapalli"
  ],
  "Telangana": [
    "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", 
    "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", 
    "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", 
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", 
    "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Hanamkonda", "Yadadri Bhuvanagiri"
  ]
};

export default function Register() {
  const navigate = useNavigate();
  const { registerCustomer, registerProvider } = useContext(AuthContext);
  const { showToast } = useContext(NotificationContext);

  const [activeTab, setActiveTab] = useState('customer'); // 'customer' or 'provider'
  const [loading, setLoading] = useState(false);

  // Common Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [location, setLocation] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');

  // Provider-specific Form States
  const [category, setCategory] = useState('Electrician');
  const [experience, setExperience] = useState('');
  const [chargesPerVisit, setChargesPerVisit] = useState('');
  const [workingHours, setWorkingHours] = useState('09:00 - 18:00');
  const [description, setDescription] = useState('');
  const [governmentId, setGovernmentId] = useState(null);

  const categories = [
    'Electrician',
    'Plumber',
    'Carpenter',
    'Cleaner',
    'Painter',
    'AC Repair',
    'Washing Machine Repair',
    'Refrigerator Repair',
    'Pest Control',
    'Gardening',
    'Home Cleaning',
    'Appliance Repair',
  ];

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      if (setPreview) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast('Validation Error', 'Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('location', location);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      if (activeTab === 'customer') {
        await registerCustomer(formData);
        showToast('Welcome aboard! 🎉', 'Successfully registered as customer.', 'success');
        navigate('/customer');
      } else {
        // Provider fields
        formData.append('category', category);
        formData.append('experience', experience);
        formData.append('chargesPerVisit', chargesPerVisit);
        formData.append('workingHours', workingHours);
        formData.append('description', description);
        if (governmentId) {
          formData.append('governmentId', governmentId);
        }

        await registerProvider(formData);
        showToast('Application Submitted! 📋', 'Registered successfully. Profile is pending admin approval.', 'success');
        navigate('/provider');
      }
    } catch (err) {
      showToast('Registration Failed', err.message || 'Verification checks failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400";
  const selectClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-950 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-2xl">
        
        {/* Title Block */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-blue-glow group-hover:scale-105 transition-transform">
              <Sparkles size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Serv<span className="text-blue-600">Nexa</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
              Sign in here
            </Link>
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-premium p-6 sm:p-8">
          
          {/* Tab switcher */}
          <div className="flex gap-1.5 p-1.5 rounded-xl bg-gray-100 dark:bg-slate-900 mb-8">
            <button
              type="button"
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 flex justify-center items-center gap-2 ${
                activeTab === 'customer'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <User size={14} /> Join as Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('provider')}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 flex justify-center items-center gap-2 ${
                activeTab === 'provider'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <ShieldCheck size={14} /> Join as Service Partner
            </button>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            
            {/* Form Section Header: Personal Details */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">1. Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><User size={14} /></span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="e.g. Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Mail size={14} /></span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="e.g. rajesh@example.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Phone size={14} /></span>
                    <input
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      placeholder="e.g. +91 98765 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* State Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">State *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><MapPin size={14} /></span>
                    <select
                      name="state"
                      autoComplete="address-level1"
                      value={selectedState}
                      onChange={(e) => {
                        const state = e.target.value;
                        setSelectedState(state);
                        setSelectedDistrict('');
                        setLocation('');
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                      <option value="Telangana">Telangana</option>
                    </select>
                  </div>
                </div>

                {/* District Selection */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">District *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><MapPin size={14} /></span>
                    <select
                      name="district"
                      autoComplete="address-level2"
                      value={selectedDistrict}
                      onChange={(e) => {
                        const dist = e.target.value;
                        setSelectedDistrict(dist);
                        setLocation(dist);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={!selectedState}
                      required
                    >
                      <option value="">Select District</option>
                      {selectedState && locationData[selectedState].map((district) => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Password *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Lock size={14} /></span>
                    <input
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Confirm Password *</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Lock size={14} /></span>
                    <input
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Provider Professional details */}
            {activeTab === 'provider' && (
              <div className="border-t border-gray-100 dark:border-slate-700/50 pt-6">
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">2. Partner Specifications</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Service Category *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={selectClass}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Experience */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Experience (Years) *</label>
                       <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Briefcase size={14} /></span>
                         <input
                           type="number"
                           name="experience"
                           autoComplete="off"
                           placeholder="e.g. 5"
                           min="0"
                           value={experience}
                           onChange={(e) => setExperience(e.target.value)}
                           className={inputClass}
                           required
                         />
                       </div>
                     </div>

                    {/* Charges */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Charges per Visit (₹) *</label>
                       <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><IndianRupee size={14} /></span>
                         <input
                           type="number"
                           name="chargesPerVisit"
                           autoComplete="off"
                           placeholder="e.g. 350"
                           min="1"
                           value={chargesPerVisit}
                           onChange={(e) => setChargesPerVisit(e.target.value)}
                           className={inputClass}
                           required
                         />
                       </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Working hours */}
                     <div className="flex flex-col gap-1.5">
                       <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Working Hours *</label>
                       <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Clock size={14} /></span>
                         <input
                           type="text"
                           name="workingHours"
                           autoComplete="off"
                           placeholder="e.g. 09:00 AM - 06:00 PM"
                           value={workingHours}
                           onChange={(e) => setWorkingHours(e.target.value)}
                           className={inputClass}
                           required
                         />
                       </div>
                     </div>

                    {/* Government ID Document Upload */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Government ID Proof *</label>
                      <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-xs font-semibold text-gray-600 dark:text-gray-300 transition-colors w-full justify-center">
                        <Upload size={14} />
                        <span className="truncate">{governmentId ? governmentId.name : 'Upload Aadhaar / PAN card / Voter ID'}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileChange(e, setGovernmentId)}
                          className="hidden"
                          required
                        />
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Description / Bio</label>
                    <div className="relative">
                      <span className="absolute top-3 left-3.5 text-gray-400"><FileText size={14} /></span>
                      <textarea
                        rows="2"
                        placeholder="Describe your expertise, past projects, or highlights..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none transition-all placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Photo File Upload */}
            <div className="flex flex-col gap-2.5 border-t border-gray-100 dark:border-slate-700/50 pt-6">
              <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                {activeTab === 'provider' ? '3. Photo Identification' : '2. Profile Photo'}
              </h3>
              <div className="flex items-center gap-4">
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="Preview"
                    className="h-14 w-14 rounded-2xl object-cover border border-gray-200 dark:border-slate-700 shadow-sm"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-300">
                    <User size={20} />
                  </div>
                )}
                <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors shadow-sm">
                  <Upload size={13} />
                  <span>Choose Profile Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setProfilePhoto, setProfilePhotoPreview)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow hover:shadow-blue-glow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register and Continue
                  <ArrowRight size={15} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
