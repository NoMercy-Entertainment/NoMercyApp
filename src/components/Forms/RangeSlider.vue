<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {convertToPercentage} from "@/store/audioPlayer";

const props = defineProps({
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  step: {
    type: Number,
    required: false,
    default: 0.1
  },
  value: {
    type: Number,
    required: true,
  },
  vertical: {
    type: Boolean,
    required: false,
    default: false
  },
});

const rangeMarkers = ref<HTMLElement | null>(null);

const markers = computed(() => {
  const markerArray: { value: number; position: string }[] = [];
  for (let i = props.min; i <= props.max; i++) {
    // Calculate the percentage position for each marker
    let position: string;
    if (props.vertical) {
      // For vertical sliders, invert the marker positions
      position = ((i - props.min) / (props.max - props.min)) * 100 + '%';
    } else {
      // For horizontal sliders, normal marker positions
      position = ((i - props.min) / (props.max - props.min)) * 100 + '%';
    }
    markerArray.push({ value: i, position });
  }
  return markerArray;
});

const left = computed(() => `${convertToPercentage(props.value, props.min, props.max)}%`);

const updateMarkers = () => {
  if (rangeMarkers.value) {
    rangeMarkers.value.innerHTML = '';
    markers.value.forEach((marker) => {
      const markerElement = document.createElement('div');
      markerElement.classList.add('range-marker');
      markerElement.style[props.vertical ? 'bottom' : 'left'] = marker.position;

      // Create the label for the marker
      const label = document.createElement('div');
      label.classList.add('range-marker-label');
      label.textContent = marker.value.toString();
      markerElement.appendChild(label);

      rangeMarkers.value?.appendChild(markerElement);
    });
  }
};

onMounted(() => {
  updateMarkers();
});

</script>

<template>
  <div class="range-container relative"
       :class="{
          'w-4': vertical ,
          'h-4': !vertical
       }">
    <slot
        :min="min"
        :max="max"
        :step="step"
        :left="left"
    />
    <div ref="rangeMarkers"
         class="range-markers flex"
         :class="{
            'flex-col h-available py-2 -ml-[1.1rem] w-4 bottom-1.5 top-6 left-0 text-end': vertical,
            'flex-row w-available px-4 -mt-1 h-4 -top-3 left-0 right-7 text-center': !vertical
         }"
    ></div>
  </div>
</template>

<style>
.range-markers {
  position: absolute;
  display: flex;
  pointer-events: none;
  left: 50%;
  width: 1rem;
}

.range-marker {
  position: absolute;
  width: 1rem;
}

.range-marker-label {
  bottom: 0;
  font-size: 10px;
  text-align: end;
}
</style>