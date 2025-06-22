<script setup lang="ts">
import {
	closeEqualizerMenu,
	equalizerMenuOpen,
	setEqualizerMenuOpen,
} from '@/store/audioPlayer';

import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import EqualizerPannel from '@/components/MusicPlayer/components/EqualizerPannel.vue';

function handleClose() {
	setEqualizerMenuOpen(false);
}
</script>

<template>
	<Teleport to="body">
		<BottomFlyout
			:menu-open="equalizerMenuOpen"
			:close-menu="closeEqualizerMenu"
			:allow-swipe-to-close="false"
		>
			<div
				id="equalizer"
				class="flex flex-col w-available -mt-4 gap-4 p-4 z-[9999]"
			>
				<EqualizerPannel>
					<template #button>
						<button @click="handleClose()">
							<OptimizedIcon icon="cross" class="w-6 h-6" />
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
	--color: rgb(var(--color-text));
}

ion-item::part(detail-icon) {
	color: white;
	opacity: 1;
	font-size: 20px;
}
</style>
