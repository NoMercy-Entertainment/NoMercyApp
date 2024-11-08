<script setup lang="ts">
import {onMounted, ref} from 'vue';
import router from '@/router';

import {
  IonPage,
  IonRouterOutlet,
  IonTabs,
  isPlatform,
} from '@ionic/vue';

import ProfileMenu from '@/Layout/Mobile/components/menus/ProfileMenu.vue';
import BottomBar from '@/Layout/Mobile/components/BottomBar.vue';
import SideFlyout from '@/Layout/Mobile/components/SideFlyout.vue';

const menuOpen = ref(false);

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

const toggleMenu = async () => {
  if (menuOpen.value) {
    closeMenu();
  } else {
    openMenu();
  }
};

</script>

<template>
  <ion-page id="main-content">
    <ion-tabs>

      <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto">
      </ion-router-outlet>

      <ProfileMenu v-if="isPlatform('capacitor')"
         :menuOpen="menuOpen"
          :closeMenu="closeMenu"
          :openMenu="openMenu"
      />

      <BottomBar v-if="isPlatform('capacitor')"
         :menuOpen="menuOpen"
          :closeMenu="closeMenu"
          :openMenu="openMenu"
          :toggleMenu="toggleMenu"
       />
    </ion-tabs>

    <SideFlyout v-if="!isPlatform('capacitor')"    />
  </ion-page>
</template>

<style scoped>
ion-menu::part(container) {
  @apply bg-transparent
}

ion-menu ion-header,
ion-menu ion-header ion-toolbar {
  --background: var(--color-background);
  box-shadow: none;
}

ion-menu ion-content::part(background) {
  background: var(--color-background);
}

</style>
