import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, Wrench, Droplets, Hammer, Sparkles, Paintbrush, Wind,
  ShieldCheck, Calendar, Star, Plus, Minus, MapPin, Clock,
  ArrowRight, Zap, Users, CheckCircle2, ChevronRight,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [faqOpen, setFaqOpen] = useState(null);

  const categories = [
    { name: 'Electrician', icon: Wrench, desc: 'Panel upgrades, wiring, repairs', color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400', border: 'hover:border-amber-300 dark:hover:border-amber-800' },
    { name: 'Plumber', icon: Droplets, desc: 'Leaks, drain clogs, fittings', color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400', border: 'hover:border-blue-300 dark:hover:border-blue-800' },
    { name: 'Carpenter', icon: Hammer, desc: 'Furniture, custom woodwork', color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400', border: 'hover:border-orange-300 dark:hover:border-orange-800' },
    { name: 'Cleaner', icon: Sparkles, desc: 'Deep cleaning, sanitization', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400', border: 'hover:border-emerald-300 dark:hover:border-emerald-800' },
    { name: 'Painter', icon: Paintbrush, desc: 'Wall painting, colour consult', color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/20 dark:text-purple-400', border: 'hover:border-purple-300 dark:hover:border-purple-800' },
    { name: 'AC Repair', icon: Wind, desc: 'AC servicing & gas refill', color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400', border: 'hover:border-teal-300 dark:hover:border-teal-800' },
  ];

  const popularServices = [
    { name: 'Ceiling Fan Installation', category: 'Electrician', price: 450, rating: 4.8, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300' },
    { name: 'Kitchen Pipe Leaking Fix', category: 'Plumber', price: 500, rating: 4.9, image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?w=300' },
    { name: 'Whole Apartment Cleaning', category: 'Cleaner', price: 750, rating: 4.7, image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300' },
    { name: 'AC Unit Gas Refilling', category: 'AC Repair', price: 600, rating: 4.9, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', role: 'Home Owner · Visakhapatnam', rating: 5, comment: 'ServNexa ne ek reliable electrician dhundhna bahut aasaan bana diya. Booking sirf 2 minute mein, aur Rajesh ji bilkul time par aaye. Highly recommended!', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', initials: 'PS' },
    { name: 'Arjun Mehta', role: 'Apartment Tenant · Hyderabad', rating: 5, comment: 'Plumbing repair quick and hassle-free raha. System notifications se poora booking process track karna bahut convenient tha.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', initials: 'AM' },
    { name: 'Kavya Nair', role: 'Software Engineer · Vijayawada', rating: 4.8, comment: 'Excellent interface aur professional service providers. Prices aur reviews bilkul transparent hain — koi hidden charges nahi.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', initials: 'KN' },
  ];

  const faqs = [
    { q: 'How does ServNexa verify service providers?', a: 'All service providers must upload government-issued identification and professional certification documents upon registration. Our administration team manually reviews each application before approving them on the platform.' },
    { q: 'Is there a booking cancellation policy?', a: 'Yes. Customers can cancel bookings through their dashboard before the provider accepts. Once accepted, please contact support for urgent cancellations.' },
    { q: 'How do I pay for the bookings?', a: 'Visit charges are displayed upfront when booking. Payments are settled directly with the provider after job completion. No advance payment required.' },
    { q: 'What if I\'m not satisfied with the service?', a: 'Leave a detailed review for the provider. For major concerns, write to support@servnexa.in and our team will mediate a resolution promptly.' },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers', icon: Users },
    { value: '500+', label: 'Verified Providers', icon: ShieldCheck },
    { value: '50,000+', label: 'Services Completed', icon: CheckCircle2 },
    { value: '4.9★', label: 'Average Rating', icon: Star },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/providers?search=${encodeURIComponent(searchQuery)}` : '/providers');
  };

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors duration-200">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-hero-gradient dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800">
        {/* Decorative orbs */}
        <div className="absolute top-[-80px] left-[-80px] h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-3xl pointer-events-none animate-orb" />
        <div className="absolute bottom-[-60px] right-[-40px] h-[320px] w-[320px] rounded-full bg-indigo-400/10 blur-3xl pointer-events-none animate-orb" style={{ animationDelay: '4s' }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-36 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-8 shadow-sm">
            <ShieldCheck size={13} className="flex-shrink-0" />
            100% Verified Professionals across India
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] max-w-4xl mx-auto">
            Home Services,{' '}
            <span className="gradient-text-blue">
              On Demand.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Connect with trusted plumbers, electricians, cleaners, and technicians in your city. Transparent rates. No hidden fees.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-2xl mx-auto flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-1.5 shadow-premium focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 dark:focus-within:border-blue-500 transition-all"
          >
            <Search size={18} className="ml-3 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for Plumber, Electrician, Cleaner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2.5 bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="flex-shrink-0 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-blue-glow hover:shadow-blue-glow-lg active:scale-95 transition-all"
            >
              Search
            </button>
          </form>

          {/* Quick Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Plumber', 'Electrician', 'AC Repair', 'Cleaner', 'Carpenter'].map((cat) => (
              <Link
                key={cat}
                to={`/providers?category=${encodeURIComponent(cat)}`}
                className="px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 text-xs font-medium text-gray-600 dark:text-gray-300 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────── */}
      <section className="border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center">
                      <Icon size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────── */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Services</p>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Explore Categories</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">What do you need help with today?</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/providers?category=${encodeURIComponent(cat.name)}`}
                className={`group rounded-2xl border border-gray-100 dark:border-slate-800 p-5 bg-white dark:bg-slate-850 shadow-sm hover:shadow-premium-hover ${cat.border} hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className={`p-3.5 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mt-4">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-relaxed">{cat.desc}</p>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            View All Providers <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── Popular Services ─────────────────────── */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-950/30 border-t border-gray-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Trending</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Most Booked Services</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Top-rated services booked by thousands of homeowners</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularServices.map((svc, i) => (
              <Link
                key={i}
                to={`/providers?category=${encodeURIComponent(svc.category)}`}
                className="group rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{svc.category}</span>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{svc.name}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{svc.rating}</span>
                    </div>
                    <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">₹{svc.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Process</p>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">How It Works</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Get professional home services in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Search & Filter', desc: 'Find providers by category, location, rating, and budget.', icon: Search, bg: 'bg-blue-600' },
            { step: '02', title: 'Book a Slot', desc: 'Pick your preferred date and time slot instantly.', icon: Calendar, bg: 'bg-indigo-600' },
            { step: '03', title: 'Get Service', desc: 'Provider visits your home and completes the job professionally.', icon: Wrench, bg: 'bg-violet-600' },
            { step: '04', title: 'Rate & Pay', desc: 'Leave a review and pay the provider directly after service.', icon: Star, bg: 'bg-purple-600' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="relative group p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-4 right-4 text-5xl font-black text-gray-100 dark:text-slate-800 select-none leading-none">
                  {item.step}
                </div>
                <div className={`h-11 w-11 ${item.bg} rounded-xl flex items-center justify-center mb-5 shadow-md`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10 -translate-y-1/2">
                    <ArrowRight size={16} className="text-gray-300 dark:text-slate-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────── */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-950/30 border-t border-gray-100 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">What Our Customers Say</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Trusted by thousands of homeowners across India</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 shadow-sm hover:shadow-premium-hover transition-all duration-300 flex flex-col"
              >
                {/* Quote */}
                <div className="text-4xl text-blue-200 dark:text-blue-900 font-serif leading-none mb-3 select-none">"</div>
                <div className="flex items-center gap-0.5 mb-3">
                  {Array(5).fill(0).map((_, j) => (
                    <Star key={j} size={13} className={j < Math.round(test.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-slate-700'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                  {test.comment}
                </p>
                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <img
                    src={test.image}
                    alt={test.name}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 dark:ring-slate-700"
                  />
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white">{test.name}</h5>
                    <p className="text-[11px] text-gray-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────── */}
      <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-16 text-center shadow-blue-glow-lg">
          <div className="absolute top-0 left-0 h-full w-full opacity-10">
            <div className="absolute top-[-60px] left-[-60px] h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-[-60px] right-[-60px] h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative z-10">
            <Zap size={32} className="mx-auto text-blue-200 fill-blue-200 mb-4" />
            <h2 className="text-3xl font-extrabold text-white">
              Ready to Book Your Service?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-blue-100 leading-relaxed">
              Join over 10,000 homeowners who trust ServNexa for professional, verified home services across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 active:scale-95 transition-all"
              >
                Get Started Free <ArrowRight size={15} />
              </Link>
              <Link
                to="/providers"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 transition-all"
              >
                Browse Providers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ─────────────────────────────────── */}
      <section className="py-20 bg-slate-50/60 dark:bg-slate-950/30 border-t border-gray-100 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Support</p>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Quick answers to common questions</p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-sm">
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className={`ml-4 flex-shrink-0 p-1 rounded-lg transition-colors ${faqOpen === idx ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' : 'text-gray-400'}`}>
                    {faqOpen === idx ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                {faqOpen === idx && (
                  <div className="px-6 pb-5 pt-1 border-t border-gray-50 dark:border-slate-800 text-sm text-gray-500 dark:text-gray-400 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            <div className="flex flex-col gap-4 md:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <Zap size={16} className="text-white fill-white" />
                </div>
                <span className="font-bold text-lg text-white">Serv<span className="text-blue-400">Nexa</span></span>
              </Link>
              <p className="text-[12px] text-slate-400 leading-relaxed">
                Connecting Customers, Empowering Providers, Managing Services.
              </p>
              <div className="flex gap-3 mt-1">
                {['🇮🇳 Made in India'].map((t, i) => (
                  <span key={i} className="text-[11px] text-slate-500">{t}</span>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">Quick Links</h5>
              <ul className="flex flex-col gap-2.5 text-[12px] text-slate-400">
                <li><Link to="/providers" className="hover:text-white transition-colors">Explore Providers</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Client Login</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Partner Signup</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">Services</h5>
              <ul className="flex flex-col gap-2.5 text-[12px] text-slate-400">
                <li><Link to="/providers?category=Electrician" className="hover:text-white transition-colors">Electrical Work</Link></li>
                <li><Link to="/providers?category=Plumber" className="hover:text-white transition-colors">Plumbing Repairs</Link></li>
                <li><Link to="/providers?category=Cleaner" className="hover:text-white transition-colors">Home Cleaning</Link></li>
                <li><Link to="/providers?category=AC%20Repair" className="hover:text-white transition-colors">AC Servicing</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs mb-4 uppercase tracking-widest">Contact</h5>
              <ul className="flex flex-col gap-2.5 text-[12px] text-slate-400 leading-relaxed">
                <li>📧 support@servnexa.in</li>
                <li>📞 +91 98765 00000</li>
                <li>📍 Hyderabad & Visakhapatnam, India</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 py-5">
          <p className="text-center text-[11px] text-slate-500">
            © {new Date().getFullYear()} ServNexa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
