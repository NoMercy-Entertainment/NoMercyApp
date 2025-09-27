<script lang="ts" setup>
import type { PropType } from 'vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';
import type { PlaylistItem } from '@/types/musicPlayer';
import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';

import audioPlayer, { currentSong } from '@/store/audioPlayer';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/stringArray.ts';

import MusicButton from './MusicButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	data: {
		type: Object as PropType<PlaylistItem | DisplayList>,
		required: true,
	},
	className: {
		type: String as PropType<string>,
		required: false,
		default: '',
	},
	color: {
		type: String as PropType<string>,
		required: false,
	},
	type: {
		type: String as PropType<'track' | 'artist' | 'album'>,
		required: false,
		default: 'track',
	},
	noBackground: {
		type: Boolean as PropType<boolean>,
		required: false,
		default: false,
	},
});

const toast = useToast();

function handleClick(e?: MouseEvent) {
	e?.stopPropagation();

	serverClient()
		.post<StatusResponse<string>>(
			`music/${props.data.type}/${props.data.id}/like`,
			{
				value: !props.data.favorite,
			},
		)
		.then(({ data }) => {
			audioPlayer.setCurrentSong(currentSong.value);

			if (props.data.type === 'tracks') {
				// query.invalidateQueries(['music', `${type}s`, (props.data as any)[`${type}_track`]?.[0]?.id]);
				// query.invalidateQueries(['music', 'albums', props.data.id]);
			}
			else {
				// query.invalidateQueries(['music', props.data?.type, props.data.id]);
			}

			toast.add({
				severity: 'success',
				summary: translate('Success'),
				detail: translate(data.message, ...data.args ?? []),
				life: 5000,
			});
		});
}
</script>

<template>
	<MusicButton
		:class="{
			'!bg-transparent hover:bg-transparent': noBackground,
		}"
		:onclick="handleClick"
		:style="`--fill: ${color};`"
		label="Favorite"
	>
		<slot />

		<MoooomIcon
			v-if="data.favorite"
			:class="className"
			class="h-7 w-7"
			icon="heart"
		/>
	</MusicButton>
</template>
