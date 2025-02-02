<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';

import { useQueryClient } from '@tanstack/vue-query';

import type { ServerLibrary, User } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import DeleteUserModal from '@/views/Dashboard/System/Users/components/DeleteUserModal.vue';
import Button from '@/components/Buttons/Button.vue';
import Toggle from '@/components/Forms/Toggle.vue';
import useApiClient from '@/lib/clients/useApiClient';
import { ServerUser } from '@/types/auth';
import Select from '@/components/Forms/Select.vue';
import { currentServer } from "@/store/currentServer";

const query = useQueryClient();

const route = useRoute();

const { data: libraries } = useServerClient<ServerLibrary[]>({
  path: '/dashboard/libraries',
});

const { data: serverUsers } = useApiClient<ServerUser[]>({
  path: 'server_users',
  params: {
    server_id: currentServer.value?.id,
  },
  queryKey: ['server_users'],
});

const { data: permissions, error } = useServerClient<User>({
  path: `dashboard/users/${route.params.id}/permissions`,
  queryKey: ['userPermissions', route.params.id],
});

const name = computed(() => serverUsers.value?.find(u => u.id == route.params.id)?.name);

const allowed = ref(permissions.value?.allowed);
const manage = ref(permissions.value?.manage);
const audioTranscoding = ref(permissions.value?.audio_transcoding);
const videoTranscoding = ref(permissions.value?.video_transcoding);
const noTranscoding = ref(permissions.value?.no_transcoding);

const allowedAllLibraries = ref(libraries.value?.filter(l => permissions.value?.libraries?.includes(l.id)).length == libraries.value?.length);
const allowedLibraries = ref(libraries.value?.filter(l => permissions.value?.libraries?.includes(l.id)));

watch(permissions, (value) => {
  allowed.value = value?.allowed;
  manage.value = value?.manage;
  audioTranscoding.value = value?.audio_transcoding;
  videoTranscoding.value = value?.video_transcoding;
  noTranscoding.value = value?.no_transcoding;

  allowedLibraries.value = libraries.value?.filter(l => value?.libraries?.includes(l.id));
  allowedAllLibraries.value = libraries.value?.filter(l => value?.libraries?.includes(l.id)).length == libraries.value?.length;
});

const deleteConfirmOpen = ref(false);
const openDeleteConfirm = () => {
  deleteConfirmOpen.value = true;
};
const closeDeleteConfirm = () => {
  deleteConfirmOpen.value = false;
};

const handleCancel = () => {
  window.history.back();
};

const handleSave = () => {

  serverClient()
    .patch<{ message: string, status: string, args: string[] }>(`dashboard/users/${route.params.id}/permissions`, {
      allowed: allowed.value,
      manage: manage.value,
      audio_transcoding: audioTranscoding.value,
      video_transcoding: videoTranscoding.value,
      no_transcoding: noTranscoding.value,
      libraries: allowedLibraries.value?.map(l => l.id),
    })
    .then(({ data }) => {
      query.invalidateQueries({ queryKey: ['userPermissions', route.params.id] });

      // showNotification({
      //     title: translate(data.message, ...data.args),
      //     type: data.status == 'ok'
      //         ? TYPE.SUCCESS
      //         : TYPE.ERROR,
      //     visibleOnly: true,
      //     duration: 2000,
      // });

      handleCancel();
    });
};

watch(allowedAllLibraries, value => {
  if (!value) return;
  allowedLibraries.value = libraries.value;
});

watch(allowedLibraries, value => {
  if (!libraries.value || !value) return;

  // allowedAllLibraries.value = value.length == libraries.value.length;
});

</script>

<template>

  <DashboardLayout :error="error" :title="`Server member: {{name}}`" :params="{ name }" :back="true">
    <template v-slot:cta>
    </template>

    <div v-if="permissions" class="mt-4 flex w-full flex-col sm:w-1/2">
      <h3 class="mt-4 mb-2">{{ $t('Base permissions') }}:</h3>
      <div class="flex flex-col gap-2">
        <label for="allowed" class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
          data-selected="true">
          <Toggle v-if="allowed != undefined" id="allowed" label="Manage" v-model="allowed" class="mr-2" />
          <span class="whitespace-pre-wrap text-sm font-semibold">
            {{ $t('Allow this user to access content') }}
          </span>
        </label>
        <label for="manage" class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
          data-selected="true">
          <Toggle v-if="manage != undefined" id="manage" label="Manage" v-model="manage" class="mr-2" />
          <span class="whitespace-pre-wrap text-sm font-semibold">
            {{ $t('Allow this user to manage the server') }}
          </span>
        </label>
      </div>
      <h3 class="mt-4 mb-2">{{ $t('Media playback') }}:</h3>
      <div class="flex w-full flex-col gap-2">
        <label for="audioTranscoding" class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
          data-selected="true">
          <Toggle v-if="audioTranscoding != undefined" id="audioTranscoding" label="AudioTranscoding"
            v-model="audioTranscoding" class="mr-2" />
          <span class="whitespace-pre-wrap text-sm font-semibold">
            {{ $t('Allow audio playback that requires transcoding') }}
          </span>
        </label>
        <label for="videoTranscoding" class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group"
          data-selected="true">
          <Toggle v-if="videoTranscoding != undefined" id="videoTranscoding" label="VideoTranscoding"
            v-model="videoTranscoding" class="mr-2" />
          <span class="whitespace-pre-wrap text-sm font-semibold">
            {{ $t('Allow video playback that requires transcoding') }}
          </span>
        </label>
      </div>
      <h3 class="mt-4 mb-2">{{ $t('Library Access') }}:</h3>
      <div class="flex w-1/2 flex-col gap-2">
        <label for="allowedAllLibraries"
          class="pointer-events-auto inline-flex h-10 w-full touch-none items-center group" data-selected="true">
          <Toggle v-if="allowedAllLibraries != undefined" id="allowedAllLibraries" label="AllowedAllLibraries"
            v-model="allowedAllLibraries" class="mr-2" />
          <span class="whitespace-pre-wrap text-sm font-semibold">
            {{ $t('Enable access to all libraries') }}
          </span>
        </label>

        <Select v-if="!allowedAllLibraries" id="libraries" label="libraries" placeholder="Select libraries" multiple
          :items="libraries" optionLabel="title" v-model="allowedLibraries" />
      </div>
    </div>

    <template v-slot:actions>
      <Button type="button" id="yes" variant="text" class="mr-auto" color="text-auto-alpha-11" startIcon="userDelete"
        @click="openDeleteConfirm">
        {{ $t('Remove user') }}
      </button>
      <Button type="button" id="cancel" variant="text" color="white" @click="handleCancel">
        {{ $t('Cancel') }}
      </Button>
      <Button type="button" id="save" color="theme" @click="handleSave">
        {{ $t('Save') }}
      </button>
    </template>

    <DeleteUserModal v-if="permissions?.id" :id="permissions?.id" :name="permissions?.name" :close="closeDeleteConfirm"
      :open="deleteConfirmOpen" />
  </DashboardLayout>
</template>

<style scoped></style>
