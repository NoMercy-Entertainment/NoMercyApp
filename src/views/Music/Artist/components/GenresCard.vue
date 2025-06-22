<script lang="ts" setup>
import type { PropType } from 'vue';

import type { ArtistResponse } from '@/types/api/music/artist';

import { pickPaletteColor, tooDark } from '@/lib/colorHelper';
import { colorPalette } from '@/store/ui';

defineProps({
	data: {
		type: Object as PropType<ArtistResponse>,
		required: true,
	},
});
</script>

<template>
	<div class="inline-flex w-auto flex-wrap items-start justify-start gap-2">
		<template v-for="genre in data.genres">
			<RouterLink
				:to="genre?.link"
				class="flex items-center justify-start rounded-2xl py-1 px-1.5 bg-focus/10"
			>
				<div class="flex items-center justify-start gap-2 px-2">
					<div
						class="text-center text-sm font-medium leading-tight"
						:class="`${
							tooDark(pickPaletteColor(colorPalette), 100)
								? 'text-shite/12'
								: 'text-black/12'
						}`"
					>
						{{ $t(genre.name) }}
					</div>
				</div>
			</RouterLink>
		</template>
	</div>
</template>
