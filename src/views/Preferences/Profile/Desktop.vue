<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
import {useToast} from "primevue/usetoast";
import FileUpload, {FileUploadBeforeSendEvent, FileUploadSelectEvent} from 'primevue/fileupload';
import {IonContent, IonPage} from "@ionic/vue";

import {user} from "@/store/user";
import {suffix} from "@/config/config";

import Avatar from "@/components/Images/Avatar.vue";
import Button from "@/components/Buttons/Button.vue";
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import apiClient from "@/lib/clients/apiClient";
import type {User} from "@/types/auth";
import {twMerge} from "tailwind-merge";
import {useTranslation} from "i18next-vue";

const { t } = useTranslation();

const toast = useToast();
const fileUpload = ref();
const image = ref<HTMLImageElement>();
const url = ref(user.value.avatarUrl);
const disabled = ref(true);

const uploadUrl = `https://api${suffix}.nomercy.tv/avatar`;

const upload = () => {
  fileUpload.value.upload();
  disabled.value = true;
};

const onUpload = () => {
  toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});

  apiClient()
      .get<{ data: User }>('/app_config')
      .then(async ({data}) => {
        user.value.avatarUrl = data.data.avatarUrl;
      });
};

const handleSelected = (e: FileUploadSelectEvent) => {
  url.value = e.files[0].objectURL;
  disabled.value = false;
};

const beforeSend = (e: FileUploadBeforeSendEvent) => {
  e.xhr.setRequestHeader('Authorization', `Bearer ${user.value.accessToken}`);
};

const handleReset = () => {
  url.value = user.value.avatarUrl;
  fileUpload.value.clear();
};

onMounted(() => {
  setTimeout(() => {
    if (!fileUpload.value?.$el) return;
    fileUpload.value.$el.querySelector('span[files]').innerText = t('No file chosen');
  }, 100);
});

const style = computed(() => {
  return {
    '--color-1': `rgb(var(--color-theme-1))`,
    '--color-2': `rgb(var(--color-theme-2))`,
    '--color-3': `rgb(var(--color-theme-3))`,
    '--color-4': `rgb(var(--color-theme-4))`,
    '--color-5': `rgb(var(--color-theme-5))`,
    '--color-6': `rgb(var(--color-theme-6))`,
    '--color-7': `rgb(var(--color-theme-7))`,
    '--color-8': `rgb(var(--color-theme-8))`,
    '--color-9': `rgb(var(--color-theme-9))`,
    '--color-10': `rgb(var(--color-theme-10))`,
    '--color-11': `rgb(var(--color-theme-11))`,
    '--color-12': `rgb(var(--color-theme-12))`,
  };
});

const classes = computed(() => {
  return twMerge(
      '!flex !justify-center !items-center !px-4 !py-2 !gap-2 !rounded-lg !text-sm',
      'select-none !w-auto !font-semibold !leading-[100%] !transition-transform !duration-150 !border-none !text-white',
      '!bg-gradient-to-b from-[var(--color-11)] to-[var(--color-10)] hover:from-[var(--color-12)] hover:to-[var(--color-11)] active:from-[var(--color-10)] active:to-[var(--color-9)] dark:from-[var(--color-7)] dark:to-[var(--color-5)] dark:hover:from-[var(--color-8)] dark:hover:to-[var(--color-6)] dark:active:from-[var(--color-7)] dark:active:to-[var(--color-4)] button-filled ',
      `
				 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-11)/70%)]
				 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--background-auto-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--background-auto-1)/70%)]
				 active:!shadow-none
				 active:!dark:shadow-none
			 `,
  );
});

const description = "Upload an image of max {{dimension}} pixels and {{size}} in size.\n We recommend a square image for best results.";

</script>

<template>

  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout :gridStyle="3" title="Profile">
        <template v-slot:cta>
          <!--          <Button id="invite" color="theme" startIcon="userAdd" @click="{}">-->
          <!--            {{ $t('Invite user') }}-->
          <!--          </Button>-->
        </template>
        <div class="flex flex-col gap-4 col-span-2">
          <div class="flex gap-4">

            <img ref="image" v-if="url" :src="url" class="w-60 min-w-60 h-auto aspect-square object-cover rounded-lg" alt=""/>
            <Avatar v-else :email="user.email" :size="250" class="w-60 min-w-60 h-auto aspect-square rounded-lg"/>

            <div class="flex flex-col justify-start items-start flex-grow relative gap-2">

              <FileUpload
                  @select="handleSelected"
                  @before-send="beforeSend"
                  @upload="onUpload"
                  :url="uploadUrl"
                  :choose-label="$t('Choose image')"
                  :cancel-label="$t('Cancel')"
                  ref="fileUpload"
                  name="image"
                  withCredentials
                  mode="basic"
                  accept="image/*"
                  :maxFileSize="2 * 1024 * 1024"
                  :style="style"
                  :class="classes"
              />

              <Button id="upload" color="theme" startIcon="cloudUpload" @click="upload" :disabled="disabled">
                {{ $t('Upload image') }}
              </Button>

              <p class="self-stretch flex-grow-0 flex-shrink-0 w-full text-sm text-left text-[#9ba1a6] whitespace-pre-line">
                {{ $t(description, {
                  dimension: '2000x2000',
                  size: '2MB',
                })}}
              </p>

              <Button id="upload" color="white" variant="text" startIcon="arrowCounterClockwise" @click="handleReset">
                {{ $t('Reset image') }}
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>

<style scoped>

</style>