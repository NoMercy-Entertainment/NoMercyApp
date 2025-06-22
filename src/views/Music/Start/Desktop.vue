<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';

import type { HomeDataItem } from '@/types/api/music';
import type { Component } from '@/lib/routerHelper';

import useServerClient from '@/lib/clients/useServerClient';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import { onMounted } from 'vue';
import { setBackground, setColorPalette } from '@/store/ui';
import NotFound from '@/Layout/Desktop/components/NotFound.vue';

const { data, isError } = useServerClient<Component<HomeDataItem>[]>({
	queryKey: ['music', 'home'],
});

onMounted(() => {
	setColorPalette(null);
	setBackground(null);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<NotFound v-if="isError && !data" />
			<ScrollContainer v-else :auto-hide="true" :static="true">
				<template v-if="data">
					<component
						:is="render.component"
						v-for="(render, index) in data ?? []"
						:key="render.id"
						:index="index"
						v-bind="render.props"
					/>
				</template>
			</ScrollContainer>
		</IonContent>
	</IonPage>
</template>
