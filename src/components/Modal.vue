<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';

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
		v-model:open="visible"
		v-model:visible="visible"
		:class="{
			[maxWidth]: true,
			'no-close': noClose,
			'has-background': background,
		}"
		:header="$t(title, params)"
		as="div"
		class="dialog w-available overflow-clip relative isolate"
		modal
	>
		<!--		<Shadow v-if="background" class="-z-10 -translate-y-[10%] translate-x-[20%]" /> -->
		<ScrollPanel
			:dt="{
				bar: {
					background: 'rgb(var(--surface-1) / 60%)',
				},
			}"
			class="w-available h-available"
		>
			<template #default>
				<slot />
			</template>
		</ScrollPanel>

		<template #footer>
			<slot class="z-10 mt-auto" name="actions" />
		</template>
	</Dialog>
</template>

<style lang="scss">
.p-dialog.has-background {
	--tw-bg-opacity: 0.8;
	background-image:
		radial-gradient(
			ellipse 48.23% 78.54% at 63.01% -3.15%,
			rgb(from theme('colors.theme.8') r g b / 20%) 0%,
			rgb(from theme('colors.theme.1') r g b / 0%) 100%
		),
		radial-gradient(
			ellipse 44.44% 70.34% at 101.5% -2.98%,
			rgb(from theme('colors.theme.8') r g b / 20%) 0%,
			rgb(from theme('colors.theme.1') r g b / 0%) 100%
		),
		linear-gradient(
			180deg,
			rgb(from theme('colors.theme.8') r g b / 20%) 0%,
			rgb(from theme('colors.theme.1') r g b / 0%) 100%
		);
	background-blend-mode: overlay, normal, normal, normal;
}
</style>
