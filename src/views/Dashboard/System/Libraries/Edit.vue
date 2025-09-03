<script setup lang="ts">
import { onBeforeMount, onMounted, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

import { useQueryClient } from '@tanstack/vue-query';
import { IonContent, IonPage } from '@ionic/vue';

import type {
	EncoderProfile,
	FolderLibrary,
	LibrariesResponse,
	StatusResponse,
} from '@/types/api/base/library';
import type { Language } from '@/types/api/shared';
import type { Library, NameVal } from '@/types/api/dashboard/server';

import { translate } from '@/lib/stringArray.ts';
import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import { media_types } from '@/config/global';

import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import LanguageSelect from '@/components/Forms/LanguageSelect.vue';
import NewFolderModal from './components/NewFolderModal.vue';
import DeleteLibraryModal from './components/DeleteLibraryModal.vue';
import Folder from './components/Folder.vue';
import AddContentModal from '@/views/Dashboard/System/Libraries/components/AddContentModal.vue';

const route = useRoute();
const query = useQueryClient();
const toast = useToast();
const {
	data: libraries,
	error,
	refetch,
} = useServerClient<LibrariesResponse[]>({
	path: 'dashboard/libraries',
	queryKey: ['dashboard', 'libraries', currentServer.value?.serverBaseUrl],
});

const { data: languages } = useServerClient<Language[]>({
	path: '/dashboard/configuration/languages',
});

const settings = ref<LibrariesResponse>();

onBeforeMount(() => {
	refetch();
});

const title = ref<Library['title']>('');
const media_type = ref<NameVal | undefined>();
const specialName = ref<Library['specialSeasonName']>('');
const subtitleLanguages = ref<Language[]>([]);
const autoRefreshInterval = ref<Library['autoRefreshInterval']>(0);
const image = ref<Library['image']>('');
const perfectSubtitleMatch = ref<Library['perfectSubtitleMatch']>(false);
const realtime = ref<Library['realtime']>(false);
const folders = ref<FolderLibrary[]>([]);
const folder = ref<string>('/');

onMounted(() => {
	if (!libraries.value)
		return;
	settings.value = libraries.value.find(l => l.id === route.params.id)!;
});

watch(libraries, (value) => {
	if (!value)
		return;
	settings.value = value.find(l => l.id === route.params.id)!;
});

watch(libraries, (value) => {
	if (!value)
		return;
	subtitleLanguages.value
    = languages.value?.filter(l =>
			settings.value?.subtitles?.includes(l.iso_639_1),
		) ?? [];
});

watch(settings, (value) => {
	if (!value)
		return;

	title.value = value.title;
	media_type.value = media_types.find(m => m.value === value.type);
	specialName.value = value.specialSeasonName;
	autoRefreshInterval.value = value.autoRefreshInterval ?? 0;
	image.value = value.image ?? '';
	perfectSubtitleMatch.value = value.perfectSubtitleMatch ?? false;
	realtime.value = value.realtime ?? false;
	folders.value = value.folder_library ?? [];
});

const newModalOpen = ref(false);
function openNewFolderModal() {
	newModalOpen.value = true;
}
function closeNewModal() {
	newModalOpen.value = false;
}

const addModalOpen = ref(false);
function openAddContentModal() {
	addModalOpen.value = true;
}
function closeAddModal() {
	addModalOpen.value = false;
}

function setFolder(value: string) {
	folder.value = value;
}

const deleteConfirmOpen = ref(false);
function openDeleteConfirm() {
	deleteConfirmOpen.value = true;
}
function closeDeleteConfirm() {
	deleteConfirmOpen.value = false;
}

const loadingRefresh = ref(false);
function handleRefresh() {
	loadingRefresh.value = true;

	serverClient()
		.post<StatusResponse<string>>(`dashboard/libraries/${route.params.id}/refresh`)
		.then(({ data }) => {
			loadingRefresh.value = false;
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			loadingRefresh.value = false;
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

const loadingRescan = ref(false);
function handleRescan() {
	loadingRescan.value = true;

	serverClient()
		.post<{
		message: string;
		status: string;
		args: string[];
	}>(`dashboard/libraries/${route.params.id}/rescan`)
		.then(({ data }) => {
			loadingRescan.value = false;
			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});
		})
		.catch(() => {
			loadingRescan.value = false;
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: translate('An error occurred while rescanning the library folders'),
				life: 5000,
			});
		});
}

function handleCancel() {
	window.history.back();
}

function handleSave() {
	serverClient()
		.patch<{
		message: string;
		status: string;
		args: string[];
	}>(`dashboard/libraries/${route.params.id}`, {
			id: route.params.id,
			title: title.value,
			type: media_type.value?.value,
			specialSeasonName: specialName.value,
			subtitles: subtitleLanguages.value.map(l => l.iso_639_1),
			autoRefreshInterval: autoRefreshInterval.value,
			image: image.value,
			perfectSubtitleMatch: perfectSubtitleMatch.value,
			realtime: realtime.value,
			folder_library: folders.value,
		})
		.then(({ data }) => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});

			handleCancel();
		});
}

function setEncoderQualities(folder: FolderLibrary, profiles: EncoderProfile[]) {
	if (!settings.value)
		return;

	settings.value = {
		...settings.value,
		folder_library: toRaw(settings.value)?.folder_library.map((f) => {
			if (f.folder_id === folder.folder_id) {
				f.folder.encoder_profiles = profiles.map(p => toRaw(p));
			}
			return f;
		}),
	};
}

function handleDeleteFolder(folder: FolderLibrary) {
	if (!settings.value)
		return;

	settings.value = {
		...settings.value,
		folder_library: toRaw(settings.value)?.folder_library.filter(
			f => f.folder_id !== folder.folder_id,
		),
	};
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<DashboardLayout
				v-model="addModalOpen"
				:error="error"
				title="Library: {{title}}"
				:params="{ title: settings?.title }"
				:back="true"
			>
				<template #cta />

				<div class="flex w-full flex-col p-4 sm:w-full">
					<div class="flex w-full text-md">
						{{
							t(
								"Changes to metadata or artwork downloading settings will only apply to new content added to your newLibrary.",
							)
						}}
						<br>
						{{
							t(
								"To apply the changes to existing titles, you'll need to refresh their metadata manually.",
							)
						}}
					</div>
					<div
						class="mt-4 flex w-full flex-col gap-8 pr-2 min-h-[50vh] sm:flex-row"
					>
						<div class="flex w-full flex-col sm:w-1/3">
							<div class="mt-4 flex h-11 w-full">
								<h3 class="text-xl">
									{{ $t("Library settings") }}:
								</h3>
							</div>
							<div class="flex flex-col gap-2">
								<div class="flex flex-col gap-2">
									<label for="special_name">Library name</label>
									<InputText
										id="special_name"
										v-model="title"
										type="text"
										tabindex="-1"
										@change="title = $event.target.value"
									/>
								</div>

								<div class="flex flex-col gap-2">
									<label for="media_types">Media Type</label>
									<Select
										v-if="media_types"
										id="media_types"
										v-model="media_type"
										placeholder="Select a media type"
										option-label="title"
										:options="media_types ?? []"
									/>
								</div>

								<template
									v-if="
										media_type
											&& !['music', 'image', 'audiobook'].includes(media_type.value)
									"
								>
									<div class="flex flex-col gap-2">
										<label for="special_name">Special season display name</label>
										<InputText
											id="special_name"
											v-model="specialName"
											tabindex="-1"
											@change="specialName = $event.target.value"
										/>
									</div>

									<LanguageSelect
										v-if="languages"
										id="subtitleLanguages"
										v-model="subtitleLanguages"
										name="Subtitle download languages"
										class="mb-4"
										multiple
										:items="languages"
										:set-selected="(value: typeof subtitleLanguages) => {
											if (Array.isArray(value)) {
												subtitleLanguages = value;
												return;
											}
										}"
									/>
								</template>
							</div>
						</div>
						<div class="flex w-full flex-col sm:w-2/3">
							<div class="mt-4 flex h-16 w-full gap-2">
								<h3 class="text-xl">
									{{ $t("Folders") }}:
								</h3>

								<Button
									id="yes"
									type="button"
									variant="text"
									color="white"
									class="ml-auto"
									start-icon="folderAdd"
									:onclick="openNewFolderModal"
								>
									{{ $t("Add new folder") }}
								</Button>
							</div>
							<div class="flex w-full flex-col gap-1">
								<template v-if="settings?.folder_library">
									<template
										v-for="folderLibrary in settings?.folder_library"
										:key="folderLibrary.folder_id"
									>
										<Folder
											:folder="folderLibrary"
											:type="settings.type"
											:set-encoder-qualities="setEncoderQualities"
											:handle-delete-folder="handleDeleteFolder"
										/>
									</template>
								</template>
							</div>
						</div>
					</div>
				</div>

				<template #actions>
					<Button
						id="refresh"
						type="button"
						variant="text"
						start-icon="folderSwap"
						:disabled="loadingRefresh"
						color="auto"
						:class="
							loadingRefresh
								? 'first:children:animate-spin !cursor-not-allowed'
								: ''
						"
						@click="handleRefresh"
					>
						{{ $t("Refresh") }}
					</Button>
					<Button
						id="rescan"
						type="button"
						variant="text"
						start-icon="folderSwap"
						:disabled="loadingRescan"
						color="auto"
						:class="
							loadingRescan
								? 'first:children:animate-spin !cursor-not-allowed'
								: ''
						"
						@click="handleRescan"
					>
						{{ $t("Rescan") }}
					</Button>
					<Button
						id="remove"
						type="button"
						variant="text"
						class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
						start-icon="folderRemove"
						color="red"
						@click="openDeleteConfirm"
					>
						{{ $t("Remove") }}
					</Button>
					<Button
						id="add"
						type="button"
						variant="text"
						class="mr-auto"
						color="auto"
						start-icon="folderAdd"
						@click="openAddContentModal"
					>
						{{ $t("Add content") }}
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
						variant="default"
						color="theme"
						@click="handleSave"
					>
						{{ $t("Save") }}
					</Button>
				</template>

				<NewFolderModal
					:close="closeNewModal"
					:folder="folder"
					:open="newModalOpen"
					:set-folder="setFolder"
				/>

				<DeleteLibraryModal
					v-if="settings?.id"
					:id="settings?.id"
					:name="settings?.title"
					:close="closeDeleteConfirm"
					:open="deleteConfirmOpen"
				/>

				<AddContentModal
					v-if="settings"
					:close-add-content-modal="closeAddModal"
					:add-content-modal-open="addModalOpen"
					:library-settings="settings"
				/>
			</DashboardLayout>
		</IonContent>
	</IonPage>
</template>
