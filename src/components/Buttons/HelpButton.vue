<script setup lang="ts">

import { suffix } from '@/config/config';

import Button from '@/components/Buttons/Button.vue';

import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const url = computed(() => `https://docs${suffix}.nomercy.tv${route.path.replace(/\/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/gu, '')
	}`);

</script>

<template>
	<Button id="help" :href="url" variant="text" component="link" target="_blank" color="auto"
		startIcon="messageBubbleQuestion"
		class="relative flex h-10 flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5">
		{{ $t('Help') }}
	</Button>
</template>
