<script lang="ts" setup>
import { RouterLink, useRoute } from 'vue-router';

import { scheme } from '@/store/colorScheme';

import ProfileMenuServerSection from '@/Layout/Mobile/components/ProfileMenuServerSection.vue';
import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';

import Toggle from '@/components/Forms/Toggle.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

import { logout } from '@/lib/auth/index';
import { currentServer } from '@/store/currentServer';
import { closeMenu, menuOpen } from '@/store/profileMenu';
import { launchAndroidApp, shouldShowAndroidPrompts } from '@/store/androidAppPrompt';
import servers from '@/store/servers.ts';

const reload = () => window.location.reload();

const route = useRoute();

function handleOpenApp() {
	launchAndroidApp(route.path);
}
</script>

<template>
	<BottomFlyout :close-menu="closeMenu" :menu-open="menuOpen">
		<div class="flex flex-col w-[96%] mx-auto">
			<div class="py-2 border-b border-surface-12/[0.08]">
				<ProfileMenuServerSection />
			</div>

			<div v-if="servers.length > 0" class="py-1 border-b border-surface-12/[0.08]">
				<RouterLink
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					to="/setup/select-servers"
				>
					<MoooomIcon class-name="w-8 h-8" icon="serverSwitch" />
					<p class="flex-grow pl-2 text-lg font-medium text-left">
						{{ $t("Switch server") }}
					</p>
				</RouterLink>
			</div>

			<div v-if="servers.length > 0" class="py-1">
				<RouterLink
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					to="/preferences/display"
				>
					<MoooomIcon class-name="w-8 h-8" icon="monitor" />
					<p class="flex-grow pl-2 text-lg font-medium text-left">
						{{ $t("Preferences") }}
					</p>
				</RouterLink>
			</div>

			<div v-if="servers.length > 0 && (currentServer?.is_owner || currentServer?.is_manager)" class="py-1">
				<RouterLink
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					to="/dashboard/system"
				>
					<MoooomIcon class-name="w-8 h-8" icon="gridMasonry" />
					<p class="flex-grow pl-2 text-lg font-medium text-left">
						{{ $t("System") }}
					</p>
				</RouterLink>
			</div>

			<div class="py-1">
				<button
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					@click="reload()"
				>
					<MoooomIcon class-name="w-8 h-8" icon="arrowRefreshVertical" />
					<p class="flex-grow pl-2 text-lg font-medium text-left">
						{{ $t("Refresh") }}
					</p>
				</button>
			</div>

			<div v-if="shouldShowAndroidPrompts" class="py-1">
				<button
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					@click="handleOpenApp"
				>
					<MoooomIcon class-name="w-8 h-8" icon="mobilePhone" />
					<p class="flex-grow pl-2 text-lg font-medium text-left">
						{{ $t("Open in App") }}
					</p>
				</button>
			</div>

			<div class="py-1">
				<button
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					@click="scheme = scheme === 'light' ? 'dark' : 'light'"
				>
					<MoooomIcon class-name="w-8 h-8" icon="moonDiagonal" />
					<label
						class="flex items-center flex-grow gap-2 px-2 w-available"
						for="toggleScheme"
					>
						<span class="flex-grow text-lg font-medium text-left">
							{{ $t("Dark mode") }}
						</span>
					</label>
					<Toggle
						id="toggleScheme"
						:model-value="scheme === 'dark'"
						@update:model-value="value => scheme = value ? 'dark' : 'light'"
					/>
				</button>
			</div>

			<div class="py-1 border-t border-surface-12/[0.08]">
				<button
					class="flex items-center w-full pl-2 py-2.5 rounded-md bg-transparent active:bg-surface-3 transition-colors"
					@click="logout()"
				>
					<MoooomIcon class-name="w-8 h-8" icon="doorOpen" />
					<p class="flex-grow pl-2 text-lg font-medium text-left">
						{{ $t("Logout") }}
					</p>
				</button>
			</div>
		</div>
	</BottomFlyout>
</template>
