<script setup lang="ts">
defineProps({
  playing: {
    type: Boolean,
    required: true,
  },
  color: {
    type: String,
    required: false,
    default: 'rgb(var(--color-theme-6))',
  },
});
</script>

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
  background: rgb(var(--color-focus, var(--color-theme-6)));
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
    opacity: .75;
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

<template>
  <div class="bars w-5 h-5 flex gap-0.5 relative" :class="{ paused: !playing }">
    <div class="bar w-px h-full"></div>
    <div class="bar w-px h-full"></div>
    <div class="bar w-px h-full"></div>
    <div class="bar w-px h-full"></div>
    <div class="bar w-px h-full"></div>
  </div>
  <!--    <svg xmlns="http://www.w3.org/2000/svg"-->
  <!--         width="20px"-->
  <!--         height="20px"-->
  <!--         viewBox="0 0 100 100"-->
  <!--         class="will-change-auto [transform:translateZ(0)]"-->
  <!--         style="background: rgba(241, 242, 243, 0); display: block;">-->
  <!--        <g transform="rotate(180 50 50)">-->
  <!--            <rect x="11.666666666666668"-->
  <!--                  y="12.5"-->
  <!--                  width="10"-->
  <!--                  height="40"-->
  <!--                  :fill="color"-->
  <!--                  style="filter: brightness(1.5) saturate(1.2);">-->
  <!--                <animate attributeName="height"-->
  <!--                         calcMode="spline"-->
  <!--                         values="50;75;10;50"-->
  <!--                         :keyTimes="playing-->
  <!--                             ? '0;0.33;0.66;1'-->
  <!--                             : '0;0;0;0'"-->
  <!--                         dur="1s"-->
  <!--                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"-->
  <!--                         repeatCount="indefinite"-->
  <!--                         begin="-0.6s"></animate>-->
  <!--            </rect>-->
  <!--            <rect x="28.333333333333336"-->
  <!--                  y="12.5"-->
  <!--                  width="10"-->
  <!--                  height="40"-->
  <!--                  :fill="color"-->
  <!--                  style="filter: brightness(1.2) saturate(0.8);">-->
  <!--                <animate attributeName="height"-->
  <!--                         calcMode="spline"-->
  <!--                         values="50;75;10;50"-->
  <!--                         :keyTimes="playing-->
  <!--                             ? '0;0.33;0.66;1'-->
  <!--                             : '0;0;0;0'"-->
  <!--                         dur="1s"-->
  <!--                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"-->
  <!--                         repeatCount="indefinite"-->
  <!--                         begin="-0.8s"></animate>-->
  <!--            </rect>-->
  <!--            <rect x="45"-->
  <!--                  y="12.5"-->
  <!--                  width="10"-->
  <!--                  height="40"-->
  <!--                  :fill="color"-->
  <!--                  style="filter: brightness(3) saturate(0.5);">-->
  <!--                <animate attributeName="height"-->
  <!--                         calcMode="spline"-->
  <!--                         values="50;75;10;50"-->
  <!--                         :keyTimes="playing-->
  <!--                             ? '0;0.33;0.66;1'-->
  <!--                             : '0;0;0;0'"-->
  <!--                         dur="1s"-->
  <!--                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"-->
  <!--                         repeatCount="indefinite"-->
  <!--                         begin="-0.2s"></animate>-->
  <!--            </rect>-->
  <!--            <rect x="61.66666666666667"-->
  <!--                  y="12.5"-->
  <!--                  width="10"-->
  <!--                  height="40"-->
  <!--                  :fill="color"-->
  <!--                  style="filter: brightness(1.2) saturate(0.8);">-->
  <!--                <animate attributeName="height"-->
  <!--                         calcMode="spline"-->
  <!--                         values="50;75;10;50"-->
  <!--                         :keyTimes="playing-->
  <!--                             ? '0;0.33;0.66;1'-->
  <!--                             : '0;0;0;0'"-->
  <!--                         dur="1s"-->
  <!--                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"-->
  <!--                         repeatCount="indefinite"-->
  <!--                         begin="0s"></animate>-->
  <!--            </rect>-->
  <!--            <rect x="78.33333333333333"-->
  <!--                  y="12.5"-->
  <!--                  width="10"-->
  <!--                  height="40"-->
  <!--                  :fill="color"-->
  <!--                  style="filter: brightness(1.5) saturate(0.8);">-->
  <!--                <animate attributeName="height"-->
  <!--                         calcMode="spline"-->
  <!--                         values="50;75;10;50"-->
  <!--                         :keyTimes="playing-->
  <!--                             ? '0;0.33;0.66;1'-->
  <!--                             : '0;0;0;0'"-->
  <!--                         dur="1s"-->
  <!--                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"-->
  <!--                         repeatCount="indefinite"-->
  <!--                         begin="-0.4s"></animate>-->
  <!--            </rect>-->
  <!--        </g>-->
  <!--    </svg>-->
</template>
