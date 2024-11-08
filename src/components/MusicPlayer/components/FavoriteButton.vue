<script setup lang="ts">
import { PropType } from 'vue';

import type { DisplayList, Song } from '@/types/api/music/musicPlayer';
import type { StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import MusicButton from './MusicButton.vue';
import audioPlayer, {currentSong} from '@/store/audioPlayer';

const props = defineProps({
	data: {
		type: Object as PropType<Song|DisplayList>,
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
		type: String as PropType<'track'|'artist'|'album'>,
		required: false,
		default: 'track',
	},
});

const handleClick = (e?: MouseEvent) => {
	e?.stopPropagation();

	serverClient()
		.post<StatusResponse<string>>(`music/${props.data.type}/${props.data.id}/like`, {
			value: !props.data.favorite,
		})
		.then(({ data }) => {
			audioPlayer.value.setCurrentSong(currentSong.value);

			if (props.data.type === 'tracks') {
				// query.invalidateQueries(['music', `${type}s`, (props.data as any)[`${type}_track`]?.[0]?.id]);
				// query.invalidateQueries(['music', 'albums', props.data.id]);
			} else {
				// query.invalidateQueries(['music', props.data?.type, props.data.id]);
			}

			// showNotification({
			// 	title: translate(data.message, ...data.args ?? []),
			// 	type: TYPE.SUCCESS,
			// 	visibleOnly: true,
			// 	duration: 2000,
			// });
		});
};


</script>

<template>
    <MusicButton label="Favorite"
                 :onclick="handleClick"
                 :style="`--fill: ${color};`">
		<slot />

        <MoooomIcon icon="heart" class="h-7 w-7" v-if="data.favorite"
                  :class="className"
        />
    </MusicButton>
</template>
