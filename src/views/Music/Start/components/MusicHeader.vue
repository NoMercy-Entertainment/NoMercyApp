<script setup lang="ts">
import { onMounted, watch } from 'vue';
import type { PropType } from 'vue';

import type { HomeDataItem } from '@/types/api/music';

import { breakTitle2 } from '@/lib/stringArray';
import { focusColor, setColorPalette } from '@/store/ui';
import { currentServer } from '@/store/currentServer';

const props = defineProps({
	selected: {
		type: Object as PropType<HomeDataItem | null>,
		required: false,
	},
});

onMounted(() => {
	setColorPalette(props.selected?.color_palette?.cover);
});

watch(props, (value) => {
	setColorPalette(value.selected?.color_palette?.cover);
});
</script>

<template>
	<div
		:key="selected?.id"
		class="w-full h-full absolute left-0 top-0 bg-[#131314]"
		:style="focusColor ? `--color-focus: ${focusColor}` : ''"
	>
		<div
			class="w-available h-available absolute left-[202px] top-0 overflow-hidden bg-focus"
		>
			<img
				class="w-available h-available absolute left-[-0.39px] top-[-0.39px] opacity-40 object-cover object-center"
				:src="`${currentServer?.serverBaseUrl}${selected?.cover}`"
				alt=""
			>
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
					class="flex flex-col justify-start items-start w-full relative gap-0 mt-8"
				>
					<p
						v-if="selected?.name"
						class="self-stretch flex-grow-0 flex-shrink-0 w-full text-3xl font-bold text-left z-10"
						v-html="breakTitle2(selected?.name ?? ' ', 'text-lg line-clamp-2')"
					/>

					<div
						class="flex items-center h-8 gap-2 self-stretch w-full opacity-60 text-xs font-medium text-left text-[#c4c7c5]"
					>
						<span v-if="selected?.type" class="flex gap-2">
							<span>{{ selected?.type.replace(/s$/u, "").toTitleCase() }}</span>
						</span>

						<span v-if="selected?.tracks" class="flex gap-2">
							<span>•</span>
							<span>{{ selected?.tracks }} {{ $t("tracks") }}</span>
						</span>
					</div>
				</div>
				<div class="line-clamp-4 text-sm -mt-4">
					{{ selected?.description }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
