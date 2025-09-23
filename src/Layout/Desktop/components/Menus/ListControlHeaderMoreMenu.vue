<script lang="ts" setup>
import type { PropType } from 'vue';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';

import type { MoooomIcons } from '@Icons/icons';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import { buttonClasses } from '@/config/global.ts';

interface IMenuItem {
	icon: keyof typeof MoooomIcons;
	onclick: () => void;
	title: string;
}

defineProps({
	items: {
		type: Array as PropType<IMenuItem[]>,
		required: true,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
});
</script>

<template>
	<Menu as="div" class="relative select-none z-[150]">
		<MenuButton
			:aria-label="$t('more')"
			class=""
		>
			<slot name="button">
				<OptimizedIcon icon="menuDotsHorizontal" />
			</slot>
		</MenuButton>

		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="scale-95 transform opacity-0"
			enter-to-class="scale-100 transform opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="scale-100 transform opacity-100"
			leave-to-class="scale-95 transform opacity-0"
		>
			<MenuItems
				:class="className"
				class="absolute z-10 m-2 ml-8 flex w-min origin-top-right -translate-x-full flex-col gap-2 rounded-lg p-1 shadow-lg bg-surface-3 dark:bg-surface-1 border-1 border-surface-8/11"
			>
				<slot />
				<template v-for="(item, index) in items" :key="index">
					<MenuItem
						:class="buttonClasses"
						as="div"
						class="w-60 min-w-60 !flex"
						@click="item.onclick"
					>
						<span
							class="relative flex flex-1 items-center justify-start gap-2 text-base font-semibold"
						>
							<OptimizedIcon :icon="item.icon" :title="item.title" />
							<span class="flex flex-1 w-full whitespace-nowrap">
								{{ $t(item.title) }}
							</span>
						</span>
					</MenuItem>
				</template>
			</MenuItems>
		</transition>
	</Menu>
</template>
