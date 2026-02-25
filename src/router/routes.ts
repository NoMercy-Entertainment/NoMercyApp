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
const DashboardRecommendations = () => import('@/views/Dashboard/Content/Recommendations');

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
	// All app routes share ONE layout instance so the layout is never remounted on navigation
	{
		path: '/',
		component: getBaseLayout,
		redirect: '/home',
		children: [
			// Base
			{
				path: 'home',
				name: 'Home',
				component: BaseIndex,
			},
			{
				path: 'search',
				name: 'Search',
				component: Search,
				meta: { type: 'all' },
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
						next({ path: firstLibrary.link });
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

			// Music
			{
				path: 'music',
				redirect: '/music/start',
			},
			{
				path: 'music/start',
				name: 'Music Start',
				component: MusicStart,
			},
			{
				path: 'music/artists',
				redirect: '/music/artists/_',
			},
			{
				path: 'music/artists/:letter',
				name: 'Artists',
				component: MusicCards,
				meta: { type: 'artists' },
			},
			{
				path: 'music/artist/:id',
				name: 'Artist',
				component: MusicArtist,
				meta: { type: 'artists' },
			},
			{
				path: 'music/albums',
				redirect: '/music/albums/_',
			},
			{
				path: 'music/albums/:letter',
				name: 'Albums',
				component: MusicCards,
				meta: { type: 'albums' },
			},
			{
				path: 'music/album/:id',
				name: 'Album',
				component: MusicList,
				meta: { type: 'albums' },
			},
			{
				path: 'music/genres',
				redirect: '/music/genres/letter/_',
			},
			{
				path: 'music/genres/letter/:letter',
				name: 'Music Genres',
				component: MusicCards,
				meta: { type: 'genres' },
			},
			{
				path: 'music/genres/:id',
				name: 'Music Genre',
				component: MusicList,
				meta: { type: 'genres' },
			},
			{
				path: 'music/playlists',
				name: 'Music Playlists',
				component: MusicCards,
				meta: { type: 'playlists' },
			},
			{
				path: 'music/playlists/:id',
				name: 'Music Playlist',
				component: MusicList,
				meta: { type: 'playlists' },
			},
			{
				path: 'music/tracks',
				name: 'Tracks',
				component: MusicList,
				meta: { type: 'tracks' },
			},

			// Dashboard
			{
				path: 'dashboard',
				redirect: '/dashboard/system',
			},
			{
				path: 'dashboard/system',
				name: 'System',
				component: DashboardSystem,
			},
			{
				path: 'dashboard/configuration',
				name: 'General',
				component: DashboardGeneral,
			},
			{
				path: 'dashboard/users',
				name: 'Users',
				component: DashboardUsers,
			},
			{
				path: 'dashboard/users/:id',
				name: 'Edit user',
				component: () => import('@/views/Dashboard/System/Users/Edit.vue'),
			},
			{
				path: 'dashboard/libraries',
				name: 'Dashboard Libraries',
				component: DashboardLibraries,
			},
			{
				path: 'dashboard/libraries/:id',
				name: 'Dashboard Library',
				component: () => import('@/views/Dashboard/System/Libraries/Edit.vue'),
			},
			{
				path: 'dashboard/specials',
				name: 'Dashboard Specials',
				component: DashboardSpecials,
			},
			{
				path: 'dashboard/specials/:id',
				name: 'Dashboard Special',
				component: () => import('@/views/Dashboard/Content/Specials/Edit.vue'),
			},
			{
				path: 'dashboard/recommendations/:type',
				name: 'Dashboard Recommendations',
				component: DashboardRecommendations,
			},
			{
				path: 'dashboard/recommendations/:type/:id',
				name: 'Dashboard Recommendation',
				component: () => import('@/views/Dashboard/Content/Recommendations/Detail.vue'),
			},
			{
				path: 'dashboard/devices',
				name: 'Devices',
				component: DashboardDevices,
			},
			{
				path: 'dashboard/devices/:id',
				name: 'Device',
				component: () => import('@/views/Dashboard/Devices/Devices/Show.vue'),
			},
			{
				path: 'dashboard/ripper',
				name: 'Ripper',
				component: DashboardRipper,
			},
			{
				path: 'dashboard/encoderprofiles',
				name: 'Encoder Profiles',
				component: DashboardEncoderProfiles,
			},
			{
				path: 'dashboard/encoderprofiles/:id',
				name: 'Encoder Profile',
				component: () => import('@/views/Dashboard/System/EncoderProfiles/Edit.vue'),
			},
			{
				path: 'dashboard/notifications',
				name: 'Notifications',
				component: DashboardNotifications,
			},
			{
				path: 'dashboard/notifications/:id',
				name: 'Notification',
				component: DashboardNotifications,
			},
			{
				path: 'dashboard/metadata',
				name: 'Metadata',
				component: DashboardMetadata,
			},
			{
				path: 'dashboard/activity',
				name: 'Activity',
				component: DashboardActivity,
			},
			{
				path: 'dashboard/dlna',
				name: 'DLNA',
				component: DashboardDlna,
			},
			{
				path: 'dashboard/logs',
				name: 'Logs',
				component: DashboardLogs,
			},
			{
				path: 'dashboard/plugins',
				name: 'Plugins',
				component: DashboardPlugins,
			},
			{
				path: 'dashboard/plugins/:id',
				name: 'Plugin',
				component: DashboardPlugins,
			},
			{
				path: 'dashboard/schedule',
				name: 'Scheduled Tasks',
				component: DashboardSchedule,
			},
			{
				path: 'dashboard/schedule/:id',
				name: 'Scheduled Task',
				component: DashboardSchedule,
			},

			// Preferences
			{
				path: 'preferences/display',
				name: 'Display',
				component: PreferencesDisplay,
			},
			{
				path: 'preferences/profile',
				name: 'Profile',
				component: PreferencesProfile,
			},
			{
				path: 'preferences/controls',
				name: 'Controls',
				component: PreferencesControls,
			},
			{
				path: 'preferences/subtitles',
				name: 'Subtitles',
				component: PreferencesSubtitles,
			},

			// Dev
			{
				path: 'dev/cast',
				name: 'Cast',
				component: DevCast,
			},
			{
				path: 'dev/download',
				name: 'Download',
				component: DevDownload,
			},

			// Setup
			{
				path: 'setup',
				redirect: '/setup/select-servers',
			},
			{
				path: 'setup/select-servers',
				name: 'Select Server',
				component: SetupSelectServer,
			},
			{
				path: 'setup/no-servers',
				name: 'No Servers',
				component: SetupNoServer,
			},
			{
				path: 'setup/server-offline',
				name: 'Server offline',
				component: SetupServerOffline,
			},
			{
				path: 'setup/post-install',
				name: 'Post Install',
				component: SetupPostInstall,
			},

			// Catch-all inside layout
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
		path: '/:catchAll(.*)*',
		component: NotFound,
		props: {
			message: 'Page not found',
			status: 404,
		},
	},
];

export default routes;
