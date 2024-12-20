<script setup lang="ts">
import {ref} from 'vue';
import {IonPage, IonContent} from '@ionic/vue';

import useApiClient from '@/lib/clients/useApiClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

import Button from '@/components/Buttons/Button.vue';
import UserCard from './components/UserCard.vue';
import InviteUserModal from './components/InviteUserModal.vue';
import {currentServer} from "@/store/currentServer";

const inviteModalOpen = ref(false);

const {data: serverUsers} = useApiClient({
  path: 'server_users',
  params: {
    server_id: currentServer.value?.id,
  },
  queryKey: ['server_users'],
});

const openInviteModal = () => {
  inviteModalOpen.value = true;
  setTimeout(()=> {
    document.querySelector<HTMLInputElement>('#email')?.focus();
  }, 300);
}

const closeInviteModal = () => {
  inviteModalOpen.value = false;
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <DashboardLayout :gridStyle="1" title="Server members" description="Manage your server members and their account permissions here.">
        <template v-slot:cta>
          <Button
              id="invite"
              color="theme"
              startIcon="userAdd"
              @click="openInviteModal"
          >
            {{ $t('Invite user') }}
          </Button>
        </template>

        <template v-for="user in serverUsers">
          <UserCard :data="user" />
        </template>

        <InviteUserModal :open="inviteModalOpen" :close="closeInviteModal" />
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
