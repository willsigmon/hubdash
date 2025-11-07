/**
 * Optimistic Updates Store
 * Handles optimistic UI updates with rollback capability
 */

import { create } from 'zustand';

export interface OptimisticAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  rollback?: () => void | Promise<void>;
}

interface OptimisticState {
  pendingActions: OptimisticAction[];
  failedActions: OptimisticAction[];

  // Actions
  addOptimisticAction: (action: Omit<OptimisticAction, 'id' | 'timestamp'>) => string;
  resolveAction: (id: string) => void;
  failAction: (id: string) => void;
  rollbackAction: (id: string) => Promise<void>;
  rollbackFailedActions: () => Promise<void>;
  clearHistory: () => void;
}

// In-memory store for optimistic updates (not persisted)
export const useOptimisticStore = create<OptimisticState>((set, get) => ({
  pendingActions: [],
  failedActions: [],

  addOptimisticAction: (action) => {
    const id = `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullAction: OptimisticAction = {
      ...action,
      id,
      timestamp: Date.now(),
    };

    set((state) => ({
      pendingActions: [...state.pendingActions, fullAction],
    }));

    return id;
  },

  resolveAction: (id) => {
    set((state) => ({
      pendingActions: state.pendingActions.filter((action) => action.id !== id),
      failedActions: state.failedActions.filter((action) => action.id !== id),
    }));
  },

  failAction: (id) => {
    const { pendingActions } = get();
    const failedAction = pendingActions.find((action) => action.id === id);

    if (failedAction) {
      set((state) => ({
        pendingActions: state.pendingActions.filter((action) => action.id !== id),
        failedActions: [...state.failedActions, failedAction],
      }));
    }
  },

  rollbackAction: async (id) => {
    const { failedActions } = get();
    const action = failedActions.find((action) => action.id === id);

    if (action?.rollback) {
      try {
        await action.rollback();
        set((state) => ({
          failedActions: state.failedActions.filter((a) => a.id !== id),
        }));
      } catch (error) {
        console.error('Failed to rollback action:', error);
      }
    }
  },

  rollbackFailedActions: async () => {
    const { failedActions } = get();

    for (const action of failedActions) {
      if (action.rollback) {
        try {
          await action.rollback();
        } catch (error) {
          console.error('Failed to rollback action:', action.id, error);
        }
      }
    }

    set({ failedActions: [] });
  },

  clearHistory: () => {
    set({ pendingActions: [], failedActions: [] });
  },
}));

// Selectors
export const usePendingActionCount = () =>
  useOptimisticStore((state) => state.pendingActions.length);

export const useFailedActionCount = () =>
  useOptimisticStore((state) => state.failedActions.length);

export const useHasPendingActions = () =>
  useOptimisticStore((state) => state.pendingActions.length > 0);

export const useHasFailedActions = () =>
  useOptimisticStore((state) => state.failedActions.length > 0);

