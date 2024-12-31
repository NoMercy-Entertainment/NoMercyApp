<script setup lang="ts">
import {computed, onMounted, ref, Ref, toRaw, watch} from 'vue';
import {IonContent, IonPage} from '@ionic/vue';
import {useQueryClient} from '@tanstack/vue-query';
import {useDebounce} from '@vueuse/core';
import {InputNumber, InputText} from 'primevue';

import type {ConfigurationResponse} from '@/types/api/dashboard/server';

import serverClient from '@/lib/clients/serverClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import useServerClient from '@/lib/clients/useServerClient';
import {Nullable} from 'vitest';

const {data: configuration, refetch: invalidate, error} = useServerClient<ConfigurationResponse>({
  path: '/dashboard/configuration',
});

const ready = ref<boolean>(false);
const newConfig = ref<ConfigurationResponse>(configuration.value ?? <ConfigurationResponse>{});

const updateState = <T>(key: keyof T, value: any) => {
  if (!configuration.value) return;

  if (toRaw(configuration.value[key as keyof ConfigurationResponse]) == value) {
    delete newConfig.value[key as keyof ConfigurationResponse];
    newConfig.value = {
      ...newConfig.value,
    };
    return;
  }
  newConfig.value = {
    ...newConfig.value,
    [key]: value || undefined,
  };
};

watch(configuration, (value) => {
  if (!value) return;
  newConfig.value = <ConfigurationResponse>{};

  server_name.value = value?.server_name;
  external_server_port.value = value?.external_server_port;
  internal_server_port.value = value?.internal_server_port;
  queue_workers.value = value?.queue_workers;
  cron_workers.value = value?.cron_workers;
  data_workers.value = value?.data_workers;
  request_workers.value = value?.request_workers;
  encoder_workers.value = value?.encoder_workers;
  image_workers.value = value?.image_workers;
  ready.value = true;
});

onMounted(() => {
  if (!configuration.value) return;
  newConfig.value = <ConfigurationResponse>{};

  server_name.value = configuration.value?.server_name;
  external_server_port.value = configuration.value?.external_server_port;
  internal_server_port.value = configuration.value?.internal_server_port;
  queue_workers.value = configuration.value?.queue_workers;
  cron_workers.value = configuration.value?.cron_workers;
  data_workers.value = configuration.value?.data_workers;
  request_workers.value = configuration.value?.request_workers;
  encoder_workers.value = configuration.value?.encoder_workers;
  image_workers.value = configuration.value?.image_workers;
  ready.value = true;
});

const server_name = ref<Nullable<string>>(configuration.value?.server_name ?? '');
watch(server_name, (value) => {
  updateState('server_name', value);
});

const external_server_port = ref<Nullable<number>>(configuration.value?.external_server_port ?? 0);
watch(external_server_port, (value) => {
  updateState('external_server_port', value);
});

const internal_server_port = ref<Nullable<number>>(configuration.value?.internal_server_port ?? 0);
watch(internal_server_port, (value) => {
  updateState('internal_server_port', value);
});

const queue_workers = ref<Nullable<number>>(configuration.value?.queue_workers ?? 0);
watch(queue_workers, (value) => {
  updateState('queue_workers', value);
});

const cron_workers = ref<Nullable<number>>(configuration.value?.cron_workers ?? 0);
watch(cron_workers, (value) => {
  updateState('cron_workers', value);
});

const data_workers = ref<Nullable<number>>(configuration.value?.data_workers ?? 0);
watch(data_workers, (value) => {
  updateState('data_workers', value);
});

const request_workers = ref<Nullable<number>>(configuration.value?.request_workers ?? 0);
watch(request_workers, (value) => {
  updateState('request_workers', value);
});

const image_workers = ref<Nullable<number>>(configuration.value?.image_workers ?? 0);
watch(image_workers, (value) => {
  updateState('image_workers', value);
});

const encoder_workers = ref<Nullable<number>>(configuration.value?.encoder_workers ?? 0);
watch(encoder_workers, (value) => {
  updateState('encoder_workers', value);
});

const hasChanges = computed<boolean>(() => (Object.keys(newConfig.value).length > 0));
console.log(newConfig.value, Object.keys(newConfig.value));

watch(newConfig, (value) => {
  console.log(value);
});

const query = useQueryClient();

const save = () => {
  console.raw(newConfig.value);
  serverClient()
      .patch(`/dashboard/configuration`, newConfig.value)
      .then(() => {
        invalidate();
        query.invalidateQueries({queryKey: ['serverInfo']});
      });
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout :error="error" :gridStyle="2" title="General" description="">
        <template v-slot:cta>

        </template>

        <div v-if="ready" class="col-span-2 col-start-1 2xl:col-start-1">
          <div class="flex flex-col gap-2">
            <label for="server_name">Server name</label>
            <InputText id="server_name" v-model="server_name" class="mb-4"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="secure_internal_port">Secure internal port</label>
            <InputNumber id="secure_internal_port" v-model="internal_server_port" class="mb-4"
                          :useGrouping="false" showButtons :min="2000"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="secure_external_port">Secure external port</label>
            <InputNumber id="secure_external_port" v-model="external_server_port" class="mb-4"
                          :useGrouping="false" showButtons  :in="2000"/>
          </div>
        </div>
        <div v-if="ready" class="col-span-2 col-start-1 2xl:col-start-3">
          <div class="flex flex-col gap-2">
            <label for="cron_workers">Cron workers</label>
            <InputNumber
                id="cron_workers" v-model="cron_workers" class="mb-4"
                 :useGrouping="false" showButtons :min="0"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="data_workers">Data workers</label>
            <InputNumber
                id="data_workers" v-model="data_workers" class="mb-4"
                 :useGrouping="false" showButtons :min="0"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="request_workers">Request workers</label>
            <InputNumber id="request_workers" v-model="request_workers" class="mb-4"
                          :useGrouping="false" showButtons :min="0"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="encoder_workers">Encoder workers</label>
            <InputNumber id="encoder_workers" v-model="encoder_workers" class="mb-4"
                          :useGrouping="false" showButtons :min="0"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="image_workers">Image workers</label>
            <InputNumber
                id="image_workers" v-model="image_workers" class="mb-4"
                 :useGrouping="false" showButtons :min="0"/>
          </div>
          <div class="flex flex-col gap-2">
            <label for="queue_workers">Queue workers</label>
            <InputNumber id="queue_workers" v-model="queue_workers" class="mb-4"
                          :useGrouping="false" showButtons :min="0"/>
          </div>
        </div>

        <template v-slot:actions>

          <Button type="submit"
                  id="save"
                  :disabled="!hasChanges"
                  color="theme"
                  class="ml-auto"
                  form="myForm"
                  @click="save()">
            {{ $t('Save') }}
          </button>
        </template>

      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>

