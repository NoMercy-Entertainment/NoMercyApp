<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { shouldMarquee } from '@/lib/utils/dom';

const props = defineProps({
	text: {
		type: String,
		required: false,
	},
	playing: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const marquee = ref<HTMLElement | null>();
let pendingTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleMarqueeCheck() {
	if (pendingTimer) return;
	pendingTimer = setTimeout(() => {
		pendingTimer = null;
		if (!marquee.value) return;
		shouldMarquee(marquee.value);
	}, 500);
}

watch(() => props.text, scheduleMarqueeCheck);

onMounted(scheduleMarqueeCheck);

onBeforeUnmount(() => {
	if (pendingTimer) {
		clearTimeout(pendingTimer);
		pendingTimer = null;
	}
});
</script>

<template>
	<div
		ref="marquee"
		class="w-available relative flex flex-grow flex-col items-start justify-start gap-2"
		data-marquee="container"
	>
		<div
			class="flex-shrink-0 flex-grow-0 self-stretch font-semibold line-clamp-1 w-fit whitespace-nowrap leading-none"
			data-marquee="scroller"
		>
			{{ text }}
			<slot />
		</div>
	</div>
</template>
