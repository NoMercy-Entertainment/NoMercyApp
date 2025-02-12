<script lang="ts" setup>
import {PropType} from 'vue';

import {darkMode} from '@/store/colorScheme';
import {user} from '@/store/user';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import ProfileMenuServerSection from '@/Layout/Desktop/components/Menus/ProfileMenuServerSection.vue';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Toggle from '@/components/Forms/Toggle.vue';
import DropdownLink from "@/Layout/Desktop/components/Menus/DropdownLink.vue";

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
      <button :aria-label="$t('Toggle profile menu')"
          class="relative mx-auto flex flex-col rounded-full size-12  border-2 border-slate-dark-5">
        <NoMercyAvatar :user="user" :size="40" class="absolute inset-0"/>
        <span
            class="absolute rounded-full border-white bg-green-600 size-[28%] -bottom-[2%] -end-[2%] border-[0.125rem] dark:border-stone-900">
        </span>
      </button>
    </template>

    <template v-slot:default="{ open }">
      <div class="flex w-full flex-col items-start justify-start p-2 text-slate-dark-9 dark:text-slate-light-5"
           :inert="!open"
           style="box-shadow: 0 4px 7px 0 rgba(0,0,0,0.08);">
        <div
            class="relative h-auto flex-shrink-0 flex-grow-0 flex-col items-center justify-start self-stretch z-1099 group sm:flex">
          <ProfileMenuServerSection/>
          <div class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"></div>
          <div
              class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 py-2">
            <DropdownLink icon="serverSwitch" name="Switch server" to="/setup/select-servers" @click="handleSelectServer" />
          </div>
          <div class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"></div>
          <div
              class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 py-2">

            <DropdownLink icon="gridMasonry" name="System" to="/dashboard/system" />
            <DropdownLink icon="paintSwatches" name="Preferences" to="/preferences/display" />
            <DropdownLink icon="arrowRefreshHorizontal" name="Refresh" :click="reload" />

            <div @click="darkMode = !darkMode"
                class="flex justify-center items-center self-stretch h-10 relative py-2.5 px-1 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12">
            <button tabindex="-1"
                class="relative flex w-full flex-grow items-center justify-center gap-2 px-2 text-lg font-medium text-left">
              <MoooomIcon className="" icon="moonDiagonal"/>
              <span class="relative flex flex-grow items-center justify-center gap-2 pl-2">
                <span class="w-full flex-grow text-lg font-medium">
                  {{ $t('Dark mode') }}
                </span>
              </span>
              <span class="inline-flex cursor-pointer items-center gap-3" >
                <Toggle :model-value="darkMode" @update:model-value="darkMode = $event" id="toggleScheme"  />
              </span>
            </button>
            </div>

          </div>
          <div class="border-t-0 border-r-0 border-b border-l-0 border-[#e2f0fd]/4 w-full"></div>
          <div
              class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-0 pt-2">
            <DropdownLink icon="doorOpen" name="Logout" :click="$keycloak?.keycloak?.logout" />
          </div>
        </div>
      </div>
    </template>
  </DropdownMenu>
</template>
