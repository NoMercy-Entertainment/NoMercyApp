<script setup lang='ts'>
import {type PropType} from 'vue';
import {useTranslation} from 'i18next-vue';
import {Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions} from '@headlessui/vue';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const {t} = useTranslation();

const modelValue = defineModel<any>({
  required: true,
});

defineProps({
  id: {
    type: String,
    required: true,
  },
  items: {
    type: Array as PropType<Array<any> | undefined> | undefined,
    required: true,
    default: [],
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

</script>

<template>
  <div class="pointer-events-auto relative w-auto group/selector">
    <Listbox as="div" :id="label" v-model="modelValue" :value="modelValue" :multiple="multiple" :disabled="disabled"
             class="flex flex-shrink-0 flex-grow-0 flex-col"
    >
      <ListboxLabel
          class='block select-none text-contrast space-nowrap empty:hidden'
          :class="{
            'mb-1 text-sm font-medium': variant === 'normal',
            'mb-0.5 text-sm font-medium': variant === 'dense',
            'mb-px text-xs font-thin': variant === 'tight',
          }"
      >
        {{ t(label) }}
      </ListboxLabel>
      <div
          class="flex flex-1 flex-shrink-0 flex-grow-0 flex-col"
          :class="{
            'h-10 min-h-10 mt-2': variant === 'normal',
            'h-8 min-h-8 mt-1': variant === 'dense',
            'h-7 min-h-7 mt-0': variant === 'tight',
          }"
      >
        <ListboxButton
            class="relative flex items-center w-full cursor-default rounded-md  text-slate-lightA-12/70  dark:text-slate-darkA-12/80 shadow-sm sm:text-sm data-[headlessui-state='disabled']:grayscale *:last:data-[headlessui-state='disabled']:hidden"
            :class="{
              '!bg-auto-1 ring-[1.5px] ring-inset ring-auto-3 focus:outline-none focus:ring-2 focus:ring-focus data-[headlessui-state=\'open\']:ring-2 data-[headlessui-state=\'open\']:ring-focus': variant === 'normal' || variant === 'dense',
              'h-10 min-h-10 px-3': variant === 'normal',
              'h-8 min-h-8 px-2': variant === 'dense',
              'h-5 min-h-5 px-0': variant === 'tight',
            }"
        >
					<span class="!flex truncate text-left leading-none w-full">
					{{
              modelValue && modelValue.length > 0
                  ? modelValue.map((s: any) => s?.title || s?.name || s?.label).join(', ')
                  : modelValue?.name || modelValue?.title || modelValue?.label || t(placeholder as any)
            }}
					</span>
          <span
              class="absolute inset-y-0 right-0 flex h-auto items-center rounded-r-md min-h-auto focus-visible:outline-transparent"
              :class="{
                'h-10 min-h-10 px-3': variant === 'normal',
                'h-8 min-h-8 px-2': variant === 'dense',
                'hidden': variant === 'tight',
              }"
          >
							<MoooomIcon v-if="multiple" icon="arrowSelect"
                          className="w-5 ui-open:rotate-180 transition-transform duration-300"/>
							<MoooomIcon v-else icon="chevronDown"
                          className="w-5 ui-open:rotate-180 transition-transform duration-300"/>
					</span>
        </ListboxButton>

        <transition leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
          <ListboxOptions
              class="absolute top-full z-10 h-auto max-h-56 min-w-fit overflow-auto rounded-md text-base shadow-lg ring-1 ring-black ring-opacity-5 min-h-auto w-available bg-auto-1 focus:outline-none sm:text-sm"
              :class="{
                'p-1.5': variant === 'normal',
                'p-1': variant === 'dense',
                'p-0.5': variant === 'tight',
              }"
          >
            <ListboxOption v-slot="{ active, selected }"
                           v-for="item in items"
                           :key="item.title || item.name || item.label"
                           :value="item"
                           as="template">
              <li class="relative flex w-full min-w-fit cursor-default select-none items-center rounded-sm"
                  :class="{
                  '!bg-focus  text-slate-lightA-5/70  dark:text-slate-darkA-5/80 ': active,
                  ' text-slate-lightA-12/70  dark:text-slate-darkA-12/80' : !active,
                  'h-8 min-h-8': variant === 'normal',
                  'h-6 min-h-6': variant === 'dense',
							}">
									<span
                      class="mx-3 block truncate text-left"
                      :class="{
													'font-semibold': selected,
													'font-normal': !selected,
                      }"
                  >
										{{ $t(item.title || item.name || item.label) }}
									</span>
                <span v-if="selected"
                      class="absolute right-0 flex items-center justify-center pr-4 data-[headlessui-state='disabled']:hidden"
                      :class="{
                        'text-auto-50':active,
                        'text-focus': !active,
                      }"
                >
										<MoooomIcon icon="check" className="w-5"/>
								</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
