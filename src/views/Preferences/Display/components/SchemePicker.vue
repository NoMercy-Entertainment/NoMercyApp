<script setup lang="ts">
import { watch } from 'vue';

import { useColorMode } from '@vueuse/core';
import { darkMode, setColorScheme } from '@/store/colorScheme';
import type { ColorScheme } from '@/types/config';

const scheme = useColorMode({
	attribute: 'class',
	modes: {
		light: 'light',
		system: 'system',
		dark: 'dark',
	},
});

watch(darkMode, (value) => {
	console.log(value);
	if (value) {
		changeTheme('dark');
	}
	else {
		changeTheme('light');
	}
});

function changeTheme(value: ColorScheme) {
	scheme.value = value;

	setColorScheme(value);
}
</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold">
			{{ $t("Scheme") }}
		</p>
		<div class="flex flex-row gap-2">
			<div
				class="flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2"
			>
				<button
					id="light"
					title="Light"
					class="relative flex h-8 w-8 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl outline border-2"
					:class="
						scheme === 'light' ? 'outline-[#6e56cf]' : 'outline-transparent'
					"
					@click="changeTheme('light')"
				>
					<svg
						width="32"
						height="32"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="flex-shrink-0 flex-grow-0"
						preserveAspectRatio="xMidYMid meet"
					>
						<circle cx="15.0002" cy="15" r="15" fill="#EEECEC" />
					</svg>
				</button>
				<!--                <button id="auto" title="System default" @click="changeTheme('system')" -->
				<!--                    class="relative flex h-8 w-8 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl outline outline-2" -->
				<!--                    :class="scheme === 'system' -->
				<!--                        ? 'outline-[#6e56cf]' -->
				<!--                        : 'outline-transparent'"> -->
				<!--                    <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" -->
				<!--                        class="flex-shrink-0 flex-grow-0 opacity-80" preserveAspectRatio="xMidYMid meet"> -->
				<!--                        <circle opacity="0.8" cx="15.0005" cy="15" r="15" fill="url(#paint0_linear_4609_14480)"> -->
				<!--                        </circle> -->
				<!--                        <defs> -->
				<!--                            <linearGradient id="paint0_linear_4609_14480" x1="0.333822" y1="0.333333" x2="30.3338" -->
				<!--                                y2="30.3333" gradientUnits="userSpaceOnUse"> -->
				<!--                                <stop offset="0.479993" stop-color="#EEECEC"></stop> -->
				<!--                                <stop offset="0.480523" stop-color="rgb(var(&#45;&#45;color-slate-1))"></stop> -->
				<!--                            </linearGradient> -->
				<!--                        </defs> -->
				<!--                    </svg> -->
				<!--                </button> -->
				<button
					id="dark"
					title="Dark"
					class="relative flex h-8 w-8 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl outline outline-2"
					:class="scheme === 'dark' ? 'outline-[#6e56cf]' : 'border-transparent'"
					@click="changeTheme('dark')"
				>
					<svg
						width="32"
						height="32"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="flex-shrink-0 flex-grow-0 opacity-80"
						preserveAspectRatio="xMidYMid meet"
					>
						<circle
							opacity="0.8"
							cx="15.0005"
							cy="15"
							r="15"
							fill="rgb(var(--color-slate-1))"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
