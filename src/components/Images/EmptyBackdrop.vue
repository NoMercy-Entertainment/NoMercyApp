<script setup lang="ts"></script>

<template>
	<!--  <svg -->
	<!--      width="100%" -->
	<!--      height="100%" -->
	<!--      viewBox="0 0 575 575" -->
	<!--      fill="none" -->
	<!--      xmlns="http://www.w3.org/2000/svg" -->
	<!--      class="w-screen h-screen absolute" -->
	<!--      preserveAspectRatio="none" -->
	<!--  > -->
	<!--    <g opacity="0.5"> -->
	<!--      <mask -->
	<!--          id="mask0_2280_31236" -->
	<!--          style="mask-type:alpha" -->
	<!--          maskUnits="userSpaceOnUse" -->
	<!--          x="-50%" -->
	<!--          y="-50%" -->
	<!--          width="100vw" -->
	<!--          height="100vw" -->
	<!--      > -->
	<!--        <circle cx="2" cy="2" r="573" fill="url(#paint0_radial_2280_31236)"></circle> -->
	<!--      </mask> -->
	<!--      <g mask="url(#mask0_2280_31236)"> -->
	<!--        <circle cx="2" cy="2" r="573" fill="rgb(var(&#45;&#45;color-theme-6))"></circle> -->
	<!--      </g> -->
	<!--    </g> -->
	<!--    <defs> -->
	<!--      <radialGradient -->
	<!--          id="paint0_radial_2280_31236" -->
	<!--          cx="0" -->
	<!--          cy="0" -->
	<!--          r="1" -->
	<!--          gradientUnits="userSpaceOnUse" -->
	<!--          color-interpolation="linearRGB" -->
	<!--          color-rendering="optimizeQuality" -->
	<!--          gradientTransform="translate(2 2) rotate(-90) scale(573)" -->
	<!--      > -->
	<!--        <stop stop-color="rgb(var(&#45;&#45;color-theme-6))" offset="0"></stop> -->
	<!--        <stop offset="1" stop-color="rgb(var(&#45;&#45;color-theme-6))" stop-opacity="0"></stop> -->
	<!--      </radialGradient> -->
	<!--    </defs> -->
	<!--  </svg -->
	<!--  > -->
	<div class="bg" />
</template>

<style scoped>
.bg {
	width: 100%;
	height: 100%;
	position: absolute;
	background: radial-gradient(
		circle at 10% -10%,
		hsl(from rgb(var(--color-focus)) h s 30% / 80%),
		hsl(from rgb(var(--color-focus)) h s 30% / 60%),
		hsl(from rgb(var(--color-focus)) h s 30% / 40%),
		hsl(from rgb(var(--color-focus)) h s 30% / 20%),
		hsl(from rgb(var(--color-focus)) h s 30% / 5%),
		hsl(from rgb(var(--color-focus)) h s 30% / 0%),
		hsl(from rgb(var(--color-focus)) h s 30% / 0%)
	);
}
</style>
