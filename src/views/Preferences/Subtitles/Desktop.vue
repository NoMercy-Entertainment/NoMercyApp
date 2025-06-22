<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';
import { useLocalStorage } from '@vueuse/core';

import {
	defaultSubtitleStyles,
	edgeStyles,
	fontFamilies,
} from '@/lib/VideoPlayer/plugins/UIPlugin/buttons';
import type { SubtitleStyle } from '@nomercy-entertainment/nomercy-video-player/src/types';

import { getEdgeStyle, parseColorToHex } from '@/types/config';

import ColorPicker from './components/ColorPicker.vue';
import SliderBar from './components/SliderBar.vue';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

const currentStyle = useLocalStorage<SubtitleStyle>(
	'nmplayer-subtitle-style',
	defaultSubtitleStyles,
);

const currentFontFamily = ref<(typeof fontFamilies)[number]>();
const currentEdgeStyle = ref<(typeof edgeStyles)[number]>();

onMounted(() => {
	console.raw(
		fontFamilies,
		currentStyle.value.fontFamily,
		fontFamilies.find(f => f.value === currentStyle.value.fontFamily),
	);
	console.raw(
		edgeStyles,
		currentStyle.value.edgeStyle,
		edgeStyles.find(e => e.value === currentStyle.value.edgeStyle),
	);

	currentFontFamily.value = fontFamilies.find(
		f => f.value === currentStyle.value.fontFamily,
	);
	currentEdgeStyle.value = edgeStyles.find(
		e => e.value === currentStyle.value.edgeStyle,
	);
});

const areaStyle = computed(() => {
	return {
		fontSize: '26px',
		fontFamily: 'ReithSans, sans-serif',
		color: 'white',
		textShadow: '',
		width: '100%',
		bottom: '0',
		backgroundColor: parseColorToHex(
			currentStyle.value.areaColor,
			currentStyle.value.windowOpacity / 100,
		),
	};
});

const textStyle = computed(() => {
	return {
		fontSize: `calc(26px * ${currentStyle.value.fontSize / 100})`,
		fontFamily: currentFontFamily.value?.value,
		color: parseColorToHex(
			currentStyle.value.textColor,
			currentStyle.value.textOpacity / 100,
		),
		textShadow: getEdgeStyle(
			currentStyle.value.edgeStyle,
			currentStyle.value.textOpacity / 100,
		),
		backgroundColor: parseColorToHex(
			currentStyle.value.backgroundColor,
			currentStyle.value.backgroundOpacity / 100,
		),
	};
});

watch(currentFontFamily, (value) => {
	if (!value)
		return;
	currentStyle.value = {
		...currentStyle.value,
		fontFamily: value.value,
	};
});

watch(currentEdgeStyle, (value) => {
	if (!value)
		return;
	currentStyle.value = {
		...currentStyle.value,
		edgeStyle: value.value,
	};
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				:grid-style="4"
				title="Subtitle settings"
				:allow-anyone="true"
			>
				<template #cta>
					<!--          <Button id="invite" color="theme" startIcon="userAdd" @click="{}"> -->
					<!--            {{ $t('Invite user') }} -->
					<!--          </Button> -->
				</template>

				<div class="h-auto w-full gap-4 flex flex-col">
					<div
						id="player1-subtitle-window"
						class="relative w-3/4 mx-auto h-40 overflow-clip rounded-md"
					>
						<img
							src="https://app.nomercy.tv/tmdb-images/eplbcueeqEz6qUilG1HTVz1smEE.jpg"
							alt=""
							class="absolute inset-0 object-cover object-[0_75%] w-full h-full"
						>
						<div id="player1-subtitle-overlay" class="subtitle-overlay">
							<div id="player1-subtitle-safezone" class="subtitle-safezone">
								<div
									id="player1-subtitle-area"
									class="subtitle-area sized aligned-center"
									:style="areaStyle"
								>
									<span
										id="player1-subtitle-text"
										class="subtitle-text"
										:style="textStyle"
									>
										English subtitle 1 -Unforced- (00:00:01.000)
									</span>
								</div>
							</div>
						</div>
					</div>

					<div
						class="h-auto w-full justify-center flex-wrap content-start gap-4 flex mx-auto sm:flex-nowrap"
					>
						<div class="col-span-1 col-start-1 flex flex-col gap-4 w-1/4">
							<SliderBar
								:min="0"
								:max="200"
								:step="1"
								:percentage="100"
								:position="100"
								title="Text size"
								type="fontSize"
								color="textColor"
							/>
							<Select
								v-model="currentFontFamily"
								title="Font family"
								type="fontFamily"
								:options="[...fontFamilies]"
								option-label="name"
							/>
							<Select
								v-model="currentEdgeStyle"
								title="Edge style"
								type="edgeStyle"
								:options="[...edgeStyles]"
								option-label="name"
							/>
						</div>

						<div
							class="col-span-1 col-start-2 flex flex-col gap-4 justify-center"
						>
							<ColorPicker title="Text color" type="textColor" />
							<ColorPicker title="Background color" type="backgroundColor" />
							<ColorPicker title="Window color" type="areaColor" />
						</div>

						<div class="col-span-1 col-start-3 flex flex-col gap-4 w-1/4">
							<SliderBar
								:min="0"
								:max="100"
								:step="1"
								title="Text opacity"
								color="textColor"
								type="textOpacity"
							/>
							<SliderBar
								:min="0"
								:max="100"
								:step="1"
								title="Background opacity"
								color="backgroundColor"
								type="backgroundOpacity"
							/>
							<SliderBar
								:min="0"
								:max="100"
								:step="1"
								title="Window opacity"
								color="areaColor"
								type="windowOpacity"
							/>
						</div>
					</div>
				</div>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>

<style scoped>
.subtitle-overlay {
	bottom: 3em;
	left: 0;
	pointer-events: none;
	position: absolute;
	right: 0;
	top: 0;
	z-index: 0;
}
.subtitle-safezone {
	position: absolute;
	inset: 0px;
}
.subtitle-area {
	direction: ltr;
	writing-mode: horizontal-tb;
	unicode-bidi: plaintext;
	white-space: pre-line;
	position: absolute;
	height: fit-content;
}
.subtitle-area.sized {
	left: 0;
	width: 100%;
}
.subtitle-area.aligned-center {
	text-align: center;
}
</style>
