<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import type { MenuItem } from 'primevue/menuitem';
import ContextMenu from 'primevue/contextmenu';
import { Portal } from '@headlessui/vue';
import {
	disableScreensaver,
	imageModal,
	imageModalData,
	setImageModalData,
	setImageModalOpen,
	showImageModal,
	showScreensaver,
} from '@/store/imageModal';
import { pickPaletteColor, RGBString2hex } from '@/lib/colorHelper';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';
import { cardMenu, trackContextMenuItems } from '@/store/contextMenuItems';
import serverClient from '@/lib/clients/serverClient';

const showButton = ref(false);
const src = ref<string | null>();
const logoSrc = ref<string | undefined>();
const logoAspect = ref<number>(1);
const logoColor = ref<string>();
const overlayRef = ref<HTMLDivElement>();
const timeout = ref<NodeJS.Timeout>();
const timeout2 = ref<NodeJS.Timeout>();
const timeout3 = ref<NodeJS.Timeout>();

const imageBaseUrl = computed(() => {
	// return `${currentServer.value?.serverBaseUrl}/images/original`;
	return 'https://app.nomercy.tv/tmdb-images';
});

const delay = computed(() => {
	return showScreensaver.value ? 2400 : 400;
});

watch(imageModalData, (data) => {
	if (overlayRef?.value?.style) {
		overlayRef.value.style.opacity = '1';
	}

	if (!data)
		return;

	if (src.value === null && data.src) {
		src.value = `${imageBaseUrl.value}${data.src}?width=3840&type=avif&aspect_ratio=null`;
		logoColor.value = pickPaletteColor(data.color_palette?.image)
			?.replace('rgb(', '')
			.replace(')', '')
			.replace(/,/gu, ' ');

		timeout2.value = setTimeout(() => {
			handleLoaded();
			logoSrc.value = undefined;
			setTimeout(() => {
				logoSrc.value = data.meta?.logo?.src;
				logoAspect.value = data.meta?.logo?.aspectRatio || 1;
			}, 4000);
		}, delay.value);
	}
	else if (data.src) {
		timeout2.value = setTimeout(() => {
			handleLoaded();
			src.value = `${imageBaseUrl.value}${data.src}?width=3840&type=avif&aspect_ratio=null`;
			logoColor.value = pickPaletteColor(data.color_palette?.image)
				?.replace('rgb(', '')
				.replace(')', '')
				.replace(/,/gu, ' ');

			logoSrc.value = undefined;
			setTimeout(() => {
				logoSrc.value = `${data.meta?.logo?.src}?width=3840&type=avif&aspect_ratio=null`;
				logoAspect.value = data.meta?.logo?.aspectRatio || 1;
			}, 4000);
		}, delay.value);
	}
});

onBeforeUnmount(() => {
	clearTimeout(timeout.value);
	clearTimeout(timeout2.value);
	clearTimeout(timeout3.value);
});

function handleClose() {
	setImageModalOpen(false);
	setImageModalData(null);
	src.value = null;
}

function handleShowButtonToggle() {
	clearTimeout(timeout.value);
	timeout.value = setTimeout(() => {
		document
			.querySelector<HTMLDivElement>('#imageModal')
			?.classList
			.add('allchildren:cursor-none');
		showButton.value = true;
	}, 2000);
	showButton.value = false;
	document
		.querySelector<HTMLDivElement>('#imageModal')
		?.classList
		.remove('allchildren:cursor-none');
}

function handleLoaded() {
	setTimeout(() => {
		if (overlayRef.value) {
			overlayRef.value.style.opacity = '0';
		}
	}, delay.value);
}

function handleClick(e: MouseEvent | TouchEvent) {
	handleClose();
	e.stopPropagation();
	e.preventDefault();
	cardMenu.value.hide(e);
}

onMounted(() => {
	if (!showImageModal)
		return;

	window.addEventListener('mousemove', handleShowButtonToggle);
	return () => {
		window.removeEventListener('mousemove', handleShowButtonToggle);
		clearTimeout(timeout.value);
	};
});

enum WallpaperStyle {
	Fill,
	Fit,
	Stretch,
	Tile,
	Center,
	Span,
}

const wallpaperStyle = ref<WallpaperStyle>(WallpaperStyle.Fill);

function setAsWallpaper() {
	serverClient().post('dashboard/server/wallpaper', {
		path: imageModalData.value?.src,
		color: logoColor.value
			? RGBString2hex(`rgb(${logoColor.value})`)
			: imageModalData.value?.color_palette?.image?.darkVibrant ?? '',
		style: wallpaperStyle.value,
	});
}

async function downloadImage(url: string, name: string) {
	let imageDataUrl;
	try {
		const response = await axios.get(url, {
			responseType: 'blob', // Get the image as binary data
		});

		// Create a URL for displaying the image (optional)
		const blob = new Blob([response.data]);
		imageDataUrl = URL.createObjectURL(blob);

		// Save the image (in browser)
		const a = document.createElement('a');
		a.href = imageDataUrl;
		a.download = name;
		a.click();
	}
	catch (error) {
		console.error(error);
	}
}

async function copyImageToClipboard(imageUrl: string): Promise<void> {
	try {
		const response = await fetch(imageUrl);
		if (!response.ok) {
			throw new Error('Failed to fetch the image');
		}
		const blob = await response.blob();

		const clipboardItem = new window.ClipboardItem({
			[blob.type]: new Promise(resolve => resolve(blob)),
		});

		await navigator.clipboard.write([clipboardItem]);
		console.log('Image copied to clipboard successfully!');
	}
	catch (error) {
		console.error('Failed to copy image to clipboard:', error);
	}
}

function onRightClick(e: MouseEvent) {
	e.preventDefault();
	e.stopPropagation();
	trackContextMenuItems.value = [
		{
			label: 'Save image as...',
			icon: 'mooooom-download',
			command: () => {
				downloadImage(
					imageModalData.value?.src ?? '',
					imageModalData.value?.src ?? 'image',
				);
			},
		},
		{
			label: 'Copy image',
			icon: 'mooooom-fileCopy',
			command: () => {
				copyImageToClipboard(src.value ?? '');
			},
		},
		{
			label: 'Open image in new tab',
			icon: 'mooooom-bookOpenBookmark',
			command: () => {
				window.open(src.value ?? '');
			},
		},
		{
			label: 'Set as desktop wallpaper (Windows only)',
			icon: 'mooooom-monitor',
			items: [
				{
					label: 'Fill',
					icon: 'mooooom-monitor',
					command: () => {
						wallpaperStyle.value = WallpaperStyle.Fill;
						setAsWallpaper();
					},
				},
				{
					label: 'Fit',
					icon: 'mooooom-monitor',
					command: () => {
						wallpaperStyle.value = WallpaperStyle.Fit;
						setAsWallpaper();
					},
				},
				{
					label: 'Stretch',
					icon: 'mooooom-monitor',
					command: () => {
						wallpaperStyle.value = WallpaperStyle.Stretch;
						setAsWallpaper();
					},
				},
				{
					label: 'Center',
					icon: 'mooooom-monitor',
					command: () => {
						wallpaperStyle.value = WallpaperStyle.Center;
						setAsWallpaper();
					},
				},
				{
					label: 'Span',
					icon: 'mooooom-monitor',
					command: () => {
						wallpaperStyle.value = WallpaperStyle.Span;
						setAsWallpaper();
					},
				},
			],
		},
	];

	cardMenu.value.show(e);
}
</script>

<template>
	<Portal>
		<dialog
			id="imageModal"
			ref="imageModal"
			class="fixed inset-0 w-full z-[999999999] bg-auto-4 dark:bg-auto-9 m-0"
			@click="handleClick"
		>
			<div
				v-if="(showImageModal || showScreensaver) && !disableScreensaver"
				ref="overlayRef"
				:style="`--delay: ${showScreensaver ? '2400ms' : '400ms'}`"
				class="pointer-events-none fixed inset-0 bg-black w-available h-available z-999 transitioning-slower"
			/>
			<div
				class="fixed z-0 h-screen w-screen items-center border-solid border-black bg-black p-8 text-center left-50 border-1 transitioning-slower"
			>
				<img
					:src="src ?? ''"
					alt=""
					class="h-0 w-0 opacity-0"
					@load="handleLoaded"
				>
				<div
					class="absolute z-0 bg-center opacity-75 -inset-[50vh] w-[200vw] h-[400vh] bg-blur"
					:style="`background-image: url(${src});`"
				/>

				<button
					aria-hidden="true"
					tabindex="-1"
					class="absolute flex transitioning top-8 right-8 w-10 min-w-[2.5rem] h-10 min-h-[2.5rem] z-0 items-center justify-center disabled:opacity-50 disabled:text-auto-3 disabled:hover:!bg-transparent rounded-full overflow-clip hover:bg-transparent focus-visible:bg-transparent active:bg-transparent sm:focus-visible:bg-auto-4/80 sm:hover:bg-auto-4/80 pointer-events-auto"
					:class="!showButton && !showScreensaver ? 'flex' : 'hidden'"
					@click="handleClose"
				>
					<OptimizedIcon icon="cross" class="h-5 w-5" />
				</button>

				<ContextMenu
					ref="cardMenu"
					:model="trackContextMenuItems as MenuItem[]"
					class="!z-[999999999999999999999]"
				/>
				<div
					class="absolute inset-2 tv:inset-2 z-0 m-auto h-auto overflow-clip rounded-xl bg-cover bg-center bg-no-repeat opacity-90 shadow-img max-w-[82vw] max-h-[83vh] bg-image-blur md:inset-16"
					:style="`background-image: url(${src}); aspect-ratio: ${imageModalData?.aspectRatio}`"
					@contextmenu="onRightClick($event)"
				/>

				<div
					class="absolute inset-2 tv:inset-20 z-0 m-auto h-auto overflow-clip rounded-xl bg-cover bg-center bg-no-repeat shadow-img max-w-[82vw] max-h-[83vh] md:inset-24 pointer-events-none"
					:style="`background-image: url(${src}); aspect-ratio: ${imageModalData?.aspectRatio}; box-shadow: 0 0 800px 80px rgba(0,0,0,.2) inset;`"
					@contextmenu="onRightClick($event)"
				>
					<div
						class="absolute left-0 z-0 p-4 bottom:2 sm:bottom-6 sm:left-8 tv:bottom-4 tv:left-6"
					>
						<div
							class="pointer-events-none flex h-full w-full select-none items-start justify-start bg-cover min-h-[20vh] max-h-[20vh] min-w-[30vw] max-w-[30vw] tv:min-h-[15vh] tv:max-h-[15vh] tv:min-w-[30vw] tv:max-w-[30vw]"
						>
							<TMDBImage
								v-if="logoSrc"
								:key="logoSrc"
								:auto-shadow="true"
								:path="logoSrc"
								:shadow="logoColor"
								:size="500"
								class="w-auto object-contain h-available object-[0_0%] max-h-inherit !duration-700 children:!duration-700"
								class-name="relative h-auto w-auto self-start px-4 py-4 !items-start"
								type="logo"
							/>
						</div>
					</div>
				</div>

				<div
					class="absolute bottom-6 mx-auto -ml-8 flex w-full justify-center gap-8 text-crimson-11"
					:class="showButton && !showScreensaver ? 'flex' : 'hidden'"
				>
					<button
						aria-hidden="true"
						tabindex="-1"
						data-state="closed"
						class="z-0 flex h-10 w-10 items-center justify-center min-w-[2.5rem] min-h-[2.5rem]"
						style="opacity: 0.3"
					>
						<OptimizedIcon icon="arrowLeft" class="h-8 w-8 text-white/10" />
					</button>
					<button
						aria-hidden="true"
						tabindex="-1"
						data-state="closed"
						class="z-0 flex h-10 w-10 items-center justify-center transitioning min-w-[2.5rem] min-h-[2.5rem]"
						style="opacity: 0.3"
					>
						<OptimizedIcon icon="arrowRight" class="h-8 w-8 text-white/10" />
					</button>
				</div>
				<div
					class="absolute right-6 bottom-3 z-0 tv:h-12 h-20 tv:w-12 w-20 tv:right-3.5"
					:style="`--color-focus: ${logoColor ?? 'var(--color-theme-7)'};`"
				>
					<AppLogoSquare class="" />
				</div>
			</div>
		</dialog>
	</Portal>
</template>
