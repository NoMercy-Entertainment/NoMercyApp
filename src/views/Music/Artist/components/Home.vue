<script setup lang="ts">
import {PropType} from "vue";

import type {ArtistResponse} from "@/types/api/music/artist";

import TrackCard from "./TrackCard.vue";
import Tab from "./Tab.vue";
import TabFrame from "./TabFrame.vue";

defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
	displayType: {
		type: String as PropType<'list' | 'card'>,
		required: true,
		default: 'list',
	},
	activeTab:{
		type: String,
		required: true,
	}
});

const tabs = [
	{
		name: 'list',
	},
	{
		name: 'card',
	},
]


</script>

<template>
	<div class="flex flex-1 basis-0 items-start justify-start gap-8 self-stretch p-8">
		<TabFrame :data="data" :activeTab="activeTab">
			<Tab :isActive="displayType === tabs[0].name">
				<TrackCard title="Your most played" :data="data.favorite_tracks ?? []"/>
				<TrackCard title="All songs" :data="data.tracks ?? []"/>
			</Tab>
			<Tab :isActive="displayType === tabs[1].name">

			</Tab>
		</TabFrame>
	</div>
</template>
