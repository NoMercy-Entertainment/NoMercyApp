<script lang="ts" setup>
import { computed } from 'vue';

import { closeFullPlayer, currentSong, musicSize } from '@/store/audioPlayer';

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
		:data-size="musicSize"
		class="flex h-16 w-full items-center justify-between"
	>
		<MusicButton
			:onclick="() => closeFullPlayer()"
			class="!min-w-12"
			label="close"
		>
			<OptimizedIcon class="h-6 w-6" icon="chevronDown" />
		</MusicButton>

		<div
			:class="{
				'mt-2': !isPlatform('capacitor'),
			}"
			class="relative flex flex-col gap-1"
		>
			<span
				v-if="playlistTitle"
				class="whitespace-pre text-center leading-none text-2xs"
			>{{ $t("Now playing") }}</span>
			<div
				v-if="playlistTitle"
				class="whitespace-pre-line text-pretty text-left leading-5 text-base"
			>
				{{ playlistTitle }}
			</div>
		</div>

		<DropdownMenu
			class="!min-w-12 flex items-center justify-center"
			orientation="vertical"
		>
			<template #button>
				<OptimizedIcon class="h-6 w-6" icon="menuDotsVertical" />
			</template>
			<template #default>
				<div class="flex flex-col gap-1 min-h-[85px]">
					<MusicButton :onclick="() => closeFullPlayer()" label="close">
						<OptimizedIcon class="h-6 w-6" icon="chevronDown" />
					</MusicButton>
					<MusicButton :onclick="() => closeFullPlayer()" label="close">
						<OptimizedIcon class="h-6 w-6" icon="chevronDown" />
					</MusicButton>
					<MusicButton :onclick="() => closeFullPlayer()" label="close">
						<OptimizedIcon class="h-6 w-6" icon="chevronDown" />
					</MusicButton>
				</div>
			</template>
		</DropdownMenu>
	</div>
</template>
