<script lang="ts" setup>
import type { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps({
	setNextButtonLocked: {
		type: Function as PropType<(value: boolean) => void>,
		required: true,
	},
});
const { t } = useTranslation();
const query = useQueryClient();
</script>

<template>
</template>
