<script lang="ts" setup>
import SpriteIcon from '@/components/Images/icons/SpriteIcon.vue';
import type { PropType } from 'vue';
import type { PersonResponseItem } from '@/types/api/base/person';

defineProps({
	data: {
		type: Object as PropType<PersonResponseItem>,
		required: true,
	},
});
</script>

<template>
	<div
		v-if="data?.external_ids"
		class="flex flex-col gap-1 justify-center items-start w-available"
	>
		<p class="text-xs font-bold uppercase text-surface-10">
			{{ $t("Links") }}
		</p>
		<div class="flex flex-row flex-wrap w-available items-center gap-2 -mx-2">
			<a
				:href="`https://www.themoviedb.org/person/${data?.id}`"
				aria-label="TMDB"
				class="relative flex items-center justify-center overflow-hidden h-9 p-1.5 px-2"
				target="_blank"
			>
				<SpriteIcon class="!w-12" icon="tmdb" />
			</a>
			<a
				v-if="data?.external_ids?.facebook_id"
				:href="`https://www.facebook.com/${data?.external_ids.facebook_id}`"
				aria-label="Facebook"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="facebook" />
			</a>
			<a
				v-if="data?.external_ids?.twitter_id"
				:href="`https://twitter.com/${data?.external_ids?.twitter_id}`"
				aria-label="Twitter"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="twitter" />
			</a>
			<a
				v-if="data?.external_ids?.instagram_id"
				:href="`https://instagram.com/${data?.external_ids?.instagram_id}`"
				aria-label="Instagram"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="instagram" />
			</a>
			<a
				v-if="data?.external_ids?.youtube_id"
				:href="`https://youtube.com/channel/${data?.external_ids?.youtube_id}`"
				aria-label="YouTube"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="youtube" />
			</a>
			<a
				v-if="data?.external_ids?.tiktok_id"
				:href="`https://tiktok.com/@${data?.external_ids?.tiktok_id}`"
				aria-label="TikTok"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="tiktok" />
			</a>
			<a
				v-if="data?.external_ids?.imdb_id"
				:href="`https://www.imdb.com/name/${data?.external_ids?.imdb_id}`"
				aria-label="IMDb"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="imdb" />
			</a>
			<a
				v-if="data?.external_ids?.wikidata_id"
				:href="`https://www.wikidata.org/wiki/${data?.external_ids?.wikidata_id}`"
				aria-label="Wikidata"
				class="relative flex items-center justify-center overflow-hidden p-1.5"
				target="_blank"
			>
				<SpriteIcon class="w-6" icon="wikipedia" />
			</a>
		</div>
	</div>
	<div
		class="self-stretch h-px bg-[#05294d]/[0.08] dark:bg-[#e2f0fd]/[0.08]"
	/>
</template>

<style scoped></style>
