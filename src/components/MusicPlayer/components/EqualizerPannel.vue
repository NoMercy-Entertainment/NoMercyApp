<script setup lang="ts">
import {
	bands,
	equalizerPreset,
	equalizerPresets,
	equalizerSliderValues,
	handleChange,
	handleFullReset,
	handleReset,
	panning,
	setEqualizerPreset,
} from '@/store/audioPlayer';

import Button from '@/components/Button.vue';
import RangeSlider from '@/components/Forms/RangeSlider.vue';
</script>

<template>
	<div
		class="flex flex-col justify-start items-start relative gap-8 w-full h-full sm:p-8"
	>
		<p class="text-xl font-bold">
			{{ $t("Equaliser") }}
		</p>

		<div class="flex items-center self-stretch relative gap-2">
			<p class="leading-none text-xs">
				L
			</p>
			<RangeSlider
				v-slot="{ min, max, step, left }"
				:value="panning"
				:index="0"
				:min="equalizerSliderValues.pan.min"
				:max="equalizerSliderValues.pan.max"
				:step="equalizerSliderValues.pan.step"
				class="w-available"
			>
				<input
					v-model="panning"
					type="range"
					:min="min"
					:max="max"
					:step="step"
					class="!w-available"
					:style="{ '--left': left }"
					@input="handleChange('panning', $event)"
					@click="handleReset('panning', $event)"
				>
			</RangeSlider>
			<p class="leading-none text-xs">
				R
			</p>
		</div>

		<div class="flex justify-evenly items-center w-full sm:gap-6 flex-1">
			<template v-for="(band, index) in bands" :key="index">
				<template v-if="band.frequency === 'Pre'">
					<div
						class="flex justify-start items-center h-full -ml-3 sm:first:mr-4"
					>
						<RangeSlider
							v-slot="{ min, max, step, left }"
							vertical
							markers
							:value="band.gain"
							:index="index"
							:min="equalizerSliderValues.pre.min"
							:max="equalizerSliderValues.pre.max"
							:step="equalizerSliderValues.pre.step"
						>
							<input
								v-model="band.gain"
								type="range"
								:min="min"
								:max="max"
								:step="step"
								class="vertical !h-[260px] rotate-180"
								:style="{ '--left': left }"
								@input="handleChange('gain', $event, band)"
								@click="handleReset('gain', $event, band)"
							>
						</RangeSlider>
					</div>
				</template>

				<template v-else>
					<div class="flex justify-start items-center h-full">
						<RangeSlider
							v-slot="{ min, max, step, left }"
							vertical
							markers
							:value="band.gain"
							:index="index"
							:min="equalizerSliderValues.band.min"
							:max="equalizerSliderValues.band.max"
							:step="equalizerSliderValues.band.step"
						>
							<input
								:key="equalizerPreset.name"
								v-model="band.gain"
								type="range"
								:min="min"
								:max="max"
								:step="step"
								:disabled="equalizerPreset.name !== 'Custom'"
								class="vertical !h-[260px] rotate-180"
								:style="{ '--left': left }"
								@input="handleChange('gain', $event, band)"
								@click="handleReset('gain', $event, band)"
							>
						</RangeSlider>
					</div>
				</template>
			</template>
		</div>

		<div class="flex justify-start items-end self-stretch gap-4">
			<div class="flex flex-1 flex-col gap-2">
				<label for="media_types" class="leading-none text-xs">
					{{ $t("Preset") }}
				</label>
				<Select
					id="equalizer_preset"
					:options="equalizerPresets"
					:model-value="equalizerPreset"
					autocomplete="off"
					checkmark
					label="equalizer preset"
					option-label="name"
					size="small"
					variant="filled"
					@update:model-value="setEqualizerPreset($event)"
				/>
			</div>
			<Button
				id="reset"
				class="w-20 max-h-[2.15rem]"
				end-icon="arrowCounterClockwise"
				@click="handleFullReset()"
			>
				<span>
					{{ $t("Reset") }}
				</span>
			</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
input[type='range']:not(.vertical) {
	@apply [background-image:_-webkit-gradient(linear,_right_top,_right_bottom,_color-stop(var(--left),#ffffff80),_color-stop(var(--left),_#ffffff80))]
  dark:[background-image:_-webkit-gradient(linear,_right_top,_right_bottom,_color-stop(var(--left),#00000080),_color-stop(var(--left),_#00000080))] #{!important};
}
</style>
