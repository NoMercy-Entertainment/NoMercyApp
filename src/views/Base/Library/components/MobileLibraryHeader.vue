<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { IonLabel, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/vue';

import router from '@/router';
import libraries from '@/store/Libraries';

import OptimizedIcon from '@/components/OptimizedIcon.vue';

const shownRoutes = ['/libraries/', '/genre'];
const endsWithRoutes = ['/collection', '/specials', '/person'];
const route = useRoute();

const show = ref(
	shownRoutes.some(r => route.fullPath.startsWith(r))
	|| endsWithRoutes.some(r => route.fullPath.endsWith(r)),
);
router.afterEach((to) => {
	show.value
    = shownRoutes.some(route => to.fullPath.startsWith(route))
    	|| endsWithRoutes.some(route => to.fullPath.endsWith(route));
});
</script>

<template>
	<IonToolbar v-if="show" class="transition-all duration-200 toolbar">
		<IonSegment :scrollable="true" mode="ios" :value="route.fullPath">
			<template
				v-for="library in libraries?.filter((l) => l.type !== 'music') ?? []"
				:key="library.id"
			>
				<IonSegmentButton
					:value="`/libraries/${library.id}`"
					layout="icon-start"
					:class="{
						'bg-focus': route.fullPath.startsWith(`/libraries/${library.id}`),
					}"
					@click="() => router.push(`/libraries/${library.id}`)"
				>
					<OptimizedIcon icon="folder" class="mr-2" />
					<IonLabel>{{ library.title }}</IonLabel>
				</IonSegmentButton>
			</template>

			<IonSegmentButton
				v-if="libraries?.some?.((l) => l.type === 'movie')"
				value="/collection"
				layout="icon-start"
				:class="{
					'bg-focus': route.fullPath.startsWith('/collection'),
				}"
				@click="() => router.push('/collection')"
			>
				<OptimizedIcon icon="collection1" class="mr-2" />
				<IonLabel>{{ $t("Collections") }}</IonLabel>
			</IonSegmentButton>

			<IonSegmentButton
				value="/specials"
				layout="icon-start"
				:class="{
					'bg-focus': route.fullPath.startsWith('/specials'),
				}"
				@click="() => router.push('/specials')"
			>
				<OptimizedIcon icon="sparkles" class="mr-2" />
				<IonLabel>{{ $t("Specials") }}</IonLabel>
			</IonSegmentButton>

			<IonSegmentButton
				value="/genre"
				layout="icon-start"
				:class="{
					'bg-focus': route.fullPath.startsWith('/genre'),
				}"
				@click="() => router.push('/genre')"
			>
				<OptimizedIcon icon="witchHat" class="mr-2" />
				<IonLabel>{{ $t("Genres") }}</IonLabel>
			</IonSegmentButton>

			<IonSegmentButton
				value="/person"
				layout="icon-start"
				:class="{
					'bg-focus': route.fullPath.startsWith('/person'),
				}"
				@click="() => router.push('/person')"
			>
				<OptimizedIcon icon="user" class="mr-2" />
				<IonLabel>{{ $t("People") }}</IonLabel>
			</IonSegmentButton>
		</IonSegment>
	</IonToolbar>
</template>

<style scoped lang="scss">
ion-toolbar {
	@apply bg-slate-light-1 dark:bg-slate-dark-3;
	--color-background: var(--color-background);
	--background: transparent !important;
}

ion-segment {
	@apply px-4;
	--background: transparent !important;
}

ion-segment-button::part(indicator-background) {
	@apply bg-focus;
}
ion-segment-button::part(native) {
}
</style>
