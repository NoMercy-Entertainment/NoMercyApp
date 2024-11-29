<script setup lang="ts">
import {watch} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';
import {musicSearchResult, musicSearchValue} from '@/store/search';

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="flex w-available m-4">
        <InputText type="text" v-model="musicSearchValue" variant="filled" class="w-available" />
      </div>

      <template v-if="musicSearchResult">
        <component
            v-for="(render, index) in musicSearchResult ?? []"
            :index="index"
            :key="render.id"
            :is="render.component"
            v-bind="render.props"
        />
      </template>

    </ion-content>
  </ion-page>
</template>
