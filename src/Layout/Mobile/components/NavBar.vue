<script lang="ts" setup>
import { RouterLink } from 'vue-router';

import { IonHeader, IonProgressBar, IonToolbar, isPlatform } from '@ionic/vue';
import { useIsFetching } from '@tanstack/vue-query';

import { closeSidebar, sidebar, toggleSidebar } from '@/store/sidebar';
import { isTv } from '@/config/global';
import { searchUrl } from '@/store/routeState';

import MobileLibraryHeader from '@/views/Base/Library/components/MobileLibraryHeader.vue';
import AppLogo from '@/components/Images/icons/AppLogo.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

const isFetching = useIsFetching();
</script>

<template>
	<IonHeader class="pt-safe transition-all duration-200">
		<IonToolbar v-if="!isPlatform('capacitor') && !isTv" class="toolbar">
			<div
				class="pt-safe flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-[50px] overflow-hidden px-1 py-1.5"
			>
				<button
					aria-label="menu"
					class=" flex justify-center items-center flex-grow-0 flex-shrink-0 h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent children:absolute children:transition-opacity children:duration-100 children:inset-4"
					@click="toggleSidebar"
				>
					<OptimizedIcon
						:class="{
							'opacity-0': sidebar === 'closed' || sidebar === 'hidden',
							'opacity-100': sidebar === 'open',
						}"
						icon="cross"
					/>
					<OptimizedIcon
						:class="{
							'opacity-100': sidebar === 'closed' || sidebar === 'hidden',
							'opacity-0': sidebar === 'open',
						}"
						icon="menuBurger"
					/>
				</button>
				<div
					class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-1 h-available"
				>
					<AppLogo />
				</div>
				<RouterLink
					:to="searchUrl"
					aria-label="search"
					class="flex justify-center items-center flex-grow-0 flex-shrink-0 h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent"
					@click="closeSidebar"
				>
					<OptimizedIcon
						class=""
						icon="searchMagnifyingGlass"
					/>
				</RouterLink>
			</div>
		</IonToolbar>
		<MobileLibraryHeader />
	</IonHeader>

	<IonProgressBar
		v-if="isFetching > 0"
		class="absolute top-0 z-1199 bg-black"
		type="indeterminate"
	/>
</template>

<style scoped>
ion-header {
	background: var(--color-background);
	box-shadow: none;
}

ion-toolbar {
	--background: var(--color-background);
}

ion-progress-bar::part(track) {
	@apply bg-focus/50;
}

ion-progress-bar::part(progress) {
	@apply bg-focus;
}
</style>
