<script lang="ts" setup>
import { computed } from 'vue';
import BannerButton from '@/components/Buttons/BannerButton.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps<{
	link: string;
	data?: any;
	endTime?: string | null;
	hasWatched?: boolean;
	isMobile?: boolean;
	onToggleWatched?: () => void;
	onFocus?: () => void;
}>();

const playIcon = computed(() => props.isMobile ? 'playCircle' : 'playbackSpeed');
const infoIcon = computed(() => props.isMobile ? 'add' : 'infoCircle');
</script>

<template>
	<!-- Desktop Actions -->
	<div v-if="!isMobile" class="flex gap-4">
		<BannerButton
			:href="`${link}/watch`"
			class="group/play relative"
			title="Play"
			@focus="onFocus"
		>
			<MoooomIcon class="w-7" :icon="playIcon" />
			<div
				v-if="endTime"
				class="absolute top-3 grid h-0 w-max origin-bottom group-hover/play:grid-cols-1 items-center gap-1 rounded-md duration-200 bg-surface-1 grid-cols-[0fr] group-hover/play:h-[32.77px] left-[-31px] group-hover/play:top-[-38px] overflow-clip"
			>
				<p class="text-xs font-bold px-2.5 py-0.5">
					{{ $t("Ends at") }} {{ endTime }}
				</p>
			</div>
		</BannerButton>

		<BannerButton
			:onclick="onToggleWatched"
			title="Toggle seen"
			@focus="onFocus"
		>
			<MoooomIcon
				:stroke="hasWatched ? 'var(--color-green-600)' : 'currentColor'"
				class="w-7"
				icon="check"
			/>
		</BannerButton>

		<MediaLikeButton
			v-if="data"
			:data="data"
			type="video"
			@focus="onFocus"
		/>

		<BannerButton
			:href="link"
			title="Info"
			@focus="onFocus"
		>
			<MoooomIcon class="w-7" icon="infoCircle" />
		</BannerButton>
	</div>

	<!-- Mobile Actions -->
	<div v-else class="flex w-full gap-4">
		<RouterLink
			:aria-label="$t('Watch')"
			:to="`${link}/watch`"
			class="flex h-10 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-4 text-black bg-white"
			@focus="onFocus"
		>
			<MoooomIcon class-name="w-5" icon="playCircle" />
			<span class="text-center font-medium">{{ $t("Watch") }}</span>
		</RouterLink>

		<RouterLink
			:aria-label="$t('Details')"
			:to="link"
			class="flex h-10 flex-1 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-4 text-white bg-black"
			@focus="onFocus"
		>
			<MoooomIcon class-name="w-5" icon="infoCircle" />
			<span class="text-center font-medium">{{ $t("Details") }}</span>
		</RouterLink>
	</div>
</template>
