<script setup lang='ts'>
import { watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import { setShowBackdrops, showBackdrops } from "@/store/preferences";
import { useToggle } from "@vueuse/core";

const [value, toggle] = useToggle(showBackdrops.value);

const { t } = useTranslation();

watch(value, (newVal) => {
	setShowBackdrops(newVal);
});

</script>

<template>
	<div class='mb-8 flex select-none flex-col gap-3'>
		<div class='flex items-center justify-between'>
			<p class='font-bold'>{{ t('Card style') }}</p>
		</div>
		<div
			class='relative mr-2 flex h-12 items-center justify-between rounded-lg border-4 border-transparent py-2 ring-1 transition-transform duration-300 bg-auto-1 ring-auto-12'>
			<div class="
          absolute z-0 h-10 w-1/2 transition-all duration-300 bg-gradient-to-b rounded-[4px] button-filled

          from-[rgb(var(--color-slate-11))]
          dark:from-[rgb(var(--color-slate-7))]

          to-[rgb(var(--color-slate-10))]
          dark:to-[rgb(var(--color-slate-5))]

          shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-2)/60%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-2)/70%)]
          dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-2)/60%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-2)/70%)]
      "
				:class="value ? 'translate-x-full' : ''">
			</div>
			<button class='pointer-events-auto z-10 flex w-1/2 items-center gap-2 px-4 py-1' @click="() => value = false">
				<span class='flex h-5 w-5 items-center'>
					<MoooomIcon icon="portrait" class="h-5 w-5" />
				</span>
				<span>Poster</span>
			</button>
			<button class='pointer-events-auto z-10 flex w-1/2 items-center gap-2 px-5 py-1' @click="() => value = true">
				<span class='flex h-5 w-5 items-center'>
					<MoooomIcon icon="landscape" class="h-5 w-5" />
				</span>
				<span>Backdrop</span>
			</button>
		</div>
	</div>
</template>
