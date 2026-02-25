<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { refDebounced } from '@vueuse/core';
import Checkbox from '@/components/Forms/Checkbox.vue';

import type { LogEntry, LogType } from '@/types/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { connection } from '@/lib/clients/dashboardSocket';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import useHubListener from '@/hooks/useHubListener';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import LogModal from '@/views/Dashboard/Advanced/Logs/components/LogModal.vue';
import LogTypeSelector from '@/views/Dashboard/Advanced/Logs/components/LogTypeSelector.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import { userTime } from '@/lib/dateTime';
import { censorPublicIpAddresses } from '@/lib/utils';

const selectedTypes = ref<LogType[]>([]);
const selectedTypeNames = ref<string[]>([]);
const selectedLevels = ref<string[]>([]);
const limit = ref(50);
const logs = ref<LogEntry[]>([]);
const filter = ref('');
const debouncedFilter = refDebounced(filter, 500);

let abortController: AbortController | null = null;

async function fetchLogs() {
	abortController?.abort();
	abortController = new AbortController();

	const params = {
		limit: limit.value,
		types: selectedTypeNames.value.length > 0 ? selectedTypeNames.value : undefined,
		levels: selectedLevels.value.length > 0 ? selectedLevels.value : undefined,
		filter: debouncedFilter.value || undefined,
	};

	try {
		const response = await serverClient().get('/dashboard/logs', {
			params,
			signal: abortController.signal,
		});
		const data = (response.data as any)?.data ?? response.data;
		logs.value = Array.isArray(data) ? data : [];
	}
	catch (e: any) {
		if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return;
		console.error('[Logs] fetch failed:', e);
	}
}

const { data: logTypes } = useServerClient<LogType[]>({
	path: '/dashboard/logs/types',
});

const { data: levels } = useServerClient<string[]>({
	path: '/dashboard/logs/levels',
});

watch(levels, (value) => {
	if (!value)
		return;
	selectedLevels.value = [...value];
});

watch(logTypes, (value) => {
	if (!value)
		return;
	selectedTypes.value = [...value];
});

watch(selectedTypes, (value) => {
	if (!value)
		return;
	selectedTypeNames.value = value.map(v => v.name);
});

watch([selectedTypeNames, selectedLevels, limit, debouncedFilter], () => {
	fetchLogs();
});

function handleAddLog(entry: LogEntry) {
	if (!selectedLevels.value.includes(entry.level))
		return;
	if (selectedTypeNames.value.length > 0 && !selectedTypeNames.value.includes(entry.type))
		return;
	if (debouncedFilter.value && !entry.message.toLowerCase().includes(debouncedFilter.value.toLowerCase()))
		return;

	logs.value = [entry, ...logs.value.slice(0, logs.value.length - 1)];
}

useHubListener(connection, 'NewLog', handleAddLog);

let refetchInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	fetchLogs();
	refetchInterval = setInterval(fetchLogs, 5 * 60 * 1000);
});

onBeforeUnmount(() => {
	if (refetchInterval)
		clearInterval(refetchInterval);
});

const currentLog = ref<LogEntry | null>(null);
const showLogOpen = ref(false);

function openLog(item: LogEntry) {
	console.log(item);
	currentLog.value = item;
	showLogOpen.value = true;
}

function closeLog(e: Event) {
	e.stopPropagation();
	currentLog.value = null;
	showLogOpen.value = false;
}

function handleClear() {
	serverClient()
		.delete('/dashboard/logs')
		.catch(() => {
			alert('you\'d think this would actually do something huh 😋');
		})
		.then(() => {
			logs.value = [];
		});
}

function handleLevel(value: string) {
	if (selectedLevels.value.includes(value)) {
		selectedLevels.value = selectedLevels.value.filter(
			selectedLevel => selectedLevel !== value,
		);
	}
	else {
		selectedLevels.value = [...selectedLevels.value, value];
	}
}
</script>

<template>
	<DashboardLayout :grid-style="4" description="" title="Logs">
		<template #cta />

		<table
			class="mx-2 flex flex-col overflow-auto rounded-lg outline outline-1 min-w-available min-h-available divide-y divide-surface-12/8 h-inherit outline-surface-5 max-h-[78vh] min-h-[78vh]"
		>
			<thead
				class="flex flex-grow-0 items-start justify-start self-stretch rounded-tl-lg rounded-tr-lg w-available"
			>
				<tr
					class="flex w-full flex-1 gap-4 text-xs font-medium bg-surface-2/10"
				>
					<th
						class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-[150px] min-w-[150px]"
					>
						<span>{{ $t("Limit") }} ({{ limit }})</span>

						<DropdownMenu
							class="relative flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 hover:bg-surface-5/6"
							translate="translate-x-1/4"
						>
							<template #button>
								<MoooomIcon class-name="w-6" icon="chevronDown" />
							</template>
							<template #default>
								<div
									class="flex w-full flex-col items-start justify-between py-2 bg-surface-1"
								>
									<template
										v-for="l in [5, 10, 20, 50, 100, 500, 1000, 2000]"
									>
										<button
											class="flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
											@click="limit = l"
										>
											<Checkbox :model-value="limit === l" />
											<span>{{ l }}</span>
										</button>
									</template>
								</div>
							</template>
						</DropdownMenu>
					</th>
					<th
						class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-[120px] min-w-[120px]"
					>
						<span>{{ $t("Type") }}</span>
						<LogTypeSelector
							v-if="logTypes"
							v-model:selected-types="selectedTypes"
							:log-types="logTypes"
						/>
					</th>
					<th
						class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-[120px] min-w-[120px]"
					>
						<span>{{ $t("Level") }}</span>
						<DropdownMenu
							class="relative flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 hover:bg-surface-5/6"
						>
							<template #button>
								<MoooomIcon class-name="w-6" icon="chevronDown" />
							</template>

							<div
								class="flex w-full flex-col items-start justify-between py-2 bg-surface-1"
							>
								<template v-for="level in levels">
									<button
										class="flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
										@click="() => handleLevel(level)"
									>
										<Checkbox
											:model-value="selectedLevels?.includes(level)"
										/>
										<span>{{ level }}</span>
									</button>
								</template>
							</div>
						</DropdownMenu>
					</th>
					<th
						class="relative flex h-11 items-center justify-between gap-3 self-stretch p-3 group/tableButton w-available"
					>
						<span>{{ $t("Message") }}</span>
						<InputText
							id="filter"
							v-model="filter"
							class="mr-auto ml-4 min-w-40"
							name=""
							placeholder="Filter..."
							size="small"
							variant="filled"
						/>
					</th>
					<th
						class="relative flex h-11 w-20 items-center justify-between gap-3 self-stretch p-3 group/tableButton min-w-20"
					>
						<Button
							id="clear"
							class-name="!py-1 !h-8"
							color="theme"
							title="Clear logs"
							variant="text"
							@click="handleClear"
						>
							<span>{{ $t("clear") }}</span>
						</Button>
					</th>
				</tr>
			</thead>

			<tbody
				class="overflow-auto divide-y divide-surface-12/5 max-h-available flex-1"
			>
				<template v-for="(log, index) in logs ?? []" :key="`${log.time}-${log.type}-${index}`">
					<tr
						class="flex h-12 w-full flex-1 justify-center gap-4 odd:bg-white/[0.04]"
					>
						<td
							class="relative flex flex-grow items-center justify-start whitespace-nowrap px-3 text-xs line-clamp-1 w-[150px] min-w-[150px]"
						>
							{{ userTime(log.time) }}
						</td>
						<td
							class="relative flex flex-grow items-center justify-center whitespace-nowrap text-xs line-clamp-1 w-[120px] min-w-[120px]"
						>
							<div
								:style="`background: ${log.color}55`"
								class="h-5 w-min rounded-full px-2 text-center leading-5"
							>
								{{
									logTypes?.find((t) => t.name === log.type)?.display_name
								}}
							</div>
						</td>
						<td
							class="relative flex flex-grow items-center justify-start whitespace-nowrap px-3 text-xs line-clamp-1 w-[120px] min-w-[120px]"
						>
							{{ log.level }}
						</td>
						<td
							class="relative flex flex-grow cursor-pointer items-center justify-start whitespace-nowrap px-3 text-xs line-clamp-1 w-available"
							@click="() => openLog(log)"
						>
							{{ censorPublicIpAddresses(log.message) }}
						</td>
					</tr>
				</template>
			</tbody>
		</table>

		<LogModal
			v-if="currentLog?.level"
			:id="currentLog?.level"
			:close="closeLog"
			:data="currentLog"
			:name="currentLog?.level"
			:open="true"
		/>
	</DashboardLayout>
</template>
