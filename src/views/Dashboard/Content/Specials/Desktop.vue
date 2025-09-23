<script lang="ts" setup>
import { IonContent, IonPage } from '@ionic/vue';

import type { LibrariesResponse, StatusResponse } from '@/types/api/base/library';
import type { Library } from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import router from '@/router';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import SpecialCard from '@/views/Dashboard/Content/Specials/components/SpecialCard.vue';

const { data: specials, error } = useServerClient<LibrariesResponse[]>({
	path: 'dashboard/specials?page=0&take=20',
	queryKey: ['dashboard', 'specials'],
});

function handleCreateSpecial() {
	serverClient()
		.post<StatusResponse<Library>>('dashboard/specials')
		.then(({ data }) => {
			router.push(`/dashboard/special/${data?.data?.id ?? 'unknown'}`);
		});
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				:error="error"
				:grid-style="1"
				description="Manage your specials and their content here."
				title="Specials"
			>
				<template #cta>
					<Button
						id="newLibrary"
						color="theme"
						start-icon="collectionAdd"
						@click="handleCreateSpecial"
					>
						{{ $t("Create special") }}
					</Button>
				</template>

				<template v-for="special in specials ?? []" :key="special.id">
					<SpecialCard :data="special" />
				</template>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
