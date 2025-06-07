import { computed, ref } from 'vue';
import { MenuItem } from 'primevue/menuitem';
import { ContextMenuMethods } from 'primevue';
import type { MoooomIcons } from '@Icons/icons';
import serverClient from '@/lib/clients/serverClient';
import type { AxiosResponse } from 'axios';
import type { PlaylistItem } from '@/types/musicPlayer';
import router from '@/router';
import { copyToClipboard } from '@/lib/stringArray';
import { isAlbumRoute, isArtistRoute } from '@/store/routeState';
import { t } from 'i18next';
import { musicPlaylist } from '@/store/musicPlaylists';
import { currentServer } from '@/store/currentServer';
import { testUserToken } from '@/store/user';

export interface ContextMenuItem {
	label?: string;
	icon?: `mooooom-${keyof typeof MoooomIcons}`;
	command?: string | (() => any);
	method?: string;
	confirm?: string;
	args?: { [arg: string]: any };
	separator?: boolean;
	items?: ContextMenuItem[];
}

const getRequest = (url: string, data: any) => serverClient().get(url);
const putRequest = (url: string, data: any) => serverClient().put(url, { data });
const postRequest = (url: string, data: any) => serverClient().post(url, { data });
const deleteRequest = (url: string, data: any) => serverClient().delete(url, { data });
const patchRequest = (url: string, data: any) => serverClient().patch(url, { data });

export const makeContextMenu = (items: ContextMenuItem[]): (MenuItem & { icon?: `mooooom-${keyof typeof MoooomIcons}` })[] => {
	return items.map((item) => {

		let cmd: (url: string, data: any) => Promise<AxiosResponse<unknown, unknown>>;
		if (item.method === 'GET') {
			cmd = getRequest;
		} else if (item.method === 'PUT') {
			cmd = putRequest;
		} else if (item.method === 'POST') {
			cmd = postRequest;
		} else if (item.method === 'PATCH') {
			cmd = patchRequest;
		} else if (item.method === 'DELETE') {
			cmd = deleteRequest;
		}
		else {
			cmd = item.command as () => any;
		}

		return {
			label: item.label,
			icon: item.icon,
			confirm: item.confirm,
			command: () => cmd(item.args?.url, contextMenuContext.value),
		};
	});
};

export const contextMenu = ref<ContextMenuMethods>(<ContextMenuMethods>{});
const cmi = ref<MenuItem[] | undefined>();
export const contextMenuItems = computed(() => cmi.value);

export function setContextMenu(items: MenuItem[]) {
	cmi.value = items;
}

export function clearContextMenu() {
	cmi.value = undefined;
}

const cmc = ref<{ [arg: string]: unknown | unknown[] } | null>(null);
export const contextMenuContext = computed(() => cmc.value);

export function setContextMenuContext(context: any) {
	cmc.value = context;
}

export function clearContextMenuContext() {
	cmc.value = null;
}

export const trackContextMenuItems = ref<ContextMenuItem[]>([]);

export const cardMenu = ref();

export const selectedTrackRow = ref<PlaylistItem>();

export const onTrackRowRightClick = (event: Event, data: PlaylistItem) => {
	selectedTrackRow.value = data;

	const menuItems: ContextMenuItem[] = [];

	const addToPlaylistItem: ContextMenuItem = {
		label: t('Add to playlist'),
		icon: 'mooooom-add',
		items: [
			{
				label: t('New Playlist'),
				icon: 'mooooom-add',
				command: () => {
					alert(selectedTrackRow.value?.id);
				}
			},
		]
	};

	if (musicPlaylist.value.length == 0) {
		addToPlaylistItem.items!.push({
			label: t('No playlist available'),
			icon: 'mooooom-pause'
		});
	}

	for (const playlist of musicPlaylist.value) {
		addToPlaylistItem.items!.push({
			label: playlist.name,
			icon: 'mooooom-disk',
			command: () => {
				alert(selectedTrackRow.value?.id);
			}
		});
	}

	menuItems.push(addToPlaylistItem);

	menuItems.push({
		label: t('Save to your liked songs'),
		icon: 'mooooom-heart',
		command: () => {
			alert(selectedTrackRow.value?.id);
		}
	},
		{
			label: t('Add to queue'),
			icon: 'mooooom-playlist1Add',
			command: () => {
				alert(selectedTrackRow.value?.id);
			}
		},
		{
			separator: true
		},
	);

	if (!isAlbumRoute.value && selectedTrackRow.value?.album_track && selectedTrackRow.value?.album_track?.length < 2) {
		menuItems.push({
			label: t('Go to album'),
			icon: 'mooooom-disk',
			command: () => {
				if (selectedTrackRow.value?.album_track?.[0]?.link) {
					router.push(selectedTrackRow.value?.album_track?.[0]?.link);
				}
			}
		});
	} else if (!isAlbumRoute.value && selectedTrackRow.value?.album_track && selectedTrackRow.value?.album_track?.length > 1) {
		menuItems.push({
			label: t('Go to album'),
			icon: 'mooooom-disk',
			items: selectedTrackRow.value?.album_track?.map((artist) => {
				return {
					label: artist.name,
					icon: 'mooooom-disk',
					command: () => router.push(artist.link)
				};
			})
		});
	}

	if (!isArtistRoute.value && selectedTrackRow.value?.artist_track && selectedTrackRow.value?.artist_track?.length < 2) {
		menuItems.push({
			label: t('Go to artist'),
			icon: 'mooooom-user',
			command: () => {
				if (selectedTrackRow.value?.artist_track?.[0]?.link) {
					router.push(selectedTrackRow.value?.artist_track?.[0]?.link);
				}
			}
		});
	} else if (!isArtistRoute.value && selectedTrackRow.value?.artist_track && selectedTrackRow.value?.artist_track?.length > 1) {
		menuItems.push({
			label: t('Go to artist'),
			icon: 'mooooom-user',
			items: selectedTrackRow.value?.artist_track?.map((artist) => {
				return {
					label: artist.name,
					icon: 'mooooom-user',
					command: () => router.push(artist.link)
				};
			})
		});
	}

	menuItems.push({
		separator: true
	},
		{
			label: t('Share'),
			icon: 'mooooom-shareSquare',
			items: [
				{
					label: t('Copy page link'),
					icon: 'mooooom-fileCopy',
					command: () => copyToClipboard(window.location.href)
				},
				{
					label: t('Copy track link'),
					icon: 'mooooom-fileCopy',
					command: () => selectedTrackRow.value
						? copyToClipboard(`${currentServer.value?.serverBaseUrl}/${selectedTrackRow.value?.folder_id}${selectedTrackRow.value?.folder}${selectedTrackRow.value?.filename}?token=${testUserToken.value}`)
						: {}
				},
			]
		});

	trackContextMenuItems.value = menuItems;

	cardMenu.value.show(event);
};

