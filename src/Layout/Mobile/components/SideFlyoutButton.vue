<script lang="ts" setup>
import type { PropType } from 'vue';

import type { MoooomIcons } from '@Icons/icons';

defineProps({
	title: {
		type: String,
		required: true,
	},
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: true,
	},
	href: {
		type: String,
		default: '',
	},
	onclick: {
		type: Function as PropType<(e: Event) => void>,
	},
	active: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<RouterLink
		v-if="href"
		:class="
			active
				? 'bg-focus/12 border-focus/4 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/60%)] hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/60%)]'
				: ''
		"
		:style="
			active
				? {
					background:
						'radial-gradient(50% 50% at 50% 100%, rgba(70, 70, 70, 0.09) 0%, rgba(70, 70, 70, 0.06) 40%, rgba(70, 70, 70, 0.00) 100%), linear-gradient(180deg, rgba(70, 70, 70, 0.00) 0%, rgba(70, 70, 70, 0.12) 100%), rgba(var(--color-theme-8) / 60%)',
					backgroundBlendMode: 'normal, overlay, normal',
				}
				: {}
		"
		:to="href"
		class="relative flex h-12 flex-shrink-0 flex-grow-0 items-center justify-center self-stretch rounded-md border border-transparent bg-transparent py-2.5"
		@click="onclick"
	>
		<div class="w-1 flex-shrink-0 flex-grow-0 h-3.5" />
		<MoooomIcon
			:icon="icon"
			class-name="relative h-6 w-6 flex-shrink-0 flex-grow-0"
		/>
		<div class="relative flex flex-grow items-center justify-center gap-2 pl-2">
			<p class="flex-grow text-left text-lg font-medium w-available">
				{{ $t(title) }}
			</p>
		</div>
		<slot />
	</RouterLink>
	<button
		v-else
		:class="
			active
				? 'bg-focus/12 border-focus/4 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/60%)] hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgb(from_var(--color-slate-1)_r_g_b/30%)_inset,0_22px_30px_-4px_rgb(from_var(--color-slate-1)_r_g_b/60%)]'
				: ''
		"
		:style="
			active
				? {
					background:
						'radial-gradient(50% 50% at 50% 100%, rgba(70, 70, 70, 0.09) 0%, rgba(70, 70, 70, 0.06) 40%, rgba(70, 70, 70, 0.00) 100%), linear-gradient(180deg, rgba(70, 70, 70, 0.00) 0%, rgba(70, 70, 70, 0.12) 100%), rgba(var(--color-theme-8) / 60%)',
					backgroundBlendMode: 'normal, overlay, normal',
				}
				: {}
		"
		class="relative flex h-12 flex-shrink-0 flex-grow-0 items-center justify-center self-stretch rounded-md border border-transparent bg-transparent py-2.5"
		@click="onclick"
	>
		<div class="w-1 flex-shrink-0 flex-grow-0 h-3.5" />
		<MoooomIcon
			:icon="icon"
			class-name="relative h-6 w-6 flex-shrink-0 flex-grow-0"
		/>
		<div class="relative flex flex-grow items-center justify-center gap-2 pl-2">
			<p class="flex-grow text-left text-lg font-medium w-available">
				{{ $t(title) }}
			</p>
		</div>
		<slot />
	</button>
</template>
