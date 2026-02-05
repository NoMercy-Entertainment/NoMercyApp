import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			retry: 1,
			retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
			experimental_prefetchInRender: true,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 30,
		},
	},
});
