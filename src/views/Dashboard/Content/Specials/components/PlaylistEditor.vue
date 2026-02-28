<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { onClickOutside, refDebounced } from '@vueuse/core';
import { useSortable } from '@vueuse/integrations/useSortable';
import { useQueryClient } from '@tanstack/vue-query';

import type { SpecialItem, SpecialSearchResult } from '@/types/api/dashboard/special';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { checkboxValue } from '@/lib/utils/validation';

import ScrollContainer from '@/Layout/Desktop/components/ScrollContainer.vue';
import Checkbox from '@/components/Forms/Checkbox.vue';
import Button from '@/components/Button.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps<{ specialId: string }>();
const availableItems = ref<SpecialItem[]>([]);
const selectedAvailable = ref<string[]>([]);

// ── Search dropdown ──────────────────────────────────────────────────────────
const searchQuery = ref('');
const debouncedQuery = refDebounced(searchQuery, 350);
const searchResults = ref<SpecialSearchResult[]>([]);
const isSearching = ref(false);
const selectedDropdown = ref<number[]>([]);
const searchWrapperEl = ref<HTMLElement | null>(null);
const dropdownOpen = ref(false);
const playlistEl = ref<HTMLElement | null>(null);
const playlistItems = ref<SpecialItem[]>([]);
const selectedPlaylist = ref<string[]>([]);

const { data: existingItems, refetch } = useServerClient<SpecialItem[]>({
	path: `dashboard/specials/${props.specialId}/items`,
	queryKey: ['dashboard', 'specials', props.specialId, 'items'],
});

watch(debouncedQuery, async (query) => {
	if (query.trim().length < 2) {
		searchResults.value = [];
		dropdownOpen.value = false;
		return;
	}
	isSearching.value = true;
	try {
		const { data } = await serverClient().get<{ data: SpecialSearchResult[] } | SpecialSearchResult[]>(
			`dashboard/specials/search?q=${encodeURIComponent(query)}`,
		);
		searchResults.value = Array.isArray(data) ? data : data.data ?? [];
		dropdownOpen.value = true;
	}
	catch {
		searchResults.value = [];
	}
	finally {
		isSearching.value = false;
	}
});

onClickOutside(searchWrapperEl, () => {
	dropdownOpen.value = false;
});

function onSearchFocus() {
	if (searchResults.value.length) {
		dropdownOpen.value = true;
	}
}

function isAlreadyAdded(item: SpecialSearchResult) {
	return availableItems.value.some(a => a.media_id === item.id && a.media_type === item.media_type)
		|| playlistItems.value.some(p => p.media_id === item.id && p.media_type === item.media_type);
}

function toAvailableItem(item: SpecialSearchResult): SpecialItem {
	return {
		id: `avail-${item.media_type}-${item.id}`,
		order: availableItems.value.length,
		media_type: item.media_type,
		media_id: item.id,
		title: item.title,
		overview: item.overview,
		still: item.still,
		poster: item.poster,
		year: item.year,
		show_title: item.show_title,
		season_number: item.season_number,
		episode_number: item.episode_number,
		available: item.available,
	};
}

function toggleDropdownItem(id: number) {
	const idx = selectedDropdown.value.indexOf(id);
	if (idx >= 0) {
		selectedDropdown.value.splice(idx, 1);
	}
	else {
		selectedDropdown.value.push(id);
	}
}

function addSelectedFromDropdown() {
	const toAdd = searchResults.value.filter(
		r => selectedDropdown.value.includes(r.id) && !isAlreadyAdded(r),
	);
	toAdd.forEach((item) => {
		availableItems.value.push(toAvailableItem(item));
	});
	selectedDropdown.value = [];
}

// ── Available items (left panel — base storage) ─────────────────────────────

const availableSelectAllState = computed(() => {
	return checkboxValue(selectedAvailable.value, availableItems.value);
});

function toggleAvailableItem(id: string) {
	const idx = selectedAvailable.value.indexOf(id);
	if (idx >= 0) {
		selectedAvailable.value.splice(idx, 1);
	}
	else {
		selectedAvailable.value.push(id);
	}
}

function toggleAllAvailable() {
	if (availableSelectAllState.value) {
		selectedAvailable.value = [];
	}
	else {
		selectedAvailable.value = availableItems.value.map(a => a.id);
	}
}

// ── Playlist (right panel) ──────────────────────────────────────────────────

watch(existingItems, (value) => {
	if (value) {
		playlistItems.value = [...value].sort((a, b) => a.order - b.order);
	}
}, { immediate: true });

// ── Sortable ────────────────────────────────────────────────────────────────
useSortable(playlistEl, playlistItems, {
	animation: 150,
	handle: '.drag-handle',
});

const playlistSelectAllState = computed(() => {
	return checkboxValue(selectedPlaylist.value, playlistItems.value);
});

function togglePlaylistItem(id: string) {
	const idx = selectedPlaylist.value.indexOf(id);
	if (idx >= 0) {
		selectedPlaylist.value.splice(idx, 1);
	}
	else {
		selectedPlaylist.value.push(id);
	}
}

function toggleAllPlaylist() {
	if (playlistSelectAllState.value) {
		selectedPlaylist.value = [];
	}
	else {
		selectedPlaylist.value = playlistItems.value.map(p => p.id);
	}
}

// ── Transfer: available → playlist ──────────────────────────────────────────
function addToPlaylist() {
	const toMove = availableItems.value.filter(
		a => selectedAvailable.value.includes(a.id)
			&& !playlistItems.value.some(p => p.media_id === a.media_id && p.media_type === a.media_type),
	);
	const nextOrder = playlistItems.value.length;
	toMove.forEach((item, i) => {
		playlistItems.value.push({
			...item,
			id: `pending-${item.media_type}-${item.media_id}`,
			order: nextOrder + i,
		});
	});
	availableItems.value = availableItems.value.filter(
		a => !selectedAvailable.value.includes(a.id),
	);
	selectedAvailable.value = [];
}

// ── Transfer: playlist → available ──────────────────────────────────────────
function removeFromPlaylist() {
	const toMove = playlistItems.value.filter(
		p => selectedPlaylist.value.includes(p.id),
	);
	toMove.forEach((item) => {
		if (!availableItems.value.some(a => a.media_id === item.media_id && a.media_type === item.media_type)) {
			availableItems.value.push({
				...item,
				id: `avail-${item.media_type}-${item.media_id}`,
			});
		}
	});
	playlistItems.value = playlistItems.value.filter(
		p => !selectedPlaylist.value.includes(p.id),
	);
	selectedPlaylist.value = [];
}

// ── Save ────────────────────────────────────────────────────────────────────
const queryClient = useQueryClient();
const isSaving = ref(false);

async function save() {
	isSaving.value = true;
	try {
		await serverClient().patch(
			`dashboard/specials/${props.specialId}/items`,
			{
				items: playlistItems.value.map((item, index) => ({
					media_type: item.media_type,
					media_id: item.media_id,
					order: index,
				})),
			},
		);
		await queryClient.invalidateQueries({
			queryKey: ['dashboard', 'specials', props.specialId, 'items'],
		});
		await refetch();
	}
	finally {
		isSaving.value = false;
	}
}

defineExpose({ save, isSaving });
</script>

<template>
	<div class="flex flex-col gap-4 w-full h-full min-h-0">
		<!-- Search bar with dropdown -->
		<div ref="searchWrapperEl" class="relative flex gap-4 pt-4">
			<div class="relative flex items-center flex-1 rounded-lg border border-surface-8/8 bg-surface-2 shadow-lg">
				<MoooomIcon
					class-name="absolute left-3 w-4 text-surface-9 pointer-events-none z-10"
					icon="searchMagnifyingGlass"
				/>
				<InputText
					v-model="searchQuery"
					:placeholder="$t('Search movies and episodes...')"
					class="w-full !pl-9"
					size="small"
					variant="filled"
					@focus="onSearchFocus"
				/>
			</div>

			<Button
				id="add-from-search"
				:disabled="selectedDropdown.length === 0"
				color="theme"
				end-icon="addCircle"
				type="button"
				variant="contained"
				@click="addSelectedFromDropdown"
			>
				{{ $t("Add selected") }}
			</Button>

			<!-- Search results dropdown -->
			<div
				v-if="dropdownOpen && (isSearching || searchResults.length > 0)"
				class="absolute top-full left-0 right-0 mt-1 z-50 rounded-lg border border-surface-5/8 bg-surface-6 shadow-lg overflow-hidden"
			>
				<!-- Loading -->
				<div
					v-if="isSearching"
					class="flex items-center justify-center h-16 text-sm text-surface-9"
				>
					<div class="w-8 h-8 border-2 border-focus border-t-transparent rounded-full animate-spin" />
				</div>

				<!-- Results -->
				<ScrollContainer v-else :static="false" class="max-h-80">
					<div class="flex flex-col">
						<div
							v-for="item in searchResults"
							:key="`${item.media_type}-${item.id}`"
							:class="[
								isAlreadyAdded(item) ? 'opacity-40 cursor-default' : 'cursor-pointer',
							]"
							class="flex items-center gap-3 px-4 h-11 select-none hover:bg-surface-12/4 transition-colors duration-100 odd:bg-surface-12/[0.02]"
							@click="!isAlreadyAdded(item) && toggleDropdownItem(item.id)"
						>
							<Checkbox
								v-if="!isAlreadyAdded(item)"
								:model-value="selectedDropdown.includes(item.id)"
							/>
							<span v-else class="w-[18px] flex-shrink-0" />
							<div class="flex flex-col flex-1 min-w-0">
								<span class="text-sm font-medium text-surface-12 truncate">{{ item.title }}</span>
								<span
									v-if="item.show_title"
									class="text-xs text-surface-9 truncate"
								>
									{{ item.show_title }} · S{{ item.season_number }}E{{ item.episode_number }}
								</span>
							</div>
							<span class="text-xs text-surface-9 w-16 text-right capitalize flex-shrink-0">
								{{ item.media_type }}
							</span>
						</div>
					</div>
				</ScrollContainer>
			</div>
		</div>

		<div class="flex gap-4 w-full h-full min-h-0">
			<!-- LEFT: Available Items (base storage) -->
			<div class="flex flex-col flex-1 min-w-0 rounded-lg border border-surface-5 bg-surface-2 overflow-hidden">
				<!-- Table header -->
				<div class="flex items-start gap-4 px-4 py-2 bg-surface-5/10 border-b border-surface-1/8">
					<Checkbox
						:model-value="availableSelectAllState"
						@update:model-value="toggleAllAvailable"
					/>
					<span class="text-xs font-medium text-surface-12 flex-1">{{ $t('Title') }}</span>
				</div>

				<!-- Rows -->
				<div class="flex flex-col flex-1 overflow-hidden relative">
					<ScrollContainer :static="false" class="flex-1 min-h-0">
						<div class="flex flex-col">
							<!-- Empty state -->
							<div
								v-if="availableItems.length === 0"
								class="flex items-center justify-center h-24 text-sm text-surface-9"
							>
								{{ $t('Search and add items above') }}
							</div>

							<!-- Items -->
							<template v-else>
								<div
									v-for="item in availableItems"
									:key="item.id"
									:class="[
										!item.available && 'opacity-40',
									]"
									class="flex items-center gap-4 px-4 h-12 select-none hover:bg-surface-12/4 transition-colors duration-100 odd:bg-surface-12/[0.02]"
									@click="toggleAvailableItem(item.id)"
								>
									<Checkbox :model-value="selectedAvailable.includes(item.id)" />
									<div class="flex flex-col flex-1 min-w-0">
										<span class="text-sm font-medium text-surface-12 truncate">{{ item.title }}</span>
										<span
											v-if="item.show_title"
											class="text-xs text-surface-9 truncate"
										>
											{{ item.show_title }} · S{{ item.season_number }}E{{ item.episode_number }}
										</span>
									</div>
									<span class="text-xs text-surface-9 w-16 text-right capitalize flex-shrink-0">
										{{ item.media_type }}
									</span>
								</div>
							</template>
						</div>
					</ScrollContainer>
				</div>
			</div>

			<!-- CENTER: Transfer buttons -->
			<div class="flex flex-col items-center justify-start gap-2 flex-shrink-0 py-10">
				<Button
					id="add-to-playlist"
					:disabled="selectedAvailable.length === 0"
					class="!w-8"
					color="theme"
					end-icon="arrowRight"
					size="sm"
					@click="addToPlaylist"
				/>
				<Button
					id="remove-from-playlist"
					:disabled="selectedPlaylist.length === 0"
					class="!w-8"
					color="theme"
					size="sm"
					start-icon="arrowLeft"
					variant="outlined"
					@click="removeFromPlaylist"
				/>
			</div>

			<!-- RIGHT: Playlist -->
			<div class="flex flex-col flex-1 min-w-0 rounded-lg border border-surface-5 bg-surface-2 overflow-hidden">
				<!-- Table header -->
				<div class="flex items-start gap-4 px-4 py-2 bg-surface-5/10 border-b border-surface-1/8">
					<span class="text-xs font-medium text-surface-12 w-12">{{ $t('Order') }}</span>
					<Checkbox
						:model-value="playlistSelectAllState"
						@update:model-value="toggleAllPlaylist"
					/>
					<span class="text-xs font-medium text-surface-12 flex-1">{{ $t('Title') }}</span>
				</div>
				<div class="flex flex-col flex-1 overflow-hidden relative">
					<!-- Sortable rows -->
					<ScrollContainer :static="false" class="flex-1 min-h-0">
						<div ref="playlistEl" class="flex flex-col">
							<!-- Empty state -->
							<div
								v-if="playlistItems.length === 0"
								class="flex items-center justify-center h-24 text-sm text-surface-9"
							>
								{{ $t('Add items from the left panel') }}
							</div>

							<div
								v-for="(item, index) in playlistItems"
								v-else
								:key="item.id"
								class="flex items-center gap-4 px-4 h-12 select-none hover:bg-surface-12/4 transition-colors duration-100 odd:bg-surface-12/[0.02]"
							>
								<MoooomIcon
									class-name="drag-handle w-4 text-surface-9 cursor-grab active:cursor-grabbing flex-shrink-0 !pointer-events-auto"
									icon="menuDotsVertical"
								/>
								<Checkbox
									:model-value="selectedPlaylist.includes(item.id)"
									@update:model-value="togglePlaylistItem(item.id)"
								/>
								<div class="flex flex-col flex-1 min-w-0">
									<span class="text-sm font-medium text-surface-12 truncate">{{ item.title }}</span>
									<span
										v-if="item.show_title"
										class="text-xs text-surface-9 truncate"
									>
										{{ item.show_title }} · S{{ item.season_number }}E{{ item.episode_number }}
									</span>
								</div>
								<span class="text-sm text-surface-9 w-12 text-right flex-shrink-0">{{ index + 1 }}</span>
							</div>
						</div>
					</ScrollContainer>
				</div>
				<!-- Footer -->
				<div class="flex items-start gap-4 px-4 py-2 bg-surface-5/10 border-b border-surface-1/8">
					<span class="text-xs font-medium text-surface-12 flex flex-1 justify-start gap-2">
						<span>	{{ $t('Total') }}:</span>
						<span class="w-12 text-right">{{ playlistItems.length }} </span>
						<span>{{ $t('items') }}</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>
