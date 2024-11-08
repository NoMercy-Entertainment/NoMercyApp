import {RouteRecordRaw} from 'vue-router';
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

import MusicAlbum from '@/views/Music/Album';
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
		]
	},
	{
		path: '/music',
		component: layout.value,
		children: [
			{
				path: '',
				redirect: '/music/start'
			},
			{
				path: 'start',
				name: 'Music Start',
				component: MusicStart
			},
			{
				path: 'artists',
				name: 'Artists',
				component: MusicCards,
				props:{
					type: 'artists'
				},
			},
			{
				path: 'artists/:id',
				name: 'Artist',
				component: MusicArtist
			},
			{
				path: 'albums',
				name: 'Albums',
				component: MusicCards,
				props:{
					type: 'albums'
				},
			},
			{
				path: 'albums/:id',
				name: 'Album',
				component: MusicAlbum
			},
			{
				path: 'genres',
				name: 'Music Genres',
				component: MusicCards,
				props:{
					type: 'genres'
				},
			},
			{
				path: 'genres/:id',
				name: 'Genre',
				component: MusicCards
			},
			{
				path: 'playlists',
				name: 'Music Playlists',
				component: MusicCards,
				props:{
					type: 'playlists'
				},
			},
			{
				path: 'playlists/:id',
				name: 'Music Playlist',
				component: MusicList,
			},
			{
				path: 'tracks',
				name: 'Tracks',
				component: MusicList,
				props:{
					type: 'tracks'
				},
			},
			{
				path: 'search',
				name: 'Music Search',
				component: MusicSearch,
				props: {
					type: 'music'
				}
			}
		],
	},
	{
		path: '/dashboard',
		component: layout.value,
		children: [
			{
				path: '',
				name: 'System',
				redirect: '/dashboard/system'
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
				name: 'User',
				component: DashboardUsers
			},
			{
				path: 'libraries',
				name: 'Dashboard Libraries',
				component: DashboardLibraries,
			},
			{
				path: 'libraries/:id',
				name: 'Dashboard Library',
				component: DashboardLibraries
			},
			{
				path: 'specials',
				name: 'Dashboard Specials',
				component: DashboardSpecials,
			},
			{
				path: 'specials/:id',
				name: 'Dashboard Special',
				component: DashboardSpecials
			},
			{
				path: 'devices',
				name: 'Devices',
				component: DashboardDevices,
			},
			{
				path: 'devices/:id',
				name: 'Device',
				component: DashboardDevices
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
				component: DashboardEncoderProfiles
			},
			{
				path: 'notifications',
				name: 'Notifications',
				component: DashboardNotifications,
			},
			{
				path: 'notifications/:id',
				name: 'Notification',
				component: DashboardNotifications
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
				component: DashboardPlugins
			},
			{
				path: 'schedule',
				name: 'Scheduled Tasks',
				component: DashboardSchedule,
			},
			{
				path: 'schedule/:id',
				name: 'Scheduled Task',
				component: DashboardSchedule
			},
		],
	},
	{
		path: '/preferences',
		component: layout.value,
		children: [
			{
				path: '',
				redirect: '/preferences/display'
			},
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
		path: '/setup',
		component: layout.value,
		children: [
			{
				path: '',
				redirect: 'setup/select-servers'
			},
			{
				path: 'select-servers',
				name: 'Select Servers',
				component: SetupSelectServers,
			},
		],
	},
	{
		path: '/:catchAll(.*)*',
		component: NotFound,
		props: {
			message: 'Page not found',
			status: 404,
		}
	},
];

export default routes;
