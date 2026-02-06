<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';

import type { LogType } from '@/types/server';

import { checkboxValue } from '@/lib/utils/validation';
import { groupBy } from '@/lib/utils/array';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	refetch: {
		type: Function as PropType<() => void>,
		required: true,
	},
	logTypes: {
		type: Array as PropType<LogType[]>,
		required: true,
	},
});

const checkboxState = ref<false | null | true>(false);

const selectedTypes = defineModel('selectedTypes', {
	type: Array as PropType<LogType[]>,
	required: false,
	default: () => [],
});

watch(checkboxState, (value) => {
	if (!props.logTypes)
		return;
	console.log('checkboxState', value);
});

watch(props, () => {
	if (!selectedTypes.value)
		return;

	checkboxState.value = checkboxValue(selectedTypes.value, props.logTypes);
	props.refetch();
});

onMounted(() => {
	if (!props.logTypes)
		return;
	// selectedTypes.value.value = props.logTypes;
});

function handleType(value: LogType) {
	if (
		selectedTypes.value.some(selectedType => selectedType.name === value.name)
	) {
		selectedTypes.value = selectedTypes.value.filter(
			selectedType => selectedType.name !== value.name,
		);
	}
	else {
		selectedTypes.value = [...selectedTypes.value, value];
	}
}

function toggleGroup(group: LogType) {
	if (!props.logTypes)
		return;

	const groupLogTypes = props.logTypes.filter(
		logType => logType.type === group.type,
	);

	if (
		groupLogTypes.every(logType =>
			selectedTypes.value.some(
				selectedType => selectedType.name === logType.name,
			),
		)
	) {
		// All log types of the group are already selected, so remove them
		selectedTypes.value = selectedTypes.value.filter(
			selectedType =>
				!groupLogTypes.some(logType => logType.name === selectedType.name),
		);
	}
	else {
		// Not all log types of the group are selected, so add them
		selectedTypes.value = [...selectedTypes.value, ...groupLogTypes];
	}
}
</script>

<template>
	<DropdownMenu
		class="relative flex items-center justify-center gap-2 rounded-lg transition-colors duration-200 hover:bg-surface-5/6"
	>
		<template #button>
			<MoooomIcon class-name="w-6" icon="chevronDown" />
		</template>

		<div class="flex flex-col gap-2 overflow-auto py-2 max-h-[60vh]">
			<div
				class="-mb-2 flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
			>
				<Checkbox v-model="checkboxState" label="All" />
				<p class="text-center text-xs font-semibold uppercase">
					{{ $t("All") }}
				</p>
			</div>

			<template
				v-for="group in groupBy<LogType>(logTypes?.filter((t: LogType) => t.type !== 'spacer') ?? [], 'type')"
				:key="group[0].type"
			>
				<div
					class="relative mt-2 -mb-1 flex items-center justify-start gap-2 self-stretch px-2.5"
					@click="() => toggleGroup(group[0])"
				>
					<Checkbox
						:color="
							checkboxValue(
								selectedTypes?.filter((t) => t.type === group[0].type),
								group,
							) === true
								? `${group[0]?.color}44`
								: ''
						"
						:model-value="
							checkboxValue(
								selectedTypes?.filter((t) => t.type === group[0].type),
								group,
							)
						"
					/>
					<p class="text-center text-xs font-semibold uppercase">
						{{ group[0].type }}
					</p>
					<div class="flex-grow h-px bg-[#e2f0fd]/[0.08]" />
				</div>

				<template v-for="logType in group" :key="logType.name">
					<button
						:onclick="() => handleType(logType)"
						class="flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
					>
						<Checkbox
							:color="
								selectedTypes?.some((st) => st.name === logType.name)
									? `${logType.color}44`
									: ''
							"
							:model-value="selectedTypes?.some((st) => st.name === logType.name)"
						/>
						<span
							:style="`background: ${logType.color}44`"
							class="flex-grow text-sm font-medium text-[#eeecec] rounded-full px-2 w-32 h-5 leading-5 text-center"
						>
							{{ logType.display_name }}
						</span>
					</button>
				</template>
			</template>
		</div>
	</DropdownMenu>
</template>
