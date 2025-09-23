<script lang="ts" setup>
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
		<IonSegment :scrollable="true" :value="route.fullPath" mode="ios">
			<template
				v-for="library in libraries?.filter((l) => l.type !== 'music') ?? []"
				:key="library.id"
			>
				<IonSegmentButton
					:class="{
						'bg-focus': route.fullPath.startsWith(`/libraries/${library.id}`),
					}"
					:value="`/libraries/${library.id}`"
					layout="icon-start"
					@click="() => router.push(`/libraries/${library.id}`)"
				>
					<OptimizedIcon class="mr-2" icon="folder" />
					<IonLabel>{{ library.title }}</IonLabel>
				</IonSegmentButton>
			</template>

			<IonSegmentButton
				v-if="libraries?.some?.((l) => l.type === 'movie')"
				:class="{
					'bg-focus': route.fullPath.startsWith('/collection'),
				}"
				layout="icon-start"
				value="/collection"
				@click="() => router.push('/collection')"
			>
				<OptimizedIcon class="mr-2" icon="collection1" />
				<IonLabel>{{ $t("Collections") }}</IonLabel>
			</IonSegmentButton>

			<IonSegmentButton
				:class="{
					'bg-focus': route.fullPath.startsWith('/specials'),
				}"
				layout="icon-start"
				value="/specials"
				@click="() => router.push('/specials')"
			>
				<OptimizedIcon class="mr-2" icon="sparkles" />
				<IonLabel>{{ $t("Specials") }}</IonLabel>
			</IonSegmentButton>

			<IonSegmentButton
				:class="{
					'bg-focus': route.fullPath.startsWith('/genre'),
				}"
				layout="icon-start"
				value="/genre"
				@click="() => router.push('/genre')"
			>
				<OptimizedIcon class="mr-2" icon="witchHat" />
				<IonLabel>{{ $t("Genres") }}</IonLabel>
			</IonSegmentButton>

			<IonSegmentButton
				:class="{
					'bg-focus': route.fullPath.startsWith('/person'),
				}"
				layout="icon-start"
				value="/person"
				@click="() => router.push('/person')"
			>
				<OptimizedIcon class="mr-2" icon="user" />
				<IonLabel>{{ $t("People") }}</IonLabel>
			</IonSegmentButton>
		</IonSegment>
	</IonToolbar>
</template>

<style lang="scss" scoped>
ion-toolbar {
	@apply bg-surface-1;
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
