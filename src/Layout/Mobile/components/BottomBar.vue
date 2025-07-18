<script setup lang="ts">
import {
	folder,
	home1,
	noteEighthPair,
	searchMagnifyingGlass,
} from '@Icons/index';
import { IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/vue';

import { user } from '@/store/user';
import { closeMenu, menuOpen, toggleMenu } from '@/store/profileMenu';
import { currentServer } from '@/store/currentServer';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
</script>

<template>
	<IonTabBar
		slot="bottom"
		mode="md"
		selected-tab="home"
		class="w-available overflow-clip"
		:class="{
			'bg-sand-light-1 dark:bg-slate-dark-3 hide-bg': menuOpen,
			'bg-sand-light-1 dark:bg-slate-dark-3': !menuOpen,
		}"
	>
		<IonTabButton
			v-if="currentServer"
			tab="home"
			href="/home"
			@click="closeMenu"
		>
			<IonIcon aria-hidden="true" :icon="home1" />
			<IonLabel>{{ $t("Home") }}</IonLabel>
		</IonTabButton>

		<IonTabButton tab="search" href="/search" @click="closeMenu">
			<IonIcon aria-hidden="true" :icon="searchMagnifyingGlass" />
			<IonLabel>{{ $t("Search") }}</IonLabel>
		</IonTabButton>

		<IonTabButton
			v-if="currentServer"
			tab="library"
			href="/libraries"
			@click="closeMenu"
		>
			<IonIcon aria-hidden="true" :icon="folder" class="icon" />
			<IonLabel>{{ $t("Library") }}</IonLabel>
		</IonTabButton>

		<IonTabButton
			v-if="currentServer"
			tab="music"
			href="/music/start"
			@click="closeMenu"
		>
			<IonIcon aria-hidden="true" :icon="noteEighthPair" />
			<IonLabel>{{ $t("Music") }}</IonLabel>
		</IonTabButton>

		<IonTabButton
			:_on-click="toggleMenu"
			tab="/dashboard"
			class="hide-bg"
			:class="{ 'tab-selected': menuOpen }"
			@click="toggleMenu"
		>
			<div
				class="relative mx-auto flex flex-col rounded-full min-h-8 size-8 top-1.5 mb-2 mt-2.5 bg-black"
			>
				<AppLogoSquare
					alt="NoMercy Logo"
					class="absolute w-8 h-8 rounded-full p-1.5"
				/>
				<NoMercyAvatar :user="user" :size="52" class="absolute" />
			</div>
			<IonLabel>{{ $t("Profile") }}</IonLabel>
		</IonTabButton>
	</IonTabBar>
</template>

<style scoped>
ion-tab-bar {
	@apply flex justify-center items-center self-stretch h-14;
}

ion-tab-button {
	@apply flex flex-col items-center flex-grow flex-shrink bg-transparent;
}

ion-tab-button::part(native) {
	--padding-start: 0.25rem;
	--padding-end: 0.25rem;
}

ion-tab-button ion-avatar x {
	@apply w-7 h-7 min-w-7 min-h-7 relative flex mt-2.5 mb-1.5 text-slate-dark-1 dark:text-slate-light-1;
}

ion-tab-button ion-icon {
	@apply w-7 h-7 min-w-7 min-h-7 relative flex -mb-1.5 text-slate-dark-1 dark:text-slate-light-1 p-[0.625rem_0.725rem_0.625rem];
}

ion-tab-button ion-label {
	@apply text-slate-dark-1 dark:text-slate-light-1 overflow-visible mb-1.5 -mt-1 text-2xs text-center;
}

.tab-selected ion-icon {
	transform: rotate(12deg);
}

ion-tab-bar:not(.hide-bg) .tab-selected ion-label {
	@apply text-focus;
}
ion-tab-bar:not(.hide-bg) .tab-selected ion-icon:after {
	@apply content-[''] -z-10 absolute w-8 h-8 inset-[8px_9px] justify-center items-center rounded-full bg-focus dark:brightness-[0.6] shadow-none dark:shadow-none hover:shadow-none dark:hover:shadow-none active:shadow-none active:dark:shadow-none;
	box-shadow:
		0 -1px 3px 0 rgba(0, 0, 0, 0.08) inset,
		0 -1px 2px 0 rgba(0, 0, 0, 0.16) inset,
		0 1px 0 0 rgba(255, 255, 255, 0.25) inset,
		0 1px 1px 0 rgba(255, 255, 255, 0.45) inset;
}
</style>
