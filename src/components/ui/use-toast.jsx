/**
 * useToast Hook
 * 
 * A custom React hook that manages the state of toast notifications globally.
 * Inspired by libraries like `react-hot-toast` or `sonner`.
 * It provides a `toast` function that can be called from anywhere in the app
 * to dispatch a new notification event.
 */

import { useState, useEffect } from "react";

const TOAST_LIMIT = 20; // Maximum number of toasts that can be active at once
const TOAST_REMOVE_DELAY = 1000000; // How long to wait before removing a dismissed toast from the DOM state

// Action Types for the Reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

/**
 * Generates a unique incremental ID for each toast.
 */
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Map to hold references to the timeout IDs for garbage collecting dismissed toasts
const toastTimeouts = new Map();

/**
 * Marks a toast for removal from the state array after a delay.
 * Allows the closing animation to finish before the element unmounts.
 */
const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        // Add new toast to the top, and slice to enforce the limit
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // Queue the toast(s) for removal from the DOM
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        // If no ID is provided, dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Triggers the closing animation
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// Global array of subscriber functions (components listening to toast state changes)
const listeners = [];

// Global memory state. This allows `toast()` to be called outside of React components.
let memoryState = { toasts: [] };

/**
 * Dispatches an action to the reducer, updates memory state, 
 * and notifies all subscribed React components.
 */
function dispatch(action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * Main API function to trigger a toast notification.
 * @example
 * toast({ title: "Success", description: "Saved successfully!" })
 */
function toast({ ...props }) {
  const id = genId();

  const update = (props) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () =>
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}

/**
 * React Hook for consuming the toast state.
 * Mainly used by the `Toaster` component to render the active toasts.
 */
function useToast() {
  const [state, setState] = useState(memoryState);

  useEffect(() => {
    // Subscribe to global state changes when component mounts
    listeners.push(setState);
    return () => {
      // Unsubscribe on unmount
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export { useToast, toast };