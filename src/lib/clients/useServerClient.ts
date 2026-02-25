import type { ComputedRef, Ref, UnwrapRef } from 'vue';
import { toRaw } from 'vue';
import type { QueryKey, UseQueryReturnType } from '@tanstack/vue-query';
import { useQuery } from '@tanstack/vue-query';

import serverClient from './serverClient';
import type { AxiosError } from 'axios';
import type { ErrorResponse } from '@/types/server';
import { queryKey } from '@/lib/clients/useInfiniteServerClient';
import { currentServer } from '@/store/currentServer';
import { useRoute } from 'vue-router';

export interface ServerClientProps {
	path?: string;
	data?: Record<string, { value: unknown }>;
	cacheKey?: string;
	keepForever?: boolean;
	enabled?: Ref<boolean> | ComputedRef<boolean> | boolean;
	refetchInterval?: number;
	queryKey?: QueryKey | unknown[];
	type?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head';
	suspense?: Ref<UnwrapRef<boolean>>;
	limit?: number;
}

type Return<T> = UseQueryReturnType<T, AxiosError<ErrorResponse>> extends {
	setLetter?: (value: string) => void;
}
	? UseQueryReturnType<T, AxiosError<ErrorResponse>>
	: UseQueryReturnType<T, AxiosError<ErrorResponse>> & {
		setLetter?: (value: string) => void;
	};

function getDataValues(options?: ServerClientProps) {
	return Object.keys(options?.data ?? {}).reduce((acc, key) => {
		acc[key] = toRaw(options?.data![key].value) ?? options?.data![key];
		return acc;
	}, {} as Record<string, unknown>);
}

function useServerClient<T>(options?: ServerClientProps): Return<T> {
	const route = useRoute();
	const type = options?.type ?? 'get';

	if (!currentServer.value?.serverApiUrl) {
		throw new Error('No server URL');
	}

	const path = options?.path ?? route.fullPath;
	if (path.includes('undefined')) {
		throw new Error('Invalid path');
	}

	const client = serverClient<T>();

	const useQueryC = useQuery({
		...options,
		queryKey: queryKey(options),
		enabled: !!currentServer.value?.id && (options?.enabled ?? true),
		retry: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		staleTime: options?.keepForever ? Infinity : 1000 * 60 * 5,
		queryFn: async ({ signal }): Promise<T> => {
			const dataValues = getDataValues(options);
			let response;

			switch (type) {
				case 'get':
					response = await client.get<T>(path, {
						params: {
							letter: route.query?.letter,
							...dataValues,
						},
						signal,
					});
					break;
				case 'post':
					response = await client.post<T>(path, { letter: route.query?.letter ?? undefined, ...dataValues }, { signal });
					break;
				case 'put':
					response = await client.put<T>(path, { letter: route.query?.letter ?? undefined, ...dataValues }, { signal });
					break;
				case 'patch':
					response = await client.patch<T>(path, { letter: route.query?.letter ?? undefined, ...dataValues }, { signal });
					break;
				case 'delete':
					response = await client.delete<T>(path, { letter: route.query?.letter ?? undefined, ...dataValues }, { signal });
					break;
				default:
					response = await client.get<T>(path, {
						params: {
							letter: route.query?.letter,
							...dataValues,
						},
						signal,
					});
			}

			// @ts-ignore
			return response.data?.data ?? response.data;
		},
	}) as UseQueryReturnType<T, AxiosError<ErrorResponse>>;

	return {
		...useQueryC,
	};
}

export default useServerClient;
