<script setup lang="ts">
import { IonContent, IonPage } from '@ionic/vue';

import type { EncoderProfile, StatusResponse } from '@/types/api/base/library';
import type { Library } from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { queryClient } from '@/config/tanstack-query';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import ServerEncoderCard from './components/ServerEncoderCard.vue';

const { data: encoderProfiles, error } = useServerClient<EncoderProfile[]>({
	path: 'dashboard/encoderProfiles',
	queryKey: ['dashboard', 'encoderProfiles'],
});

function handleCreateEncoderProfile() {
	serverClient()
		.post<StatusResponse<Library>>('dashboard/encoderprofiles')
		.then(({ data }) => {
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'encoderProfiles'],
			});
		});
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				:error="error"
				:grid-style="1"
				title="Encoder profiles"
				description="Manage your encoder profiles and their settings here."
			>
				<template #cta>
					<Button
						id="newEncoderProfile"
						color="theme"
						start-icon="folderAdd"
						@click="handleCreateEncoderProfile"
					>
						{{ $t("New encoder profile") }}
					</Button>
				</template>

				<template v-for="profile in encoderProfiles ?? []">
					<ServerEncoderCard :data="profile" />
				</template>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
