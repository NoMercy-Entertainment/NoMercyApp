<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import {
	IonIcon,
	IonItem,
	IonList,
	IonRippleEffect,
	isPlatform,
} from '@ionic/vue';
import {
	arrowRefreshVertical,
	doorOpen,
	gridMasonry,
	monitor,
	moonDiagonal,
	serverSwitch,
} from '@Icons/index';

import { darkMode } from '@/store/colorScheme';

import ProfileMenuServerSection from '@/Layout/Mobile/components/ProfileMenuServerSection.vue';
import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';

import Toggle from '@/components/Forms/Toggle.vue';
import { logout } from '@/lib/auth/index';
import { closeMenu, menuOpen } from '@/store/profileMenu';
import { Browser } from '@capacitor/browser';
import { phonePortrait } from 'ionicons/icons';
import { isTv, tvModeOverride } from '@/config/global';

const reload = () => window.location.reload();

const route = useRoute();
async function handleOpenApp() {
	if (isPlatform('android')) {
		Browser.open({ url: `nomercy://${route.path}` }).then(() => {
			setTimeout(async () => {
				await Browser.open({ url: `nomercy://${route.path}` });
			}, 1000);
		});
	}
}
</script>

<template>
	<BottomFlyout :menu-open="menuOpen" :close-menu="closeMenu">
		<IonList>
			<IonItem lines="inset">
				<ProfileMenuServerSection />
			</IonItem>

			<IonItem lines="inset">
				<RouterLink
					to="/setup/select-servers"
					class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
				>
					<IonRippleEffect />
					<div class="flex-grow-0 flex-shrink-0 w-1 h-3.5" />
					<IonIcon
						aria-hidden="true"
						:icon="serverSwitch"
						class-name="size-6 min-w-6"
					/>
					<div
						class="flex justify-center items-center flex-grow relative gap-2 pl-2"
					>
						<p class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("Switch server") }}
						</p>
					</div>
				</RouterLink>
			</IonItem>

			<IonItem lines="none">
				<RouterLink
					to="/preferences/display"
					class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
				>
					<IonRippleEffect />
					<div class="flex-grow-0 flex-shrink-0 w-1 h-3.5" />
					<IonIcon
						aria-hidden="true"
						:icon="monitor"
						class-name="size-6 min-w-6"
					/>
					<div
						class="flex justify-center items-center flex-grow relative gap-2 pl-2"
					>
						<p class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("Preferences") }}
						</p>
					</div>
				</RouterLink>
			</IonItem>

			<IonItem lines="none">
				<RouterLink
					to="/dashboard/system"
					class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
				>
					<IonRippleEffect />
					<div class="flex-grow-0 flex-shrink-0 w-1 h-3.5" />
					<IonIcon
						aria-hidden="true"
						:icon="gridMasonry"
						class-name="size-6 min-w-6"
					/>
					<div
						class="flex justify-center items-center flex-grow relative gap-2 pl-2"
					>
						<p class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("System") }}
						</p>
					</div>
				</RouterLink>
			</IonItem>

			<IonItem lines="none">
				<button
					no-ring
					class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
					@click="reload()"
				>
					<IonRippleEffect />
					<div class="flex-grow-0 flex-shrink-0 w-1 h-3.5" />
					<IonIcon
						aria-hidden="true"
						:icon="arrowRefreshVertical"
						class-name="size-6 min-w-6"
					/>
					<div
						class="flex justify-center items-center flex-grow relative gap-2 pl-2"
					>
						<p class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("Refresh") }}
						</p>
					</div>
				</button>
			</IonItem>

			<IonItem
				v-if="!isPlatform('capacitor') && isPlatform('android')"
				lines="none"
			>
				<button
					no-ring
					class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
					@click="handleOpenApp"
				>
					<IonRippleEffect />
					<div class="flex-grow-0 flex-shrink-0 w-1 h-3.5" />
					<IonIcon
						aria-hidden="true"
						:icon="phonePortrait"
						class-name="size-6 min-w-6"
					/>
					<div
						class="flex justify-center items-center flex-grow relative gap-2 pl-2"
					>
						<p class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("Open in App") }}
						</p>
					</div>
				</button>
			</IonItem>

			<IonItem lines="none">
				<button
					no-ring
					class="flex justify-center items-center self-stretch w-available h-full flex-grow-0 flex-shrink-0 relative pl-2 py-2.5 rounded-md bg-transparent border border-transparent"
					@click="darkMode = !darkMode"
				>
					<IonIcon
						aria-hidden="true"
						:icon="moonDiagonal"
						class-name="size-6 min-w-6"
					/>

					<label
						for="ion-tg-0"
						class="flex justify-center items-center flex-grow relative gap-2 px-2 w-available"
					>
						<span class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("Dark mode") }}
						</span>
					</label>

					<Toggle :model-value="darkMode" class="pointer-events-none" />
				</button>
			</IonItem>

			<IonItem v-show="!isTv && !isPlatform('mobileweb')" lines="inset">
				<button
					no-ring
					class="flex justify-center items-center self-stretch w-available h-full flex-grow-0 flex-shrink-0 relative pl-2 py-2.5 rounded-md bg-transparent border border-transparent"
					@click="tvModeOverride = !tvModeOverride"
				>
					<IonIcon
						aria-hidden="true"
						:icon="monitor"
						class-name="size-6 min-w-6"
					/>

					<label
						for="ion-tg-0"
						class="flex justify-center items-center flex-grow relative gap-2 px-2 w-available"
					>
						<span class="flex-grow w-full text-lg font-medium text-left">
							{{
								tvModeOverride ? $t("Disable TV mode") : $t("Enable TV mode")
							}}
						</span>
					</label>

					<Toggle :model-value="tvModeOverride" class="pointer-events-none" />
				</button>
			</IonItem>

			<IonItem lines="none">
				<button
					no-ring
					class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
					@click="logout()"
				>
					<IonRippleEffect />
					<div class="flex-grow-0 flex-shrink-0 w-1 h-3.5" />
					<IonIcon
						aria-hidden="true"
						:icon="doorOpen"
						class-name="size-6 min-w-6"
					/>
					<div
						class="flex justify-center items-center flex-grow relative gap-2 pl-2"
					>
						<p class="flex-grow w-full text-lg font-medium text-left">
							{{ $t("Logout") }}
						</p>
					</div>
				</button>
			</IonItem>
		</IonList>
	</BottomFlyout>
</template>

<style scoped>
ion-list {
	@apply bg-transparent w-[96%];
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
