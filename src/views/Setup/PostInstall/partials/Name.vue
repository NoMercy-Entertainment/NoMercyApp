<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { useDebounce } from '@vueuse/core';

import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import useServerClient from '@/lib/clients/useServerClient';

import type { ServerInfo } from '@/types/api/dashboard/server.ts';

const props = defineProps({
	setNextButtonLocked: {
		type: Function as PropType<(value: boolean) => void>,
		required: true,
	},
});

const query = useQueryClient();

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
			// showNotification({
			// 	title: translate(data.message, ...data.args ?? []),
			// 	type: TYPE.SUCCESS,
			// 	visibleOnly: true,
			// 	duration: 2000,
			// });

			query.invalidateQueries({ queryKey: ['servers'] });
		});
}

watch(debouncedName, (value) => {
	if (!value) {
		return;
	}

	updateServerName();
});

watch(serverName, (value) => {
	props.setNextButtonLocked(!value);
});
</script>

<template>
	<Textarea id="serverName"
		v-model="serverName"
		name="Give your server a friendly name to help identify it."
	/>
</template>
