<script setup lang="ts">
import { watch } from 'vue';
import { IonContent, IonPage, onIonViewWillEnter } from '@ionic/vue';

import { getMutating, getMutation, getQuery } from '@/lib/routerHelper';

import { currentServer } from '@/store/currentServer';
import { useRoute } from 'vue-router';
import router from '@/router';
import { setBackground, setColorPalette } from '@/store/ui';

const route = useRoute();
const routeName = router.currentRoute.value.name;

const isMutating = getMutating({
	queryKey: ['music', 'home'],
	path: route.path,
});

const { data: homeData, refetch } = getQuery({
	queryKey: ['music', 'home'],
	path: route.path,
});

const {
	data: mutatedData,
	mutate,
	reset,
} = getMutation({
	queryKey: ['music', 'home'],
	homeData,
	path: route.path,
});

onIonViewWillEnter(() => {
	setColorPalette(null);
	setBackground(null);

	if (!homeData.value) {
		refetch();
		return;
	}

	if (route.name !== routeName)
		return;

	const mutations
    = homeData.value?.filter?.(item => item?.update?.when === 'pageLoad') ?? [];
	mutate(mutations);
});

watch(currentServer, (value) => {
	if (!value) {
		mutatedData.value = undefined;
		homeData.value = undefined;
	}
	else {
		refetch();
		reset();
	}
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<template
				v-if="
					!isMutating
						&& (mutatedData?.every?.((d) => d.component)
							|| homeData?.every?.((d) => d.component))
				"
			>
				<component
					:is="render.component"
					v-for="(render, index) in mutatedData ?? homeData"
					:key="render.id"
					:index="index"
					v-bind="render.props"
				/>
			</template>
		</IonContent>
	</IonPage>
</template>
