<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useDebounce } from '@vueuse/core';

import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import useServerClient from '@/lib/clients/useServerClient';

import type { ServerInfo } from '@/types/api/dashboard/server.ts';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/stringArray.ts';

const props = defineProps({
	setNextButtonLocked: {
		type: Function as PropType<(value: boolean) => void>,
		required: true,
	},
});

const query = useQueryClient();
const toast = useToast();

const { data: serverInfo } = useServerClient<ServerInfo>({
	path: 'dashboard/server/info',
	queryKey: ['serverinfo'],
});

const serverName = ref(serverInfo.value?.server ?? '');
const debouncedName = useDebounce(serverName, 500);

watch(serverInfo, (value) => {
	if (!value)
		return;

	serverName.value = value.server;
});

function updateServerName() {
	serverClient()
		.patch<StatusResponse<null>>('dashboard/server/info', {
			name: debouncedName.value,
		})
		.then(({ data }) => {
			toast.add({
				severity: 'success',
				summary: translate('Success'),
				detail: translate(data.message, ...data.args ?? []),
				life: 5000,
			});
			query.invalidateQueries({ queryKey: ['servers'] });
		});
}

watch(debouncedName, (value, oldValue) => {
	if (!value || value === oldValue || oldValue === '') {
		return;
	}

	updateServerName();
});

watch(serverName, (value) => {
	props.setNextButtonLocked(!value);
});
</script>

<template>
	<div class="flex flex-col gap-2 h-available">
		<div class="flex flex-col gap-2">
			<label for="serverName">Server name</label>
			<InputText id="serverName"
				v-model="serverName"
				class="w-1/3"
				name="Give your server a friendly name to help identify it."
			/>
		</div>
		<div class="mt-auto flex flex-col">
			<p class="mb-4 text-sm">
				{{ $t('By using this NoMercy app, a NoMercy MediaServer, or any of our services, you agree to the') }}
				<a
					class="text-theme-10 hover:underline"
					href="https://nomercy.tv/privacy-policy"
					target="_blank"
				>
					{{ $t('Privacy Policy') }}
				</a>
				{{ $t('and') }}
				<a
					class="text-theme-10 hover:underline"
					href="https://nomercy.tv/terms-of-service"
					target="_blank"
				>
					{{ $t('Terms of Service') }}
				</a>.
			</p>
		</div>
	</div>
</template>
