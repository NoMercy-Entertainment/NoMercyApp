<script lang="ts" setup>
defineProps({
	playing: {
		type: Boolean,
		required: true,
	},
	color: {
		type: String,
		required: false,
		default: 'var(--color-theme-6)',
	},
});
</script>

<template>
	<div :class="{ paused: !playing }" class="bars w-5 h-5 flex gap-0.5 relative">
		<div class="bar w-px h-full" />
		<div class="bar w-px h-full" />
		<div class="bar w-px h-full" />
		<div class="bar w-px h-full" />
		<div class="bar w-px h-full" />
	</div>
</template>

<style scoped>
.bars {
	--height: 20px;
	--width: 20px;
	--brightness: 0.3;
	width: var(--width);
	height: var(--height);
	display: flex;
	position: relative;
	overflow: clip;
}

html.scheme-dark .bars {
	--brightness: 1.3;
}

.bar {
	--width: 2px;
	--left: 0;
	--space: 1px;
	--scale: var(--height);
	background: var(--color-theme-8);
	bottom: -50%;
	width: var(--width);
	height: var(--height);
	position: absolute;
	border-radius: 4px 4px 0 0;
	animation: sound 0ms -800ms ease-in infinite alternate;
	left: calc(var(--left, 0) * (var(--width, 4px) + var(--space, 2px)) - var(--width, 4px));
}

@keyframes sound {
	0% {
		opacity: 0.75;
		transform: translateY(20%);
	}

	100% {
		opacity: 1;
		transform: translateY(-40%);
	}
}

.bar:nth-child(1) {
	--left: 1;
	animation-duration: 400ms;
	animation-delay: -600ms;
	filter: brightness(calc(var(--brightness) * 1.3)) saturate(1.2);
}

.bar:nth-child(2) {
	--left: 2;
	animation-duration: 400ms;
	animation-delay: -800ms;
	filter: brightness(calc(var(--brightness) * 0.7)) saturate(0.8);
}

.bar:nth-child(3) {
	--left: 3;
	animation-duration: 400ms;
	animation-delay: -200ms;
	filter: brightness(calc(var(--brightness) * 1.2)) saturate(2.4);
}

.bar:nth-child(4) {
	--left: 4;
	animation-duration: 400ms;
	animation-delay: 0ms;
	filter: brightness(calc(var(--brightness) * 0.5)) saturate(0.8);
}

.bar:nth-child(5) {
	--left: 5;
	animation-duration: 400ms;
	animation-delay: 400ms;
	filter: brightness(calc(var(--brightness) * 1.3)) saturate(0.8);
}

.bars.paused .bar {
	animation: none;
}
</style>
