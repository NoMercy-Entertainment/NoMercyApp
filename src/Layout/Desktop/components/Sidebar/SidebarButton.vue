<script setup lang="ts">
import { computed, onMounted, type PropType, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useTranslation } from 'i18next-vue';

import router from '@/router';
import { sidebar } from '@/store/sidebar';

import type { MoooomIcons } from '@Icons/icons';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  show: {
    type: Boolean,
    required: false,
    default: true,
  },
  icon: {
    type: String as PropType<keyof typeof MoooomIcons>,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  cover: {
    required: false,
  },
});

const { t } = useTranslation();

const isCurrentRoute = ref(location.hash.replace('#', '') == props.href);

router.afterEach((to) => {
  setTimeout(() => isCurrentRoute.value = to.fullPath == props.href, 50);
});

onMounted(() => {
  setTimeout(() => isCurrentRoute.value = location.hash.replace('#', '') == props.href, 50);
});

const classes = computed(() =>
(isCurrentRoute.value
  ? 'current-route bg-focus/12 border-focus/4 text-auto-12'
  : ''));

const styles = computed(() =>
(isCurrentRoute.value
  ? {
    background: 'radial-gradient(50% 50% at 50% 100%, rgba(70, 70, 70, 0.09) 0%, rgba(70, 70, 70, 0.06) 40%, rgba(70, 70, 70, 0.00) 100%), linear-gradient(180deg, rgba(70, 70, 70, 0.00) 0%, rgba(70, 70, 70, 0.12) 100%), rgba(var(--color-focus) / 30%)',
    backgroundBlendMode: 'normal, overlay, normal',
  }
  : {}));

</script>

<template>
  <RouterLink :to="href"
    class="flex justify-start items-center self-stretch h-11 relative gap-2 px-2.5 py-2 rounded-md border border-transparent hover:border-focus/4 active:!bg-focus/11 dark:active:!bg-focus/8 active:border-focus/4 active:hover:border-focus/4 focus:bg-focus-9 hover:!bg-focus/10 disabled:!bg-focus/2 disabled:!border-focus/2 transition-colors duration-300 hover:text-auto-12"
    :title="t(name)" :style="styles" :class="classes" v-if="show">
    <MoooomIcon v-if="!!icon" :icon="icon!" class="" />
    <!--        <CoverImage v-else-if="!!cover" :data="{cover} as Song" class="top-0 z-10 -mr-1 -ml-1 aspect-square h-8 w-8 overflow-clip object-cover min-w-8" />-->

    <img v-else-if="image" :src="image" alt=""
      class="top-0 z-10 -mr-1 -ml-1 aspect-square h-8 w-8 overflow-clip object-cover min-w-8" crossorigin="anonymous" />

    <span
      class="flex h-8 flex-shrink-0 flex-grow-0 items-center overflow-clip font-semibold transition-opacity sidebar-open:delay-300 w-[168px]"
      :class="`${sidebar == 'open' ? 'opacity-100' : 'sm:opacity-0'}`">
      <span class="ml-2 flex-grow overflow-clip font-medium w-inherit line-clamp-1 text-left">
        {{ t(name) }}
      </span>
    </span>
  </RouterLink>
</template>
