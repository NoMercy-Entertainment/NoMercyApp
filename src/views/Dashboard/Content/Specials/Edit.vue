<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Image, InputText } from 'primevue';

import type { LibrariesResponse } from '@/types/api/base/library';

import useServerClient from '@/lib/clients/useServerClient';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import DeleteSpecialModal from './components/DeleteSpecialModal.vue';
import PlaylistEditor from './components/PlaylistEditor.vue';
import Button from '@/components/Button.vue';
import { currentServer } from '@/store/currentServer';
import serverClient from '@/lib/clients/serverClient';
import router from '@/router';

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
	router.back();
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

const activeTab = ref<'Details' | 'Playlist'>('Details');
const playlistEditorRef = ref<InstanceType<typeof PlaylistEditor>>();
const isSaving = ref(false);

async function handleSave() {
	if (isSaving.value)
		return;
	isSaving.value = true;

	try {
		await Promise.all([
			serverClient()
				.patch(`/dashboard/specials/${settings.value?.id}`, {
					title: title.value,
					overview: overview.value,
					backdrop: backdrop.value,
					poster: poster.value,
					logo: logo.value,
				}),
			playlistEditorRef.value?.save(),
		]);
	}
	finally {
		isSaving.value = false;
	}
}
</script>

<template>
	<DashboardLayout
		:error="error"
		:grid-style="4"
		:params="{ title: settings?.title }"
		class-name="!m-0"
		title="Special: {{title}}"
	>
		<template #pre-cta>
			<nav class="flex items-center gap-2">
				<button
					:class="activeTab === 'Details'
						? 'bg-focus/11 border-focus/4'
						: 'border-transparent hover:bg-focus/10 hover:border-focus/4'"
					class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors duration-200"
					@click="activeTab = 'Details'"
				>
					{{ $t('Details') }}
				</button>
				<button
					:class="activeTab === 'Playlist'
						? 'bg-focus/11 border-focus/4'
						: 'border-transparent hover:bg-focus/10 hover:border-focus/4'"
					class="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors duration-200"
					@click="activeTab = 'Playlist'"
				>
					{{ $t('Playlist') }}
				</button>
			</nav>
		</template>
		<template #actions>
			<Button
				id="remove"
				class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
				color="auto"
				start-icon="folderRemove"
				type="button"
				variant="text"
				@click="openDeleteConfirm"
			>
				{{ $t("Remove") }}
			</Button>
			<Button
				id="cancel"
				color="white"
				type="button"
				variant="text"
				@click="handleCancel"
			>
				{{ $t("Cancel") }}
			</Button>
			<Button
				id="save"
				:disabled="isSaving"
				class="ml-auto"
				color="theme"
				type="button"
				@click="handleSave"
			>
				{{ isSaving ? $t("Saving...") : $t("Save") }}
			</Button>
		</template>

		<div v-if="activeTab === 'Details'" class="flex gap-6 w-full p-4">
			<!-- General section -->
			<section class="flex flex-col gap-4 rounded-xl bg-surface-12/3 p-5 w-full">
				<h3 class="text-base font-semibold text-surface-12">
					{{ $t('General') }}
				</h3>
				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium text-surface-12/60" for="name">{{ $t('Name') }}</label>
					<InputText id="name" v-model="title" class="w-full" variant="filled" />
				</div>
				<div class="flex flex-col gap-2">
					<label class="text-sm font-medium text-surface-12/60" for="overview">{{ $t('Overview') }}</label>
					<Textarea
						id="overview"
						v-model="overview"
						:rows="6"
						class="w-full"
						variant="filled"
					/>
				</div>
			</section>

			<!-- Artwork section -->
			<section class="flex flex-col gap-4 rounded-xl bg-surface-12/3 p-5 w-full">
				<h3 class="text-base font-semibold text-surface-12">
					{{ $t('Artwork') }}
				</h3>
				<div class="flex flex-col gap-4">
					<!-- Backdrop -->
					<div class="flex items-start gap-4">
						<Image
							v-if="backdrop"
							:src="`${currentServer?.serverBaseUrl}/images/original${backdrop}`"
							alt="Backdrop"
							class="w-28 flex-shrink-0 rounded-lg overflow-hidden aspect-backdrop"
							preview
						/>
						<div
							v-else
							class="w-28 flex-shrink-0 rounded-lg bg-surface-12/6 aspect-backdrop flex items-center justify-center"
						>
							<span class="text-xs text-surface-9">{{ $t('No image') }}</span>
						</div>
						<div class="flex flex-col gap-1.5 flex-1 min-w-0">
							<label class="text-sm font-medium text-surface-12/60" for="backdrop">{{ $t('Backdrop') }}</label>
							<InputText
								id="backdrop"
								v-model="backdrop"
								class="w-full"
								size="small"
								variant="filled"
							/>
						</div>
					</div>
					<!-- Logo -->
					<div class="flex items-start gap-4">
						<Image
							v-if="logo"
							:src="`${currentServer?.serverBaseUrl}/images/original${logo}`"
							alt="Logo"
							class="w-28 flex-shrink-0 rounded-lg overflow-hidden aspect-backdrop bg-surface-12/6"
							preview
						/>
						<div
							v-else
							class="w-28 flex-shrink-0 rounded-lg bg-surface-12/6 aspect-backdrop flex items-center justify-center"
						>
							<span class="text-xs text-surface-9">{{ $t('No image') }}</span>
						</div>
						<div class="flex flex-col gap-1.5 flex-1 min-w-0">
							<label class="text-sm font-medium text-surface-12/60" for="logo">{{ $t('Logo') }}</label>
							<InputText
								id="logo"
								v-model="logo"
								class="w-full"
								size="small"
								variant="filled"
							/>
						</div>
					</div>
					<!-- Poster -->
					<div class="flex items-start gap-4">
						<Image
							v-if="poster"
							:src="`${currentServer?.serverBaseUrl}/images/original${poster}`"
							alt="Poster"
							class="w-20 flex-shrink-0 rounded-lg overflow-hidden aspect-poster"
							preview
						/>
						<div
							v-else
							class="w-20 flex-shrink-0 rounded-lg bg-surface-12/6 aspect-poster flex items-center justify-center"
						>
							<span class="text-xs text-surface-9">{{ $t('No image') }}</span>
						</div>
						<div class="flex flex-col gap-1.5 flex-1 min-w-0">
							<label class="text-sm font-medium text-surface-12/60" for="poster">{{ $t('Poster') }}</label>
							<InputText
								id="poster"
								v-model="poster"
								class="w-full"
								size="small"
								variant="filled"
							/>
						</div>
					</div>
				</div>
			</section>
		</div>

		<PlaylistEditor
			v-if="activeTab === 'Playlist' && settings?.id"
			ref="playlistEditorRef"
			:special-id="settings.id"
			class="w-full flex-1 min-full"
		/>

		<DeleteSpecialModal
			v-if="settings?.id"
			:id="settings?.id"
			:close="closeDeleteConfirm"
			:name="settings?.title"
			:open="deleteConfirmOpen"
		/>
	</DashboardLayout>
</template>
