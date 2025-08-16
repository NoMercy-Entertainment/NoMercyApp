<script setup lang="ts">
import { onMounted, onUnmounted, type PropType, watch } from 'vue';
import { useRoute } from 'vue-router';
import { onIonViewWillEnter } from '@ionic/vue';
import { useOnline } from '@vueuse/core';
import { IonSpinner } from '@ionic/vue';

import type { HomeItem } from '@/types/api/base/home';
import {
	type Component,
	getMutating,
	getMutation,
	getQuery,
	queryKey as qk,
} from '@/lib/routerHelper';

import router from '@/router';

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

const { data: homeData, isLoading } = getQuery({ queryKey, path: props.path });

const { data: mutatedData, mutate } = getMutation({
	queryKey,
	homeData,
});

const onlineStatus = useOnline();
const route = useRoute();

function mutatePageLoad() {
	if (!homeData.value || !onlineStatus.value) {
		return;
	}

	const mutations = homeData.value.filter(item => item?.update?.when === 'pageLoad') ?? [];
	mutate(mutations);
}

function mutateOnline() {
	if (!homeData.value || !onlineStatus.value) {
		return;
	}

	const mutations = homeData.value.filter(item => item?.update?.when === 'online') ?? [];
	mutate(mutations);
}

function mutateId(event: CustomEvent<{ id: string }>) {
	if (!homeData.value || !onlineStatus.value) {
		return;
	}

	const mutations = homeData.value.filter(item => item?.id === event.detail.id) ?? [];
	mutate(mutations);
}

onMounted(() => {
	document.addEventListener('mutateId', mutateId);

	if (!homeData.value) {
		return;
	}

	if (onlineStatus.value) {
		mutatePageLoad();
	}
});

onUnmounted(() => {
	document.removeEventListener('mutateId', mutateId);
});

watch(onlineStatus, (value) => {
	if (!value)
		return;
	mutateOnline();
});

watch(homeData, (value) => {
	if (!value)
		return;
	setTimeout(() => {
		document.dispatchEvent(new Event('indexer'));
	}, 1000);
});

router.beforeEach((to) => {
	if (!homeData.value || (to.name !== 'Home' && to.name !== 'Libraries' && to.name !== 'Music Start')) {
		return;
	}

	if (onlineStatus.value) {
		mutatePageLoad();
	}
});

onIonViewWillEnter(() => {
	if (!homeData.value || (route.name !== 'Home' && route.name !== 'Libraries' && route.name !== 'Music Start')) {
		return;
	}

	if (onlineStatus.value) {
		mutatePageLoad();
	}
});
</script>

<template>
	<template v-if="isLoading">
		<div class="grid w-available h-available place-items-center">
			<IonSpinner name="crescent" class="ion-padding" />
		</div>
	</template>
	<template v-else-if="(!isMutating || !onlineStatus)">
		<component
			:is="render?.component"
			v-for="(render, index) in mutatedData ?? homeData ?? []"
			:key="render.id"
			:index="index"
			v-bind="render.props"
		/>
	</template>
</template>
