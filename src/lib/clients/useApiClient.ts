import { ComputedRef, Ref, ref, toRaw, UnwrapRef } from 'vue';
import { QueryKey, useQuery, UseQueryReturnType } from '@tanstack/vue-query';

import apiClient from './apiClient';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/types/server';
import { queryKey } from '@/lib/clients/useInfiniteServerClient';
import router from '@/router';

export interface ServerClientProps {
	path?: string;
	data?: any;
	params?: any;
	cacheKey?: string;
	keepForever?: boolean;
	enabled?: Ref<boolean> | ComputedRef<boolean> | boolean;
	refetchInterval?: number;
	delay?: number;
	queryKey?: QueryKey | unknown[];
	type?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head';
	suspense?: Ref<UnwrapRef<boolean>>
	limit?: number;
}

type Return<T> = UseQueryReturnType<T, AxiosError<ErrorResponse>> extends {
	setLetter: (value: string) => void;
} ? UseQueryReturnType<T, AxiosError<ErrorResponse>> : UseQueryReturnType<T, AxiosError<ErrorResponse>> & {
	setLetter: (value: string) => void;
};

const useApiClient = <T,>(options?: ServerClientProps): Return<T> => {

	const letter = ref<string>(router.currentRoute.value.params?.letter as string || '_');

	const setLetter = (value: string) => {
		letter.value = value;
		// queryClient.refetch();
	};

	router.afterEach(() => {
		setLetter(router.currentRoute.value.params.letter as string);
	});

	const getDataValues = () => {
		return Object.keys(options?.data ?? {})
			.reduce((acc, key) => {
				acc[key] = toRaw(options?.data![key].value);
				return acc;
			}, {} as Record<string | number, any>);
	}

	const type = ref<'get' | 'post' | 'put' | 'patch' | 'delete' | 'head'>(options?.type ?? 'get');

	const useQueryC = useQuery({
		...options,
		queryKey: queryKey(options),
		// enabled: !!currentServer.value?.id && options?.enabled,
		enabled: true,
		retry: 0,
		// initialData: () => {
		// 	get(queryKey(options) as IDBKeyRange | IDBValidKey)
		// 		.then(value => {
		// 			queryClient.setQueryData(queryKey(options),value);
		// 		});
		// 	return {
		// 	}
		// },
		refetchOnMount: true,
		refetchOnWindowFocus: false,
		networkMode: 'offlineFirst',
		staleTime: options?.keepForever
			? Infinity
			: 1000 * 60 * 5,
		queryFn: () => {
			return new Promise<T>((resolve, reject) => {
				const controller = new AbortController();

				setTimeout(() => {

					let promise;

					if ((options?.path ?? router.currentRoute.value.fullPath).includes('undefined')) return Promise.reject();

					if (type.value == 'get') {
						promise = apiClient<T>()
							.get<T>(
								options?.path ?? router.currentRoute.value.fullPath,
								{
									params: {
										letter: letter.value,
										...options?.params,
										...getDataValues(),
									},
									signal: controller.signal,
								}
							)
							.then((response) => {
								// @ts-ignore
								return response.data?.data ?? response.data;
							})
							.catch(reject);

					}
					else if (type.value == 'post') {

						promise = apiClient<T>()
							.post<T>(options?.path ?? router.currentRoute.value.fullPath,
								{
									letter: router.currentRoute.value.params.letter ?? undefined,
									...options?.data,
									...getDataValues(),
								},
								{
									signal: controller.signal,
								})
							.then(({ data }) => {
								// @ts-ignore
								return data?.data ?? data;
							})
							.catch(reject);

					}
					else if (type.value == 'put') {
						promise = apiClient<T>()
							.put<T>(options?.path ?? router.currentRoute.value.fullPath,
								{
									letter: router.currentRoute.value.params.letter ?? undefined,
									...options?.data,
									...getDataValues(),
								},
								{
									signal: controller.signal,
								})
							.then(({ data }) => {
								// @ts-ignore
								return data?.data ?? data;
							})
							.catch(reject);
					}
					else if (type.value == 'patch') {
						promise = apiClient<T>()
							.patch<T>(options?.path ?? router.currentRoute.value.fullPath,
								{
									letter: router.currentRoute.value.params.letter ?? undefined,
									...options?.data,
									...getDataValues(),
								},
								{
									signal: controller.signal,
								})
							.then(({ data }) => {
								// @ts-ignore
								return data?.data ?? data;
							})
							.catch(reject);
					}
					else if (type.value == 'delete') {
						promise = apiClient<T>()
							.delete<T>(options?.path ?? router.currentRoute.value.fullPath,
								{
									letter: router.currentRoute.value.params.letter ?? undefined,
									...options?.data,
									...getDataValues(),
								},
								{
									signal: controller.signal,
								})
							.then(({ data }) => {
								// @ts-ignore
								return data?.data ?? data;
							})
							.catch(reject);
					}

					// promise!.then(async (value) => {
					// 	await set(queryKey(options) as IDBKeyRange | IDBValidKey, value);
					// });

					return resolve(promise as Promise<T>);

				}, options?.delay ?? 0);
			});
		},
	}) as UseQueryReturnType<T, AxiosError<ErrorResponse>>;

	return {
		...useQueryC,
		setLetter,
	};

};

export default useApiClient;
