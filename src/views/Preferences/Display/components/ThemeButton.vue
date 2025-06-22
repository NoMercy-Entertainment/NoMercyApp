<script setup lang="ts">
import type { PropType } from 'vue';

import type { themeColors } from '@/lib/colorHelper';
import { colorTheme, setColorTheme } from '@/store/colorTheme';

defineProps({
	theme: {
		type: Object as PropType<(typeof themeColors)[0]>,
		required: true,
	},
});
</script>

<template>
	<button
		:title="theme?.title"
		class="relative box-border flex h-7 w-7 min-w-7 min-h-7 transform cursor-pointer items-center justify-center rounded-full outline-none transition-transform hover:scale-105 hover:shadow-md"
		:style="`
          background: ${
			colorTheme === theme.title ? 'transparent' : theme.color
		};
      `"
		@click="setColorTheme(theme.title)"
	>
		<span
			class="w-full h-full rounded-full overflow-clip"
			:style="`
            border: 2px solid ${theme.color};
         `"
		>
			<div
				style="
          transition: height 100ms ease 0s, width 100ms ease 0s;
          transform-origin: left top;
        "
				class="rounded-full w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
				:style="`
          background: ${theme.color};
       `"
			/>
		</span>
	</button>
</template>
