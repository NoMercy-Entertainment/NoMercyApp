<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';

import router from '@/router';
import { sidebar } from '@/store/sidebar';

import type { MoooomIcons } from '@Icons/icons';
import Button from 'primevue/button';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';

const props = defineProps({
	name: {
		type: String,
		required: true,
	},
	href: {
		type: String,
		required: true,
	},
	show: {
		type: Boolean,
		required: false,
		default: true,
	},
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: false,
	},
	image: {
		type: String,
		required: false,
	},
	cover: {
		required: false,
	},
});

const { t } = useTranslation();
const route = useRoute();

const tooltipConfig = computed(() => ({
	value: t(props.name),
	disabled: sidebar.value === 'open',
}));

const classes = computed(() => {
	return route.fullPath === props.href
		? 'current-route bg-focus/11 border-focus/4'
		: '';
});

const styles = computed(() =>
	route.fullPath === props.href
		? {
				background:
              'radial-gradient(50% 50% at 50% 100%, rgba(70, 70, 70, 0.09) 0%, rgba(70, 70, 70, 0.06) 40%, rgba(70, 70, 70, 0.00) 100%), linear-gradient(180deg, rgba(70, 70, 70, 0.00) 0%, rgba(70, 70, 70, 0.12) 100%), gba(from var(--color-theme-8) / 60%))',
				backgroundBlendMode: 'normal, overlay, normal',
			}
		: {},
);

let removeAfterEach: (() => void) | null = null;

function handleClick() {
	if (removeAfterEach)
		removeAfterEach();
	removeAfterEach = router.afterEach(() => {
		removeAfterEach?.();
		removeAfterEach = null;
		setTimeout(() => {
			document.querySelector<HTMLButtonElement>('main a, main button')?.focus();
		}, 150);
	});
}
</script>

<template>
	<Button
		v-if="show"
		v-tooltip.right="tooltipConfig"
		:aria-label="$t(name)"
		:class="classes"
		:style="styles"
		:to="href"
		:unstyled="true"
		as="RouterLink"
		class="flex justify-start items-center self-stretch h-11 min-w-11 relative gap-2 px-2.5 py-2 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-200 overflow-clip"
		@click="handleClick"
	>
		<MoooomIcon v-if="!!icon" :icon="icon!" class="" />
		<CoverImage
			v-else-if="!!cover"
			:data="{ cover }"
			class="top-0 z-10 -mr-1 -ml-1 aspect-square h-8 w-8 overflow-clip object-cover min-w-8 !rounded-md"
		/>

		<img
			v-else-if="image"
			:src="image"
			alt=""
			class="top-0 z-10 -mr-1 -ml-1 aspect-square h-8 w-8 overflow-clip object-cover min-w-8 !rounded-md"
			crossorigin="anonymous"
		>

		<span
			:class="`${sidebar === 'open' ? 'opacity-100' : 'sm:opacity-0'}`"
			class="flex h-8 flex-shrink-0 flex-grow-0 items-center overflow-clip font-semibold transition-opacity sidebar-open:delay-300 w-[168px]"
		>
			<span
				class="ml-2 flex-grow overflow-clip font-medium w-inherit line-clamp-1 text-left"
			>
				{{ $t(name) }}
			</span>
		</span>
	</Button>
</template>
