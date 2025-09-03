<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';

import {
	Listbox,
	ListboxButton,
	ListboxLabel,
	ListboxOption,
	ListboxOptions,
} from '@headlessui/vue';

import { availableTranslations } from '@/config/i18next';
import type { Language } from '@/types/api/shared';
import OptimizedIcon from '@/components/OptimizedIcon.vue';

const props = defineProps({
	modelValue: {
		type: Object as PropType<Language | undefined>,
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
		<Listbox
			v-model="selected"
			as="div"
			:multiple="multiple"
			@change="$emit('update:modelValue', $event.target?.value)"
		>
			<ListboxLabel
				class="block select-none space-nowrap empty:hidden"
				:class="{
					'mb-1 text-sm font-medium': variant === 'normal',
					'mb-0.5 text-sm font-medium': variant === 'dense',
					'mb-px text-xs font-thin': variant === 'tight',
				}"
			>
				{{ $t(name) }}
			</ListboxLabel>
			<div
				class="relative"
				:class="{
					'h-10 min-h-10 mt-2': variant === 'normal',
					'h-8 min-h-8 mt-1': variant === 'dense',
					'h-7 min-h-7 mt-0': variant === 'tight',
				}"
			>
				<ListboxButton
					class="relative flex items-center w-full cursor-default rounded-md shadow-sm sm:text-sm data-[headlessui-state='disabled']:grayscale *:data-[headlessui-state='disabled']:hidden"
					:class="{
						'!bg-auto-1 ring-[1.5px] ring-inset ring-auto-3 focus:outline-none focus:ring-2 focus:ring-focus data-[headlessui-state=\'open\']:ring-2 data-[headlessui-state=\'open\']:ring-focus':
							variant === 'normal' || variant === 'dense',
						'h-10 min-h-10 pl-3': variant === 'normal',
						'h-8 min-h-8 pl-2': variant === 'dense',
						'h-5 min-h-5 pl-0': variant === 'tight',
					}"
				>
					<span
						v-if="!Array.isArray(selected)"
						class="flex items-center self-center"
					>
						<img
							:src="`https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/flags/${selected?.iso_639_1?.toUpperCase()}.svg`"
							:onerror="(event: any) => {
								event.target.onerror = null;
								event.target.src = 'https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/flags/xxx.svg';
							}"
							:alt="`${
								selected?.name !== '' && selected?.name !== null
									? selected?.name
									: selected?.english_name
							} flag`"
							class="h-auto w-6 rounded-sm border border-auto-50 group-hover:border-theme-600"
						>
						<span class="ml-3 block truncate text-left">
							{{
								(selected as Language)?.name !== ""
									&& (selected as Language)?.name !== null
									? (selected as Language)?.name
									: (selected as Language)?.english_name
							}}
						</span>
					</span>
					<span v-else class="flex items-center self-center">
						<span
							v-if="selected?.length > 4"
							class="ml-3 block truncate text-left"
						>
							{{ selected?.length }} {{ $t("selected") }}
						</span>
						<span v-else class="ml-3 block truncate text-left">
							{{
								selected
									.map((s) =>
										s?.name !== "" && s?.name !== null ? s?.name : s?.english_name,
									)
									?.join(", ")
							}}
						</span>
					</span>
					<span
						class="absolute inset-y-0 right-0 flex h-auto items-center rounded-r-md min-h-auto focus-visible:outline-transparent"
						:class="{
							'h-10 min-h-10 px-3': variant === 'normal',
							'h-8 min-h-8 px-2': variant === 'dense',
							'hidden': variant === 'tight',
						}"
					>
						<OptimizedIcon
							v-if="multiple"
							icon="arrowSelect"
							class-name="w-5 ui-open:rotate-180 transition-transform duration-200"
						/>
						<OptimizedIcon
							v-else
							icon="chevronDown"
							class-name="w-5 ui-open:rotate-180 transition-transform duration-200"
						/>
					</span>
				</ListboxButton>

				<transition
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0"
				>
					<ListboxOptions
						class="absolute z-10 h-auto max-h-56 min-w-fit overflow-auto rounded-md text-base shadow-lg ring-1 ring-black ring-opacity-5 min-h-auto w-available bg-auto-1 focus:outline-none sm:text-sm"
						:class="{
							'py-2 px-3': variant === 'normal',
							'py-1 px-2': variant === 'dense',
							'py-0.5 px-1.5': variant === 'tight',
						}"
					>
						<ListboxOption
							v-for="language in filteredOptions"
							:key="language.iso_639_1"
							v-slot="{ active, selected }"
							as="template"
							:value="language"
						>
							<li
								class="relative flex w-full min-w-fit cursor-default select-none items-center rounded-sm"
								:class="{
									'!bg-focus text-auto-12 ': active,
									'text-contrast': !active,
									'h-8 min-h-8': variant === 'normal',
									'h-6 min-h-6': variant === 'dense',
								}"
							>
								<div class="ml-2 flex items-center self-center">
									<img
										:src="`https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/flags/${language?.iso_639_1?.toUpperCase()}.svg`"
										:onerror="(event: any) => {
											event.target.onerror = null;
											event.target.src = 'https://pub-a68768bb5b1045f296df9ea56bd53a7f.r2.dev/flags/xxx.svg';
										}"
										:alt="`${
											language.name !== '' && language.name !== null
												? language.name
												: language.english_name
										} flag`"
										class="h-auto w-6 rounded-sm border border-auto-1 group-hover:border-theme-600"
									>
									<span
										class="mx-3 block truncate text-left"
										:class="{
											'font-semibold': selected,
											'font-normal': !selected,
										}"
									>
										{{
											language.name !== "" && language.name !== null
												? language.name
												: language.english_name
										}}
									</span>
								</div>

								<span
									v-if="selected"
									class="absolute right-0 flex items-center justify-center pr-4 data-[headlessui-state='disabled']:hidden"
									:class="{
										'text-auto-50': active,
										'text-focus': !active,
									}"
								>
									<OptimizedIcon
										icon="check"
										class="h-5 w-5"
										aria-hidden="true"
									/>
								</span>
							</li>
						</ListboxOption>
					</ListboxOptions>
				</transition>
			</div>
		</Listbox>
	</div>
</template>
