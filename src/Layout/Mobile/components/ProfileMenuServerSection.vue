<script setup lang="ts">

import {link} from '@Icons/index';
import {IonIcon} from '@ionic/vue';

import currentServer from '@/store/currentServer';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';

</script>

<template>

  <div
      class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2.5"
  >
    <NoMercyAvatar :user="$keycloak.tokenParsed" :size="40"/>
    <div class="flex flex-col justify-start items-start flex-grow relative gap-0.5">
      <p class="flex-grow-0 flex-shrink-0 w-48 text-base font-semibold text-left text-slate-dark-1 dark:text-slate-light-1">
        {{ $keycloak.tokenParsed?.display_name ?? $keycloak.tokenParsed?.name }}
      </p>
      <div
          class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-0.5"
      >
        <ion-icon v-if="currentServer" aria-hidden="true" :icon="link" class="w-4 h-4"/>
        <ion-icon v-else aria-hidden="true" :icon="link" class="w-4 h-4"/>
        <p class="flex-grow text-sm text-left text-slate-dark-3 dark:text-slate-light-3">
          {{ currentServer?.server_name ?? $t('Not connected') }}
        </p>
      </div>
    </div>
  </div>
</template>
