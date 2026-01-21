<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { ScrollPanel } from 'primevue';

import type { Playlist } from '@/types/api/music/playlists';

import useServerClient from '@/lib/clients/useServerClient';

import sidebar, { closeSidebar, hideSidebar, openSidebar, toggleSidebar } from '@/store/sidebar';
import router from '@/router';

import SidebarButtonGroup from './SidebarButtonGroup.vue';
import SidebarButton from './SidebarButton.vue';
import libraries from '@/store/Libraries';
import { setMusicPlaylists } from '@/store/musicPlaylists';
import { useRoute } from 'vue-router';
import konamiEnabled from '@/store/konami';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

// const {data: libraries, refetch} = useServerClient<ServerLibrary[]>({
//   path: '/dashboard/libraries',
//   queryKey: ['libraries'],
// });

const route = useRoute();

const { data: playlists } = useServerClient<Playlist[]>({
	path: '/music/playlists',
	queryKey: ['music', 'playlists'],
});

watch(playlists, (value) => {
	if (!value)
		return;
	setMusicPlaylists(value);
});

const isHomeRoute = computed(() => {
	return route.path === '/home' || route.path.includes('watch');
});

const isLibraryRoute = computed(() => {
	return (
		route.path.startsWith('/libraries')
		|| route.path.startsWith('/genre')
		|| route.path.startsWith('/collection')
		|| route.path.startsWith('/specials')
		|| route.path.startsWith('/movie')
		|| route.path.startsWith('/tv')
		|| route.path.startsWith('/person')
	);
});

const isMusicRoute = computed(() => {
	return route.path.startsWith('/music');
});

const isDashboardRoute = computed(() => {
	return route.path.startsWith('/dashboard');
});

const isSetupRoute = computed(() => {
	return route.path.startsWith('/setup') || route.path.includes('search');
});

const isPreferencesRoute = computed(() => {
	return route.path.startsWith('/preferences') || route.path.startsWith('/dev');
});

function handleSidebar() {
	if (isHomeRoute.value || isSetupRoute.value) {
		hideSidebar();
	}
	else if (
		isLibraryRoute.value
		|| isMusicRoute.value
		|| isDashboardRoute.value
		|| isPreferencesRoute.value
	) {
		openSidebar();
	}
	else {
		closeSidebar();
	}
}

router.afterEach(() => {
	setTimeout(() => {
		handleSidebar();
	}, 250);
});

onMounted(() => {
	handleSidebar();
});

function libraryIconName(type: string) {
	switch (type) {
		case 'anime':
		case 'tv':
			return 'monitor';
		case 'movie':
			return 'movieClap';
	}
}
</script>

<template>
	<aside
		id="sidebar"
		:data-sidebar="sidebar"
		class="absolute top-0 bottom-0 left-0 flex sidebar-open:w-64 sidebar-closed:-translate-x-full sidebar-hidden:-translate-x-full items-start justify-start self-stretch overflow-x-visible transition-[transform,width] duration-200 sidebar h-available z-1099 group/aside sidebar-hidden:sm:w-0 sidebar-closed:sm:w-16 sidebar-closed:sm:translate-x-0 sidebar-hidden:sm:translate-x-0 sm:!relative max-h-available overflow-clip children:opacity-100 sidebar-hidden:children:opacity-0"
	>
		<div
			:data-sidebar="sidebar"
			class="flex sidebar-open:w-64 flex-grow flex-col items-start justify-start self-stretch overflow-clip h-available sidebar-hidden:sm:w-4 sidebar-closed:sm:w-20 sm:mt-4 overflow-x-hidden"
		>
			<ScrollPanel
				:dt="{
					bar: {
						background: 'rgb(var(--surface-1) / 60%)',
					},
				}"
				:inert="sidebar === 'hidden'"
				class="w-available h-available"
			>
				<div
					:data-sidebar="sidebar"
					class="flex flex-col items-start justify-start gap-1 self-stretch px-4 sidebar-closed:px-2 py-1"
				>
					<!--                    Base pages -->
					<template
						v-for="library in libraries?.filter?.((l) => l.type !== 'music')"
						:key="library.id"
					>
						<SidebarButton
							:href="library.link"
							:icon="libraryIconName(library.type)"
							:name="library.title"
							:show="isLibraryRoute"
						/>
					</template>
					<SidebarButton
						v-if="libraries?.some?.((l) => l.type === 'movie')"
						:show="isLibraryRoute"
						href="/collection"
						icon="collection1"
						name="Collections"
					/>
					<SidebarButton
						:show="isLibraryRoute"
						href="/specials"
						icon="sparkles"
						name="Specials"
					/>
					<SidebarButton
						v-if="libraries?.some?.((l) => l.type !== 'music')"
						:show="isLibraryRoute"
						href="/genre"
						icon="witchHat"
						name="Genres"
					/>
					<SidebarButton
						:show="isLibraryRoute"
						href="/person"
						icon="user"
						name="People"
					/>
					<!--                    End Base pages -->

					<!--                    Music pages -->
					<SidebarButton
						:show="isMusicRoute"
						href="/music/start"
						icon="speaker"
						name="Start"
					/>
					<SidebarButton
						:show="isMusicRoute"
						href="/music/artists"
						icon="user"
						name="Artists"
					/>
					<SidebarButton
						:show="isMusicRoute"
						href="/music/albums"
						icon="disk"
						name="Albums"
					/>
					<SidebarButton
						:show="isMusicRoute"
						href="/music/genres"
						icon="noteClefTreble"
						name="Genres"
					/>
					<SidebarButton
						:show="isMusicRoute"
						href="/music/tracks"
						icon="heart"
						name="Songs you like"
					/>

					<SidebarButtonGroup
						v-if="playlists?.length ?? 0 > 0"
						:show="isMusicRoute"
						icon="playlist1Add"
						title="Playlists"
					>
						<SidebarButton
							v-if="playlists?.length ?? 0 > 0"
							href="/music/playlists"
							name="Show all"
						/>

						<template v-for="playlist in playlists ?? []" :key="playlist.id">
							<SidebarButton
								:cover="playlist.cover"
								:href="`/music/playlists/${playlist.id}`"
								:name="playlist.name"
							/>
						</template>
					</SidebarButtonGroup>
					<!--                    End Music pages -->

					<!--                    Dashboard pages -->
					<SidebarButtonGroup :show="isDashboardRoute" title="System">
						<SidebarButton
							href="/dashboard/system"
							icon="gridMasonry"
							name="System info"
						/>
						<SidebarButton
							href="/dashboard/general"
							icon="settings"
							name="General"
						/>
						<SidebarButton href="/dashboard/users" icon="users" name="Users" />
						<SidebarButton
							href="/dashboard/libraries"
							icon="folder"
							name="Libraries"
						/>
						<SidebarButton
							href="/dashboard/encoderprofiles"
							icon="playCircle"
							name="Encoder profiles"
						/>
						<SidebarButton
							href="/dashboard/notifications"
							icon="bell"
							name="Notifications"
						/>
					</SidebarButtonGroup>
					<SidebarButtonGroup :show="isDashboardRoute" title="Content">
						<!--            <SidebarButton href="/dashboard/metadata" -->
						<!--                           icon="edit" name="Metadata"/> -->
						<SidebarButton
							href="/dashboard/specials"
							icon="sparkles"
							name="Specials"
						/>
						<SidebarButton href="/dashboard/ripper" icon="disk" name="Ripper" />
					</SidebarButtonGroup>
					<SidebarButtonGroup :show="isDashboardRoute" title="Devices">
						<SidebarButton
							href="/dashboard/devices"
							icon="monitor"
							name="Devices"
						/>
						<SidebarButton
							href="/dashboard/activity"
							icon="tag"
							name="Activity"
						/>
						<!--            <SidebarButton href="/dashboard/dlna" -->
						<!--                           icon="airPlay" name="DLNA"/> -->
					</SidebarButtonGroup>
					<SidebarButtonGroup :show="isDashboardRoute" title="Advanced">
						<SidebarButton
							href="/dashboard/logs"
							icon="terminalBox"
							name="Logs"
						/>
						<!--            <SidebarButton href="/dashboard/plugins" -->
						<!--                           icon="shoppingCart" -->
						<!--                           name="Plugins"/> -->
						<!--            <SidebarButton href="/dashboard/schedule" -->
						<!--                           icon="timeFast1" -->
						<!--                           name="Scheduled Tasks"/> -->
					</SidebarButtonGroup>
					<!--                    End Dashboard pages -->

					<!--                    Preferences pages -->
					<SidebarButton
						:show="isPreferencesRoute"
						href="/preferences/display"
						icon="tv"
						name="Display"
					/>
					<SidebarButton
						:show="isPreferencesRoute"
						href="/preferences/profile"
						icon="userEdit"
						name="Profile"
					/>
					<SidebarButton
						:show="isPreferencesRoute"
						href="/preferences/subtitles"
						icon="closedCaption"
						name="Subtitles"
					/>
					<!--          <SidebarButton href="/preferences/controls" -->
					<!--                         icon="keyboard" -->
					<!--                         :show="isPreferencesRoute" -->
					<!--                         name="Controls"/> -->
					<!--                    end Preferences pages -->

					<SidebarButton
						:show="isPreferencesRoute && konamiEnabled"
						href="/dev/cast"
						icon="chromecast"
						name="ChromeCast"
					/>
					<SidebarButton
						:show="isPreferencesRoute && konamiEnabled"
						href="/dev/download"
						icon="cloudDownload"
						name="Download"
					/>
					<SidebarButton
						:show="isPreferencesRoute && konamiEnabled"
						href="/dev/notfound"
						icon="eye"
						name="Not Found"
					/>
				</div>
			</ScrollPanel>
		</div>
		<button
			v-if="sidebar !== 'hidden'"
			:aria-label="sidebar === 'open' ? $t('Close sidebar') : $t('Open sidebar')"
			:data-sidebar="sidebar"
			class="bg-surface-5 dark:bg-surface-5 border-slate-10 dark:border-slate-10 flex absolute bottom-[30px] overflow-hidden z-1099 duration-200 w-8 h-8 p-1.5 rounded-md shadow justify-center items-center gap-2 border border-surface-7 sidebar-open:left-60 sidebar-closed:left-12 !opacity-[0.1%] group-hover/aside:!opacity-100 focus:!opacity-100"
			style="box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05)"
			@click="toggleSidebar()"
		>
			<MoooomIcon
				:data-sidebar="sidebar"
				class-name="rotate-0 sidebar-closed:rotate-180"
				icon="chevronLeft"
			/>
		</button>
	</aside>
</template>
