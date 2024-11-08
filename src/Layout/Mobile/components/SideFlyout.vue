<script setup lang="ts">
import {computed, onMounted, ref, watch} from 'vue';
import {useSwipe} from '@vueuse/core';

import {darkMode} from '@/store/colorScheme';

import {shouldShowLibraryLinks} from '@/store/Libraries';
import {
  hasMusicLibrary,
  isDashboardRoute,
  isHomeRoute,
  isLibraryRoute,
  isMusicRoute,
  isPreferencesRoute
} from '@/store/routeState';

import {closeSidebar, sidebarState} from '@/store/sidebar';
import currentServer from '@/store/currentServer';

import ProfileMenuServerSection from '@/Layout/Desktop/components/Menus/ProfileMenuServerSection.vue';
import SideFlyoutButton from '@/Layout/Mobile/components/SideFlyoutButton.vue';

import Toggle from '@/components/Forms/Toggle.vue';

const reload = () => window.location.reload();

const target = ref<HTMLElement | null>(null);
const container = ref<HTMLElement | null>(null);
const containerWidth = computed(() => container.value?.offsetWidth);
const left = ref('-100%');
const opacity = ref(0);

onMounted(() => {
  if (sidebarState.value === 'open') {
    left.value = '0';
    opacity.value = 1;
  }
  else {
    left.value = '-100%';
    opacity.value = 0;
  }
});

watch(sidebarState, (value) => {
  if (value === 'open') {
      left.value = '0'
      opacity.value = 1;
  } else if (value === 'closed') {
      left.value = '-100%';
      opacity.value = 0;
  }
});

const {isSwiping, lengthX} = useSwipe(
    target,
    {
      passive: true,
      onSwipe() {
        if (containerWidth.value) {
          if (lengthX.value > 0) {
            const length = (Math.abs(lengthX.value));
            left.value = `-${length}px`;
            opacity.value = 1 - (length / containerWidth.value);
          } else {
            left.value = '0';
            opacity.value = 1;
          }
        }
      },
      onSwipeEnd() {
        if (lengthX.value > 0 && containerWidth.value && (Math.abs(lengthX.value) / containerWidth.value) >= 0.25) {
          left.value = '-100%';
          opacity.value = 0;
          closeSidebar();
        } else {
          left.value = '0';
          opacity.value = 1;
        }
      },
    },
);

</script>

<template>
  <aside
      :class="{
        'transition-left duration-300 ease-in-out ': !isSwiping,
      }"
      class="flex flex-col h-available absolute top-14 z-999 w-5/6 overflow-hidden"
      style="box-shadow: 0 4px 7px 0 rgba(0,0,0,0.08);"
      ref="target"
      :style="{ left }"
  >
    <div class="fixed inset-0 top-14 w-[500%] h-screen bg-black/40 -z-10"
         :style="{ opacity }"
         :class="{
            'transition-opacity duration-300 ease-in-out ': !isSwiping,
            'pointer-events-none': sidebarState !== 'open'
          }"
         @click="closeSidebar"
    ></div>
    <div ref="container"
        class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-hidden bg-slate-light-1 dark:bg-slate-dark-3 h-full"
    >
      <ProfileMenuServerSection />

      <div v-if="currentServer"
          class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-t border-r-0 border-b border-l-0 px-3 py-2 border-auto-12/[0.08]"
      >
        <SideFlyoutButton icon="serverSwitch" title="Switch server" href="/setup/select-servers" @click="closeSidebar" />
      </div>

      <div v-if="currentServer"
          class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch border-t-0 border-r-0 border-b border-l-0 px-3 py-2 border-auto-12/[0.08]"
      >
        <SideFlyoutButton icon="home1" title="Home" href="/home"
                      @click="closeSidebar"
                      v-if="shouldShowLibraryLinks"
                      :active="isHomeRoute"/>
        <SideFlyoutButton icon="folder" title="Libraries" href="/libraries"
                      @click="closeSidebar"
                      v-if="shouldShowLibraryLinks && hasMusicLibrary"
                      :active="isLibraryRoute" />
        <SideFlyoutButton icon="noteDouble" title="Music" href="/music/start"
                      @click="closeSidebar"
                      v-if="shouldShowLibraryLinks && hasMusicLibrary"
                      :active="isMusicRoute"/>
      </div>
      <div
          class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch  px-3 py-2"
      >
        <SideFlyoutButton v-if="currentServer" icon="gridMasonry" title="System" href="/dashboard/system" :active="isDashboardRoute"
                      @click="closeSidebar" />
        <SideFlyoutButton v-if="currentServer" icon="paintSwatches" title="Preferences" :active="isPreferencesRoute"
                      @click="closeSidebar"
                      href="/preferences/display"/>
        <SideFlyoutButton icon="arrowRefreshHorizontal" title="Refresh"  :onclick="reload"
                      @click="closeSidebar"/>

        <SideFlyoutButton icon="moonDiagonal" title="Dark mode"
                          @click="darkMode = !darkMode">
          <label
              class="inline-flex w-min cursor-pointer items-center gap-3"
              for="toggleScheme">
            <Toggle :model-value="darkMode" @update:model-value="darkMode = $event"/>
          </label>
        </SideFlyoutButton>

<!--        <SideFlyoutButton-->
<!--            @click="toggleNativeUI"-->
<!--            title="Switch ui style" icon="switchCamera"/>-->

      </div>

      <div
          class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch px-3 py-2 mt-auto border-t border-r-0 border-b-0 border-l-0 border-auto-12/[0.08]"
      >
        <SideFlyoutButton icon="doorOpen" title="Logout" @click="$keycloak.keycloak?.logout()"/>

      </div>
    </div>
  </aside>
</template>
