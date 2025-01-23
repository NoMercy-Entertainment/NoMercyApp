<script setup lang='ts'>
import { watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import { setShowBackdrops, showBackdrops } from "@/store/preferences";
import { useToggle } from "@vueuse/core";

const [value, toggle] = useToggle(showBackdrops.value);

const { t } = useTranslation();

watch(value, (newVal, oldVal) => {
	setShowBackdrops(newVal);
});

</script>

<template>
	<div class='mb-8 flex select-none flex-col gap-3'>
		<div class='flex items-center justify-between'>
			<p class='font-bold text-contrast'>{{ t('Card style') }}</p>
		</div>
		<div
			class='relative mr-2 flex h-12 items-center justify-between rounded-lg border-4 border-transparent py-2 ring-1 transition-transform duration-300 bg-auto-1 ring-auto-12'>
			<div class='absolute z-0 h-10 w-1/2 transition-transform duration-300 bg-auto-alpha-6 rounded-[4px]'
				:class="value ? 'translate-x-full' : ''">
			</div>
			<div class='pointer-events-auto z-10 flex w-1/2 items-center gap-2 px-4 py-1 text-contrast'
				@click="() => value = false">
				<span class='flex h-5 w-5 items-center'>
					<MoooomIcon icon="portrait" class="h-5 w-5" />
				</span>
				Poster
			</div>
			<div class='pointer-events-auto z-10 flex w-1/2 items-center gap-2 px-5 py-1 text-contrast'
				@click="() => value = true">
				<span class='flex h-5 w-5 items-center'>
					<MoooomIcon icon="landscape" class="h-5 w-5" />
				</span>
				Backdrop
			</div>
		</div>
	</div>
</template>
