<script lang="ts" setup>
import { scheme } from '@/store/colorScheme';
import type { ColorScheme } from '@/types/config';

function changeTheme(value: ColorScheme) {
	scheme.value = value;
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
					:class="
						scheme === 'light' ? 'outline-focus' : 'outline-transparent'
					"
					class="relative flex h-8 w-8 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl outline border-2"
					title="Light"
					@click="changeTheme('light')"
				>
					<svg
						class="flex-shrink-0 flex-grow-0"
						fill="none"
						height="32"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 30 30"
						width="32"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle cx="15.0002" cy="15" fill="#EEECEC" r="15" />
					</svg>
				</button>
				<button id="auto" :class="scheme === 'system'
						? 'outline-focus'
						: 'outline-transparent'" class="relative flex h-8 w-8 flex-shrink-0 flex-grow-0 items-center justify-center rounded-full outline outline-2"
					title="System default"
					@click="changeTheme('system')"
				>
					<!--        square div NO SVG with a diagonal separation white and black  -->
					<div class="absolute inset-0 rounded-full"
						style="background: linear-gradient(
                -45deg,
                var(--surface-1),
                var(--surface-1) 50%,
                var(--surface-12) 50%,
                var(--surface-12)
              );"
					/>
				</button>
				<button
					id="dark"
					:class="scheme === 'dark' ? 'outline-focus' : 'border-transparent'"
					class="relative flex h-8 w-8 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl outline outline-2"
					title="Dark"
					@click="changeTheme('dark')"
				>
					<svg
						class="flex-shrink-0 flex-grow-0 opacity-80"
						fill="none"
						height="32"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 30 30"
						width="32"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="15.0005"
							cy="15"
							fill="black"
							opacity="0.8"
							r="15"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>
