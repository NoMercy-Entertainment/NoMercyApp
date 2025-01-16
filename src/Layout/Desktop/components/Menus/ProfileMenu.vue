<script lang="ts" setup>
import {PropType} from 'vue';
import {RouterLink} from 'vue-router';

import {darkMode} from '@/store/colorScheme';
import {user} from '@/store/user';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import ProfileMenuServerSection from '@/Layout/Desktop/components/Menus/ProfileMenuServerSection.vue';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Toggle from '@/components/Forms/Toggle.vue';
import {currentServer} from '@/store/currentServer';

const reload = () => window.location.reload();

defineProps({
  direction: {
    type: String as PropType<'up' | 'down'>,
    required: false,
    default: 'down',
  }
});

const handleSelectServer = () => {
  localStorage.setItem('redirectUrl', window.location.hash.replace('#', ''));
};

</script>

<template>
  <DropdownMenu v-if="user" :direction="direction" className="rounded-full">
    <template v-slot:button>
      <div class="relative mx-auto flex flex-col rounded-full size-12  border-2 border-slate-dark-5">
        <NoMercyAvatar :user="user" :size="40" class="absolute inset-0"/>
        <span
            class="absolute rounded-full border-white bg-green-600 size-[28%] -bottom-[2%] -end-[2%] border-[0.125rem] dark:border-stone-900">
        </span>
      </div>
    </template>

    <div class="flex w-full flex-col items-start justify-start p-2 text-slate-dark-9 dark:text-slate-light-5"
         style="box-shadow: 0 4px 7px 0 rgba(0,0,0,0.08);">
      <div
          class="relative h-auto flex-shrink-0 flex-grow-0 flex-col items-center justify-start self-stretch z-1099 group sm:flex">
        <ProfileMenuServerSection/>
        <div class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"></div>
        <div
            class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 py-2">
          <RouterLink
              to="/setup/select-servers"
              @click="handleSelectServer"
              class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12"
              data-nav-title="Switch server"
              name="Switch server" >
							<span
                  class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
									<MoooomIcon className="" icon="serverSwitch"/>
									<span
                      class="relative flex flex-grow items-center justify-center gap-2 pl-2">
											<span class="w-full flex-grow text-left text-lg font-medium">
													{{ $t('Switch server') }}
											</span>
									</span>
							</span>
          </RouterLink>
        </div>
        <div
            class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"></div>
        <div
            class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 py-2">

          <RouterLink
              v-if="currentServer"
              to="/dashboard/system"
              class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12"
              data-nav-title="System"
              name="System" >
						<span
                class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
								<MoooomIcon className="" icon="gridMasonry"/>
								<span
                    class="relative flex flex-grow items-center justify-center gap-2 pl-2">
										<span class="w-full flex-grow text-lg font-medium">
												{{ $t('Dashboard') }}
										</span>
								</span>
						</span>
          </RouterLink>

          <RouterLink
              to="/preferences/display"
              class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12"
              data-nav-title="Preferences"
              name="Preferences" >
							<span
                  class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
									<MoooomIcon className="" icon="paintSwatches"/>
									<span
                      class="relative flex flex-grow items-center justify-center gap-2 pl-2">
											<span class="w-full flex-grow text-lg font-medium">
													{{ $t('Preferences') }}
											</span>
									</span>
							</span>
          </RouterLink>

          <button
              class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300"
              data-nav-title="Refresh"
              name="Refresh"
              @click="reload"
          >
							<span
                  class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
									<MoooomIcon className="" icon="arrowRefreshHorizontal"/>
									<span
                      class="relative flex flex-grow items-center justify-center gap-2 pl-2">
											<span
                          class="w-full flex-grow text-left text-lg font-medium">
													{{ $t('Refresh') }}
											</span>
									</span>
							</span>
          </button>

          <div
              class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12">
						<span
                class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
								<MoooomIcon className="" icon="moonDiagonal"/>
								<span class="relative flex flex-grow items-center justify-center gap-2 pl-2">
										<span class="w-full flex-grow text-lg font-medium">
                      {{ $t('Dark mode') }}
										</span>
								</span>
						<label
                class="inline-flex cursor-pointer items-center gap-3"
                for="ion-tg-0">
              <Toggle :model-value="darkMode" @update:model-value="darkMode = $event" id="toggleScheme"/>
							</label>
						</span>
          </div>

        </div>
        <div
            class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"></div>
        <div
            class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 pt-2">
          <button
              @click="$keycloak?.keycloak?.logout()"
              class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12"
              data-nav-title="Logout"
              name="Logout">
            <span
                class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
                <MoooomIcon className="" icon="doorOpen"/>
                <span class="relative flex flex-grow items-center justify-center gap-2 pl-2">
                    <span class="w-full flex-grow text-lg font-medium">
                        {{ $t('Logout') }}
                    </span>
                </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </DropdownMenu>
</template>
