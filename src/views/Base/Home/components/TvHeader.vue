<script lang="ts" setup>
import type { PropType } from 'vue';

import type { ContinueWatching, HomeItem } from '@/types/api/base/home';

// import ContentRating from '@/components/Images/ContentRating.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';

defineProps({
	selected: {
		type: Object as PropType<ContinueWatching | HomeItem | null>,
		required: false,
	},
});
</script>

<template>
	<div
		:key="selected?.id"
		class="w-full h-full absolute left-0 top-0 bg-[#131314]"
	>
		<div
			class="w-available h-auto absolute left-[250px] top-0 overflow-hidden bg-black aspect-video"
		>
			<TMDBImage
				:alt="selected?.title"
				:path="selected?.backdrop"
				:size="540"
				class="w-available h-available absolute left-[-0.39px] top-[-0.39px] object-cover"
			/>
			<div
				class="w-available h-available absolute left-[-0.39px] top-[-0.39px]"
			/>
			<div
				class="w-[150vw] h-[150vw] absolute left-[-30%] bottom-[-50%]"
				style="
          background: radial-gradient(
            closest-side,
            rgba(19, 19, 20, 0.1) 0%,
            rgba(19, 19, 20, 1) 70.73974609375%
          );
        "
			/>
		</div>
		<div
			class="flex flex-col justify-start items-start w-[484px] relative left-[58px] top-20 gap-7"
		>
			<div
				class="flex flex-col justify-start items-start self-stretch relative gap-5"
			>
				<div
					class="flex flex-col justify-start items-start w-full relative gap-0"
				>
					<p class="self-stretch w-full text-xl text-left mt-2">
						{{ selected?.title }}
					</p>
				</div>
				<div class="line-clamp-4 text-sm -mt-4">
					{{ selected?.overview }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
