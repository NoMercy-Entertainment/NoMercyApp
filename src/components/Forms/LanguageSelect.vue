<script lang="ts" setup>
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';

import { availableTranslations } from '@/config/i18next';
import type { Language } from '@/types/api/shared';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
	modelValue: {
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	multiple: {
		type: Boolean,
		required: false,
		default: false,
	},
	variant: {
		type: String as PropType<'tight' | 'dense' | 'normal'>,
		required: false,
		default: 'normal',
	},
	languages: {
		type: Array as PropType<Language[]>,
		required: false,
	},
});

const emit = defineEmits(['update:modelValue']);

const selected = ref<Language[] | Language>(props.modelValue!);
const query = ref('');
const filteredOptions = ref<Language[]>([]);

const items = ref<Language[]>(props.languages ?? []);

watch(props, (value) => {
	if (!value.languages)
		return;
	items.value = value.languages;
});

watch(selected, (value) => {
	if (!value)
		return;
	emit('update:modelValue', value);
});

watch(items, (value) => {
	if (!value)
		return;

	if (props.multiple) {
		filteredOptions.value = value;
	}
	else {
		filteredOptions.value
			= query.value === ''
				? value.filter(l => availableTranslations.includes(l.iso_639_1)) ?? []
				: value
					.filter(l => availableTranslations.includes(l.iso_639_1))
					?.filter((language) => {
						return language.english_name
							.toLowerCase()
							.includes(query.value.toLowerCase());
					}) ?? [];
	}
});

onMounted(() => {
	if (!items.value)
		return;

	if (props.multiple) {
		filteredOptions.value = items.value;
	}
	else {
		filteredOptions.value
			= query.value === ''
				? items.value.filter(l =>
					availableTranslations.includes(l.iso_639_1),
				) ?? []
				: items.value
					.filter(l => availableTranslations.includes(l.iso_639_1))
					?.filter((language) => {
						return language.english_name
							.toLowerCase()
							.includes(query.value.toLowerCase());
					}) ?? [];
	}
});
</script>

<template>
	<div class="relative w-full">
		<div class="flex flex-col gap-2">
			<label for="languages">{{ $t(name) }}</label>

			<MultiSelect v-if="multiple"
				id="languages"
				v-model="selected"
				:options="items.toSorted((a, b) => a.english_name.localeCompare(b.english_name))"
				class="w-full"
				display="chip"
				filter
				option-label="english_name"
				placeholder="Select Languages"
				@change="$emit('update:modelValue', $event.target?.value)"
			>
				<template #option="slotProps">
					<div class="flex items-center gap-2">
						<img
							:alt="slotProps.option.english_name"
							:onerror="(event: any) => {
								event.target.onerror = null;
								event.target.src = 'https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/flags/xxx.svg';
							}"
							:src="`https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/flags/${slotProps.option?.iso_639_1?.toUpperCase()}.svg`"
							style="width: 18px"
						>
						<div>{{ slotProps.option.english_name }}</div>
					</div>
				</template>
				<template #dropdownicon>
					<MoooomIcon class-name="w-5 h-5 ui-open:rotate-180 transition-transform duration-200" icon="chevronDown" />
				</template>
				<template #filtericon>
					<MoooomIcon class-name="w-5 h-5" icon="globe" />
				</template>
			</MultiSelect>
			<Select v-else
				id="languages"
				v-model="selected"
				:options="filteredOptions.toSorted((a, b) => a.english_name.localeCompare(b.english_name))"
				class="w-full"
				filter
				option-label="english_name"
				placeholder="Select Language"
				@change="$emit('update:modelValue', $event.target?.value)"
			/>
		</div>
	</div>
</template>
