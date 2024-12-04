<script setup lang="ts">
import { PropType } from 'vue';

import {backgroundColors} from '@/lib/colorHelper';
defineProps({
	background: {
		type: Object as PropType<typeof backgroundColors[0]>,
		required: true,
	},
});

</script>

<template>
<!--    <div :title="background?.title"-->
<!--         :onclick="() => setBackgroundColor(background.title)"-->
<!--         class="relative mr-3 mb-3 box-border flex h-7 w-7 transform cursor-pointer items-center justify-center rounded-full outline-none transition-transform p-[3px] hover:scale-105 hover:shadow-md"-->
<!--         :style="`-->
<!--            background: ${background.color};-->
<!--            box-shadow: ${background.color} 0px 0px 5px;`">-->
<!--        <div style="-->
<!--             &#45;&#45;circle-point-background-color: #fff;-->
<!--             transition: height 100ms ease 0s, width 100ms ease 0s;"-->
<!--             class="rounded-full bg-[var(&#45;&#45;circle-point-background-color)]"-->
<!--            :class="background.title === currentBackground ? 'w-full h-full' : 'w-0 h-0'">-->
<!--        </div>-->
<!--    </div>-->
</template>
