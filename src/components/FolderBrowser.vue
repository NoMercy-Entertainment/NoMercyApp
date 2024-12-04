<script setup lang="ts">
import {onMounted, PropType, ref, watch} from 'vue';
import {useTranslation} from 'i18next-vue';

import type {DirectoryTreeItem, DirectoryTreeResponse} from "@/types/api/dashboard/server";

import serverClient from '@/lib/clients/serverClient';
import ScrollContainer from "@/Layout/Desktop/components/ScrollContainer.vue";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

const {t} = useTranslation();

const props = defineProps({
  selected: {
    type: String,
    required: true,
  },
  setSelected: {
    type: Function as PropType<(value: string) => void>,
    required: true,
  },
});

watch(props, (value) => {
  path.value = value.selected;
});

const path = ref(props.selected ?? '/');
const lock = ref(false);
const directorySeparator = ref('/');

watch(path, (newValue) => {
  props.setSelected(newValue);

  lock.value = false;
});

const showFolders = ref<DirectoryTreeItem[]>([]);
const loading = ref(false);

const getFolders = (folder: string) => {
  serverClient()
      .post<DirectoryTreeResponse>('/dashboard/server/directorytree', {
        folder: folder,
      })
      .then(({data}) => {
        showFolders.value = data.data.filter(f => f.type == 'folder');
        directorySeparator.value = data.data[0].full_path?.match(/[\\\/]/gu)?.at(-1) ?? '/';
      })
      .then(() => loading.value = false);
};

watch(path, (value) => {
  if (!value) return;

  getFolders(value ?? '');
});

const handleGoUp = () => {
  lock.value = true;
  path.value = path.value.split(/[/\\]/gu).slice(0, -1).join(directorySeparator.value);

  if (!path.value.match(/[/\\]/gu)?.length) {
    path.value = '/';
  }

};

const handleClick = (folder: DirectoryTreeItem) => {
  path.value = folder.full_path;
};

onMounted(() => {
  getFolders(path.value ?? '');
});

</script>

<template>
  <div class="relative mt-1 w-full">
    <InputText id="folderName"
               name=""
               variant="filled"
               class="w-full"
               v-model="path">
    </InputText>
  </div>
  <div class="relative flex w-full flex-col overflow-clip h-[88%] even:text-lg">
    <div class="flex p-2 pt-4 border-b !bg-transparent text-sm select-none">
      <span class="">
        {{ t('Type') }}
      </span>
      <span class="mr-auto ml-4">
        {{ t('Name') }}
      </span>
    </div>
    <div
        class="relative flex w-full flex-col h-[85%]">
      <ScrollContainer :static="false" :autoHide="false" className="ml-2">
        <div @click="handleGoUp"
             class="bg-auto-6/4 hover:bg-auto-200 border-t-0 border-b border-solid border-[rgba(34,34,34,0.9)] contain flex items-center text-current cursor-pointer overflow-hidden py-1 px-2 align-middle h-10 min-h-10 leading-6 select-none"
             :class="path == '/' ? 'opacity-50' : ''"
        >
          <MoooomIcon icon="returnPackage" class="mt-1 h-5 w-5"/>
          <span class="mr-auto !ml-7">...</span>
        </div>
        <div
            class="relative w-full h-available">
          <div v-for="folder in showFolders"
               :key="folder.full_path"
               @click="() => handleClick(folder)"
               class="even:bg-auto-6/2 odd:bg-auto-100 hover:bg-auto-200 border-t-0 border-b border-solid border-[rgba(34,34,34,0.9)] contain flex items-center bg-transparent text-current cursor-pointer overflow-hidden py-1 px-2 align-middle h-10 leading-6">
            <MoooomIcon icon="folder" class="h-5 w-5"/>
            <span class="mr-auto !ml-7 text-sm select-none">
              {{ folder.path.replace(/[\\\/]/u, '') }}
            </span>
          </div>
        </div>
      </ScrollContainer>
    </div>
  </div>
</template>
