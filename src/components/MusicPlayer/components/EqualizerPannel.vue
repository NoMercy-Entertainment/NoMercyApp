<script setup lang="ts">
import {
  bands, panning, equalizerPreset,
  equalizerPresets, equalizerSliderValues,
  handleReset, handleFullReset, handleChange, setEqualizerPreset, currentSong, equalizerMenuOpen,
} from '@/store/audioPlayer';

import Button from "@/components/Button.vue";
import RangeSlider from "@/components/Forms/RangeSlider.vue"


</script>

<template>
  <div
      class="flex flex-col justify-start items-start relative gap-8 w-full h-full sm:p-8"
  >
    <p class="text-xl font-bold">
      {{ $t('Equaliser') }}
    </p>

    <div class="flex items-center self-stretch relative gap-2">
      <p class="leading-none text-xs">L</p>
      <RangeSlider :value="panning"
                   :index="0"
                   :min="equalizerSliderValues.pan.min"
                   :max="equalizerSliderValues.pan.max"
                   :step="equalizerSliderValues.pan.step"
                   class="w-available"
                   v-slot:default="{ min, max, step, left }"
      >
        <input type="range" v-model="panning"
               :tabindex="equalizerMenuOpen ? 0 : -1"
               :min="min" :max="max" :step="step"
               class="!w-available"
               @input="handleChange('panning', $event)"
               @click="handleReset('panning', $event)"
               :style="{ '--left': left }"
        />
      </RangeSlider>
      <p class="leading-none text-xs">R</p>
    </div>

    <div class="flex justify-evenly items-center w-full sm:gap-6 flex-1">

      <template v-for="(band, index) in bands" :key="index">

        <template v-if="band.frequency === 'Pre'">
          <div class="flex justify-start items-center h-full -ml-3 sm:first:mr-4">
            <RangeSlider vertical markers :value="band.gain"
                         :index="index"
                         :min="equalizerSliderValues.pre.min"
                         :max="equalizerSliderValues.pre.max"
                         :step="equalizerSliderValues.pre.step"
                         v-slot:default="{ min, max, step, left }"
            >
              <input type="range" v-model="band.gain"
                     :tabindex="equalizerMenuOpen ? 0 : -1"
                     :min="min" :max="max" :step="step"
                     class="vertical !h-[260px] rotate-180"
                     @input="handleChange('gain', $event, band)"
                     @click="handleReset('gain', $event, band)"
                     :style="{ '--left': left }"
              />
            </RangeSlider>
          </div>
        </template>

        <template v-else>
          <div class="flex justify-start items-center h-full" >
            <RangeSlider vertical markers :value="band.gain"
                         :index="index"
                         :min="equalizerSliderValues.band.min"
                         :max="equalizerSliderValues.band.max"
                         :step="equalizerSliderValues.band.step"
                         v-slot:default="{ min, max, step, left }"
            >
              <input type="range" v-model="band.gain" :key="equalizerPreset.name"
                     :tabindex="equalizerMenuOpen ? 0 : -1"
                     :min="min" :max="max" :step="step"
                     :disabled="equalizerPreset.name !== 'Custom'"
                     class="vertical !h-[260px] rotate-180"
                     @input="handleChange('gain', $event, band)"
                     @click="handleReset('gain', $event, band)"
                     :style="{ '--left': left }"
              />
            </RangeSlider>
          </div>
        </template>
      </template>
    </div>

    <div class="flex justify-start items-end self-stretch gap-4">
      <div class="flex flex-1 flex-col gap-2">
        <label for="media_types" class="leading-none text-xs">
          {{ $t('Preset') }}
        </label>
        <Select :options="equalizerPresets"
                :model-value="equalizerPreset"
                :tabindex="equalizerMenuOpen ? 0 : -1"
                @update:modelValue="setEqualizerPreset($event)"
                autocomplete="off"
                checkmark
                id="equalizer_preset"
                label="equalizer preset"
                optionLabel="name"
                size="small"
                variant="filled"
        />
      </div>
      <Button class="w-20 max-h-[2.15rem]"
              @click="handleFullReset()"
              :tabindex="equalizerMenuOpen ? 0 : -1"
              endIcon="arrowCounterClockwise"
              id="reset"
      >
        <span>
          {{ $t('Reset') }}
        </span>
      </Button>
    </div>

  </div>

</template>

<style scoped lang="scss">
input[type="range"]:not(.vertical) {
  @apply [background-image:_-webkit-gradient(linear,_right_top,_right_bottom,_color-stop(var(--left),#ffffff80),_color-stop(var(--left),_#ffffff80))]
dark:[background-image:_-webkit-gradient(linear,_right_top,_right_bottom,_color-stop(var(--left),#00000080),_color-stop(var(--left),_#00000080))] #{!important};
}
</style>
