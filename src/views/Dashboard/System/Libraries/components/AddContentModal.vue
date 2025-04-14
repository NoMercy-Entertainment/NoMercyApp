<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useRoute } from 'vue-router';

import type { FileItem, FileList } from '@/types/api/dashboard/newContent';
import type { LibrariesResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import useServerClient from '@/lib/clients/useServerClient';
import { checkboxValue } from '@/lib/stringArray';
import { currentServer } from '@/store/currentServer';

import Button from '@/components/Button.vue';
import Modal from '@/components/Modal.vue';
import NoResultImage from '@/components/Images/NoResultImage.vue';
import FolderBrowser from '@/components/FolderBrowser.vue';

import FolderItem from './FolderItem.vue';
import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import Checkbox from '@/components/Forms/Checkbox.vue';

interface DestinationFolder {
  id: string;
  name: string,
}

const route = useRoute();
const { t } = useTranslation();

const props = defineProps({
  closeAddContentModal: {
    type: Function as PropType<(e: Event) => any>,
    required: true,
  },
  addContentModalOpen: {
    type: Boolean,
    required: true,
  },
  librarySettings: {
    type: Object as PropType<LibrariesResponse>,
    required: true,
  },
});

const fileList = ref<FileItem[]>([]);
const files = ref<{ id: number; path: string }[]>([]);

const folder = ref('/');
const showModal = ref<boolean>(false);

const currentLibrary = ref<LibrariesResponse>();
const destinationFolder = ref<DestinationFolder>();
const loading = ref(false);

const { data: libraries } = useServerClient<LibrariesResponse[]>({
  path: 'dashboard/libraries',
  queryKey: ['dashboard', 'libraries', currentServer.value?.serverBaseUrl],
});

onMounted(() => {
  if (!libraries.value) return;
  currentLibrary.value = libraries.value?.find(l => l.id == route.params.id);
  destinationFolder.value = {
    id: currentLibrary.value?.folder_library?.at(-1)?.folder_id ?? '',
    name: currentLibrary.value?.folder_library.at(-1)?.folder.path ?? '',
  };
});

watch(libraries, (value) => {
  if (!value) return;
  currentLibrary.value = value?.find(l => l.id == route.params.id);
  destinationFolder.value = {
    id: currentLibrary.value?.folder_library?.at(-1)?.folder_id ?? '',
    name: currentLibrary.value?.folder_library.at(-1)?.folder.path ?? '',
  };
});

const pushFile = (file: FileItem) => {
  if (files.value?.some(f => f.path === file.path && f.id === file.match?.id)) {
    // files.value = files.value.filter(f => f.path !== file.file);
  } else {
    files.value = [...files.value, { id: file.match?.id ?? 0, path: file.path }];
  }
};

const popFile = (file: FileItem) => {
  files.value = files.value.filter(f => f.path !== file.file && f.id !== file.match?.id);
};

const getFileList = () => {
  loading.value = true;
  fileList.value = [];

  serverClient()
    .post<{ data: FileList }>('dashboard/server/filelist', {
      folder: folder.value,
      type: props.librarySettings.type,
    })
    .then(({ data }) => {
      fileList.value = data.data?.files ?? [];
      files.value = [];
    })
    .catch((response) => {
      // enqueueSnackbar(`${t(response.data.error)}`, {
      // 	variant: 'error',
      // 	autoHideDuration: 3000,
      // });
      files.value = [];
    })
    .finally(() => {
      loading.value = false;
    });

  showModal.value = false;
};

const submit = () => {
  loading.value = true;
  serverClient()
    .post('dashboard/server/addfiles', {
      files: files.value,
      library_id: props.librarySettings?.id,
      folder_id: destinationFolder.value?.id,
    })
    .then(() => {
      // enqueueSnackbar(`${t('New content added')}`, {
      // 	variant: 'success',
      // 	autoHideDuration: 3000,
      // });
      files.value = [];
    })
    .catch((response) => {
      // enqueueSnackbar(`${t(response.data.error)}`, {
      // 	variant: 'error',
      // 	autoHideDuration: 3000,
      // });
      files.value = [];
    })
    .finally(() => {
      loading.value = false;
    });
};

const openModal = () => {
  showModal.value = true;
};
const closeModal = () => {
  showModal.value = false;
};

const setFolder = (value: string) => {
  folder.value = value;
};

const checkboxState = computed(() => {
  return checkboxValue(files.value, fileList.value);
});

const handleSelectAll = () => {
  if (checkboxState.value) {
    files.value = [];
  } else {
    files.value = fileList.value.map(f => ({ id: f.match?.id ?? 0, path: f.file }));
  }
};

const continueAvailable = computed(() => {
  return files.value?.length == 0 || destinationFolder.value?.id == null;
});

</script>

<template>
  <Modal :close="closeAddContentModal" :open="addContentModalOpen" maxWidth="max-w-5xl" title="Add new content">

    <div class="flex w-full flex-col overflow-clip h-[65vh]">
      <div class="mt-4 flex h-auto w-full flex-col items-start gap-4 sm:flex-row">
        <div class="flex w-full flex-auto sm:w-64 gap-2">
          <div class="flex flex-col gap-2 flex-1 ">
            <label for="source_folder">Source folder</label>
            <InputText id='source_folder' class='w-full' variant="filled" :onclick="openModal" v-model="folder">
            </InputText>
          </div>

          <div class="flex flex-col gap-2 ml-4 w-1/3">
            <label for="destination_folder">Destination folder</label>
            <Select id="destination_folder" placeholder="Select a destination folder" vairant="filled"
              v-if="destinationFolder" :options="(currentLibrary?.folder_library?.map((fl) => ({
                id: fl.folder_id,
                name: fl.folder.path,
              })) as DestinationFolder[]) ?? []" optionLabel="name" v-model="destinationFolder" />
          </div>
        </div>
      </div>

      <div class="mt-8 flex h-0 w-full flex-1 flex-col gap-2 overflow-clip">
        <div class="relative flex h-full w-full flex-col overflow-clip">
          <ScrollContainer :static="false" :autoHide="false" className="ml-2">
            <div class="flex flex-col gap-2 pb-2" v-if="fileList.length > 0">
              <FolderItem v-for="file in fileList ?? []" :key="file.file" :data="file" :files="files"
                :pushFile="pushFile" :popFile="popFile" />
            </div>
            <div v-else-if="!loading" class="absolute inset-0 flex h-auto w-full items-center justify-center">
              <div class="flex flex-col items-center gap-2">
                <NoResultImage />
                <span>
                  {{ $t('No results') }}
                </span>
              </div>
            </div>

            <div v-if="loading" class="absolute inset-0 flex h-full w-full items-center justify-center">
              <div class="text-center">
                <div role="status">
                  <svg aria-hidden="true" class="inline h-10 w-10 animate-spin text-auto-11 fill-focus dark:text-auto-1"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor" />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill" />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </ScrollContainer>
        </div>
      </div>
    </div>

    <template v-slot:actions>

      <Button id="Add" color="theme" variant="default" class="" :onClick="submit" :disabled="continueAvailable">
        {{ t('Add selection') }}
      </Button>

      <Checkbox id="checked" class="mr-auto ml-4" name="Select all" :modelValue="checkboxState"
        @click="handleSelectAll">
        <span class="whitespace-pre-wrap text-sm font-semibold">
          {{ $t('Select all') }}
        </span>
      </Checkbox>

    </template>

    <Modal :open="showModal" :close="closeModal" maxWidth="max-w-5xl" title="Add folder">
      <div class="mx-auto flex w-full flex-col h-[45vh]">
        <FolderBrowser :selected="folder" :setSelected="setFolder" />
      </div>
      <template v-slot:actions>
        <Button type="button" id="no" variant="default" color="theme" :onClick="getFileList">
          {{ t('Select') }}
        </button>
      </template>
    </Modal>
  </Modal>
</template>
