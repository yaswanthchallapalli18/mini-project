import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Settings,
  ShieldCheck,
  Users,
  Search,
  History,
  FileText,
  Headphones,
  ChevronRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const { role, user } = useContext(AuthContext);

  const customerLinks = [
    { name: 'Overview', path: '/customer', icon: LayoutDashboard },
    { name: 'Book a Service', path: '/providers', icon: Search, external: true },
    { name: 'My Bookings', path: '/customer/bookings', icon: Calendar },
    { name: 'Saved Providers', path: '/customer/favorites', icon: Heart },
    { name: 'Settings', path: '/customer/settings', icon: Settings },
  ];

  const providerLinks = [
    { name: 'Overview', path: '/provider', icon: LayoutDashboard },
    { name: 'Manage Jobs', path: '/provider/jobs', icon: Calendar },
    { name: 'Job History', path: '/provider/history', icon: History },
    { name: 'Profile Settings', path: '/provider/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    { name: 'Verifications', path: '/admin/verifications', icon: ShieldCheck },
    { name: 'All Bookings', path: '/admin/bookings', icon: FileText },
    { name: 'Users & Providers', path: '/admin/users', icon: Users },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const links = role === 'admin' ? adminLinks : role === 'provider' ? providerLinks : customerLinks;

  const roleColors = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400',
    provider: 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400',
    customer: 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400',
  };

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] p-3 flex flex-col justify-between hidden md:flex">

      {/* User Info */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-800/80 border border-gray-100 dark:border-slate-800">
          {user?.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm flex-shrink-0"
            />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
              {user?.name || user?.username || 'User'}
            </p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full capitalize ${roleColors[role] || roleColors.customer}`}>
              {role}
            </span>
          </div>
        </div>

        {/* Section Label */}
        <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-1">
          Menu
        </p>

        {/* Nav Links */}
        <nav className="flex flex-col gap-0.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/customer' || link.path === '/provider' || link.path === '/admin' || link.external}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive && !link.external
                      ? 'sidebar-active text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="flex items-center gap-2.5">
                      <Icon size={15} className={isActive && !link.external ? 'text-white' : 'text-gray-400 dark:text-slate-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'} />
                      {link.name}
                    </span>
                    {link.external
                      ? <ExternalLink size={11} className="text-gray-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                      : isActive && <ChevronRight size={12} className="text-white/70" />
                    }
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Support Card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white mt-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <Headphones size={14} />
          </div>
          <h5 className="font-semibold text-sm">Need Help?</h5>
        </div>
        <p className="text-[11px] text-blue-100 mb-3 leading-relaxed">
          Our support team is here for verifications, billing, and scheduling.
        </p>
        <a
          href="mailto:support@servnexa.in"
          className="block text-center px-3 py-1.5 rounded-lg bg-white text-blue-600 text-[11px] font-bold hover:bg-blue-50 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </aside>
  );
}
