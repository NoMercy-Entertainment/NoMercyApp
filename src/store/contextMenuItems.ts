import { computed, ref } from 'vue';
import type { MenuItem } from 'primevue/menuitem';
import type { ContextMenuMethods } from 'primevue';
import type { MoooomIcons } from '@Icons/icons';
import serverClient from '@/lib/clients/serverClient';
import type { AxiosResponse } from 'axios';
import type { PlaylistItem } from '@/types/musicPlayer';
import router from '@/router';
import { copyToClipboard } from '@/lib/utils/string';
import { t } from 'i18next';
import { musicPlaylist } from '@/store/musicPlaylists';
import { currentServer } from '@/store/currentServer';
import { testUserToken } from '@/store/user';
import { queryClient } from '@/config/tanstack-query.ts';
import type { StatusResponse } from '@/types/api/base/library';
import audioPlayer from '@/store/audioPlayer.ts';
import { Share } from '@capacitor/share';
import type { ModalData } from '@/types';

export interface TrackRowRouteInfo {
	isAlbumRoute: boolean;
	isArtistRoute: boolean;
	isPlaylistsRoute: boolean;
	routeParamId: string;
}

export interface ContextMenuItem {
	label?: string;
	title?: string;
	icon?: `mooooom-${keyof typeof MoooomIcons}`;
	command?: string | (() => unknown);
	method?: string;
	confirm?: string;
	args?: { [arg: string]: unknown };
	separator?: boolean;
	items?: ContextMenuItem[];
}

const getRequest = (url: string, _data: unknown) => serverClient().get(url);
function putRequest(url: string, data: unknown) {
	return serverClient().put(url, { data });
}
function postRequest(url: string, data: unknown) {
	return serverClient().post(url, { data });
}
function deleteRequest(url: string, data: unknown) {
	return serverClient().delete(url, { data });
}
function patchRequest(url: string, data: unknown) {
	return serverClient().patch(url, { data });
}

export function makeContextMenu(items: ContextMenuItem[]): (MenuItem & { icon?: `mooooom-${keyof typeof MoooomIcons}` })[] {
	return items.map((item) => {
		let cmd: (
			url: string,
			data: unknown
		) => Promise<AxiosResponse<unknown, unknown>>;
		if (item.method === 'GET') {
			cmd = getRequest;
		}
		else if (item.method === 'PUT') {
			cmd = putRequest;
		}
		else if (item.method === 'POST') {
			cmd = postRequest;
		}
		else if (item.method === 'PATCH') {
			cmd = patchRequest;
		}
		else if (item.method === 'DELETE') {
			cmd = deleteRequest;
		}
		else {
			cmd = item.command as () => Promise<AxiosResponse<unknown, unknown>>;
		}

		return {
			label: item.title,
			icon: item.icon,
			confirm: item.confirm,
			args: item.args,
			// eslint-disable-next-line ts/no-use-before-define
			command: () => cmd(item.args?.url as string, contextMenuContext.value).then(() => {
				if (item.args?.replaceKey) {
					document.dispatchEvent(new CustomEvent('mutateId', { detail: { id: item.args?.replaceKey } }));
				}
			}).catch((err: unknown) => {
				console.error('Context menu command failed:', err);
			}),
		};
	});
}

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

export function setContextMenuContext(context: { [arg: string]: unknown | unknown[] } | null): void {
	cmc.value = context;
}

export function clearContextMenuContext() {
	cmc.value = null;
}

export const trackContextMenuItems = ref<ContextMenuItem[]>([]);

export const cardMenu = ref();

export const selectedTrackRow = ref<PlaylistItem>();

export function onTrackRowRightClick(event: Event, routeInfo: TrackRowRouteInfo, data: PlaylistItem) {
	selectedTrackRow.value = data;

	const isAlbumRoute = routeInfo.isAlbumRoute;
	const isArtistRoute = routeInfo.isArtistRoute;
	const isPlaylistsRoute = routeInfo.isPlaylistsRoute;

	const menuItems: ContextMenuItem[] = [];

	const addToPlaylistItem: ContextMenuItem = {
		label: t('Add to playlist'),
		icon: 'mooooom-add',
		items: [
			{
				label: t('New playlist'),
				icon: 'mooooom-add',
				command: () => {
					const evt = new CustomEvent('showModal', {
						detail: {
							modalName: 'createPlaylist',
							modalTitle: 'Add to new playlist',
							modalProps: selectedTrackRow.value,
						} satisfies ModalData<PlaylistItem | undefined>,
					});
					document.dispatchEvent(evt);
				},
			},
		],
	};

	if (musicPlaylist.value.length === 0) {
		addToPlaylistItem.items!.push({
			label: t('No playlists'),
		});
	}

	for (const playlist of musicPlaylist.value) {
		if (isPlaylistsRoute && routeInfo.routeParamId === playlist.id)
			continue;

		addToPlaylistItem.items!.push({
			label: playlist.name,
			icon: 'mooooom-playlist1Add',
			args: {
				disabled: isPlaylistsRoute && routeInfo.routeParamId === playlist.id,
			},
			command: () => {
				serverClient()
					.post(`/music/playlists/${playlist.id}/tracks`, {
						id: selectedTrackRow.value?.id,
					})
					.then(() => {
						queryClient
							.invalidateQueries({ queryKey: ['music', 'tracks'] })
							.then(() => {
								console.log('refetching tracks');
							});
					})
					.catch((err) => {
						console.error(err);
					});
			},
		});
	}

	menuItems.push(addToPlaylistItem);

	if (isPlaylistsRoute) {
		menuItems.push({
			label: t('Remove from playlist'),
			icon: 'mooooom-remove',
			command: () => {
				serverClient()
					.delete(`/music/playlists/${routeInfo.routeParamId}/tracks/${selectedTrackRow.value?.id}`)
					.then(() => {
						queryClient
							.invalidateQueries({ queryKey: ['music', 'tracks'] })
							.then(() => {
								console.log('refetching tracks');
							});
					})
					.catch((err) => {
						console.error(err);
					});
			},
		});
	}

	menuItems.push(
		{
			label: t('Save to your liked songs'),
			icon: 'mooooom-heart',
			command: async () => {
				await serverClient()
					.post<StatusResponse<string>>(`${selectedTrackRow.value?.link}/like`, {
						value: !selectedTrackRow.value?.liked.value,
					})
					.then(({ data }) => {
						if (selectedTrackRow.value) {
							selectedTrackRow.value.value = data.args?.[0] === 'liked' || data.args?.[1] === 'liked';
						}
					});
			},
		},
		{
			label: t('Add to queue'),
			icon: 'mooooom-currentPlaylist',
			command: () => {
				if (selectedTrackRow.value) {
					if (audioPlayer.currentSong === null) {
						console.log('playing track');
						audioPlayer.playTrack(selectedTrackRow.value);
						return;
					}
					console.log('adding track to queue');
					audioPlayer.addToQueue(selectedTrackRow.value);
				}
			},
		},
		{
			separator: true,
		},
	);

	if (
		!isAlbumRoute
		&& selectedTrackRow.value?.album_track
		&& selectedTrackRow.value?.album_track?.length < 2
	) {
		menuItems.push({
			label: t('Go to album'),
			icon: 'mooooom-disk',
			command: async () => {
				if (selectedTrackRow.value?.album_track?.[0]?.link) {
					await router.push(selectedTrackRow.value?.album_track?.[0]?.link);
				}
			},
		});
	}
	else if (
		!isAlbumRoute
		&& selectedTrackRow.value?.album_track
		&& selectedTrackRow.value?.album_track?.length > 1
	) {
		menuItems.push({
			label: t('Go to album'),
			icon: 'mooooom-disk',
			items: selectedTrackRow.value?.album_track?.map((artist) => {
				return {
					label: artist.name,
					icon: 'mooooom-disk',
					command: async () => await router.push(artist.link),
				};
			}),
		});
	}

	if (
		!isArtistRoute
		&& selectedTrackRow.value?.artist_track
		&& selectedTrackRow.value?.artist_track?.length < 2
	) {
		menuItems.push({
			label: t('Go to artist'),
			icon: 'mooooom-user',
			command: async () => {
				if (selectedTrackRow.value?.artist_track?.[0]?.link) {
					await router.push(selectedTrackRow.value?.artist_track?.[0]?.link);
				}
			},
		});
	}
	else if (
		!isArtistRoute
		&& selectedTrackRow.value?.artist_track
		&& selectedTrackRow.value?.artist_track?.length > 1
	) {
		menuItems.push({
			label: t('Go to artist'),
			icon: 'mooooom-user',
			items: selectedTrackRow.value?.artist_track?.map((artist) => {
				return {
					label: artist.name,
					icon: 'mooooom-user',
					command: async () => await router.push(artist.link),
				};
			}),
		});
	}

	menuItems.push(
		{
			separator: true,
		},
		{
			label: t('Share'),
			icon: 'mooooom-shareSquare',
			items: [
				{
					label: t('Copy page link'),
					icon: 'mooooom-fileCopy',
					command: async () => await copyToClipboard(window.location.href),
				},
				{
					label: t('Copy track link'),
					icon: 'mooooom-fileCopy',
					command: () =>
						selectedTrackRow.value
							? copyToClipboard(`${currentServer.value?.serverBaseUrl}${selectedTrackRow.value?.link}?token=${testUserToken.value}`)
							: {},
				},
				{
					label: t('Share page'),
					icon: 'mooooom-fileCopy',
					command: async () => {
						const shareData = {
							url: window.location.href,
						};
						await Share.share(shareData);
					},
				},
			],
		},
	);

	trackContextMenuItems.value = menuItems;

	cardMenu.value.show(event);
}
