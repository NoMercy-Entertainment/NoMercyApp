import { onMounted, Ref, ref, watch } from 'vue';

import type { ConfigurationResponse } from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import { Nullable } from 'vitest';

const updateState = <T>(configuration: Ref<T, T> | Ref<undefined, undefined>, newConfig: Ref<T>, key: keyof T, value: any) => {
	if (configuration.value?.[key] == value) {
		delete newConfig.value[key];
		newConfig.value = {
			...newConfig.value,
		};
		return;
	}
	newConfig.value = {
		...newConfig.value,
		[key]: value || undefined,
	};
};

const { data: configuration, refetch: invalidate } = useServerClient<ConfigurationResponse>({
	path: '/dashboard/configuration',
});

const ready = ref<boolean>(false);
const newConfig = ref<ConfigurationResponse>({
	server_name: '',
	external_port: 0,
	internal_port: 0,
	queue_workers: 0,
	cron_workers: 0,
	data_workers: 0,
	request_workers: 0,
	encoder_workers: 0,
	image_workers: 0,
	swagger: false,
});

watch(configuration, (value) => {
	if (!value) return;

	server_name.value = value?.server_name;
	external_port.value = value?.external_port;
	internal_port.value = value?.internal_port;
	queue_workers.value = value?.queue_workers;
	cron_workers.value = value?.cron_workers;
	data_workers.value = value?.data_workers;
	request_workers.value = value?.request_workers;
	encoder_workers.value = value?.encoder_workers;
	image_workers.value = value?.image_workers;
	ready.value = true;
});

onMounted(() => {
	if (configuration.value) {
		ready.value = true;
	}
});

export const server_name = ref<Nullable<string>>(configuration.value?.server_name ?? '');
watch(server_name, (value) => {
	updateState(configuration, newConfig, 'server_name', value);
});

export const external_port = ref<Nullable<number>>(configuration.value?.external_port ?? 0);
watch(external_port, (value) => {
	updateState(configuration, newConfig, 'external_port', value);
});

export const internal_port = ref<Nullable<number>>(configuration.value?.internal_port ?? 0);
watch(internal_port, (value) => {
	updateState(configuration, newConfig, 'internal_port', value);
});

export const queue_workers = ref<Nullable<number>>(configuration.value?.queue_workers ?? 0);
watch(queue_workers, (value) => {
	updateState(configuration, newConfig, 'queue_workers', value);
});

export const cron_workers = ref<Nullable<number>>(configuration.value?.cron_workers ?? 0);
watch(cron_workers, (value) => {
	updateState(configuration, newConfig, 'cron_workers', value);
});

export const data_workers = ref<Nullable<number>>(configuration.value?.data_workers ?? 0);
watch(data_workers, (value) => {
	updateState(configuration, newConfig, 'data_workers', value);
});

export const request_workers = ref<Nullable<number>>(configuration.value?.request_workers ?? 0);
watch(request_workers, (value) => {
	updateState(configuration, newConfig, 'request_workers', value);
});

export const image_workers = ref<Nullable<number>>(configuration.value?.image_workers ?? 0);
watch(image_workers, (value) => {
	updateState(configuration, newConfig, 'image_workers', value);
});

export const encoder_workers = ref<Nullable<number>>(configuration.value?.encoder_workers ?? 0);
watch(encoder_workers, (value) => {
	updateState(configuration, newConfig, 'encoder_workers', value);
});

export {
	ready,
	newConfig,
	invalidate,
}
