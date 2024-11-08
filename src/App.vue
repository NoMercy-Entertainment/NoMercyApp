<template>
  <ion-app>
    <ion-router-outlet animated="false" class="pointer-events-none children:pointer-events-auto" />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
