<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { convertToPercentage } from '@/store/audioPlayer';

const props = defineProps({
	min: {
		type: Number,
		required: true,
	},
	max: {
		type: Number,
		required: true,
	},
	step: {
		type: Number,
		required: false,
		default: 0.1,
	},
	value: {
		required: true,
	},
	vertical: {
		type: Boolean,
		required: false,
		default: false,
	},
	markers: {
		type: Boolean,
		required: false,
		default: false,
	},
	index: {
		type: Number,
		required: true,
		default: 0,
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
			position = `${((i - props.min) / (props.max - props.min)) * 100}%`;
		}
		else {
			// For horizontal sliders, normal marker positions
			position = `${((i - props.min) / (props.max - props.min)) * 100}%`;
		}
		markerArray.push({ value: i, position });
	}
	return markerArray.filter(
		marker =>
			marker.value === props.min
			|| marker.value === props.max
			|| marker.value % 50 === 0,
	);
});

const left = computed(
	() => `${convertToPercentage(props.value as number, props.min, props.max)}%`,
);

function updateMarkers() {
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
}

onMounted(() => {
	if (props.markers) {
		updateMarkers();
	}
});
</script>

<template>
	<div
		:class="{
			'flex-col w-full': !vertical,
			'h-min': vertical,
		}"
		class="flex justify-start items-center gap-1 range-container relative"
	>
		<div
			:class="{
				'flex-col-reverse py-1': vertical,
				'hidden': index > 1,
			}"
			class="flex justify-between items-start self-stretch relative"
		>
			<template v-for="marker in markers" :key="marker.value">
				<p
					:class="{
						'first:opacity-0 last:opacity-0 self-center': !vertical,
						'-ml-1 mb-1': !vertical,
						'flex-col-reverse w-4': vertical,
						'-ml-1 mt-0.5 mr-1.5': vertical,
					}"
					class="text-2xs leading-none font-medium text-right text-slate-9 dark:text-slate-9 w-0 whitespace-nowrap mr-1"
				>
					{{ marker.value }}
				</p>
			</template>
		</div>
		<div
			:class="{
				'w-full': !vertical,
				'h-min': vertical,
			}"
			class="flex flex-col justify-start items-start relative"
		>
			<slot :left="left" :max="max" :min="min" :step="step" />
		</div>
	</div>
</template>
