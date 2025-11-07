/**
 * WebSocket Manager for Real-time Features
 * Handles live updates, presence indicators, and collaborative features
 */

import { io, Socket } from 'socket.io-client';
import { create } from 'zustand';

export interface UserPresence {
  id: string;
  name: string;
  avatar?: string;
  currentPage: string;
  lastSeen: Date;
  isOnline: boolean;
}

export interface LiveNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  userId?: string;
  data?: any;
}

export interface CollaborativeFilter {
  id: string;
  userId: string;
  userName: string;
  filters: any[];
  isActive: boolean;
}

interface RealtimeState {
  // Connection state
  isConnected: boolean;
  socket: Socket | null;

  // Presence
  currentUser: UserPresence | null;
  onlineUsers: UserPresence[];

  // Notifications
  notifications: LiveNotification[];

  // Collaborative features
  activeFilters: CollaborativeFilter[];
  currentPage: string;

  // Actions
  connect: (user: Omit<UserPresence, 'lastSeen' | 'isOnline'>) => void;
  disconnect: () => void;
  updatePresence: (presence: Partial<UserPresence>) => void;
  sendNotification: (notification: Omit<LiveNotification, 'id' | 'timestamp'>) => void;
  shareFilter: (filters: any[]) => void;
  clearNotifications: () => void;
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001';

export const useRealtimeStore = create<RealtimeState>((set, get) => ({
  isConnected: false,
  socket: null,
  currentUser: null,
  onlineUsers: [],
  notifications: [],
  activeFilters: [],
  currentPage: '',

  connect: (user) => {
    const socket = io(WEBSOCKET_URL, {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('🔗 Connected to real-time server');
      set({ isConnected: true, socket });

      // Join with user info
      socket.emit('join', {
        ...user,
        lastSeen: new Date(),
        isOnline: true,
      });
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from real-time server');
      set({ isConnected: false });
    });

    // Presence updates
    socket.on('presence-update', (users: UserPresence[]) => {
      set({ onlineUsers: users });
    });

    // Live notifications
    socket.on('notification', (notification: LiveNotification) => {
      set((state) => ({
        notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
      }));
    });

    // Collaborative filters
    socket.on('filter-shared', (filter: CollaborativeFilter) => {
      set((state) => ({
        activeFilters: [...state.activeFilters.filter(f => f.userId !== filter.userId), filter],
      }));
    });

    socket.on('filter-removed', (userId: string) => {
      set((state) => ({
        activeFilters: state.activeFilters.filter(f => f.userId !== userId),
      }));
    });

    // Data updates
    socket.on('data-update', (update: { type: string; data: any }) => {
      // Trigger React Query invalidation for live updates
      // This would integrate with your query client
      console.log('📡 Live data update:', update);
    });

    set({ currentUser: { ...user, lastSeen: new Date(), isOnline: true } });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, currentUser: null });
    }
  },

  updatePresence: (presence) => {
    const { socket, currentUser } = get();
    if (socket && currentUser) {
      const updatedPresence = { ...currentUser, ...presence };
      socket.emit('update-presence', updatedPresence);
      set({ currentUser: updatedPresence });
    }
  },

  sendNotification: (notification) => {
    const { socket } = get();
    if (socket) {
      const fullNotification: LiveNotification = {
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      socket.emit('send-notification', fullNotification);
    }
  },

  shareFilter: (filters) => {
    const { socket, currentUser } = get();
    if (socket && currentUser) {
      const collaborativeFilter: CollaborativeFilter = {
        id: `filter-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        filters,
        isActive: true,
      };

      socket.emit('share-filter', collaborativeFilter);
    }
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

// React hooks for easier usage
export const usePresence = () => {
  const { onlineUsers, currentUser, updatePresence } = useRealtimeStore();
  return { onlineUsers, currentUser, updatePresence };
};

export const useNotifications = () => {
  const { notifications, sendNotification, clearNotifications } = useRealtimeStore();
  return { notifications, sendNotification, clearNotifications };
};

export const useCollaborativeFilters = () => {
  const { activeFilters, shareFilter } = useRealtimeStore();
  return { activeFilters, shareFilter };
};

export const useConnectionStatus = () => {
  const { isConnected, connect, disconnect } = useRealtimeStore();
  return { isConnected, connect, disconnect };
};

