import type { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteRecordRaw } from 'vue-router';
import { computed } from 'vue';
import { isMobile, isTv, tvModeOverride } from '@/config/global';

import MobileBaseLayout from '@/Layout/Mobile/BaseLayout.vue';
import TvBaseLayout from '@/Layout/Tv/BaseLayout.vue';
import DesktopBaseLayout from '@/Layout/Desktop/BaseLayout.vue';

import BaseCollection from '@/views/Base/Collection';
import AuthView from '@/views/AuthView';
import Logout from '@/views/Logout.vue';

import BaseIndex from '@/views/Base/Home';
import BaseInfo from '@/views/Base/Info';
import BaseLibraries from '@/views/Base/Libraries';
import BaseLibrary from '@/views/Base/Library';
import PaginatedLibrary from '@/views/Base/PaginatedLibrary';
import BasePerson from '@/views/Base/Person';
import Search from '@/views/Search';
import BaseWatch from '@/views/Base/Watch';

import MusicArtist from '@/views/Music/Artist';
import MusicCards from '@/views/Music/Cards';
import MusicList from '@/views/Music/List';
import MusicStart from '@/views/Music/Start';

import DashboardLogs from '@/views/Dashboard/Advanced/Logs';
import DashboardPlugins from '@/views/Dashboard/Advanced/Plugins';
import DashboardSchedule from '@/views/Dashboard/Advanced/Schedule';

import DashboardMetadata from '@/views/Dashboard/Content/Metadata';
import DashboardRipper from '@/views/Dashboard/Content/Ripper';
import DashboardSpecials from '@/views/Dashboard/Content/Specials';

import DashboardActivity from '@/views/Dashboard/Devices/Activity';
import DashboardDevices from '@/views/Dashboard/Devices/Devices';
import DashboardDlna from '@/views/Dashboard/Devices/Dlna';

import DashboardEncoderProfiles from '@/views/Dashboard/System/EncoderProfiles';

import DashboardGeneral from '../views/Dashboard/System/General';

import DashboardLibraries from '@/views/Dashboard/System/Libraries';

import DashboardNotifications from '@/views/Dashboard/System/Notifications';
import DashboardSystem from '@/views/Dashboard/System/System';

import DashboardUsers from '@/views/Dashboard/System/Users';

import PreferencesControls from '@/views/Preferences/Controls';
import PreferencesDisplay from '@/views/Preferences/Display';
import PreferencesProfile from '@/views/Preferences/Profile';
import PreferencesSubtitles from '@/views/Preferences/Subtitles';

import DevCast from '@/views/Dev/Cast';
import DevDownload from '@/views/Dev/Download';

// import SetupPostInstall from '@/views/Setup/PostInstall';
import SetupSelectServer from '@/views/Setup/SelectServers';
import SetupNoServer from '@/views/Setup/NoServers';
import SetupServerOffline from '@/views/Setup/ServerOffline';

import NotFound from '@/views/NotFound';
import libraries from '@/store/Libraries';

const baseLayout = computed(() => {
	if (isTv.value || tvModeOverride.value) {
		return TvBaseLayout;
	}
	else if (isMobile.value) {
		return MobileBaseLayout;
	}
	else {
		return DesktopBaseLayout;
	}
});

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/',
		component: baseLayout.value,
		children: [
			{
				path: '',
				redirect: '/home',
			},
			{
				path: 'home',
				name: 'Home',
				component: BaseIndex,
			},
			{
				path: 'search',
				name: 'Search',
				component: Search,
				props: {
					type: 'all',
				},
			},
			{
				path: 'libraries',
				name: 'Libraries',
				component: BaseLibraries,
				beforeEnter: (_: RouteLocationNormalizedGeneric, __: RouteLocationNormalizedGeneric, next: NavigationGuardNext) => {
					const firstLibrary = libraries.value.at(0);
					if (firstLibrary && !isMobile.value && !isTv.value) {
						next({
							name: 'Library',
							params: {
								id: firstLibrary.link.replace('/', ''),
							},
						});
					}
					else {
						next();
					}
				},
			},
			{
				path: 'libraries/:id/letter/:letter',
				name: 'Library paginated',
				strict: true,
				component: BaseLibrary,
			},
			{
				path: 'libraries/:id',
				name: 'Library',
				strict: true,
				component: BaseLibrary,
			},
			{
				path: 'specials',
				name: 'Specials',
				component: BaseLibrary,
			},
			{
				path: 'specials/:id',
				name: 'Special',
				component: BaseCollection,
			},
			{
				path: 'genre',
				name: 'Genres',
				component: BaseLibrary,
			},
			{
				path: 'genre/:id',
				name: 'Genre',
				component: BaseLibrary,
			},
			{
				path: 'collection',
				name: 'Collections',
				component: BaseLibrary,
			},
			{
				path: 'collection/:id',
				name: 'Collection',
				component: BaseCollection,
			},
			{
				path: 'person',
				name: 'People',
				component: PaginatedLibrary,
			},
			{
				path: 'person/:id',
				name: 'Person',
				component: BasePerson,
			},
			{
				path: 'movie/:id',
				name: 'Movie',
				component: BaseInfo,
			},
			{
				path: 'tv/:id',
				name: 'TV Show',
				component: BaseInfo,
			},
			{
				path: ':type/:id/watch',
				name: 'Watch',
				component: BaseWatch,
			},
			{
				path: ':catchAll(.*)*',
				component: NotFound,
				props: {
					message: 'Page not found',
					status: 404,
				},
			},
		],
	},
	{
		path: '/music',
		component: baseLayout.value,
		children: [
			{
				path: 'music',
				redirect: '/music/start',
			},
			{
				path: 'start',
				name: 'Music Start',
				component: MusicStart,
			},
			{
				path: 'artists',
				redirect: '/music/artists/_',
			},
			{
				path: 'artists/:letter',
				name: 'Artists',
				component: MusicCards,
				props: {
					type: 'artists',
				},
			},
			{
				path: 'artist/:id',
				name: 'Artist',
				component: MusicArtist,
			},
			{
				path: 'albums',
				redirect: '/music/albums/_',
			},
			{
				path: 'albums/:letter',
				name: 'Albums',
				component: MusicCards,
				props: {
					type: 'albums',
				},
			},
			{
				path: 'album/:id',
				name: 'Album',
				component: MusicList,
			},
			{
				path: 'genres',
				name: 'Music Genres',
				component: MusicCards,
				props: {
					type: 'genres',
				},
			},
			{
				path: 'genres/:id',
				name: 'Music Genre',
				component: MusicCards,
			},
			{
				path: 'playlists',
				name: 'Music Playlists',
				component: MusicCards,
				props: {
					type: 'playlists',
				},
			},
			{
				path: 'playlists/:id',
				name: 'Music Playlist',
				component: MusicList,
				props: {
					type: 'playlists',
				},
			},
			{
				path: 'tracks',
				name: 'Tracks',
				component: MusicList,
				props: {
					type: 'tracks',
				},
			},
		],
	},
	{
		path: '/dashboard',
		component: baseLayout.value,
		children: [
			{
				path: 'dashboard',
				name: 'System',
				redirect: '/dashboard/system',
			},
			{
				path: 'system',
				name: 'System',
				component: DashboardSystem,
			},
			{
				path: 'general',
				name: 'General',
				component: DashboardGeneral,
			},
			{
				path: 'users',
				name: 'Users',
				component: DashboardUsers,
			},
			{
				path: 'users/:id',
				name: 'Edit user',
				component: () => import('@/views/Dashboard/System/Users/Edit.vue'),
			},
			{
				path: 'libraries',
				name: 'Dashboard Libraries',
				component: DashboardLibraries,
			},
			{
				path: 'libraries/:id',
				name: 'Dashboard Library',
				component: () => import('@/views/Dashboard/System/Libraries/Edit.vue'),
			},
			{
				path: 'specials',
				name: 'Dashboard Specials',
				component: DashboardSpecials,
			},
			{
				path: 'specials/:id',
				name: 'Dashboard Special',
				component: () => import('@/views/Dashboard/Content/Specials/Edit.vue'),
			},
			{
				path: 'devices',
				name: 'Devices',
				component: DashboardDevices,
			},
			{
				path: 'devices/:id',
				name: 'Device',
				component: () => import('@/views/Dashboard/Devices/Devices/Show.vue'),
			},
			{
				path: 'ripper',
				name: 'Ripper',
				component: DashboardRipper,
			},
			{
				path: 'encoderprofiles',
				name: 'Encoder Profiles',
				component: DashboardEncoderProfiles,
			},
			{
				path: 'encoderprofiles/:id',
				name: 'Encoder Profile',
				component: () => import('@/views/Dashboard/System/EncoderProfiles/Edit.vue'),
			},
			{
				path: 'notifications',
				name: 'Notifications',
				component: DashboardNotifications,
			},
			{
				path: 'notifications/:id',
				name: 'Notification',
				component: DashboardNotifications,
			},
			{
				path: 'metadata',
				name: 'Metadata',
				component: DashboardMetadata,
			},
			{
				path: 'activity',
				name: 'Activity',
				component: DashboardActivity,
			},
			{
				path: 'dlna',
				name: 'DLNA',
				component: DashboardDlna,
			},
			{
				path: 'logs',
				name: 'Logs',
				component: DashboardLogs,
			},
			{
				path: 'plugins',
				name: 'Plugins',
				component: DashboardPlugins,
			},
			{
				path: 'plugins/:id',
				name: 'Plugin',
				component: DashboardPlugins,
			},
			{
				path: 'schedule',
				name: 'Scheduled Tasks',
				component: DashboardSchedule,
			},
			{
				path: 'schedule/:id',
				name: 'Scheduled Task',
				component: DashboardSchedule,
			},
		],
	},
	{
		path: '/preferences',
		component: baseLayout.value,
		children: [
			{
				path: 'display',
				name: 'Display',
				component: PreferencesDisplay,
			},
			{
				path: 'profile',
				name: 'Profile',
				component: PreferencesProfile,
			},
			{
				path: 'controls',
				name: 'Controls',
				component: PreferencesControls,
			},
			{
				path: 'subtitles',
				name: 'Subtitles',
				component: PreferencesSubtitles,
			},
		],
	},
	{
		path: '/dev',
		component: baseLayout.value,
		children: [
			{
				path: 'cast',
				name: 'Cast',
				component: DevCast,
			},
			{
				path: 'download',
				name: 'Download',
				component: DevDownload,
			},
		],
	},
	{
		path: '/setup',
		component: baseLayout.value,
		children: [
			{
				path: 'setup',
				redirect: 'setup/select-servers',
			},
			{
				path: 'select-servers',
				name: 'Select Server',
				component: SetupSelectServer,
			},
			{
				path: 'no-servers',
				name: 'No Servers',
				component: SetupNoServer,
			},
			{
				path: 'server-offline',
				name: 'Server offline',
				component: SetupServerOffline,
			},
		],
	},
	{
		path: '/auth',
		name: 'Auth',
		component: AuthView,
		meta: {
			public: true,
			bypassSetup: true,
		},
	},
	{
		path: '/logout',
		name: 'Logout',
		component: Logout,
		meta: {
			public: true,
			bypassSetup: true,
		},
	},
];

export default routes;
