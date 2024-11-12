import {NavigationGuardNext, RouteLocationNormalizedGeneric, RouteRecordRaw} from 'vue-router';
import {computed} from 'vue';
import {isMobile, isTv} from '@/config/global';

import MobileLayout from '@/Layout/Mobile/BaseLayout.vue';
import TvLayout from '@/Layout/Tv/BaseLayout.vue';
import DesktopLayout from '@/Layout/Desktop/BaseLayout.vue';

import BaseCollection from '@/views/Base/Collection';
import BaseIndex from '@/views/Base/Home';
import BaseInfo from '@/views/Base/Info';
import BaseLibraries from '@/views/Base/Libraries';
import BaseLibrary from '@/views/Base/Library';
import BasePerson from '@/views/Base/Person';
import BaseSearch from '@/views/Base/Search';
import BaseWatch from '@/views/Base/Watch';
import MusicArtist from '@/views/Music/Artist';
import MusicCards from '@/views/Music/Cards';
import MusicList from '@/views/Music/List';
import MusicSearch from '@/views/Music/Search';
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

// import SetupPostInstall from '@/views/Setup/PostInstall';
import SetupSelectServers from '@/views/Setup/SelectServers';

import NotFound from '@/views/NotFound';
import libraries from '@/store/Libraries';

const layout = computed(() => {
	if (isMobile.value) {
		return MobileLayout;
	} else if (isTv.value) {
		return TvLayout;
	} else {
		return DesktopLayout;
	}
});

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		redirect: '/home'
	},
	{
		path: '/',
		component: layout.value,
		children: [
			{
				path: '',
				redirect: '/home'
			},
			{
				path: 'home',
				name: 'Home',
				component: BaseIndex
			},
			{
				path: 'search',
				name: 'Search',
				component: BaseSearch,
				props: {
					type: 'all'
				}
			},
			{
				path: 'libraries',
				name: 'Libraries',
				component: BaseLibraries,
				beforeEnter: (_: RouteLocationNormalizedGeneric, __: RouteLocationNormalizedGeneric, next: NavigationGuardNext) => {
					const firstLibrary = libraries.value.at(0);
					if (firstLibrary && !isMobile.value) {
						next({
							name: 'Library',
							params: {
								id: firstLibrary.id
							}
						});
					} else {
						next();
					}
				}
			},
			{
				path: 'libraries/:id',
				name: 'Library',
				component: BaseLibrary
			},
			{
				path: 'specials',
				name: 'Specials',
				component: BaseLibrary,
			},
			{
				path: 'specials/:id',
				name: 'Special',
				component: BaseCollection
			},
			{
				path: 'genres',
				name: 'Genres',
				component: BaseLibrary,
			},
			{
				path: 'genres/:id',
				name: 'Genre',
				component: BaseLibrary
			},
			{
				path: 'collection',
				name: 'Collections',
				component: BaseLibrary,
			},
			{
				path: 'collection/:id',
				name: 'Collection',
				component: BaseCollection
			},
			{
				path: 'person',
				name: 'People',
				component: BaseLibrary,
			},
			{
				path: 'person/:id',
				name: 'Person',
				component: BasePerson
			},
			{
				path: 'movie/:id',
				name: 'Movie',
				component: BaseInfo
			},
			{
				path: 'tv/:id',
				name: 'TV Show',
				component: BaseInfo
			},
			{
				path: ':type/:id/watch',
				name: 'Watch',
				component: BaseWatch,
			},
			{
				path: 'music',
				redirect: '/music/start'
			},
			{
				path: 'music/start',
				name: 'Music Start',
				component: MusicStart
			},
			{
				path: 'music/artists',
				name: 'Artists',
				component: MusicCards,
				props: {
					type: 'artists'
				},
			},
			{
				path: 'music/artists/:id',
				name: 'Artist',
				component: MusicArtist,
				props: {
					type: 'artists'
				},
			},
			{
				path: 'music/albums',
				name: 'Albums',
				component: MusicCards,
				props: {
					type: 'albums'
				},
			},
			{
				path: 'music/albums/:id',
				name: 'Album',
				component: MusicList,
				props: {
					type: 'albums'
				},
			},
			{
				path: 'music/genres',
				name: 'Music Genres',
				component: MusicCards,
				props: {
					type: 'genres'
				},
			},
			{
				path: 'music/genres/:id',
				name: 'Music Genre',
				component: MusicCards
			},
			{
				path: 'music/playlists',
				name: 'Music Playlists',
				component: MusicCards,
				props: {
					type: 'playlists'
				},
			},
			{
				path: 'music/playlists/:id',
				name: 'Music Playlist',
				component: MusicList,
			},
			{
				path: 'music/tracks',
				name: 'Tracks',
				component: MusicList,
				props: {
					type: 'tracks'
				},
			},
			{
				path: 'music/search',
				name: 'Music Search',
				component: MusicSearch,
				props: {
					type: 'music'
				}
			},
			{
				path: 'dashboard',
				name: 'System',
				redirect: '/dashboard/system'
			},
			{
				path: 'dashboard/system',
				name: 'System',
				component: DashboardSystem,
			},
			{
				path: 'dashboard/general',
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
				name: 'User',
				component: DashboardUsers
			},
			{
				path: 'dashboard/libraries',
				name: 'Dashboard Libraries',
				component: DashboardLibraries,
			},
			{
				path: 'dashboard/libraries/:id',
				name: 'Dashboard Library',
				component: DashboardLibraries
			},
			{
				path: 'dashboard/specials',
				name: 'Dashboard Specials',
				component: DashboardSpecials,
			},
			{
				path: 'dashboard/specials/:id',
				name: 'Dashboard Special',
				component: DashboardSpecials
			},
			{
				path: 'dashboard/devices',
				name: 'Devices',
				component: DashboardDevices,
			},
			{
				path: 'dashboard/devices/:id',
				name: 'Device',
				component: DashboardDevices
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
				component: DashboardEncoderProfiles
			},
			{
				path: 'dashboard/notifications',
				name: 'Notifications',
				component: DashboardNotifications,
			},
			{
				path: 'dashboard/notifications/:id',
				name: 'Notification',
				component: DashboardNotifications
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
				component: DashboardPlugins
			},
			{
				path: 'dashboard/schedule',
				name: 'Scheduled Tasks',
				component: DashboardSchedule,
			},
			{
				path: 'dashboard/schedule/:id',
				name: 'Scheduled Task',
				component: DashboardSchedule
			},

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

			{
				path: 'setup',
				redirect: 'setup/select-servers'
			},
			{
				path: 'setup/select-servers',
				name: 'Select Servers',
				component: SetupSelectServers,
			},
			{
				path: ':catchAll(.*)*',
				component: NotFound,
				props: {
					message: 'Page not found',
					status: 404,
				}
			},
		]
	},
];

export default routes;
