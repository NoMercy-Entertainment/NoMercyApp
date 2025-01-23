<script lang="ts" setup>
import { PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useRoute } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';

import type { ServerLibrary } from '@/types/server';

import serverClient from '@/lib/clients/serverClient';
import FolderBrowser from '@/components/FolderBrowser.vue';
import Modal from '@/components/Modal.vue';

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function as PropType<() => any>,
    required: true,
  },
  folder: {
    type: String,
    required: true,
  },
  setFolder: {
    type: Function as PropType<(folder: string) => void>,
    required: true,
  },
  library: {
    type: Object as PropType<ServerLibrary>,
    required: false,
  },
});

const route = useRoute();
const { t } = useTranslation();
const query = useQueryClient();

const handleCreateFolder = () => {
  serverClient()
    .post<{
      message: string,
      status: string,
      args: string[];
    }>(`dashboard/libraries/${route.params.id ?? props.library?.id}/folders`, {
      path: props.folder,
    })
    .then(({ data }) => {
      query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

      // showNotification({
      // 	title: translate(data.message, ...data.args),
      // 	type: data.status == 'ok'
      // 		? TYPE.SUCCESS
      // 		: TYPE.ERROR,
      // 	visibleOnly: true,
      // 	duration: 2000,
      // });

      props.setFolder('/');

      props.close();
    });
};

</script>
<template>
  <Modal :close="close" :open="open" maxWidth="max-w-5xl" title="Add folder">

    <div class="mx-auto flex w-full flex-col h-[44vh]">
      <FolderBrowser :selected="folder" :setSelected="setFolder" />
    </div>

    <template v-slot:actions>
      <Button id="yes" :onClick="handleCreateFolder" color="theme" type="button" variant="contained">
        {{ t('Add') }}
      </button>
      <Button id="no" :onClick="close" type="button" color="text-auto-alpha-11" variant="text">
        {{ t('Cancel') }}
      </button>
    </template>
  </Modal>
</template>
