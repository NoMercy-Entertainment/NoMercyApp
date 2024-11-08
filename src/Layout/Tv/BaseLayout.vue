<script setup lang="ts">
import {onMounted, ref} from 'vue';
import router from '@/router';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenu,
  IonPage,
  IonRippleEffect,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar,
  isPlatform,
  menuController,
} from '@ionic/vue';
import {
  arrowRefreshVertical,
  cross,
  doorOpen,
  folder,
  gridMasonry,
  home1,
  monitor,
  moonDiagonal,
  noteEighthPair,
  searchMagnifyingGlass,
  serverSwitch,
} from '@Icons/index';

import BottomFlyout from '@/Layout/Mobile/components/BottomFlyout.vue';
import ProfileMenuServerSection from '@/Layout/Mobile/components/ProfileMenuServerSection.vue';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import {darkMode} from '@/store/colorScheme';
import Toggle from '@/components/Forms/Toggle.vue';

const menuOpen = ref(false);
const transparent = ref(false);

const reload = () => window.location.reload();

const openMenu = () => {
  menuOpen.value = !menuOpen.value;
};
const closeMenu = () => {
  menuOpen.value = false;
};

onMounted(() => {
  router.afterEach(() => {
    closeMenu();
  });
});

</script>

<template>
  <ion-menu content-id="main-content"
            :class="{
        'mt-6': isPlatform('capacitor'),
    }"
  >
    <ion-header>
      <ion-toolbar v-if="!isPlatform('capacitor')" >
        <ion-buttons slot="start">
          <ion-button @click="menuController.close()">
            <ion-icon :icon="cross"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">This is the menu content.</ion-content>
  </ion-menu>

  <ion-page id="main-content">
    <ion-tabs>
      <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto">
      </ion-router-outlet>

      <BottomFlyout v-model:menuOpen="menuOpen" v-model:transparent="transparent" @close="openMenu"
                    :closeMenu="closeMenu">
        <div
            class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 px-3 py-2 border-t-0 border-r-0 border-b border-l-0 border-slate-lightA-4 dark:border-slate-darkA-4"
        >
          <ProfileMenuServerSection/>
        </div>
        <div
            class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 px-3 py-2 border-t-0 border-r-0 border-b border-l-0 border-slate-lightA-4 dark:border-slate-darkA-4"
        >

          <button @click="() => router.push('/setup/server')"
                  class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
          >
            <ion-ripple-effect/>
            <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
            <ion-icon aria-hidden="true" :icon="serverSwitch" class="w-6 h-6"/>
            <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
              <p class="flex-grow w-full text-lg font-medium text-left">
                {{ $t('Switch server') }}
              </p>
            </div>
          </button>

        </div>
        <div
            class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 px-3 py-2 border-t-0 border-r-0 border-b border-l-0 border-slate-lightA-4 dark:border-slate-darkA-4"
        >

          <button @click="router.push('/preferences/display')"
                  class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
          >
            <ion-ripple-effect/>
            <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
            <ion-icon aria-hidden="true" :icon="monitor" class="w-6 h-6"/>
            <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
              <p class="flex-grow w-full text-lg font-medium text-left">
                {{ $t('Preferences') }}
              </p>
            </div>
          </button>

          <button @click="router.push('/setup/server')"
                  class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
          >
            <ion-ripple-effect/>
            <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
            <ion-icon aria-hidden="true" :icon="gridMasonry" class="w-6 h-6"/>
            <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
              <p class="flex-grow w-full text-lg font-medium text-left">
                {{ $t('System') }}
              </p>
            </div>
          </button>

          <button @click="reload()"
                  class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
          >
            <ion-ripple-effect/>
            <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
            <ion-icon aria-hidden="true" :icon="arrowRefreshVertical" class="w-6 h-6"/>
            <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
              <p class="flex-grow w-full text-lg font-medium text-left">
                {{ $t('Refresh') }}
              </p>
            </div>
          </button>

          <button @click="darkMode = !darkMode"
                  class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative pl-1 py-2.5 rounded-md bg-transparent border border-transparent"
          >
            <ion-icon aria-hidden="true" :icon="moonDiagonal" class="w-6 h-6"/>
            <div class="flex justify-center items-center flex-grow relative gap-2 px-2">
              <p class="flex-grow w-[255px] text-lg font-medium text-left">
                {{ $t('Dark mode') }}
              </p>
            </div>
            <Toggle :model-value="darkMode" @update:model-value.prevent="darkMode = $event"/>
          </button>
        </div>

        <div
            class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 px-3 py-2"
        >
          <button @click="$keycloak.keycloak?.logout()"
                  class="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative py-2.5 rounded-md bg-transparent border border-transparent ion-activatable ripple-parent rectangle"
          >
            <ion-ripple-effect/>
            <div class="flex-grow-0 flex-shrink-0 w-1 h-3.5"></div>
            <ion-icon aria-hidden="true" :icon="doorOpen" class="w-6 h-6"/>
            <div class="flex justify-center items-center flex-grow relative gap-2 pl-2">
              <p class="flex-grow w-full text-lg font-medium text-left">
                {{ $t('Logout') }}
              </p>
            </div>
          </button>
        </div>
      </BottomFlyout>

      <ion-tab-bar slot="bottom" mode="ios" selected-tab="search"
                   :class="{
                      ' bg-sand-light-1 dark:bg-slate-dark-1': menuOpen,
                      'bg-sand-light-1 dark:bg-slate-dark-2': !menuOpen
                   }"
      >

        <ion-tab-button tab="home" href="/home" @click="menuOpen = false">
          <ion-icon aria-hidden="true" :icon="home1"/>
          <ion-label>{{ $t('Home') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search" href="/search" @click="menuOpen = false">
          <ion-icon aria-hidden="true" :icon="searchMagnifyingGlass"/>
          <ion-label>{{ $t('Search') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="library" href="/library" @click="menuOpen = false">
          <ion-icon aria-hidden="true" :icon="folder" class="icon"/>
          <ion-label>{{ $t('Library') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="music" href="/music/start" @click="menuOpen = false">
          <ion-icon aria-hidden="true" :icon="noteEighthPair"/>
          <ion-label>{{ $t('Music') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button @click="menuOpen = !menuOpen">
          <NoMercyAvatar :user="$keycloak.tokenParsed" :size="40"/>
          <ion-label>{{ $t('Profile') }}</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<style scoped>
ion-menu::part(container) {
  @apply bg-transparent;
}

ion-menu ion-header,
ion-menu ion-header ion-toolbar {
  --background: transparent;
}

ion-menu ion-content {
  @apply bg-slate-light-1 dark:bg-slate-dark-3;
}

ion-tab-bar {
  @apply flex justify-center items-center self-stretch h-20;
}

ion-tab-button {
  @apply flex flex-col items-center flex-grow flex-shrink-0 bg-transparent;
}

ion-tab-button ion-avatar {
  @apply w-[2.95rem] h-[2.95rem] min-w-[2.95rem] min-h-[2.95rem] relative flex mt-1.5 -mb-1 text-slate-dark-1 dark:text-slate-light-1;
}

ion-tab-button ion-icon {
  @apply w-8 h-8 min-w-8 min-h-8 relative flex -mb-1.5 text-slate-dark-1 dark:text-slate-light-1 p-[0.625rem_0.725rem_0.625rem];
}

ion-tab-button ion-label {
  @apply text-slate-dark-1 dark:text-slate-light-1 overflow-visible mb-1 mt-0 text-base;
}

.tab-selected ion-icon {
  transform: rotate(12deg);
}

.tab-selected ion-icon:after {
  @apply content-[''] absolute w-[2.75rem] h-[2.75rem] inset-[4px_5px] justify-center items-center rounded-full;
  background: radial-gradient(100% 100% at 50% 100%, rgba(116, 82, 254, 0.15) 0%, rgba(112, 83, 255, 0.51) 100%);
  box-shadow: 0 0.5px 0 0 rgba(142, 117, 255, 0.84) inset, 0 1px 1px 0 rgba(111, 82, 255, 0.73) inset;
}

</style>
