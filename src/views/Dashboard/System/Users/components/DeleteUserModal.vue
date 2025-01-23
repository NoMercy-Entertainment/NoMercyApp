<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { useTranslation } from 'i18next-vue';

import { useQueryClient } from '@tanstack/vue-query';

import apiClient from '@/lib/clients/apiClient';
import { currentServer } from '@/store/currentServer';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Buttons/Button.vue';

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function as PropType<() => any>,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  noRedirect: {
    type: Boolean,
    default: false,
  },
});

const { t } = useTranslation();
const query = useQueryClient();

const errorBucket = ref<{
  type: string,
  place: string;
  message: string;
}[]>([]);

const handleDelete = () => {
  if (!props.id) {
    errorBucket.value.push({
      type: 'error',
      place: 'email',
      message: t('Email is required'),
    });
    return;
  }

  apiClient()
    .post('server/users', {
      _method: 'delete',
      server_id: currentServer.value?.id,
      user_id: props.id,
    })
    .then(() => {
      query.invalidateQueries({ queryKey: ['users'] }).then(() => {
        history.back();
      });
    });

  props.close();
};

</script>

<template>
  <Modal :open="open" :close="close" :params="{ name: name }" :title="`Delete server member {{name}}`">

    <p class="my-6 text-sm text-auto-10">
      {{ $t('Are you sure you want to delete this server member?') }}<br>
      {{ $t('They won\'t be able to access your content anymore until you re-invite them') }}.
    </p>

    <template v-slot:actions>
      <Button type="button" id="yes" color="red" variant="contained" endIcon="userRemove" @click="handleDelete">
        {{ $t('Yes') }}
      </Button>
      <Button type="button" id="no" variant="text" color="white" @click="close">
        {{ $t('Cancel') }}
      </Button>
    </template>

  </Modal>
</template>
