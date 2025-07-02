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

import { useOnline } from '@vueuse/core';
import router from '@/router';
import { onIonViewWillEnter } from '@ionic/vue';
import { useRoute } from 'vue-router';

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
const route = useRoute();

onMounted(() => {
	if (!homeData.value) {
		return;
	}

	if (onlineStatus.value) {
		const mutations = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad') ?? [];
		mutate(mutations);
	}
});

watch(onlineStatus, (value) => {
	if (!value)
		return;

	const mutations = homeData.value?.filter?.(item => item?.update?.when === 'online') ?? [];
	mutate(mutations);
});

watch(homeData, (value) => {
	if (!value)
		return;
	setTimeout(() => {
		document.dispatchEvent(new Event('indexer'));
	}, 1000);
});

router.beforeEach((to) => {
	if (!homeData.value || (to.name !== 'Home' && to.name !== 'Libraries')) {
		return;
	}

	if (onlineStatus.value) {
		const mutations = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad') ?? [];
		mutate(mutations);
	}
});

onIonViewWillEnter(() => {
	if (!homeData.value) {
		return;
	}

	if (onlineStatus.value) {
		const mutations = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad') ?? [];
		mutate(mutations);
	}
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
