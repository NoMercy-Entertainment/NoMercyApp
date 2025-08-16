<script setup lang="ts">
import type { PropType } from 'vue';

import type { DisplayList } from '@/types/api/music/musicPlayer';
import type { PlaylistItem } from '@/types/musicPlayer';
import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import MusicButton from './MusicButton.vue';
import audioPlayer, { currentSong } from '@/store/audioPlayer';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/stringArray.ts';

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
				summary: translate(data.message, ...data.args ?? []),
				detail: 'File Uploaded',
				life: 2000,
			});
		});
}
</script>

<template>
	<MusicButton
		label="Favorite"
		:onclick="handleClick"
		:style="`--fill: ${color};`"
	>
		<slot />

		<OptimizedIcon
			v-if="data.favorite"
			icon="heart"
			class="h-7 w-7"
			:class="className"
		/>
	</MusicButton>
</template>
