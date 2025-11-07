"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User } from 'lucide-react';
import { usePresence, useConnectionStatus } from '@/lib/realtime/socket-manager';
import { HoverAnimation } from './PageTransition';

/**
 * Presence Indicator Component
 * Shows online users and collaborative activity
 */
export default function PresenceIndicator() {
  const { onlineUsers, updatePresence } = usePresence();
  const { isConnected } = useConnectionStatus();

  // Update presence when page changes
  useEffect(() => {
    if (isConnected) {
      updatePresence({ currentPage: window.location.pathname });
    }
  }, [window.location.pathname, isConnected, updatePresence]);

  if (!isConnected || onlineUsers.length <= 1) {
    return null;
  }

  const otherUsers = onlineUsers.filter(user => user.id !== 'current-user'); // Replace with actual current user ID

  return (
    <HoverAnimation>
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white rounded-full shadow-lg border border-hti-teal/20 p-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Users className="w-5 h-5 text-hti-teal" />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-sm font-medium text-hti-navy">
              {otherUsers.length}
            </span>
          </div>
        </div>

        {/* Expanded view on hover */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-hti-teal/20 p-4 min-w-64"
          >
            <h4 className="font-semibold text-hti-navy mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Online Users ({onlineUsers.length})
            </h4>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-hti-sand/50">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-hti-teal rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-hti-navy text-sm truncate">
                      {user.name}
                    </div>
                    <div className="text-xs text-hti-stone truncate">
                      {user.currentPage === '/' ? 'Home' :
                       user.currentPage.startsWith('/board') ? 'Board Dashboard' :
                       user.currentPage.startsWith('/ops') ? 'Operations Hub' :
                       user.currentPage.startsWith('/reports') ? 'Reports' :
                       user.currentPage.startsWith('/marketing') ? 'Marketing Hub' :
                       user.currentPage}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </HoverAnimation>
  );
}

/**
 * Live Notifications Component
 * Shows real-time notifications and updates
 */
export function LiveNotifications() {
  const { notifications, clearNotifications } = useNotifications();

  return (
    <div className="fixed top-20 right-4 z-40 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.slice(0, 3).map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`p-4 rounded-lg shadow-lg border-l-4 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-500 text-green-800'
                : notification.type === 'warning'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                : notification.type === 'error'
                ? 'bg-red-50 border-red-500 text-red-800'
                : 'bg-blue-50 border-blue-500 text-blue-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-semibold text-sm">{notification.title}</h5>
                <p className="text-sm mt-1">{notification.message}</p>
                <p className="text-xs mt-2 opacity-75">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length > 3 && (
        <button
          onClick={clearNotifications}
          className="w-full text-center py-2 text-sm text-hti-stone hover:text-hti-navy transition-colors"
        >
          Clear all notifications ({notifications.length})
        </button>
      )}
    </div>
  );
}

/**
 * Collaborative Filters Indicator
 * Shows when other users are applying filters
 */
export function CollaborativeFiltersIndicator() {
  const { activeFilters } = useCollaborativeFilters();

  if (activeFilters.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-hti-teal/10 border border-hti-teal/30 rounded-lg px-4 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-hti-teal" />
          <span className="text-sm text-hti-navy">
            {activeFilters.length} user{activeFilters.length > 1 ? 's' : ''} sharing filters
          </span>
        </div>
      </motion.div>
    </div>
  );
}

