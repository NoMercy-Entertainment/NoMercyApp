<script setup lang="ts">
import { ref, watch } from "vue";
import { setUsePercentageColors, usePercentageColors } from "@/store/preferences";
import Toggle from "@/components/Forms/Toggle.vue";

const value = ref(usePercentageColors.value);

watch(usePercentageColors, (v) => {
	value.value = v;
});

watch(value, (value) => {
	setUsePercentageColors(value);
});

</script>

<template>
	<div class="mb-8 flex select-none flex-col gap-3">
		<div class="flex flex-col">
			<p class="font-bold text-contrast">{{ $t("Color indication") }}</p>
			<p class="text-sm text-contrast">
				{{ $t("Easily visualize the percentage of episodes you have at your disposal.") }}
			</p>
		</div>
		<div class="flex flex-col duration-150 transition-color">
			<div class="flex duration-150 transition-color text-contrast"
				:class="value ? 'justify-between' : 'justify-around'">
				<template v-if="value">
					<span>0%</span>
					<span>25%</span>
					<span>50%</span>
					<span>100%</span>
				</template>
				<template v-else>
					<span>&lt;10%</span>
					<span>&lt;50%</span>
					<span>&gt;50%</span>
					<span>100%</span>
				</template>
			</div>
			<span v-if="value" class="h-2 w-full duration-150 transition-color"
				style="background: linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 45%, rgb(0, 255, 0) 80%, rgb(0, 92, 0) 100%);"></span>
			<span v-else class="h-2 w-full duration-150 transition-color"
				style="background: linear-gradient(to right, rgb(238, 85, 68) 0%, rgb(238, 85, 68) 25%, rgb(255, 187, 51) 25%, rgb(255, 187, 51) 50%, rgb(68, 187, 68) 50%, rgb(68, 187, 68) 75%, rgb(153, 68, 255) 75%, rgb(153, 68, 255) 100%);"></span>
		</div>

		<div class="flex w-full gap-2">
			<Toggle id="usePercentageColors" label="Manage" v-model="value" class="mr-2" />
			<div class="flex flex-col justify-center">
				<span class="whitespace-pre-wrap text-sm font-semibold text-contrast">{{ $t("Extended") }}</span>
				<span class="h-5 whitespace-pre-wrap text-sm text-contrast empty:hidden"></span>
			</div>
		</div>
	</div>
</template>
