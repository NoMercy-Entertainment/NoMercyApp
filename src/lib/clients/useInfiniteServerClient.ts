import { InfiniteData, QueryKey, useInfiniteQuery, UseInfiniteQueryReturnType, } from '@tanstack/vue-query';

import serverClient from '@/lib/clients/serverClient';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/server';
import { ServerClientProps } from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';
import { useRoute } from 'vue-router';

interface InfiniteServerClientProps {
	path?: string;
	data?: any;
	cacheKey?: string;
	keepForever?: boolean;
	limit?: number;
	version?: 'lolomo';
	enabled?: boolean;
	queryKey?: string[];
}

export const queryKey = (options?: ServerClientProps | InfiniteServerClientProps) => {
	if (options?.queryKey) return options?.queryKey

	const route = useRoute();
	const options2: string[] = [];

	(options?.path ?? route.path)?.split('/').slice(1).forEach(p => {
		if (p.includes('?')) {
			options2.push(p.split('?')[0]);
			options2.push(p.split('?')[1].split('=')[1]);
		} else {
			options2.push(p);
		}
	});

	return options?.queryKey ?? options2;
};

type Return<T> = UseInfiniteQueryReturnType<InfiniteData<T>, AxiosError<ErrorResponse>> extends {
	setLetter: (value: string) => void;
} ? UseInfiniteQueryReturnType<InfiniteData<T>, AxiosError<ErrorResponse>> : UseInfiniteQueryReturnType<InfiniteData<T>, AxiosError<ErrorResponse>> & {
	setLetter: (value: string) => void;
};

const useInfiniteServerClient = <T,>(options?: {
	path?: string;
	data?: any;
	cacheKey?: string;
	keepForever?: boolean;
	enabled?: boolean;
	refetchInterval?: number;
	queryKey?: QueryKey | unknown[];
	limit?: number;
	initialPageParam?: number;
	version?: string,
}): Return<T> => {

	const LIMIT = 3;
	const route = useRoute();

	return useInfiniteQuery({
		...options,
		queryKey: options?.queryKey ?? (options?.path ?? route.fullPath).split('/').slice(1),
		enabled: !!currentServer.value?.id && options?.enabled,
		retry: 0,
		staleTime: options?.keepForever
			? Infinity
			: 1000 * 60 * 5,
		retryOnMount: false,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true,
		initialPageParam: 0,
		getNextPageParam: (lastPage: any) => {
			return lastPage.has_more ? lastPage.next_page : undefined;
		},
		getPreviousPageParam: (lastPage: any) => {
			return lastPage.has_more ? lastPage.next_page - 2 : undefined;
		},
		queryFn: ({ pageParam = 0, signal }) =>
			new Promise((resolve, reject) => serverClient()
				.get(options?.path ?? route.fullPath, {
					signal: signal,
					params: {
						page: pageParam,
						version: options?.version,
						take: options?.limit ?? LIMIT,
					},
				})
				.then(response => {
					resolve(response.data);
				})
				.catch(reject))
	}) as Return<T>;
};

export default useInfiniteServerClient;
