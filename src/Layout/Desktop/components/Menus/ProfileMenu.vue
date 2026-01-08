<script lang="ts" setup>
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import { isPlatform } from '@ionic/vue';

import { scheme } from '@/store/colorScheme';
import { user } from '@/store/user';


import { redirectUrl } from '@/store/routeState';
import { konamiEnabledState } from '@/store/konami.ts';
import { logout } from '@/lib/auth/index.ts';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import ProfileMenuServerSection from '@/Layout/Desktop/components/Menus/ProfileMenuServerSection.vue';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import Toggle from '@/components/Forms/Toggle.vue';
import DropdownLink from '@/Layout/Desktop/components/Menus/DropdownLink.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
	direction: {
		type: String as PropType<'up' | 'down'>,
		required: false,
		default: 'down',
	},
});

const reload = () => window.location.reload();

const route = useRoute();

function handleSelectServer() {
	redirectUrl.value = route.fullPath;
}
</script>

<template>
	<DropdownMenu v-if="user" :direction="direction" class-name="rounded-full">
		<template #button>
			<button
				:aria-label="$t('Profile menu')"
				class="relative mx-auto flex flex-col rounded-full size-12 border-2 bg-black"
			>
				<AppLogoSquare
					alt="NoMercy Logo"
					class="absolute w-11 h-11 m-0.5 rounded-full"
				/>
				<NoMercyAvatar
					:size="40"
					:user="user"
					class="absolute inset-0 bg-black"
				/>
				<span
					class="absolute rounded-full border-white bg-green-600 size-[28%] -bottom-[2%] -end-[2%] border-[0.125rem] dark:border-stone-900"
				/>
			</button>
		</template>

		<template #default="{ open }">
			<div
				:inert="!open"
				class="flex w-full flex-col items-start justify-start p-2 "
				style="box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.08)"
			>
				<div
					class="relative h-auto flex-shrink-0 flex-grow-0 flex-col items-center justify-start self-stretch z-1099 group sm:flex"
				>
					<ProfileMenuServerSection />
					<div
						class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"
					/>
					<div
						class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 py-2"
					>
						<DropdownLink
							icon="serverSwitch"
							name="Switch server"
							to="/setup/select-servers"
							@click="handleSelectServer"
						/>
					</div>
					<div
						class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"
					/>
					<div
						class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 py-2"
					>
						<DropdownLink
							icon="gridMasonry"
							name="System"
							to="/dashboard/system"
						/>
						<DropdownLink
							icon="paintSwatches"
							name="Preferences"
							to="/preferences/display"
						/>
						<DropdownLink
							:click="reload"
							icon="arrowRefreshHorizontal"
							name="Refresh"
						/>

						<div
							class="flex justify-start items-center self-stretch h-11 relative gap-2 px-2.5 py-2 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-200 overflow-clip"
						>
							<button
								class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left"
								tabindex="-1"
								@click="scheme = scheme === 'light' ? 'dark' : 'light'"
							>
								<MoooomIcon class-name="" icon="moonDiagonal" />
								<span
									class="relative flex flex-grow items-center justify-center gap-2 pl-2"
								>
									<span class="w-full flex-grow text-lg font-medium">
										{{ $t("Dark mode") }}
									</span>
								</span>
								<span
									class="inline-flex cursor-pointer items-center gap-3 pointer-events-none"
								>
									<Toggle
										id="toggleScheme"
										:model-value="scheme === 'dark'"
										@update:model-value="value => scheme = value ? 'dark' : 'light'"
									/>
								</span>
							</button>
						</div>
					</div>
					<div
						class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"
					/>
					<div
						class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 pt-2"
					>
						<DropdownLink
							:click="logout"
							icon="doorOpen"
							name="Logout"
						/>
					</div>
				</div>
			</div>
		</template>
	</DropdownMenu>
</template>
