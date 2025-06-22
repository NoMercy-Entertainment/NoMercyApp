<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
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
});

const { t } = useTranslation();

const visible = ref(false);

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
		role="dialog"
		class="w-full"
		:class="{
			[maxWidth]: true,
		}"
	>
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
			<slot name="actions" />
		</template>
	</Dialog>
</template>
