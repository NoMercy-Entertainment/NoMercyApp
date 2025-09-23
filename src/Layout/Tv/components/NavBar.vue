<script lang="ts" setup>
import { IonHeader, IonToolbar } from '@ionic/vue';

import { user } from '@/store/user';
import { navBarVisible } from '@/store/ui';
import { isHomeRoute, isLibraryRoute, isMusicRoute } from '@/store/routeState';
import { currentSong, isPlaying, openFullPlayer } from '@/store/audioPlayer';

import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import Marquee from '@/components/Marquee.vue';
import EqSpinner from '@/components/Images/EqSpinner.vue';

import NavBarButton from './NavBarButton.vue';
import PlayerIcon from '@/components/Images/icons/PlayerIcon.vue';
</script>

<template>
	<IonHeader
		v-if="navBarVisible"
		class="pt-safe transition-all duration-200 !h-[104px] text-surface-12"
		mode="md"
	>
		<IonToolbar mode="md">
			<div class="flex justify-between items-center w-full relative px-14 h-14">
				<button
					v-if="currentSong"
					class="flex w-60 -ml-1.5 -mr-48 h-10 my-auto bg-theme-8 pr-2 rounded-full overflow-clip focus:outline-none focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline"
					@click="openFullPlayer()"
				>
					<div
						class="relative w-10 h-10 aspect-square rounded-full overflow-clip"
					>
						<CoverImage
							:alt="currentSong.name"
							:class="{
								'': isPlaying,
							}"
							:data="currentSong"
							class="w-auto h-full aspect-square absolute top-0 left-0 brightness-50"
						/>

						<div
							class="flex items-center justify-center w-auto h-full aspect-square absolute top-0 left-0"
						>
							<EqSpinner v-if="isPlaying" :playing="isPlaying" />
							<PlayerIcon v-else class="w-5 h-5" icon="nmPause" />
						</div>
					</div>

					<div
						class="w-[calc(100%-30px)] flex flex-col justify-center items-start gap-1.5 mr-2 overflow-clip py-0.5 rounded-r-full text-surface-12"
					>
						<Marquee
							:text="currentSong.name"
							class="px-2 children:pr-4 text-2xs leading-none !flex-grow-0"
						/>
						<span class="pl-2 text-3xs line-clamp-1 leading-none">
							{{ currentSong.artist_track?.map(at => at.name).join(', ') }}
						</span>
					</div>
				</button>
				<AppLogoSquare v-else class="w-10 h-10" />

				<div
					class="flex justify-start items-start flex-grow-0 flex-shrink-0 gap-3"
				>
					<NavBarButton
						:active="isHomeRoute"
						href="/home"
						icon="home1"
						name="Home"
					/>
					<NavBarButton
						:active="isLibraryRoute"
						href="/libraries"
						icon="folder"
						name="Libraries"
					/>
					<NavBarButton
						:active="isMusicRoute"
						href="/music/start"
						icon="noteSixteenth"
						name="Music"
					/>
				</div>

				<RouterLink
					class="relative flex flex-col rounded-full bg-black size-10 my-1"
					to="/setup/select-servers"
				>
					<NoMercyAvatar
						:size="40"
						:user="user"
						class="absolute focus-visible:ring-2 ring-inset focus-visible:ring-white"
					/>
					<span
						class="absolute rounded-full border-white bg-green-600 size-[25%] bottom-[5%] end-[5%] border-[0.125rem] dark:border-stone-900"
					/>
				</RouterLink>
			</div>
		</IonToolbar>
	</IonHeader>
</template>

<style scoped>
ion-header {
	background: transparent !important;
}

ion-toolbar {
	--min-height: 80px;
	--padding-top: 1.5rem;
	--padding-bottom: 16px;
	--background: transparent !important;
}

ion-header {
	box-shadow: none;
}
</style>
