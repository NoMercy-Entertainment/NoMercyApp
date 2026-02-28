<script lang="ts" setup>
import { RouterLink } from 'vue-router';

import { isPlatform } from '@ionic/vue';
import { useIsFetching } from '@tanstack/vue-query';

import { closeSidebar, sidebar, toggleSidebar } from '@/store/sidebar';

import { searchUrl } from '@/store/routeState';

import AppLogo from '@/components/Images/icons/AppLogo.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const isFetching = useIsFetching();
</script>

<template>
	<header
		v-if="!isPlatform('capacitor')"
		class="pt-safe bg-background shrink-0 z-40"
	>
		<div
			class="flex justify-between items-center h-[50px] px-1 py-1.5"
		>
			<button
				aria-label="menu"
				class="flex justify-center items-center h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent children:absolute children:transition-opacity children:duration-100 children:inset-4"
				@click="toggleSidebar"
			>
				<MoooomIcon
					:class="{
						'opacity-0': sidebar === 'closed' || sidebar === 'hidden',
						'opacity-100': sidebar === 'open',
					}"
					icon="cross"
				/>
				<MoooomIcon
					:class="{
						'opacity-100': sidebar === 'closed' || sidebar === 'hidden',
						'opacity-0': sidebar === 'open',
					}"
					icon="menuBurger"
				/>
			</button>
			<div class="flex justify-center items-center relative gap-2 px-1 h-available">
				<AppLogo />
			</div>
			<RouterLink
				:to="searchUrl"
				aria-label="search"
				class="flex justify-center items-center h-14 w-14 relative overflow-hidden gap-2 p-2.5 rounded-lg bg-transparent"
				@click="closeSidebar"
			>
				<MoooomIcon icon="searchMagnifyingGlass" />
			</RouterLink>
		</div>
	</header>

	<div
		v-if="isFetching > 0"
		class="absolute top-0 left-0 right-0 z-1199 h-1 bg-focus animate-pulse"
	/>
</template>
