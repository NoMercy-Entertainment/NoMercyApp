<script lang="ts" setup>
import type { PlaylistItem } from '@/types/musicPlayer';
import { stopPropagation } from '@/lib/utils/dom';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';

defineProps<{
	song: PlaylistItem;
	onClick?: () => void;
}>();
</script>

<template>
	<div
		:class="onClick ? 'cursor-pointer hover:bg-surface-10/50' : ''"
		class="flex h-auto w-full items-center justify-start gap-2 rounded-lg p-2"
		@click="onClick"
	>
		<figure class="relative aspect-square h-auto w-14 overflow-hidden rounded-md text-focus">
			<CoverImage v-if="song" :data="song" />
		</figure>

		<div class="relative flex flex-col items-start justify-start gap-1">
			<p class="w-full flex-shrink-0 font-semibold self-stretch-0 text-left">
				{{ song?.name }}
			</p>

			<div
				class="mb-1 inline-flex h-6 gap-1 overflow-hidden whitespace-nowrap text-xs w-available line-clamp-1 hover-animate-pause"
			>
				<div class="-ml-1 w-available" data-marquee="container">
					<div
						class="ml-1 flex w-fit flex-nowrap gap-1 text-xs line-clamp-1 whitespace-break-spaces hover-animate-pause w-available h-available"
						data-marquee="scroller"
					>
						<span class="flex w-fit flex-wrap gap-1 whitespace-wrap line-clamp-2 h-inherit">
							<RouterLink
								:to="song?.artist_track?.[0]?.link ?? '#'"
								class="flex gap-1 whitespace-nowrap text-xs font-semibold line-clamp-2 h-inherit hover:underline focus:underline dark:font-medium"
								tabindex="0"
								@click="stopPropagation($event)"
							>
								<span class="flex items-center gap-1 leading-none line-clamp-2">
									{{ song?.artist_track?.[0]?.name }}
								</span>
							</RouterLink>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
