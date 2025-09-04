<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';

import { useQueryClient } from '@tanstack/vue-query';
import { useSortable } from '@vueuse/integrations/useSortable';

import type { LibrariesResponse, StatusResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';

import Button from '@/components/Button.vue';
import LibraryItem from './LibraryItem.vue';
import useServerClient from '@/lib/clients/useServerClient';

const props = defineProps({
	setNextButtonLocked: {
		type: Function as PropType<(value: boolean) => void>,
		required: true,
	},
});

const query = useQueryClient();

const { data: libraries } = useServerClient<LibrariesResponse[]>({
	path: 'dashboard/libraries',
	queryKey: ['dashboard', 'libraries'],
});

const el = ref<HTMLElement | null>(null);
const list = ref<LibrariesResponse[]>(libraries.value ?? []);

watch(libraries, (value) => {
	console.log('Libraries updated:', value);
	if (!value)
		return;

	list.value = value;

	props.setNextButtonLocked(value?.length === 0);
});

function handleCreateLibrary() {
	serverClient()
		.post<StatusResponse<LibrariesResponse>>('dashboard/libraries')
		.then(() => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		});
}

function handleSortLibrary() {
	serverClient()
		.patch<StatusResponse<LibrariesResponse>>('dashboard/libraries/sort', {
			libraries: list.value.map((library, index) => ({
				id: library.id,
				order: index,
			})),
		})
		.then(() => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		});
}

watch(list, () => {
	handleSortLibrary();
});

useSortable(el, list, {
	animation: 150,
	handle: '.handle',
});
</script>

<template>
	<div class="flex flex-col overflow-hidden text-start h-available">
		<h2 class="mb-2 text-xl font-semibold">
			{{ $t('Organize your media library') }}
		</h2>
		<p class="mb-4 text-sm">
			{{ $t('Add your media libraries to organize your content.') }}
		</p>
		<div ref="el" class="flex h-auto w-full flex-col overflow-y-auto text-start gap-1">
			<template v-for="(item, index) in list" :key="item.id">
				<LibraryItem
					v-model="list[index]"
				/>
			</template>
		</div>
		<div class="mt-4 flex w-full justify-start">
			<Button id="yes"
				color="theme"
				type="button"
				variant="contained"
				@click="handleCreateLibrary"
			>
				{{ $t('Add media library') }}
			</Button>
		</div>
	</div>
</template>
