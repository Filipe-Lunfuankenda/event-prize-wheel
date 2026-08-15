import { QueryClient } from '@tanstack/react-query';

/**
 * Query Client Configuration
 * 
 * This module initializes and exports the React Query client instance.
 */

/**
 * The singleton instance of the QueryClient used throughout the application.
 * Configured with default options for queries.
 */
export const queryClientInstance = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});