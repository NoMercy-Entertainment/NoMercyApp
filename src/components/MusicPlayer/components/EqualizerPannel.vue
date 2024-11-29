<script setup lang="ts">
import {ref, watch} from 'vue';

import {
  bands, equalizerMenuOpen, panning,
  abbreviateFrequency, handleReset,
  handleChange, setEqualizerMenuOpen,
} from '@/store/audioPlayer';
import {equalizerSliderValues} from "@/config/config";

import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import RangeSlider from "@/components/Forms/RangeSlider.vue";

const canDismiss = ref(false);

const handleClose = () => {
  canDismiss.value = true;
  setEqualizerMenuOpen(false);
};

watch(equalizerMenuOpen, (value) => {
  if (value) {
    canDismiss.value = false;
  }
});

</script>

<template>
  <div class="flex flex-col z-10 mt-4 gap-4">
    <div class="flex gap-6 justify-evenly items-center">
      <div class="flex w-available justify-evenly items-center gap-1">
        <div class="leading-none h-3.5">L</div>
        <!-- set to minimum value to disable background-->
        <RangeSlider :value="equalizerSliderValues.pan.min"
                     :min="equalizerSliderValues.pan.min"
                     :max="equalizerSliderValues.pan.max"
                     :step="equalizerSliderValues.pan.step"
                     class="w-full"
                     v-slot:default="{ min, max, step, left }"
        >
          <input type="range" v-model="panning"
                 :min="min" :max="max" :step="step"
                 class="w-available mx-1.5 bg-focus"
                 @input="handleChange('panning', $event)"
                 :style="{ '--left': left }"
          />
        </RangeSlider>

        <div class="leading-none h-3.5">R</div>
      </div>
      <button class="leading-none h-3.5" @click="handleReset()">
        <span>{{ $t('Reset') }}</span>
      </button>

      <slot name="button" />
    </div>

    <div class="flex justify-center mt-1">
      <div v-for="(band, index) in bands" :key="index" class="flex flex-col items-center w-10 mx-auto">

        <template v-if="band.frequency === 'Pre'">
          <RangeSlider vertical :value="band.gain"
                       :min="equalizerSliderValues.pre.min"
                       :max="equalizerSliderValues.pre.max"
                       :step="equalizerSliderValues.pre.step"
                       v-slot:default="{ min, max, step, left }"
          >
            <input type="range" v-model="band.gain"
                   :min="min" :max="max" :step="step"
                   class="vertical h-[260px] rotate-180 my-1.5 bg-focus"
                   @input="handleChange('gain', $event, band)"
                   :style="{ '--left': left }"
            />
          </RangeSlider>
        </template>

        <template v-else>
          <RangeSlider vertical :value="band.gain"
                       :min="equalizerSliderValues.band.min"
                       :max="equalizerSliderValues.band.max"
                       :step="equalizerSliderValues.band.step"
                       v-slot:default="{ min, max, step, left }"
          >
            <input type="range" v-model="band.gain"
                   :min="min" :max="max" :step="step"
                   class="vertical h-[260px] rotate-180 my-1.5 bg-focus"
                   @input="handleChange('gain', $event, band)"
                   :style="{ '--left': left }"
            />
          </RangeSlider>
        </template>

        <div v-if="band.frequency === 'Pre'" class="text-center whitespace-nowrap text-sm">
          {{ band.frequency }}
        </div>
        <div v-else class="text-center whitespace-nowrap text-sm">
          {{ abbreviateFrequency(band.frequency as number) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"].vertical {
  writing-mode: vertical-lr;
}
</style>