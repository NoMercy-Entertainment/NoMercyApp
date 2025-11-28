<script lang="ts" setup>
import type { PropType } from 'vue';
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

defineProps({
	id: {
		type: String,
		required: true,
	},
	items: {
		type: Array as PropType<Array<any> | undefined> | undefined,
		required: true,
	},
	multiple: {
		type: Boolean,
		required: false,
		default: false,
	},
	label: {
		type: String,
		required: true,
	},
	placeholder: {
		type: String,
		required: false,
	},
	disabled: {
		type: Boolean,
		required: false,
		default: false,
	},
	variant: {
		type: String as PropType<'tight' | 'dense' | 'normal'>,
		required: false,
		default: 'normal',
	},
});

defineEmits(['update:modelValue']);

const modelValue = defineModel<any>({
	required: true,
});
</script>

<template>
	<div class="pointer-events-auto relative w-auto group/selector">
		<Listbox
			:id="label"
			v-model="modelValue"
			:disabled="disabled"
			:multiple="multiple"
			:value="modelValue"
			as="div"
			class="flex flex-shrink-0 flex-grow-0 flex-col"
		>
			<ListboxLabel
				:class="{
					'mb-1 text-sm font-medium': variant === 'normal',
					'mb-0.5 text-sm font-medium': variant === 'dense',
					'mb-px text-xs font-thin': variant === 'tight',
				}"
				class="block select-none space-nowrap empty:hidden"
			>
				{{ $t(label) }}
			</ListboxLabel>
			<div
				:class="{
					'h-10 min-h-10 mt-2': variant === 'normal',
					'h-8 min-h-8 mt-1': variant === 'dense',
					'h-7 min-h-7 mt-0': variant === 'tight',
				}"
				class="flex flex-1 flex-shrink-0 flex-grow-0 flex-col"
			>
				<ListboxButton
					:class="{
						'!bg-surface-1 ring-[1.5px] ring-inset ring-surface-3 focus:outline-none focus:ring-2 focus:ring-focus/70 data-[headlessui-state=\'open\']:ring-2 data-[headlessui-state=\'open\']:ring-focus/70':
							variant === 'normal' || variant === 'dense',
						'h-10 min-h-10 px-3': variant === 'normal',
						'h-8 min-h-8 px-2': variant === 'dense',
						'h-5 min-h-5 px-0': variant === 'tight',
					}"
					class="relative flex items-center w-full cursor-default rounded-md text-surface-12 shadow-sm sm:text-sm data-[headlessui-state='disabled']:grayscale *:last:data-[headlessui-state='disabled']:hidden"
				>
					<span class="!flex truncate text-left leading-none w-full">
						{{
							modelValue && modelValue.length > 0
								? modelValue
									.map((s: any) => s?.title || s?.name || s?.label)
									.join(", ")
								: modelValue?.name
									|| modelValue?.title
									|| modelValue?.label
									|| t(placeholder as any)
						}}
					</span>
					<span
						:class="{
							'h-10 min-h-10 px-3': variant === 'normal',
							'h-8 min-h-8 px-2': variant === 'dense',
							'hidden': variant === 'tight',
						}"
						class="absolute inset-y-0 right-0 flex h-auto items-center rounded-r-md min-h-auto focus-visible:outline-transparent"
					>
						<MoooomIcon
							v-if="multiple"
							class-name="w-5 ui-open:rotate-180 transition-transform duration-200"
							icon="arrowSelect"
						/>
						<MoooomIcon
							v-else
							class-name="w-5 ui-open:rotate-180 transition-transform duration-200"
							icon="chevronDown"
						/>
					</span>
				</ListboxButton>

				<transition
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0"
				>
					<ListboxOptions
						:class="{
							'p-1.5': variant === 'normal',
							'p-1': variant === 'dense',
							'p-0.5': variant === 'tight',
						}"
						class="absolute top-full z-10 h-auto max-h-56 min-w-fit overflow-auto rounded-md text-base shadow-lg ring-1 ring-black ring-opacity-5 min-h-auto w-available bg-surface-1 focus:outline-none sm:text-sm"
					>
						<ListboxOption
							v-for="item in items"
							:key="item.title || item.name || item.label"
							v-slot="{ active, selected }"
							:value="item"
							as="template"
						>
							<li
								:class="{
									'!bg-focus/40': active,
									'h-8 min-h-8': variant === 'normal',
									'h-6 min-h-6': variant === 'dense',
								}"
								class="relative flex w-full min-w-fit cursor-default select-none items-center rounded-sm text-surface-12"
							>
								<span
									:class="{
										'font-semibold': selected,
										'font-normal': !selected,
									}"
									class="mx-3 block truncate text-left"
								>
									{{ $t(item.title || item.name || item.label) }}
								</span>
								<span
									v-if="selected"
									:class="{
										'text-surface-50': active,
										'text-focus': !active,
									}"
									class="absolute right-0 flex items-center justify-center pr-2 data-[headlessui-state='disabled']:hidden"
								>
									<MoooomIcon class-name="w-5" icon="check" />
								</span>
							</li>
						</ListboxOption>
					</ListboxOptions>
				</transition>
			</div>
		</Listbox>
	</div>
</template>
