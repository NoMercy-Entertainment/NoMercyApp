import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { keycloak, user } from '@/store/user';
import { displayLanguage } from '@/store/preferences.ts';

export interface AxiosInstance<E> {
	request: <T = unknown>(
		config: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
	get: <T = unknown>(
		url: string,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
	delete: <T = unknown, S = unknown>(
		url: string,
		data?: S,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
	head: <T = unknown>(
		url: string,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
	post: <T = unknown, S = unknown>(
		url: string,
		data?: S,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
	put: <T = unknown, S = unknown>(
		url: string,
		data: S,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
	patch: <T = unknown, S = unknown>(
		url: string,
		data: S,
		config?: AxiosRequestConfig
	) => Promise<AxiosResponse<T, E>>;
}

export default <T>({
	baseUrl,
	timeout,
}: {
	baseUrl: string;
	timeout?: number;
}) => {
	const axiosInstance = axios.create({
		headers: {
			'Accept': 'application/json',
			'Accept-Language': displayLanguage.value,
			'Authorization': `Bearer ${
				user.value?.accessToken || localStorage.getItem('access_token')
			}`,
		},
		timeout: timeout ? timeout * 1000 : undefined,
		baseURL: baseUrl,
	});

	axiosInstance.interceptors.request.use(
		(config) => {
			if (keycloak.value.authenticated) {
				config.headers.Authorization = `Bearer ${
					keycloak.value.token || localStorage.getItem('access_token')
				}`;
			}
			return config;
		},
		async (error) => {
			if (error.response?.status === 401) {
				await keycloak.value
					.keycloak!.updateToken(5).then(() => {
					return axios.request(error.config);
				}).catch(() => {
					return Promise.reject(error);
				});
			}
			else {
				return Promise.reject(error);
			}
		},
	);

	return axiosInstance as AxiosInstance<T>;
};
