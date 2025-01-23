<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import { useTranslation } from "i18next-vue";

import type { AxiosError } from "axios";
import type { ServerLibrary } from '@/types/server';

import apiClient from "@/lib/clients/apiClient";
import useServerClient from '@/lib/clients/useServerClient';
import { currentServer } from '@/store/currentServer';
import { queryClient } from '@/config/tanstack-query';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Buttons/Button.vue';
import { Nullable } from 'vitest';

const { t } = useTranslation();

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function as PropType<() => any>,
    required: true,
  },
});

const error = ref(null);
const email = ref<Nullable<string>>('');

const errorBucket = ref<{
  type: string,
  place: string;
  message: string;
}[]>([]);

const { data: libraries } = useServerClient<ServerLibrary[]>({
  path: '/dashboard/libraries',
});

const allowedLibraries = ref<ServerLibrary[]>();

const closeInviteModal = () => {
  errorBucket.value = [];
  props.close();
}

const validateEmail = (email?: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u;
  return re.test(String(email).toLowerCase());
};

const inputChange = (field: string) => {
  errorBucket.value = errorBucket.value.filter(errorBucket => errorBucket.place != field);
}

const isValidEmail = computed(() => {
  return validateEmail(email.value);
});

const handleInvite = () => {
  if (!email.value) {
    errorBucket.value.push({
      type: 'error',
      place: 'email',
      message: t('Email is required'),
    });
    return;
  }

  if (!validateEmail(email.value)) {
    errorBucket.value.push({
      type: 'error',
      place: 'email',
      message: t('Invalid email address'),
    });
    return;
  }

  apiClient()
    .post('server/users', {
      server_id: currentServer.value?.id,
      email: email.value,
      libraries: allowedLibraries.value?.map(l => l.id),
    })
    .then(() => {
      queryClient.invalidateQueries({ queryKey: ['server_users'] });

      email.value = '';

      props.close();
    })
    .catch(({ response }: AxiosError<{ status: string, message?: string, exception?: string }>) => {
      if (response?.status != 200 && response?.data) {
        errorBucket.value.push({
          message: response.data.message ?? 'An error occurred',
          place: 'email',
          type: response.data.status ?? response.data.exception,
        });
      }
    });

};

</script>

<template>
  <Modal :open="open" :close="closeInviteModal" title="Invite user">

    <div class="flex w-full flex-col justify-start text-left">

      <p class="py-4 text-sm text-auto-10">
        {{ $t('Enter the email of the friend you want to invite to your server.') }}<br>
        {{ $t('We will send this person an email with a link to join the server, if they accept the invitation they will be automatically shown here.') }}
      </p>

      <div class="flex flex-col gap-2 w-full">
        <label for="email">Email</label>
        <InputText id="email" v-model="email" class="mb-4" />
      </div>

      <div class="pointer-events-auto mt-2 w-full flex-col gap-1 card flex justify-center">
        <label for="libraries">Allowed libraries</label>
        <MultiSelect id="libraries" display="chip" label="libraries" placeholder="Select libraries" multiple
          :options="libraries" optionLabel="title" v-model="allowedLibraries" />
      </div>
    </div>


    <template v-slot:actions>
      <Button type="button" id="yes" color="theme" variant="contained" endIcon="emailSend" :disabled="!isValidEmail"
        @click="handleInvite">
        {{ $t('Send') }}
      </button>
      <Button type="button" id="no" variant="text" @click="closeInviteModal">
        {{ $t('Cancel') }}
      </button>
    </template>
  </Modal>
</template>
