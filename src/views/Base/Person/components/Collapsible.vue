<script setup lang="ts">
import { IonSkeletonText } from '@ionic/vue';

import { ref } from 'vue';

defineProps({
	text: {
		type: String,
		required: false,
	},
	maxLines: {
		type: Number,
		default: 3,
	},
});

const showMore = ref(false);
</script>

<template>
	<div
		v-if="text"
		class="flex flex-col relative justify-start items-start self-stretch gap-1"
	>
		<p
			ref="overview"
			class="self-stretch relative w-inherit text-sm leading-5 font-medium text-left min-h-[3.5rem] transition-all duration-200 overflow-hidden text-pretty whitespace-pre"
			:class="{
				[`max-h-[3.5rem] h-[3.5rem] line-clamp-3`]:
					(text?.length ?? 0) > 180 && !showMore,
				[`max-h-available h-auto line-clamp-none after:content-['']`]: showMore,
				[`-webkit-line-clamp: ${maxLines};`]: true,
			}"
		>
			{{ text?.replace(/(\w{2,})\.\s/gu, "$1.\n") ?? "&nbsp;" }}
		</p>
		<div
			v-if="(text?.length ?? 0) > 180"
			class="flex flex-col justify-center items-center h-5 relative overflow-hidden gap-2"
		>
			<button
				class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left underline underline-offset-2"
				@click="showMore = !showMore"
			>
				<span v-if="!showMore">{{ $t("Read more") }}</span>
				<span v-else>{{ $t("Read less") }}</span>
			</button>
		</div>
	</div>
	<IonSkeletonText
		v-else
		:animated="true"
		class="h-[4.55rem] will-change-auto"
	/>
	<div
		class="self-stretch h-px bg-[#05294d]/[0.08] dark:bg-[#e2f0fd]/[0.08]"
	/>
</template>

<style scoped></style>
