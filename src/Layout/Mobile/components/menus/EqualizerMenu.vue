<script lang="ts" setup>
import { closeEqualizerMenu, equalizerMenuOpen, setEqualizerMenuOpen } from '@/store/audioPlayer';

import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';
import EqualizerPannel from '@/components/MusicPlayer/components/EqualizerPannel.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

function handleClose() {
	setEqualizerMenuOpen(false);
}
</script>

<template>
	<Teleport to="body">
		<BottomFlyout
			:allow-swipe-to-close="false"
			:close-menu="closeEqualizerMenu"
			:menu-open="equalizerMenuOpen"
		>
			<div
				id="equalizer"
				class="flex flex-col w-available -mt-4 gap-4 p-4 z-[9999]"
			>
				<EqualizerPannel>
					<template #button>
						<button @click="handleClose()">
							<MoooomIcon class="w-6 h-6" icon="cross" />
						</button>
					</template>
				</EqualizerPannel>
			</div>
		</BottomFlyout>
	</Teleport>
</template>

<style scoped>
input[type='range'].vertical {
	writing-mode: vertical-lr;
}

ion-list {
	@apply bg-transparent w-full;
}

ion-item {
	--background: transparent;
	--color: var(--color-text);
}

ion-item::part(detail-icon) {
	color: white;
	opacity: 1;
	font-size: 20px;
}
</style>
