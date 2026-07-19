import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);

  // Fetch notifications from server
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/notifications');
      const data = res.data.data;
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    }
  };

  // Add a triggerable toast alert
  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    
    // Auto remove toast after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err.message);
    }
  };

  // Setup polling for notifications
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(() => {
        fetchNotifications();
      }, 15000); // Poll every 15s

      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  // Alert on new notification via Toast
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      // If notification was created in the last 15 seconds, show a toast
      const isRecent = new Date() - new Date(latest.createdAt) < 16000;
      const isUnread = !latest.isRead;
      
      // Store a record of shown notifications in session storage to avoid double-toasts
      const shownKey = `toast-shown-${latest._id}`;
      if (isRecent && isUnread && !sessionStorage.getItem(shownKey)) {
        showToast(latest.title, latest.message, 'info');
        sessionStorage.setItem(shownKey, 'true');
      }
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        fetchNotifications,
        markAsRead,
        showToast,
        removeToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
      }}
    >
      {children}

      {/* Floating Toast Notification Bar */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-lg border text-sm transition-all duration-300 transform translate-y-0 scale-100 flex justify-between items-start glass ${
              toast.type === 'error'
                ? 'border-red-200 bg-red-50/90 text-red-900 dark:border-red-900/30 dark:bg-red-950/80 dark:text-red-200'
                : toast.type === 'success'
                ? 'border-green-200 bg-green-50/90 text-green-900 dark:border-green-900/30 dark:bg-green-950/80 dark:text-green-200'
                : 'border-blue-200 bg-blue-50/90 text-blue-900 dark:border-blue-900/30 dark:bg-blue-950/80 dark:text-blue-200'
            }`}
          >
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">
                {toast.title}
              </h4>
              <p className="opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
