<script lang="ts" setup>
import {PropType, ref} from 'vue';

import {InvalidateQueryFilters, useQueryClient} from '@tanstack/vue-query';

import type {InfoResponse} from '@/types/api/base/info';
import type {DisplayList, Song} from "@/types/api/music/musicPlayer";
import type {Collection, CollectionResponse} from "@/types/api/base/collection";
import type {ContinueWatching, HomeItem} from "@/types/api/base/home";
import type {LibraryResponse, StatusResponse} from '@/types/api/base/library';
import type {ArtistResponse} from '@/types/api/music/artist';

import router from '@/router';

import serverClient from '@/lib/clients/serverClient';

import BannerButton from '@/components/Buttons/BannerButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';


const props = defineProps({
	data: {
		type: Object as PropType<LibraryResponse | InfoResponse | HomeItem | ContinueWatching | Collection | Song | DisplayList | CollectionResponse | ArtistResponse | undefined>,
		required: true,
	},
	color: {
		type: String,
		required: false,
		default: 'var(--color-green-500)',
	},
	className: {
		type: String,
		required: false,
	},
	type: {
		type: String,
		required: false,
	}
});

const query = useQueryClient();

const liked = ref(props.data?.favorite);

const queryKey = (): InvalidateQueryFilters => {
	const props2: string[] = [];

	router.currentRoute.value.fullPath?.split('/').slice(1).forEach(p => {
		if (p.includes('?')) {
			props2.push(p.split('?')[0]);
			props2.push(p.split('?')[1].split('=')[1]);
		} else {
			props2.push(p);
		}
	});

	return props2 as InvalidateQueryFilters;
};

const handleLike = (e: Event) => {
	e.stopPropagation();
	serverClient()
		.post<StatusResponse<string>>(`/${props.data?.media_type ?? props.type}/${props.data?.id}/like`, {
			value: !liked.value,
		})
		.then(({data}) => {
			liked.value = data.args?.[0] == 'liked';
			// showNotification({
			// 	title: translate(data.message, ...data.args ?? []),
			// 	type: data.status == 'ok'
			// 		? TYPE.SUCCESS
			// 		: TYPE.ERROR,
			// 	visibleOnly: true,
			// 	duration: 2000,
			// });

			query.invalidateQueries(queryKey());
		});
};

</script>

<template>
	<BannerButton :onclick="handleLike" title="Favorite">
		<MoooomIcon v-if="liked" icon="heart" :class="className"
								:style="`--fill-color: rgb(var(--color-focus, var(--color-red-8))); color: rgb(var(--color-focus, var(--color-red-8)));`"/>
		<MoooomIcon v-else icon="heart" :class="className"/>
	</BannerButton>
</template>
