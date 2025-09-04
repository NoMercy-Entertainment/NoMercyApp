<script setup lang="ts">
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import Shadow from '@/Layout/Desktop/components/Shadow.vue';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<(e: Event) => any>,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	params: {
		type: Object,
		required: false,
	},
	subTitle: {
		type: String,
		required: false,
	},
	maxWidth: {
		type: String,
		required: false,
		default: 'max-w-xl',
	},
	hidden: {
		type: Boolean,
		required: false,
		default: false,
	},
	background: {
		type: Boolean,
		required: false,
	},
	noClose: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const visible = ref(props.open);

watch(props, (value) => {
	visible.value = value.open;
});

watch(visible, (value) => {
	if (!value) {
		props.close(new Event('close'));
	}
});
</script>

<template>
	<Dialog
		v-model:visible="visible"
		v-model:open="visible"
		modal
		:header="$t(title, params)"
		as="div"
		class="w-available bg-slate-light-1 dark:bg-slate-dark-1 overflow-clip relative isolate"
		:class="{
			[maxWidth]: true,
			'no-close': noClose,
		}"
	>
		<Shadow v-if="background" class="-z-10 -translate-y-[10%] translate-x-[20%]" />
		<ScrollPanel
			class="w-available h-available"
			:dt="{
				bar: {
					background: 'rgb(var(--background-auto-12) / 60%)',
				},
			}"
		>
			<template #default>
				<slot />
			</template>
		</ScrollPanel>

		<template #footer>
			<slot name="actions" class="z-10" />
		</template>
	</Dialog>
</template>
