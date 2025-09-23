<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import type { MoooomIcons } from '@Icons/icons.ts';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	type: {
		type: Object as PropType<{
			name: string;
			value: string;
		}>,
		required: true,
	},
	selected: {
		type: Boolean,
		default: false,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
});

const icon = computed<keyof typeof MoooomIcons>(() => {
	let string: keyof typeof MoooomIcons = 'nomercy';

	switch (props.type?.value) {
		case 'music':
			string = 'noteDouble';
			break;
		case 'tv':
			string = 'tv';
			break;
		case 'image':
			string = 'picture';
			break;
		case 'movie':
			string = 'film';
			break;
		default:
			string = 'nomercy';
	}

	return string;
});
</script>

<template>
	<div :class="{
			'bg-white/11 dark:bg-black/8 outline outline-2 outline-focus hover:bg-focus/[0.15]': selected,
			'hover:bg-focus/[0.15]': !selected,
		}"
		class="flex justify-start items-start flex-grow gap-1 px-2 py-4 rounded-xl"
	>
		<div class="flex flex-col justify-start items-center flex-grow gap-4">
			<div
				class="flex justify-start items-start flex-grow-0 flex-shrink-0 relative gap-2 rounded-lg"
			>
				<MoooomIcon :class-name="className" :icon="icon" />
			</div>
			<div
				class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-0.5"
			>
				<div
					class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-1.5"
				>
					<p
						class="flex-grow w-full text-base font-medium text-center"
					>
						{{ type.name }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
