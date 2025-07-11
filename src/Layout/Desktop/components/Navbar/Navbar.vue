<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { isPlatform } from '@ionic/vue';

import { shouldShowLibraryLinks } from '@/store/Libraries';
import { user } from '@/store/user';

import NotificationMenu from '@/Layout/Desktop/components/Menus/NotificationMenu.vue';
import ProfileMenu from '@/Layout/Desktop/components/Menus/ProfileMenu.vue';

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import AppLogo from '@/components/Images/icons/AppLogo.vue';
import NavbarButton from './NavbarButton.vue';
import {
	isHomeRoute,
	isLibraryRoute,
	isMusicRoute,
	searchUrl,
} from '@/store/routeState';
import { currentServer } from '@/store/currentServer';
import MessagesMenu from '@/Layout/Desktop/components/Menus/MessagesMenu.vue';

const { t } = useTranslation();
</script>

<template>
	<div
		id="navShadow"
		:class="`static sm:hidden w-full h-6 z-1199 background-animate bg-focus top-0 left-0 opacity-50 bg-gradient-to-r ${
			isPlatform('android') ? 'block' : 'hidden'
		}`"
		style="
             --tw-gradient-from: rgb(var(--color-focus)) var(--tw-gradient-from-position);
             --tw-gradient-stops: var(--tw-gradient-from), white var(--tw-gradient-via-position), var(--tw-gradient-to);
             --tw-gradient-to: rgb(var(--color-focus)) var(--tw-gradient-to-position);
            background-image: linear-gradient(var(--angle), var(--tw-gradient-stops));
        "
	/>
	<nav
		id="navbar"
		:class="`relative flex w-available h-16 justify-start items-center bg-slate-light-2 dark:bg-slate-dark-1 self-stretch z-10 sm:z-10 sm:!h-16 ${
			isPlatform('android') ? 'mt-0' : ''
		}`"
	>
		<!--    <button -->
		<!--        id="toggleSidebar" -->
		<!--        v-if="sidebar !== 'hidden'" -->
		<!--        @click="toggleSidebar" -->
		<!--        class="ml-2 flex h-12 w-12 items-center justify-center rounded-md transition-transform duration-200 border-1 border-auto-alpha-5 text-auto-alpha-11 sm:hidden"> -->
		<!--      <MoooomIcon v-if="sidebar === 'open'" icon="cross" class="w-6"/> -->
		<!--      <MoooomIcon v-else-if="sidebar === 'closed'" icon="menuBurger" class="w-6"/> -->
		<!--    </button> -->

		<div
			class="flex h-16 flex-1 flex-shrink-0 items-center justify-between self-stretch pr-6"
		>
			<div
				class="flex flex-shrink-0 flex-grow items-center justify-start gap-12 overflow-clip h-full"
			>
				<div
					class="relative flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 self-stretch px-1"
				>
					<RouterLink
						aria-label="Home"
						:to="`${currentServer ? '/home' : ''}`"
						class="relative -mr-6 my-1 flex w-48 flex-shrink-0 flex-grow-0 items-center justify-center gap-2 self-stretch px-1 pl-4 md:w-56"
					>
						<AppLogo class="h-10 w-auto" />
					</RouterLink>
				</div>
				<div
					class="hidden flex-shrink-0 flex-grow-0 items-center justify-start gap-1 md:!flex"
				>
					<NavbarButton
						v-if="shouldShowLibraryLinks"
						:href="`${currentServer ? '/home' : ''}`"
						:active="isHomeRoute"
						icon="home1"
						name="Home"
					/>

					<NavbarButton
						v-if="shouldShowLibraryLinks"
						href="/libraries"
						:active="isLibraryRoute"
						icon="folder"
						name="Libraries"
					/>

					<NavbarButton
						v-if="shouldShowLibraryLinks"
						href="/music/start"
						:active="isMusicRoute"
						icon="noteDouble"
						name="Music"
					/>
				</div>
			</div>

			<div
				v-if="user"
				class="flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2"
			>
				<div
					class="hidden flex-shrink-0 flex-grow-0 items-center justify-start gap-1 sm:flex"
				>
					<RouterLink
						:to="searchUrl"
						aria-label="Search"
						class="relative my-1 flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 overflow-hidden rounded-md text-auto-12 p-2.5 hover:bg-focus/10 focus:bg-auto-12/2"
					>
						<OptimizedIcon icon="searchMagnifyingGlass" class="w-6" />
					</RouterLink>
				</div>

				<MessagesMenu />
				<NotificationMenu />
				<ProfileMenu />
			</div>
		</div>
	</nav>
</template>
