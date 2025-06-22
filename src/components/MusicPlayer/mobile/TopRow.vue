<script setup lang="ts">
import { computed } from 'vue';

import { closeFullPlayer, currentSong, musicSize } from '@/store/audioPlayer';
import { breakTitle2 } from '@/lib/stringArray';

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import { isPlatform } from '@ionic/vue';

const playlistTitle = computed(() => {
	return currentSong.value?.album_track?.[0]?.name;
});
</script>

<template>
	<div
		class="flex h-16 w-full items-center justify-between"
		:data-size="musicSize"
	>
		<MusicButton
			label="close"
			:onclick="() => closeFullPlayer()"
			class="!min-w-12"
		>
			<OptimizedIcon icon="chevronDown" class="h-6 w-6" />
		</MusicButton>

		<div
			class="relative flex flex-col gap-1"
			:class="{
				'mt-2': !isPlatform('capacitor'),
			}"
		>
			<span
				v-if="playlistTitle"
				class="whitespace-pre text-center leading-none text-2xs"
			>{{ $t("Now playing") }}</span>
			<div
				v-if="playlistTitle"
				class="whitespace-pre-line text-pretty text-left leading-5 text-base"
				v-html="breakTitle2(playlistTitle, 'text-xs line-clamp-1')"
			/>
		</div>

		<DropdownMenu
			orientation="vertical"
			class="!min-w-12 flex items-center justify-center"
		>
			<template #button>
				<OptimizedIcon icon="menuDotsVertical" class="h-6 w-6" />
			</template>
			<template #default>
				<div class="flex flex-col gap-1 min-h-[85px]">
					<MusicButton label="close" :onclick="() => closeFullPlayer()">
						<OptimizedIcon icon="chevronDown" class="h-6 w-6" />
					</MusicButton>
					<MusicButton label="close" :onclick="() => closeFullPlayer()">
						<OptimizedIcon icon="chevronDown" class="h-6 w-6" />
					</MusicButton>
					<MusicButton label="close" :onclick="() => closeFullPlayer()">
						<OptimizedIcon icon="chevronDown" class="h-6 w-6" />
					</MusicButton>
				</div>
			</template>
		</DropdownMenu>
	</div>
</template>
