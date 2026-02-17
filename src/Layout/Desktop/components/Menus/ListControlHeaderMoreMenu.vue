<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { twMerge } from 'tailwind-merge';
import Button from 'primevue/button';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue';
import type { IMenuItem } from '@/types';

import { buttonClasses } from '@/config/global.ts';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { currentServer } from '@/store/currentServer.ts';

const props = defineProps({
	items: {
		type: Array as PropType<IMenuItem[]>,
		required: true,
	},
	className: {
		type: String,
		required: false,
		default: '',
	},
	title: {
		type: String,
		required: false,
		default: 'More options',
	},
	showDelay: {
		type: Number,
		required: false,
		default: 750,
	},
	hideDelay: {
		type: Number,
		required: false,
		default: 300,
	},
	noTip: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const filteredItems = computed(() => {
	return props.items.filter(
		item =>	!item.privileged || (item.privileged
			&& (currentServer.value?.is_owner || currentServer.value?.is_manager)),
	);
});
</script>

<template>
	<Menu as="div" class="relative select-none z-[150]">
		<Button
			v-tooltip.top="{
				showDelay,
				hideDelay,
				value: noTip ? null : $t(title),
			}"
			:aria-label="$t(title)"
			:as="MenuButton"
			:class="{
				[twMerge(buttonClasses, 'flex flex-nowrap')]: true,
			}"
			:unstyled="true"
			class="data-[headlessui-state='open']:bg-surface-12/6 sm:data-[headlessui-state='open']:bg-surface-12/6"
		>
			<slot name="button">
				<MoooomIcon icon="menuDotsHorizontal" />
			</slot>
		</Button>

		<transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="scale-95 transform opacity-0"
			enter-to-class="scale-100 transform opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="scale-100 transform opacity-100"
			leave-to-class="scale-95 transform opacity-0"
		>
			<MenuItems
				:class="twMerge(className, 'absolute z-10 m-2 ml-8 flex origin-top-right -translate-x-full flex-col gap-2 rounded-xl p-1 shadow-lg bg-surface-3 dark:bg-surface-1 border-1 border-surface-8/11 w-max min-w-min')"
			>
				<slot />

				<template v-for="(item, index) in filteredItems" :key="index">
					<MenuItem
						:class="buttonClasses.replace('sm:bg-surface-12/2', '')"
						as="div"
						class="w-available min-w-60 !flex"
						@click="item.onclick"
					>
						<span
							class="relative flex flex-1 items-center justify-start gap-2 text-base font-semibold"
						>
							<MoooomIcon :icon="item.icon" :title="item.title" />
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
