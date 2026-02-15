<script lang="ts" setup>
import {computed, onMounted, ref, toRaw, watch} from "vue";
import {IonContent, IonPage} from "@ionic/vue";
import {useQueryClient} from "@tanstack/vue-query";
import {InputNumber, InputText} from "primevue";

import type {ConfigurationResponse} from "@/types/api/dashboard/server";

import serverClient from "@/lib/clients/serverClient";

import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import useServerClient from "@/lib/clients/useServerClient";
import Toggle from "@/components/Forms/Toggle.vue";
import {currentServer, setCurrentServer} from "@/store/currentServer";
import servers, {setServers} from "@/store/servers";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

const {
  data: configuration,
  refetch: invalidate,
  error,
} = useServerClient<ConfigurationResponse>({
  path: "/dashboard/configuration",
});

const ready = ref<boolean>(false);
const newConfig = ref<ConfigurationResponse>(
  configuration.value ?? <ConfigurationResponse>{}
);

const updateState = <T>(key: keyof T, value: any) => {
  if (!configuration.value) return;

  if (toRaw(configuration.value[key as keyof ConfigurationResponse]) === value) {
    delete newConfig.value[key as keyof ConfigurationResponse];
    newConfig.value = {
      ...newConfig.value,
    };
    return;
  }
  newConfig.value = {
    ...newConfig.value,
    [key]: value ?? undefined,
  };
};

watch(configuration, (value) => {
  if (!value) return;
  newConfig.value = <ConfigurationResponse>{};

  name.value = value?.name;
  external_port.value = value?.external_port;
  internal_port.value = value?.internal_port;
  queue_workers.value = value?.queue_workers;
  cron_workers.value = value?.cron_workers;
  data_workers.value = value?.data_workers;
  request_workers.value = value?.request_workers;
  encoder_workers.value = value?.encoder_workers;
  image_workers.value = value?.image_workers;
  file_workers.value = value?.file_workers;
  swagger.value = value?.swagger;
  ready.value = true;
});

onMounted(() => {
  if (!configuration.value) return;
  newConfig.value = <ConfigurationResponse>{};

  name.value = configuration.value?.name;
  external_port.value = configuration.value?.external_port;
  internal_port.value = configuration.value?.internal_port;
  queue_workers.value = configuration.value?.queue_workers;
  cron_workers.value = configuration.value?.cron_workers;
  data_workers.value = configuration.value?.data_workers;
  request_workers.value = configuration.value?.request_workers;
  encoder_workers.value = configuration.value?.encoder_workers;
  image_workers.value = configuration.value?.image_workers;
  file_workers.value = configuration.value?.file_workers;
  swagger.value = configuration.value?.swagger;
  ready.value = true;
});

const name = ref<string>(configuration.value?.name ?? "");
watch(name, (value) => {
  updateState("name", value);
});

const external_port = ref<number>(configuration.value?.external_port ?? 0);
watch(external_port, (value) => {
  updateState("external_port", value);
});

const internal_port = ref<number>(configuration.value?.internal_port ?? 0);
watch(internal_port, (value) => {
  updateState("internal_port", value);
});

const queue_workers = ref<number>(configuration.value?.queue_workers ?? 0);
watch(queue_workers, (value) => {
  updateState("queue_workers", value);
});

const cron_workers = ref<number>(configuration.value?.cron_workers ?? 0);
watch(cron_workers, (value) => {
  updateState("cron_workers", value);
});

const data_workers = ref<number>(configuration.value?.data_workers ?? 0);
watch(data_workers, (value) => {
  updateState("data_workers", value);
});

const request_workers = ref<number>(configuration.value?.request_workers ?? 0);
watch(request_workers, (value) => {
  updateState("request_workers", value);
});

const image_workers = ref<number>(configuration.value?.image_workers ?? 0);
watch(image_workers, (value) => {
  updateState("image_workers", value);
});

const encoder_workers = ref<number>(configuration.value?.encoder_workers ?? 0);
watch(encoder_workers, (value) => {
  updateState("encoder_workers", value);
});

const file_workers = ref<number>(configuration.value?.file_workers ?? 0);
watch(file_workers, (value) => {
  updateState("file_workers", value);
});

const swagger = ref<boolean>(configuration.value?.swagger ?? false);
watch(swagger, (value) => {
  updateState("swagger", value);
});

const hasChanges = computed<boolean>(
  () => Object.keys(newConfig.value).length > 0
);

watch(newConfig, (value) => {
  console.log(value);
});

const query = useQueryClient();

const save = () => {
  console.raw(newConfig.value);
  serverClient()
    .patch(`/dashboard/configuration`, newConfig.value)
    .then(() => {
      if (currentServer.value) {
        const updates: Record<string, any> = {};
        if (newConfig.value.name !== undefined) updates.name = newConfig.value.name.toString();
        if (newConfig.value.external_port !== undefined) updates.external_port = newConfig.value.external_port.toString();
        if (newConfig.value.internal_port !== undefined) updates.internal_port = newConfig.value.internal_port.toString();

        if (Object.keys(updates).length > 0) {
          const updated = { ...currentServer.value, ...updates };
          setServers([
            ...servers.value.filter((server) => server.id !== currentServer.value!.id),
            updated,
          ]);
          setCurrentServer(updated);
        }
      }

      invalidate();
      query.invalidateQueries({ queryKey: ["serverInfo"] });
    });
};
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout
        :error="error"
        :gridStyle="2"
        description=""
        title="General"
      >
        <template v-slot:cta> </template>

        <div v-if="ready" class="col-span-2 col-start-1 2xl:col-start-1">
          <div class="flex flex-col gap-2">
            <label for="name">Server name</label>
            <InputText id="name" v-model="name" class="mb-4" />
          </div>
          <div class="flex flex-col gap-2">
            <label for="internal_port">Secure internal port</label>
            <InputNumber
              id="internal_port"
              v-model="internal_port"
              :min="2000"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="external_port">Secure external port</label>
            <InputNumber
              id="external_port"
              v-model="external_port"
              :min="2000"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
        </div>

        <div v-if="ready" class="col-span-2 col-start-1 2xl:col-start-3">
          <div class="flex flex-col gap-2">
            <label for="queue_workers">Queue workers</label>
            <InputNumber
              id="queue_workers"
              v-model="queue_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="encoder_workers">Encoder workers</label>
            <InputNumber
              id="encoder_workers"
              v-model="encoder_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="cron_workers">Cron workers</label>
            <InputNumber
              id="cron_workers"
              v-model="cron_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="data_workers">Data workers</label>
            <InputNumber
              id="data_workers"
              v-model="data_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="image_workers">Image workers</label>
            <InputNumber
              id="image_workers"
              v-model="image_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="file_workers">File workers</label>
            <InputNumber
              id="file_workers"
              v-model="file_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="request_workers">Request workers</label>
            <InputNumber
              id="request_workers"
              v-model="request_workers"
              :min="0"
              :useGrouping="false"
              class="mb-4"
              showButtons
            />
          </div>
        </div>

        <div v-if="ready" class="col-span-2 col-start-1 2xl:col-start-5">
          <div class="flex flex-col gap-2">
            <span class="flex gap-4">
              <label for="swagger">Open API / Swagger Ui</label>
              <a
                v-if="swagger && currentServer?.serverBaseUrl"
                :aria-label="$t('Open API / Swagger Ui in a new tab')"
                :href="currentServer?.serverBaseUrl"
                class="flex gap-1 items-center underline underline-offset-4 h-4 text-sm"
                target="_blank"
              >
                <span>{{ $t("Open") }}</span>
                <MoooomIcon
                  className="size-4"
                  color="theme"
                  icon="shareSquare"
                />
              </a>
            </span>
            <Toggle
              :model-value="swagger"
              @update:model-value="swagger = $event"
            />
          </div>
        </div>

        <template v-slot:actions>
          <Button
            id="save"
            :disabled="!hasChanges"
            class="ml-auto"
            color="theme"
            form="myForm"
            type="submit"
            @click="save()"
          >
            {{ $t("Save") }}
          </Button>
        </template>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
