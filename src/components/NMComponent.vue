<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonSpinner } from '@ionic/vue';
import { useOnline } from '@vueuse/core';

import { getMutating, getMutation, getQuery, queryKey as qk } from '@/lib/routerHelper';
import { nmComponentMap } from '@/components/nmComponentMap';

const props = defineProps({
	path: {
		type: String,
		required: false,
		default: undefined,
	},
	options: {
		type: Object as PropType<{
			queryKey: string[];
			keepForever?: boolean | undefined;
		}>,
		required: false,
		default: () => ({
			keepForever: true,
			queryKey: qk(),
		}),
	},
});

// Routes that should trigger pageLoad mutations
const MUTABLE_ROUTES = new Set(['Home', 'Libraries', 'Music Start']);

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
	if (mutations.length > 0) {
		mutate(mutations);
	}
}

function mutateOnline() {
	if (!homeData.value || !onlineStatus.value) {
		return;
	}

	const mutations = homeData.value.filter(item => item?.update?.when === 'online') ?? [];
	if (mutations.length > 0) {
		mutate(mutations);
	}
}

function mutateId(event: Event) {
	const customEvent = event as CustomEvent<{ id: string }>;
	if (!homeData.value || !onlineStatus.value) {
		return;
	}

	const mutations = homeData.value.filter(item => item?.id === customEvent.detail.id) ?? [];
	if (mutations.length > 0) {
		mutate(mutations);
	}
}

function shouldMutate(): boolean {
	return MUTABLE_ROUTES.has(route.name as string);
}

onMounted(() => {
	document.addEventListener('mutateId', mutateId);

	// Initial mutation on mount if applicable
	if (homeData.value && onlineStatus.value && shouldMutate()) {
		mutatePageLoad();
	}
});

onUnmounted(() => {
	document.removeEventListener('mutateId', mutateId);
});

// Trigger mutations when coming back online
watch(onlineStatus, (value) => {
	if (value) {
		mutateOnline();
	}
});

// Dispatch indexer event when data loads (deferred to avoid blocking render)
watch(homeData, (value) => {
	if (value) {
		requestIdleCallback(() => {
			document.dispatchEvent(new Event('indexer'));
		});
	}
});

// Trigger mutations on route changes for applicable routes
watch(
	() => route.name,
	(newName) => {
		if (homeData.value && onlineStatus.value && MUTABLE_ROUTES.has(newName as string)) {
			mutatePageLoad();
		}
	},
);
</script>

<template>
	<template v-if="isLoading">
		<div class="grid w-available h-available place-items-center">
			<IonSpinner class="ion-padding" name="crescent" />
		</div>
	</template>
	<template v-else-if="!isMutating">
		<component
			:is="nmComponentMap[render?.component]"
			v-for="(render, index) in mutatedData ?? homeData ?? []"
			:key="render.id"
			:index="index"
			v-bind="render.props"
		/>
	</template>
</template>
