import type { Ref } from 'vue';
import { onMounted, ref, watch } from 'vue';

import type { ConfigurationResponse } from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import type { Nullable } from 'vitest';

function updateState<T>(configuration: Ref<T, T> | Ref<undefined, undefined>, newConfig: Ref<T>, key: keyof T, value: any) {
	if (configuration.value?.[key] === value) {
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
}

const { data: configuration, refetch: invalidate }
	= useServerClient<ConfigurationResponse>({
		path: '/dashboard/configuration',
	});

const ready = ref<boolean>(false);
const newConfig = ref<ConfigurationResponse>({
	name: '',
	external_port: 0,
	internal_port: 0,
	library_workers: 1,
	import_workers: 2,
	extras_workers: 15,
	encoder_workers: 1,
	cron_workers: 1,
	image_workers: 10,
	file_workers: 4,
	music_workers: 2,
	swagger: false,
});

onMounted(() => {
	if (configuration.value) {
		ready.value = true;
	}
});

export const name = ref<Nullable<string>>(configuration.value?.name ?? '');
watch(name, (value) => {
	updateState(configuration, newConfig, 'name', value);
});

export const external_port = ref<Nullable<number>>(
	configuration.value?.external_port ?? 0,
);
watch(external_port, (value) => {
	updateState(configuration, newConfig, 'external_port', value);
});

export const internal_port = ref<Nullable<number>>(
	configuration.value?.internal_port ?? 0,
);
watch(internal_port, (value) => {
	updateState(configuration, newConfig, 'internal_port', value);
});

export const library_workers = ref<Nullable<number>>(
	configuration.value?.library_workers ?? 1,
);
watch(library_workers, (value) => {
	updateState(configuration, newConfig, 'library_workers', value);
});

export const import_workers = ref<Nullable<number>>(
	configuration.value?.import_workers ?? 2,
);
watch(import_workers, (value) => {
	updateState(configuration, newConfig, 'import_workers', value);
});

export const extras_workers = ref<Nullable<number>>(
	configuration.value?.extras_workers ?? 15,
);
watch(extras_workers, (value) => {
	updateState(configuration, newConfig, 'extras_workers', value);
});

export const encoder_workers = ref<Nullable<number>>(
	configuration.value?.encoder_workers ?? 1,
);
watch(encoder_workers, (value) => {
	updateState(configuration, newConfig, 'encoder_workers', value);
});

export const cron_workers = ref<Nullable<number>>(
	configuration.value?.cron_workers ?? 1,
);
watch(cron_workers, (value) => {
	updateState(configuration, newConfig, 'cron_workers', value);
});

export const image_workers = ref<Nullable<number>>(
	configuration.value?.image_workers ?? 10,
);
watch(image_workers, (value) => {
	updateState(configuration, newConfig, 'image_workers', value);
});

export const file_workers = ref<Nullable<number>>(
	configuration.value?.file_workers ?? 4,
);
watch(file_workers, (value) => {
	updateState(configuration, newConfig, 'file_workers', value);
});

export const music_workers = ref<Nullable<number>>(
	configuration.value?.music_workers ?? 2,
);
watch(music_workers, (value) => {
	updateState(configuration, newConfig, 'music_workers', value);
});

watch(configuration, (value) => {
	if (!value)
		return;

	name.value = value?.name;
	external_port.value = value?.external_port;
	internal_port.value = value?.internal_port;
	library_workers.value = value?.library_workers;
	import_workers.value = value?.import_workers;
	extras_workers.value = value?.extras_workers;
	encoder_workers.value = value?.encoder_workers;
	cron_workers.value = value?.cron_workers;
	image_workers.value = value?.image_workers;
	file_workers.value = value?.file_workers;
	music_workers.value = value?.music_workers;
	ready.value = true;
});

export { invalidate, newConfig, ready };
