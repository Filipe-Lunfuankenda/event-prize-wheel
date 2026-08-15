import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility Functions
 * 
 * This module provides general-purpose helper functions for the application.
 */

/**
 * Combines and merges Tailwind CSS classes.
 * @param {...any} inputs - Any number of class strings or objects.
 * @returns {string} - The merged and optimized class string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

/**
 * Checks if the application is running within an iframe.
 * @returns {boolean} - True if the page is embedded in an iframe, false otherwise.
 */
export const isIframe = window.self !== window.top;
