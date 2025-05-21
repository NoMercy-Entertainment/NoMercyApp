<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { IonIcon, IonItem, IonList, IonRippleEffect, isPlatform } from '@ionic/vue';
import { arrowRefreshVertical, doorOpen, gridMasonry, monitor, moonDiagonal, serverSwitch } from '@Icons/index';

import { darkMode } from '@/store/colorScheme';

import ProfileMenuServerSection from '@/Layout/Mobile/components/ProfileMenuServerSection.vue';
import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';

import Toggle from '@/components/Forms/Toggle.vue';
import { logout } from '@/lib/auth/index';
import { closeMenu, menuOpen } from "@/store/profileMenu";
import { Browser } from "@capacitor/browser";
import { phonePortrait } from "ionicons/icons";
import {isTv, tvModeOverride} from "@/config/global";

const reload = () => window.location.reload();

const route = useRoute();
const handleOpenApp = async () => {
  if (isPlatform('android')) {
    Browser.open({ url: `nomercy://${route.path}` }).then(() => {
      setTimeout(async () => {
        await Browser.open({ url: `nomercy://${route.path}` })
      }, 1000);
    });
  }
}

</script>

<template>

  <BottomFlyout :menuOpen="menuOpen" :closeMenu="closeMenu">
    <ion-list >

      <ion-item lines="inset">
        <ProfileMenuServerSection />
      </ion-item>

      <ion-item lines="inset">
        <RouterLink to="/setup/select-servers"
          class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-ripple-effect />
          <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
          <ion-icon aria-hidden="true" :icon="serverSwitch" className="size-6 min-w-6" />
          <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
            <p class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('Switch server') }}
            </p>
          </div>
        </RouterLink>
      </ion-item>

      <ion-item lines="none">
        <RouterLink to="/preferences/display"
          class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-ripple-effect />
          <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
          <ion-icon aria-hidden="true" :icon="monitor" className="size-6 min-w-6" />
          <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
            <p class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('Preferences') }}
            </p>
          </div>
        </RouterLink>
      </ion-item>

      <ion-item lines="none">
        <RouterLink to="/dashboard/system"
          class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-ripple-effect />
          <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
          <ion-icon aria-hidden="true" :icon="gridMasonry" className="size-6 min-w-6" />
          <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
            <p class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('System') }}
            </p>
          </div>
        </RouterLink>
      </ion-item>

      <ion-item lines="none">
        <button no-ring @click="reload()"
          class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-ripple-effect />
          <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
          <ion-icon aria-hidden="true" :icon="arrowRefreshVertical" className="size-6 min-w-6" />
          <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
            <p class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('Refresh') }}
            </p>
          </div>
        </button>
      </ion-item>

      <ion-item lines="none" v-if="!isPlatform('capacitor') && isPlatform('android')">
        <button no-ring @click="handleOpenApp"
          class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-ripple-effect />
          <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
          <ion-icon aria-hidden="true" :icon="phonePortrait" className="size-6 min-w-6" />
          <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
            <p class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('Open in App') }}
            </p>
          </div>
        </button>
      </ion-item>

      <ion-item lines="none">
        <button no-ring @click="darkMode = !darkMode"
          class="flex justify-center items-center self-stretch w-available h-full flex-grow-0 flex-shrink-0 relative pl-2 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-icon aria-hidden="true" :icon="moonDiagonal" className="size-6 min-w-6" />

          <label for="ion-tg-0" class="flex justify-center items-center flex-grow relative gap-2 px-2 w-available">
            <span class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('Dark mode') }}
            </span>
          </label>

          <Toggle :model-value="darkMode" class="pointer-events-none" />
        </button>
      </ion-item>

      <ion-item lines="inset">
        <button no-ring @click="tvModeOverride = !tvModeOverride"
          class="flex justify-center items-center self-stretch w-available h-full flex-grow-0 flex-shrink-0 relative pl-2 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-icon aria-hidden="true" :icon="monitor" className="size-6 min-w-6" />

          <label for="ion-tg-0" class="flex justify-center items-center flex-grow relative gap-2 px-2 w-available">
            <span class="flex-grow w-full text-lg font-medium text-left">
              {{ tvModeOverride ? $t('Disable TV mode') : $t('Enable TV mode') }}
            </span>
          </label>

          <Toggle :model-value="tvModeOverride" class="pointer-events-none" />
        </button>
      </ion-item>

      <ion-item lines="none">
        <button no-ring @click="logout()"
          class="flex justify-center items-center self-stretch w-full h-full flex-grow-0 flex-shrink-0 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent">
          <ion-ripple-effect />
          <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
          <ion-icon aria-hidden="true" :icon="doorOpen" className="size-6 min-w-6" />
          <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
            <p class="flex-grow w-full text-lg font-medium text-left">
              {{ $t('Logout') }}
            </p>
          </div>
        </button>
      </ion-item>
    </ion-list>

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
