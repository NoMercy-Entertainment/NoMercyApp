import type {
	InfiniteData,
	QueryKey,
	UseInfiniteQueryReturnType,
} from '@tanstack/vue-query';
import {
	useInfiniteQuery,
} from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/server';
import type { ServerClientProps } from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';
import { useRoute } from 'vue-router';

interface InfiniteServerClientProps {
	path?: string;
	data?: Record<string, { value: unknown }>;
	cacheKey?: string;
	keepForever?: boolean;
	limit?: number;
	version?: 'lolomo';
	enabled?: boolean;
	queryKey?: string[];
}

export function queryKey(options?: ServerClientProps | InfiniteServerClientProps) {
	if (options?.queryKey)
		return options?.queryKey;

	const route = useRoute();
	const options2: string[] = [];

	(options?.path ?? route.path)
		?.split('/')
		.slice(1)
		.forEach((p) => {
			if (p.includes('?')) {
				options2.push(p.split('?')[0]);
				options2.push(p.split('?')[1].split('=')[1]);
			}
			else {
				options2.push(p);
			}
		});

	return options?.queryKey ?? options2;
}

type Return<T> = UseInfiniteQueryReturnType<
	InfiniteData<T>,
	AxiosError<ErrorResponse>
> extends {
	setLetter: (value: string) => void;
}
	? UseInfiniteQueryReturnType<InfiniteData<T>, AxiosError<ErrorResponse>>
	: UseInfiniteQueryReturnType<InfiniteData<T>, AxiosError<ErrorResponse>> & {
		setLetter: (value: string) => void;
	};

function useInfiniteServerClient<T>(options?: {
	path?: string;
	data?: Record<string, { value: unknown }>;
	cacheKey?: string;
	keepForever?: boolean;
	enabled?: boolean;
	refetchInterval?: number;
	queryKey?: QueryKey | unknown[];
	limit?: number;
	initialPageParam?: number;
	version?: string;
}): Return<T> {
	const LIMIT = 3;
	const route = useRoute();

	return useInfiniteQuery({
		...options,
		queryKey:
      options?.queryKey
      ?? (options?.path ?? route.fullPath).split('/').slice(1),
		enabled: !!currentServer.value?.id && options?.enabled,
		retry: 0,
		staleTime: options?.keepForever ? Infinity : 1000 * 60 * 5,
		retryOnMount: false,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		initialPageParam: 0,
		getNextPageParam: (lastPage: T & { has_more?: boolean; next_page?: number }) => {
			return lastPage.has_more ? lastPage.next_page : undefined;
		},
		getPreviousPageParam: (lastPage: T & { has_more?: boolean; next_page?: number }) => {
			return lastPage.has_more ? (lastPage.next_page ?? 2) - 2 : undefined;
		},
		queryFn: ({ pageParam = 0, signal }) =>
			new Promise((resolve, reject) =>
				serverClient()
					.get(options?.path ?? route.fullPath, {
						signal,
						params: {
							page: pageParam,
							version: options?.version,
							take: options?.limit ?? LIMIT,
						},
					})
					.then((response) => {
						resolve(response.data as T & { has_more?: boolean; next_page?: number });
					})
					.catch(reject),
			),
	}) as Return<T>;
}

export default useInfiniteServerClient;
