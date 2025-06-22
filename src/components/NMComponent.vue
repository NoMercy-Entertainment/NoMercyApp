<script setup lang="ts">
import { onMounted, type PropType, watch } from 'vue';

import type { HomeItem } from '@/types/api/base/home';
import {
	type Component,
	getMutating,
	getMutation,
	getQuery,
	queryKey as qk,
} from '@/lib/routerHelper';

import { setTitle } from '@/lib/stringArray';
import { setBackground, setColorPalette } from '@/store/ui';
import { useOnline } from '@vueuse/core';

const props = defineProps({
	path: {
		type: String,
		required: false,
		default: undefined,
	},
	options: {
		type: Object as PropType<
      Component<HomeItem>[] & { queryKey: string[]; path?: string }
		>,
		required: false,
		default: () => ({
			keepForever: true,
			queryKey: qk(),
		}),
	},
});

const queryKey = props.options.queryKey ?? qk();

const isMutating = getMutating({ queryKey, path: props.path });

const { data: homeData } = getQuery({ queryKey, path: props.path });

const { data: mutatedData, mutate } = getMutation({
	queryKey,
	homeData,
});

const onlineStatus = useOnline();

onMounted(() => {
	if (!homeData.value)
		return;

	setTitle();
	setBackground(null);
	setColorPalette(null);

	if (onlineStatus.value) {
		const mutations
      = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad')
      	?? [];
		mutate(mutations);
	}
});

watch(onlineStatus, (value) => {
	if (!value)
		return;

	const mutations
    = homeData.value?.filter?.(item => item?.update?.when === 'online') ?? [];
	mutate(mutations);
});

watch(homeData, (value) => {
	if (!value)
		return;
	setTimeout(() => {
		document.dispatchEvent(new Event('indexer'));
	}, 1000);
});
</script>

<template>
	<template v-if="!isMutating || !onlineStatus">
		<component
			:is="render.component"
			v-for="(render, index) in mutatedData ?? homeData ?? []"
			:key="render.id"
			:index="index"
			v-bind="render.props"
		/>
	</template>
</template>
