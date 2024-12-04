<script setup lang='ts'>
import {ref, watch} from 'vue';
import {setUseAutoThemeColors, useAutoThemeColors} from "@/store/preferences";
import Toggle from "@/components/Forms/Toggle.vue";

const value = ref(useAutoThemeColors.value);

watch(useAutoThemeColors, (v) => {
	value.value = v;
});

watch(value, (value) => {
	setUseAutoThemeColors(value);
});


</script>

<template>
	<div class='mb-8 flex select-none flex-col gap-3'>
		<div class='flex flex-col'>
			<p class='font-bold text-contrast'>
				{{ $t('Auto theme') }}
			</p>
			<p class='text-sm text-contrast'>
				{{ $t('Enables setting theme colors when loading shows or movies based on the backdrop image') }}.
			</p>
		</div>
		<div class='flex transition-transform duration-150'>
			<Toggle id="autoTheme"
							label="Auto theme"
							v-model="value"
							class="mr-2"/>
			<div class="flex flex-col justify-center">
				<span class="whitespace-pre-wrap text-sm font-semibold text-contrast">
            {{ $t('Enabled') }}
        </span>
				<span class="h-5 whitespace-pre-wrap text-sm text-contrast empty:hidden"></span>
			</div>
		</div>
	</div>
</template>
