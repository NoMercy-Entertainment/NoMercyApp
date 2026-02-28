<script lang="ts" setup>
import { dashboardSocketIsConnected } from '@/lib/clients/dashboardSocket';
import { isMobile } from '@/config/global';

defineProps({
	title: {
		type: String,
		required: true,
	},
	background: {
		type: Boolean,
		required: false,
		default: true,
	},
});
</script>

<template>
	<div v-if="isMobile && dashboardSocketIsConnected">
		<div
			class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-3 self-stretch w-full pt-1 text-surface-12"
		>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-4 self-stretch"
			>
				<p class="flex flex-grow flex-nowrap gap-2 text-xl font-medium">
					<span>{{ $t(title) }}</span>
					<slot name="count" />
				</p>
				<div class="ml-auto flex gap-2 text-surface-12 bg-surface-12/2">
					<slot name="cta" />
				</div>
			</div>

			<div
				:class="{
					' bg-surface-5/6 text-surface-11 p-4': background,
				}"
				class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-xl overflow-clip"
			>
				<slot />
			</div>
		</div>
	</div>
	<div
		v-else-if="dashboardSocketIsConnected"
		class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-3 self-stretch text-surface-12"
	>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-4 self-stretch"
		>
			<p class="flex flex-grow flex-nowrap gap-2 text-xl font-medium">
				<span>{{ $t(title) }}</span>
				<slot name="count" />
			</p>
			<div class="ml-auto flex gap-2 bg-surface-12/2">
				<slot name="cta" />
			</div>
		</div>

		<div
			:class="{
				'bg-surface-12/3 text-surface-12/12 p-4': background,
			}"
			class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-xl overflow-clip"
		>
			<slot />
		</div>
	</div>
</template>
