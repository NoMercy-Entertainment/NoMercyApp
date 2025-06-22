<script setup lang="ts">
import { IonItem } from '@ionic/vue';

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
	<IonItem v-if="isMobile && dashboardSocketIsConnected">
		<div
			class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-3 self-stretch w-full pt-1"
		>
			<div
				class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-4 self-stretch text-slate-light-12 dark:text-slate-dark-12"
			>
				<p class="flex-grow text-xl font-medium">
					{{ $t(title) }}
				</p>
				<div class="ml-auto flex gap-2">
					<slot name="cta" />
				</div>
			</div>

			<div
				class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-xl"
				:class="{
					'bg-slate-lightA-3 dark:bg-slate-darkA-3 p-4': background,
				}"
			>
				<slot />
			</div>
		</div>
	</IonItem>
	<div
		v-else-if="dashboardSocketIsConnected"
		class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-3 self-stretch"
	>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-4 self-stretch text-slate-light-12 dark:text-slate-dark-12"
		>
			<p class="flex-grow text-xl font-medium">
				{{ $t(title) }}
			</p>
			<div class="ml-auto flex gap-2">
				<slot name="cta" />
			</div>
		</div>

		<div
			class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-4 self-stretch rounded-xl"
			:class="{
				'bg-slate-lightA-3 dark:bg-slate-darkA-3 p-4': background,
			}"
		>
			<slot />
		</div>
	</div>
</template>
