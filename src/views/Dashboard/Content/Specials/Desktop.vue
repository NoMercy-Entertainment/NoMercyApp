<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';

import type { LibrariesResponse, StatusResponse } from "@/types/api/base/library";
import type { Library } from "@/types/api/dashboard/server";

import useServerClient from "@/lib/clients/useServerClient";
import serverClient from "@/lib/clients/serverClient";
import router from "@/router";

import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import SpecialCard from "@/views/Dashboard/Content/Specials/components/SpecialCard.vue";

const { data: specials, error } = useServerClient<LibrariesResponse[]>({
  path: 'specials?page=0&take=20',
  queryKey: ['dashboard', 'specials'],
});

const handleCreateSpecial = () => {
  serverClient()
    .post<StatusResponse<Library>>('dashboard/specials')
    .then(({ data }) => {
      router.push(`/dashboard/special/${data?.data?.id ?? 'unknown'}`);
    });
}

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">

      <DashboardLayout :error="error" :gridStyle="1" title="Specials"
        description="Manage your specials and their content here.">
        <template v-slot:cta>

          <Button id="newLibrary" color="theme" startIcon="collectionAdd" @click="handleCreateSpecial">
            {{ $t('Create special') }}
          </Button>
        </template>

        <template v-for="special in specials ?? []">
          <SpecialCard :data="special" />
        </template>
      </DashboardLayout>
    </ion-content>
  </ion-page>
</template>
