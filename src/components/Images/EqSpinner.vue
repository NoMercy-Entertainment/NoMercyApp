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

<template>
    <svg xmlns="http://www.w3.org/2000/svg"
         width="20px"
         height="20px"
         viewBox="0 0 100 100"
         style="background: rgba(241, 242, 243, 0); display: block;">
        <g transform="rotate(180 50 50)">
            <rect x="11.666666666666668"
                  y="12.5"
                  width="10"
                  height="40"
                  :fill="color"
                  style="filter: brightness(1.5) saturate(1.2);">
                <animate attributeName="height"
                         calcMode="spline"
                         values="50;75;10;50"
                         :keyTimes="playing
                             ? '0;0.33;0.66;1'
                             : '0;0;0;0'"
                         dur="1s"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
                         repeatCount="indefinite"
                         begin="-0.6s"></animate>
            </rect>
            <rect x="28.333333333333336"
                  y="12.5"
                  width="10"
                  height="40"
                  :fill="color"
                  style="filter: brightness(1.2) saturate(0.8);">
                <animate attributeName="height"
                         calcMode="spline"
                         values="50;75;10;50"
                         :keyTimes="playing
                             ? '0;0.33;0.66;1'
                             : '0;0;0;0'"
                         dur="1s"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
                         repeatCount="indefinite"
                         begin="-0.8s"></animate>
            </rect>
            <rect x="45"
                  y="12.5"
                  width="10"
                  height="40"
                  :fill="color"
                  style="filter: brightness(3) saturate(0.5);">
                <animate attributeName="height"
                         calcMode="spline"
                         values="50;75;10;50"
                         :keyTimes="playing
                             ? '0;0.33;0.66;1'
                             : '0;0;0;0'"
                         dur="1s"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
                         repeatCount="indefinite"
                         begin="-0.2s"></animate>
            </rect>
            <rect x="61.66666666666667"
                  y="12.5"
                  width="10"
                  height="40"
                  :fill="color"
                  style="filter: brightness(1.2) saturate(0.8);">
                <animate attributeName="height"
                         calcMode="spline"
                         values="50;75;10;50"
                         :keyTimes="playing
                             ? '0;0.33;0.66;1'
                             : '0;0;0;0'"
                         dur="1s"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
                         repeatCount="indefinite"
                         begin="0s"></animate>
            </rect>
            <rect x="78.33333333333333"
                  y="12.5"
                  width="10"
                  height="40"
                  :fill="color"
                  style="filter: brightness(1.5) saturate(0.8);">
                <animate attributeName="height"
                         calcMode="spline"
                         values="50;75;10;50"
                         :keyTimes="playing
                             ? '0;0.33;0.66;1'
                             : '0;0;0;0'"
                         dur="1s"
                         keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1"
                         repeatCount="indefinite"
                         begin="-0.4s"></animate>
            </rect>
        </g>
    </svg>
</template>
