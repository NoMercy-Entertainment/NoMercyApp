<script setup lang="ts">
import { onBeforeMount, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';

import { useQueryClient } from '@tanstack/vue-query';

import type { EncoderProfile, FolderLibrary, LibrariesResponse } from '@/types/api/base/library';
import type { Language } from '@/types/api/shared';
import type { Library, NameVal } from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import { media_types } from '@/config/global';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import LanguageSelect from '@/components/Forms/LanguageSelect.vue';
import NewFolderModal from './components/NewFolderModal.vue';
import DeleteLibraryModal from './components/DeleteLibraryModal.vue';
import Folder from './components/Folder.vue';
import AddContentModal from '@/views/Dashboard/System/Libraries/components/AddContentModal.vue';
import { IonContent, IonPage } from '@ionic/vue';

const route = useRoute();
const query = useQueryClient();
const { t } = useTranslation();

const { data: libraries, error, refetch } = useServerClient<LibrariesResponse[]>({
  path: 'dashboard/libraries',
  queryKey: ['dashboard', 'libraries', currentServer.value?.serverBaseUrl],
});

const { data: languages } = useServerClient<Language[]>({
  path: '/dashboard/configuration/languages',
});

const settings = ref<LibrariesResponse>();

onBeforeMount(() => {
  refetch();
});

const title = ref<Library['title']>('');
const media_type = ref<NameVal | undefined>();
const specialName = ref<Library['specialSeasonName']>('');
const subtitleLanguages = ref<Language[]>([]);
const autoRefreshInterval = ref<Library['autoRefreshInterval']>(0);
const image = ref<Library['image']>('');
const perfectSubtitleMatch = ref<Library['perfectSubtitleMatch']>(false);
const realtime = ref<Library['realtime']>(false);
const folders = ref<FolderLibrary[]>([]);
const folder = ref<string>('/');

onMounted(() => {
  if (!libraries.value) return;
  settings.value = libraries.value.find(l => l.id == route.params.id)!;
});

watch(libraries, (value) => {
  if (!value) return;
  settings.value = value.find(l => l.id == route.params.id)!;
});

watch(libraries, (value) => {
  if (!value) return;
  subtitleLanguages.value = languages.value?.filter(l => settings.value?.subtitles?.includes(l.iso_639_1)) ?? [];
});

watch(settings, (value) => {
  if (!value) return;

  title.value = value.title;
  media_type.value = media_types.find(m => m.value == value.type);
  specialName.value = value.specialSeasonName;
  autoRefreshInterval.value = value.autoRefreshInterval ?? 0;
  image.value = value.image ?? '';
  perfectSubtitleMatch.value = value.perfectSubtitleMatch ?? false;
  realtime.value = value.realtime ?? false;
  folders.value = value.folder_library ?? [];
});

const newModalOpen = ref(false);
const openNewFolderModal = () => {
  newModalOpen.value = true;
};
const closeNewModal = () => {
  newModalOpen.value = false;
};

const addModalOpen = ref(false);
const openAddContentModal = () => {
  addModalOpen.value = true;
};
const closeAddModal = () => {
  addModalOpen.value = false;
};

const setFolder = (value: string) => {
  folder.value = value;
};

const deleteConfirmOpen = ref(false);
const openDeleteConfirm = () => {
  deleteConfirmOpen.value = true;
};
const closeDeleteConfirm = () => {
  deleteConfirmOpen.value = false;
};

const loadingRefresh = ref(false);
const handleRefresh = () => {

  loadingRefresh.value = true;

  serverClient()
    .post<{
      message: string,
      status: string,
      args: string[];
    }>(`dashboard/libraries/${route.params.id}/refresh`)
    .then(({ data }) => {
      console.log(data.status == 'ok');
      loadingRefresh.value = false;
      // showNotification({
      //     title: translate(data.message, ...data.args),
      //     type: data.status == 'ok'
      //         ? TYPE.SUCCESS
      //         : TYPE.ERROR,
      //     visibleOnly: true,
      //     duration: 2000,
      // });
    })
    .catch(() => {
      console.log('error');
      loadingRefresh.value = false;
      // showNotification({
      //     title: translate('An error occurred while rescanning the library folders'),
      //     type: TYPE.ERROR,
      //     visibleOnly: true,
      //     duration: 2000,
      // });
    });
};


const loadingRescan = ref(false);
const handleRescan = () => {

  loadingRescan.value = true;

  serverClient()
    .post<{
      message: string,
      status: string,
      args: string[];
    }>(`dashboard/libraries/${route.params.id}/rescan`)
    .then(({ data }) => {
      console.log(data.status == 'ok');
      loadingRescan.value = false;
      // showNotification({
      //     title: translate(data.message, ...data.args),
      //     type: data.status == 'ok'
      //         ? TYPE.SUCCESS
      //         : TYPE.ERROR,
      //     visibleOnly: true,
      //     duration: 2000,
      // });
    })
    .catch(() => {
      console.log('error');
      loadingRescan.value = false;
      // showNotification({
      //     title: translate('An error occurred while rescanning the library folders'),
      //     type: TYPE.ERROR,
      //     visibleOnly: true,
      //     duration: 2000,
      // });
    });
};

const handleCancel = () => {
  window.history.back();
};

const handleSave = () => {
  serverClient()
    .patch<{
      message: string,
      status: string,
      args: string[];
    }>(`dashboard/libraries/${route.params.id}`, {
      id: route.params.id,
      title: title.value,
      type: media_type.value?.value,
      specialSeasonName: specialName.value,
      subtitles: subtitleLanguages.value.map(l => l.iso_639_1),
      autoRefreshInterval: autoRefreshInterval.value,
      image: image.value,
      perfectSubtitleMatch: perfectSubtitleMatch.value,
      realtime: realtime.value,
      folder_library: folders.value,
    })
    .then(({ data }) => {
      query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

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

const setEncoderQualities = (folder: FolderLibrary, profiles: EncoderProfile[]) => {
  if (!settings.value) return;

  settings.value = {
    ...settings.value,
    folder_library: toRaw(settings.value)?.folder_library.map((f) => {
      if (f.folder_id == folder.folder_id) {
        f.folder.encoder_profiles = profiles.map(p => toRaw(p));
      }
      return f;
    }),
  };
};

const handleDeleteFolder = (folder: FolderLibrary) => {
  if (!settings.value) return;

  settings.value = {
    ...settings.value,
    folder_library: toRaw(settings.value)?.folder_library.filter(f => f.folder_id != folder.folder_id),
  };
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout :error="error" :title="`Library: {{title}}`" :params="{ title: settings?.title }" :back="true"
        v-model="addModalOpen">
        <template v-slot:cta>
        </template>

        <div class="flex w-full flex-col p-4 sm:w-full">
          <div class="flex w-full text-md">
            {{ t('Changes to metadata or artwork downloading settings will only apply to new content added to your newLibrary.') }}
            <br>
            {{ t('To apply the changes to existing titles, you\'ll need to refresh their metadata manually.') }}
          </div>
          <div class="mt-4 flex w-full flex-col gap-8 pr-2 min-h-[50vh] sm:flex-row">
            <div class="flex w-full flex-col sm:w-1/3">
              <div class="mt-4 flex h-11 w-full">
                <h3 class="text-xl">
                  {{ t('Library settings') }}:
                </h3>
              </div>
              <div class="flex flex-col gap-2">

                <div class="flex flex-col gap-2">
                  <label for="special_name">Library name</label>
                  <InputText type="text" tabindex="-1" id="special_name" v-model="title"
                    @change="title = $event.target.value" />
                </div>

                <div class="flex flex-col gap-2">
                  <label for="media_types">Media Type</label>
                  <Select id="media_types" placeholder="Select a media type" v-if="media_types" optionLabel="title"
                    :options="media_types ?? []" v-model="media_type" />
                </div>

                <template v-if="media_type && !['music', 'image', 'audiobook'].includes(media_type.value)">

                  <div class="flex flex-col gap-2">
                    <label for="special_name">Special season display name</label>
                    <InputText tabindex="-1" id="special_name" v-model="specialName"
                      @change="specialName = $event.target.value" />
                  </div>

                  <LanguageSelect v-if="languages" id="subtitleLanguages" name="Subtitle download languages"
                    class="mb-4" multiple :items="languages" v-model="subtitleLanguages" :setSelected="(value: typeof subtitleLanguages) => {
                      if (Array.isArray(value)) {
                        subtitleLanguages = value;
                        return;
                      }
                    }" />
                </template>
              </div>
            </div>
            <div class="flex w-full flex-col sm:w-2/3">
              <div class="mt-4 flex h-16 w-full gap-2">
                <h3 class="text-xl">
                  {{ t('Folders') }}:
                </h3>

                <Button type="button" id="yes" variant="text" color="white" class="ml-auto" startIcon="folderAdd"
                  :onClick="openNewFolderModal">
                  {{ t('Add new folder') }}
                </Button>
              </div>
              <div class="flex w-full flex-col gap-1">
                <template v-if="settings?.folder_library">
                  <template v-for="folderLibrary in settings?.folder_library" :key="folderLibrary.folder_id">
                    <Folder :folder="folderLibrary" :type="settings.type" :setEncoderQualities="setEncoderQualities"
                      :handleDeleteFolder="handleDeleteFolder" />
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>

        <template v-slot:actions>
          <Button type="button" id="refresh" variant="text" startIcon="folderSwap" :disabled="loadingRefresh"
            color="auto" :class="loadingRefresh ? 'first:children:animate-spin !cursor-not-allowed' : ''"
            @click="handleRefresh">
            {{ t('Refresh') }}
          </button>
          <Button type="button" id="rescan" variant="text" startIcon="folderSwap" :disabled="loadingRescan" color="auto"
            :class="loadingRescan ? 'first:children:animate-spin !cursor-not-allowed' : ''" @click="handleRescan">
            {{ t('Rescan') }}
          </button>
          <Button type="button" id="remove" variant="text"
            class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
            startIcon="folderRemove" color="red" @click="openDeleteConfirm">
            {{ t('Remove') }}
          </button>
          <Button type="button" id="add" variant="text" class="mr-auto" color="auto" startIcon="folderAdd"
            @click="openAddContentModal">
            {{ t('Add content') }}
          </button>
          <Button type="button" id="cancel" variant="text" color="white" @click="handleCancel">
            {{ t('Cancel') }}
          </Button>
          <Button type="button" id="save" variant="default" color="theme" @click="handleSave">
            {{ t('Save') }}
          </button>
        </template>

        <NewFolderModal :close="closeNewModal" :folder="folder" :open="newModalOpen" :setFolder="setFolder" />

        <DeleteLibraryModal v-if="settings?.id" :id="settings?.id" :name="settings?.title" :close="closeDeleteConfirm"
          :open="deleteConfirmOpen" />

        <AddContentModal v-if="settings" :closeAddContentModal="closeAddModal" :addContentModalOpen="addModalOpen"
          :librarySettings="settings" />
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
