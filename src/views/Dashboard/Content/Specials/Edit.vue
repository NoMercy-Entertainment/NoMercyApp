<script setup lang="ts">
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { LibrariesResponse } from '@/types/api/base/library';

import useServerClient from '@/lib/clients/useServerClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import DeleteSpecialModal from './components/DeleteSpecialModal.vue';
import Button from '@/components/Button.vue';
import { InputText } from 'primevue';
import { currentServer } from '@/store/currentServer';
import serverClient from '@/lib/clients/serverClient';

const route = useRoute();

const {
	data: specials,
	error,
	refetch,
} = useServerClient<LibrariesResponse[]>({
	path: 'dashboard/specials',
	queryKey: ['dashboard', 'specials'],
});

const settings = ref<LibrariesResponse>();

onBeforeMount(() => {
	refetch();
});

onMounted(() => {
	if (!specials.value)
		return;
	settings.value = specials.value.find(l => l.id === route.params.id)!;
});

watch(specials, (value) => {
	if (!value)
		return;
	settings.value = value.find(l => l.id === route.params.id)!;
});

const deleteConfirmOpen = ref(false);
function openDeleteConfirm() {
	deleteConfirmOpen.value = true;
}
function closeDeleteConfirm() {
	deleteConfirmOpen.value = false;
}

function handleCancel() {
	window.history.back();
}

const title = ref<string>(settings.value?.title || '');
const overview = ref<string>(settings.value?.overview || '');
const backdrop = ref<string>(settings.value?.backdrop || '');
const poster = ref<string>(settings.value?.poster || '');
const logo = ref<string>(settings.value?.logo || '');

watch(settings, (value) => {
	if (!value)
		return;
	title.value = value?.title;
	overview.value = value?.overview;
	backdrop.value = value?.backdrop;
	poster.value = value?.poster;
	logo.value = value?.logo;
});

function handleSave() {
	serverClient()
		.patch(`/dashboard/specials/${settings.value?.id}`, {
			title: title.value,
			overview: overview.value,
			backdrop: backdrop.value,
			poster: poster.value,
			logo: logo.value,
		})
		.then(({ data }) => {
			console.log(data);
		});
}
</script>

<template>
	<DashboardLayout
		:grid-style="1"
		:error="error"
		title="Special: {{title}}"
		:params="{ title: settings?.title }"
	>
		<template #cta />
		<template #actions>
			<Button
				id="remove"
				type="button"
				variant="text"
				start-icon="folderRemove"
				class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
				color="auto-alpha"
				@click="openDeleteConfirm"
			>
				{{ $t("Remove") }}
			</Button>
			<Button
				id="cancel"
				type="button"
				variant="text"
				color="white"
				@click="handleCancel"
			>
				{{ $t("Cancel") }}
			</Button>
			<Button
				id="save"
				type="button"
				class="ml-auto"
				color="theme"
				@click="handleSave"
			>
				{{ $t("Save") }}
			</Button>
		</template>

		<div class="flex flex-col gap-5 col-span-5 col-start-1 2xl:col-start-1">
			<div class="flex flex-col gap-2">
				<label for="name">Name</label>
				<InputText id="name" v-model="title" variant="filled" class="w-full" />
			</div>
			<div class="flex flex-col gap-2">
				<label for="overview">Overview</label>
				<Textarea
					id="overview"
					v-model="overview"
					variant="filled"
					:rows="8"
					class="w-full"
				/>
			</div>

			<div class="flex gap-4 w-full">
				<div class="flex flex-col gap-4 w-full">
					<div class="flex flex-col gap-2">
						<label for="backdrop">Backdrop</label>
						<InputText
							id="backdrop"
							v-model="backdrop"
							variant="filled"
							class="w-full"
						/>
					</div>
					<Image
						:src="`${currentServer?.serverBaseUrl}/images/original${backdrop}`"
						alt="Image"
						width="100%"
						class="mx-2"
						preview
					/>
				</div>
				<div class="flex flex-col gap-4 w-full">
					<div class="flex flex-col gap-2">
						<label for="logo">Logo</label>
						<InputText
							id="logo"
							v-model="logo"
							variant="filled"
							class="w-full"
						/>
					</div>
					<Image
						:src="`${currentServer?.serverBaseUrl}/images/original${logo}`"
						alt="Image"
						width="100%"
						class="mx-2"
						preview
					/>
				</div>
			</div>
		</div>

		<div
			class="flex flex-col gap-4 col-span-2 row-start-1 col-start-1 2xl:col-start-6"
		>
			<div class="flex flex-col gap-5">
				<div class="flex flex-col gap-2">
					<label for="poster">Poster</label>
					<InputText
						id="poster"
						v-model="poster"
						variant="filled"
						class="w-full"
					/>
				</div>
				<Image
					:src="`${currentServer?.serverBaseUrl}/images/original${poster}`"
					alt="Image"
					width="100%"
					class="mx-2"
					preview
				/>
			</div>
		</div>

		<DeleteSpecialModal
			v-if="settings?.id"
			:id="settings?.id"
			:name="settings?.title"
			:close="closeDeleteConfirm"
			:open="deleteConfirmOpen"
		/>
	</DashboardLayout>
</template>

<style scoped></style>
