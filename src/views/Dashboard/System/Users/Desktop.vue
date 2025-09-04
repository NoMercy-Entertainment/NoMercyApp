<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonPage } from '@ionic/vue';

import useApiClient from '@/lib/clients/useApiClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';

import Button from '@/components/Button.vue';
import UserCard from './components/UserCard.vue';
import InviteUserModal from './components/InviteUserModal.vue';
import { currentServer } from '@/store/currentServer';
import type { ServerUser } from '@/types/auth';

const inviteModalOpen = ref(false);

const { data: serverUsers } = useApiClient<ServerUser[]>({
	path: 'server/server-users',
	params: {
		id: currentServer.value?.id,
	},
	queryKey: ['server_users'],
});

function openInviteModal() {
	inviteModalOpen.value = true;
	setTimeout(() => {
		document.querySelector<HTMLInputElement>('#email')?.focus();
	}, 300);
}

function closeInviteModal() {
	inviteModalOpen.value = false;
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				:grid-style="1"
				title="Server members"
				description="Manage your server members and their account permissions here."
			>
				<template #cta>
					<Button
						id="invite"
						color="theme"
						start-icon="userAdd"
						@click="openInviteModal"
					>
						{{ $t("Invite user") }}
					</Button>
				</template>

				<template
					v-for="user in [...(serverUsers ?? [])]?.sort((a, b) =>
						a.name.localeCompare(b.name),
					)"
					:key="user.user_id"
				>
					<UserCard :data="user" />
				</template>

				<InviteUserModal :open="inviteModalOpen" :close="closeInviteModal" />
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
