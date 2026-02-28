<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { user } from '@/store/user';
import { closeMenu, menuOpen, toggleMenu } from '@/store/profileMenu';
import { currentServer } from '@/store/currentServer';
import router from '@/router';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const route = useRoute();

const tabs = computed(() => [
	{ id: 'home', route: '/home', icon: 'home1' as const, label: 'Home', show: !!currentServer.value },
	{ id: 'search', route: '/search', icon: 'searchMagnifyingGlass' as const, label: 'Search', show: true },
	{ id: 'library', route: '/libraries', icon: 'folder' as const, label: 'Library', show: !!currentServer.value },
	{ id: 'music', route: '/music/start', icon: 'noteEighthPair' as const, label: 'Music', show: !!currentServer.value },
]);

function isActive(tab: { id: string; route: string }) {
	if (tab.id === 'home') return route.path === '/home' || route.path === '/';
	if (tab.id === 'search') return route.path.startsWith('/search');
	if (tab.id === 'library') return route.path.startsWith('/libraries') || route.path.startsWith('/collection') || route.path.startsWith('/specials') || route.path.startsWith('/genre') || route.path.startsWith('/person');
	if (tab.id === 'music') return route.path.startsWith('/music');
	return false;
}

const isProfileActive = computed(() => menuOpen.value || route.path.startsWith('/preferences') || route.path.startsWith('/dashboard'));

function navigate(tab: { route: string }) {
	closeMenu();
	router.push(tab.route);
}
</script>

<template>
	<nav
		:class="{ 'opacity-0 pointer-events-none': menuOpen }"
		class="flex items-center justify-evenly w-full h-[60px] bg-surface-1 dark:bg-surface-2 text-surface-12 pb-safe transition-opacity duration-200 z-50 shrink-0"
	>
		<template v-for="tab in tabs" :key="tab.id">
			<button
				v-if="tab.show"
				class="flex flex-col items-center justify-center flex-1 h-full gap-0.5 bg-transparent border-none outline-none cursor-pointer"
				@click="navigate(tab)"
			>
				<div class="relative flex items-center justify-center w-7 h-7">
					<MoooomIcon
						:class-name="`w-5 h-5 transition-transform duration-150 ${isActive(tab) ? 'rotate-[12deg]' : ''}`"
						:icon="tab.icon"
					/>
					<div
						v-if="isActive(tab)"
						class="absolute inset-0 -z-10 rounded-full bg-focus dark:brightness-[0.6]"
						style="box-shadow: 0 -1px 3px 0 rgba(0,0,0,0.08) inset, 0 -1px 2px 0 rgba(0,0,0,0.16) inset, 0 1px 0 0 rgba(255,255,255,0.25) inset, 0 1px 1px 0 rgba(255,255,255,0.45) inset"
					/>
				</div>
				<span
					:class="isActive(tab) ? 'font-bold' : 'font-medium'"
					class="text-2xs text-center leading-tight max-w-full truncate text-surface-12"
				>
					{{ $t(tab.label) }}
				</span>
			</button>
		</template>

		<!-- Profile tab -->
		<button
			class="flex flex-col items-center justify-center flex-1 h-full gap-0.5 bg-transparent border-none outline-none cursor-pointer"
			@click="toggleMenu"
		>
			<div
				:class="isProfileActive ? 'rotate-[12deg]' : ''"
				class="relative mx-auto flex rounded-full min-h-7 size-7 bg-black transition-transform duration-150"
			>
				<AppLogoSquare
					alt="NoMercy Logo"
					class="absolute w-7 h-7 rounded-full p-1.5"
				/>
				<NoMercyAvatar :size="44" :user="user" class="absolute" />
			</div>
			<span
				:class="isProfileActive ? 'font-bold' : 'font-medium'"
				class="text-2xs text-center leading-tight text-surface-12"
			>
				{{ $t("Profile") }}
			</span>
		</button>
	</nav>
</template>
