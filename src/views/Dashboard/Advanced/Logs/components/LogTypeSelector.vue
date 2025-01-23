<script lang="ts" setup>
import { onMounted, PropType, ref, watch } from "vue";

import type { LogType } from "@/types/server";

import { checkboxValue, groupBy } from "@/lib/stringArray";

import DropdownMenu from "@/Layout/Desktop/components/Menus/DropdownMenu.vue";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

const checkboxState = ref<false | null | true>(false);

const emit = defineEmits(['update:selectedTypes']);

const props = defineProps({
  refetch: {
    type: Function as PropType<() => void>,
    required: true,
  },
  logTypes: {
    type: Array as PropType<LogType[]>,
    required: true,
  },
  selectedTypes: {
    type: Array as PropType<LogType[]>,
    required: false,
    default: () => []
  },
});

watch(checkboxState, value => {
  if (!props.logTypes) return;

  if (value == null) {
    //
  } else if (value) {
    emit('update:selectedTypes', props.logTypes);
  } else {
    emit('update:selectedTypes', []);
  }

});

watch(props, value => {
  if (!value.selectedTypes) return;

  checkboxState.value = checkboxValue(value.selectedTypes, props.logTypes);

  emit('update:selectedTypes', value.selectedTypes);
  props.refetch();
});

onMounted(() => {
  if (!props.logTypes) return;
  // selectedTypes.value = props.logTypes;
});

const handleType = (value: LogType) => {
  if (props.selectedTypes.some(selectedType => selectedType.name == value.name)) {
    emit('update:selectedTypes', props.selectedTypes.filter(selectedType => selectedType.name != value.name));
  } else {
    emit('update:selectedTypes', [
      ...props.selectedTypes,
      value,
    ]);
  }
}

const toggleGroup = (group: LogType) => {
  if (!props.logTypes) return;

  const groupLogTypes = props.logTypes.filter(logType => logType.type === group.type);

  if (groupLogTypes.every(logType => props.selectedTypes.some(selectedType => selectedType.name === logType.name))) {
    // All log types of the group are already selected, so remove them
    emit('update:selectedTypes', props.selectedTypes.filter(selectedType => !groupLogTypes.some(logType => logType.name === selectedType.name)));
  } else {
    // Not all log types of the group are selected, so add them
    emit('update:selectedTypes', [...props.selectedTypes, ...groupLogTypes]);
  }
}

</script>
<template>
  <DropdownMenu
    class="relative flex items-center justify-center gap-2 rounded-lg transition-colors duration-300 hover:bg-auto-5/6"
    translate="-translate-x-1/2">

    <template v-slot:button>
      <MoooomIcon className="w-6" icon="chevronDown" />
    </template>

    <div class="flex flex-col gap-2 overflow-auto py-2 max-h-[60vh]">
      <div class="-mb-2 flex flex-grow items-center justify-start gap-3 rounded-md px-2.5">
        <Checkbox v-model="checkboxState" label="All" />
      </div>

      <template v-for="group in groupBy<LogType>(logTypes?.filter(t => t.type != 'spacer') ?? [], 'type')">

        <div class="relative mt-2 -mb-1 flex items-center justify-start gap-2 self-stretch px-2.5"
          @click="() => toggleGroup(group[0])">
          <Checkbox :modelValue="checkboxValue(selectedTypes?.filter(t => t.type == group[0].type), group)"
            :color="checkboxValue(selectedTypes?.filter(t => t.type == group[0].type), group) == true ? group[0]?.color + '44' : ''">
            <p class="text-center text-xs font-semibold uppercase">
              {{ group[0].type }}
            </p>
          </Checkbox>
          <div class="flex-grow h-px bg-[#e2f0fd]/[0.08]"></div>
        </div>

        <template v-for="logType in group">
          <button class="flex flex-grow items-center justify-start gap-3 rounded-md px-2.5"
            :onclick="() => handleType(logType)">
            <Checkbox :modelValue="selectedTypes?.some(st => st.name == logType.name)"
              :color="selectedTypes?.some(st => st.name == logType.name) ? logType.color + '44' : ''">
              <span :style="`background: ${logType.color}44`"
                class="flex-grow text-sm font-medium text-[#eeecec] rounded-full px-2 w-32 h-5 leading-5 text-center">
                {{ logType.display_name }}
              </span>
            </Checkbox>
          </button>
        </template>

      </template>
    </div>
  </DropdownMenu>
</template>
