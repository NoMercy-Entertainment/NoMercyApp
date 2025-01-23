<script lang="ts" setup>
import { PropType } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';

import type { MoooomIcons } from '@Icons/icons';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';


interface IMenuItem {
	icon: keyof typeof MoooomIcons,
	onclick: () => void;
	title: string;
}

defineProps({
	items: {
		type: Array as PropType<IMenuItem[]>,
		required: true,
	},
})
</script>

<template>
	<Menu as="div" class="relative select-none z-[150]">
		<div>
			<MenuButton
				class="w-10 min-w-[2.5rem] h-10 min-h-[2.5rem] z-0 flex items-center justify-center disabled:opacity-50 disabled:text-auto-300 disabled:hover:!bg-transparent rounded-md overflow-clip text-contrast hover:bg-transparent focus-visible:bg-transparent active:bg-transparent sm:focus-visible:bg-auto-400/80 sm:hover:bg-auto-5/6 pointer-events-auto">
				<MoooomIcon icon="menuDotsHorizontal" />
			</MenuButton>
		</div>

		<transition enter-active-class="transition duration-100 ease-out"
			enter-from-class="scale-95 transform opacity-0" enter-to-class="scale-100 transform opacity-100"
			leave-active-class="transition duration-75 ease-in" leave-from-class="scale-100 transform opacity-100"
			leave-to-class="scale-95 transform opacity-0">
			<MenuItems
				class="absolute z-10 m-2 ml-8 flex w-min origin-top-right -translate-x-full flex-col gap-2 rounded-lg p-1 shadow-lg bg-slate-light-3 dark:bg-slate-dark-1 border-1 border-auto-2/11">
				<template v-for="(item, index) in items" :key="index">

					<MenuItem as="div" @click="item.onclick"
						class="flex justify-center items-center self-stretch h-10 relative p-2 gap-3 rounded-sm border border-transparent hover:border-focus/4 active:bg-focus/9 active:border-focus/4 active:hover:border-focus/4 focus:bg-auto-12/2 hover:bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300">
					<span
						class="relative flex w-full flex-grow items-center justify-center gap-2 text-base font-semibold">
						<MoooomIcon :icon="item.icon" :title="item.title" />
						<span class="w-full whitespace-nowrap">
							{{ $t(item.title) }}
						</span>
					</span>
					</MenuItem>

				</template>
			</MenuItems>
		</transition>
	</Menu>
</template>
