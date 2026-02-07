import type { NavigationGuardNext, RouteLocationNormalizedGeneric, RouteRecordRaw } from 'vue-router';
import { isMobile } from '@/config/global';
import libraries from '@/store/libraries';

// Lazy load layouts - wrapped in functions so they only load when needed
const MobileBaseLayout = () => import('@/Layout/Mobile/BaseLayout.vue');
const DesktopBaseLayout = () => import('@/Layout/Desktop/BaseLayout.vue');

// Lazy load base views
const BaseCollection = () => import('@/views/Base/Collection');
const AuthView = () => import('@/views/AuthView');
const Logout = () => import('@/views/Logout.vue');

const BaseIndex = () => import('@/views/Base/Home');
const BaseInfo = () => import('@/views/Base/Info');
const BaseLibraries = () => import('@/views/Base/Libraries');
const BaseLibrary = () => import('@/views/Base/Library');
const PaginatedLibrary = () => import('@/views/Base/PaginatedLibrary');
const BasePerson = () => import('@/views/Base/Person');
const Search = () => import('@/views/Search');
const BaseWatch = () => import('@/views/Base/Watch');

// Lazy load music views (only when needed)
const MusicArtist = () => import('@/views/Music/Artist');
const MusicCards = () => import('@/views/Music/Cards');
const MusicList = () => import('@/views/Music/List');
const MusicStart = () => import('@/views/Music/Start');

// Lazy load dashboard views (heavy admin components)
const DashboardLogs = () => import('@/views/Dashboard/Advanced/Logs');
const DashboardPlugins = () => import('@/views/Dashboard/Advanced/Plugins');
const DashboardSchedule = () => import('@/views/Dashboard/Advanced/Schedule');

const DashboardMetadata = () => import('@/views/Dashboard/Content/Metadata');
const DashboardRipper = () => import('@/views/Dashboard/Content/Ripper');
const DashboardSpecials = () => import('@/views/Dashboard/Content/Specials');

const DashboardActivity = () => import('@/views/Dashboard/Devices/Activity');
const DashboardDevices = () => import('@/views/Dashboard/Devices/Devices');
const DashboardDlna = () => import('@/views/Dashboard/Devices/Dlna');

function DashboardEncoderProfiles() {
	return import('@/views/Dashboard/System/EncoderProfiles');
}
const DashboardGeneral = () => import('@/views/Dashboard/System/General');
const DashboardLibraries = () => import('@/views/Dashboard/System/Libraries');
function DashboardNotifications() {
	return import('@/views/Dashboard/System/Notifications');
}
const DashboardSystem = () => import('@/views/Dashboard/System/System');
const DashboardUsers = () => import('@/views/Dashboard/System/Users');

// Lazy load preferences views
const PreferencesControls = () => import('@/views/Preferences/Controls');
const PreferencesDisplay = () => import('@/views/Preferences/Display');
const PreferencesProfile = () => import('@/views/Preferences/Profile');
const PreferencesSubtitles = () => import('@/views/Preferences/Subtitles');

// Lazy load dev views
const DevCast = () => import('@/views/Dev/Cast');
const DevDownload = () => import('@/views/Dev/Download');

// Lazy load setup views
const SetupSelectServer = () => import('@/views/Setup/SelectServers');
const SetupNoServer = () => import('@/views/Setup/NoServers');
const SetupServerOffline = () => import('@/views/Setup/ServerOffline');
const SetupPostInstall = () => import('@/views/Setup/PostInstall');

const NotFound = () => import('@/views/NotFound');

function getBaseLayout() {
	if (isMobile.value) {
		return MobileBaseLayout();
	}
	return DesktopBaseLayout();
}

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/home',
	},
	{
		path: '/',
		component: getBaseLayout,
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
				meta: {
					type: 'all',
				},
			},
			{
				path: 'libraries',
				name: 'Libraries',
				component: BaseLibraries,
				beforeEnter: (
					_: RouteLocationNormalizedGeneric,
					__: RouteLocationNormalizedGeneric,
					next: NavigationGuardNext,
				) => {
					const firstLibrary = libraries.value.at(0);
					if (firstLibrary && !isMobile.value) {
						next({
							path: firstLibrary.link,
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
		],
	},
	{
		path: '/music',
		component: getBaseLayout,
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
				meta: {
					type: 'artists',
				},
			},
			{
				path: 'artist/:id',
				name: 'Artist',
				component: MusicArtist,
				meta: {
					type: 'artists',
				},
			},
			{
				path: 'albums',
				redirect: '/music/albums/_',
			},
			{
				path: 'albums/:letter',
				name: 'Albums',
				component: MusicCards,
				meta: {
					type: 'albums',
				},
			},
			{
				path: 'album/:id',
				name: 'Album',
				component: MusicList,
				meta: {
					type: 'albums',
				},
			},
			{
				path: 'genres',
				redirect: '/music/genres/letter/_',
			},
			{
				path: 'genres/letter/:letter',
				name: 'Music Genres',
				component: MusicCards,
				meta: {
					type: 'genres',
				},
			},
			{
				path: 'genres/:id',
				name: 'Music Genre',
				component: MusicList,
				meta: {
					type: 'genres',
				},
			},
			{
				path: 'playlists',
				name: 'Music Playlists',
				component: MusicCards,
				meta: {
					type: 'playlists',
				},
			},
			{
				path: 'playlists/:id',
				name: 'Music Playlist',
				component: MusicList,
				meta: {
					type: 'playlists',
				},
			},
			{
				path: 'tracks',
				name: 'Tracks',
				component: MusicList,
				meta: {
					type: 'tracks',
				},
			},
		],
	},
	{
		path: '/dashboard',
		component: getBaseLayout,
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
				component: () =>
					import('@/views/Dashboard/System/EncoderProfiles/Edit.vue'),
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
		component: getBaseLayout,
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
		component: getBaseLayout,
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
		component: getBaseLayout,
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
			{
				path: 'post-install',
				name: 'Post Install',
				component: SetupPostInstall,
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
	{
		path: '/:catchAll(.*)*',
		component: NotFound,
		meta: {
			message: 'Page not found',
			status: 404,
		},
	},
];

export default routes;
