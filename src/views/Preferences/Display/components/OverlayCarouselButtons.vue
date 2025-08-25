<script setup lang="ts">
import { ref, watch } from 'vue';
import { setOverlayCarouselButtons, useOverlayCarouselButtons } from '@/store/preferences';
import Toggle from '@/components/Forms/Toggle.vue';

const value = ref(useOverlayCarouselButtons.value);

watch(useOverlayCarouselButtons, (v) => {
	value.value = v;
});

watch(value, (value) => {
	setOverlayCarouselButtons(value);
});
</script>

<template>
	<div class="mb-8 flex select-none flex-col gap-3">
		<div class="flex flex-col">
			<p class="font-bold">
				{{ $t("Carousel navigation") }}
			</p>
			<p class="text-sm">
				{{
					$t(
						"Set this to true to show the buttons over the carousel images instead of above them",
					)
				}}.
			</p>
		</div>
		<div class="flex transition-transform duration-150">
			<Toggle id="autoTheme" v-model="value" label="Auto theme" class="mr-2" />
			<div class="flex flex-col justify-center">
				<span class="whitespace-pre-wrap text-sm font-semibold">
					{{ $t("Enabled") }}
				</span>
				<span class="h-5 whitespace-pre-wrap text-sm empty:hidden" />
			</div>
		</div>
	</div>
</template>
