<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { IonPage, IonContent, onIonViewDidEnter } from '@ionic/vue';

import type { HomeDataItem } from '@/types/api/music';
import type { Component } from "@/lib/routerHelper";

import useServerClient from '@/lib/clients/useServerClient';

import MusicHeader from "./components/MusicHeader.vue";
import TvCarousel2 from "./components/TvCarousel2.vue";

const { data } = useServerClient<Component<Component<HomeDataItem>>[]>({
  queryKey: ['music', 'home']
});

const selected = ref<HomeDataItem | null | undefined>();

const scrollContainer = ref<HTMLDivElement>();
const locked = ref(false);
const timeout = ref<NodeJS.Timeout>();
const lastFocused = ref<HTMLAnchorElement>();

watch(data, (value) => {
  if (!value) return;

  const carousels = value.filter((item) => item.component == 'NMCarousel');
  if (!carousels) return;
  selected.value = carousels.find((item) => item.props.items.length > 0)?.props?.items?.[0]?.props?.data;
});

onIonViewDidEnter(() => {
  const carousels = data.value?.filter((item) => item.component == 'NMCarousel');
  if (!carousels) return;
  selected.value = carousels.find((item) => item.props.items.length > 0)?.props?.items?.[0]?.props?.data;

  setTimeout(() => {
    const target = document.querySelector(`[data-card="${selected.value?.id}"]`) as HTMLAnchorElement;
    if (target) {
      target.focus();
    }
  }, 100);
});

watch(selected, (value) => {
  setTimeout(() => {
    const target = document.querySelector(`[data-card="${value?.id}"]`) as HTMLAnchorElement;
    if (target) {
      target.focus();
    }
  }, 100);
});

const handleFocus = (event: FocusEvent, item?: HomeDataItem) => {
  const target = event.target as HTMLAnchorElement;

  if (target?.nodeName == 'DIV') {
    (lastFocused.value ?? target.querySelector('a'))?.focus();
    return;
  }

  if (item) {
    selected.value = item;
    lastFocused.value = target;
  }
};

const handleDown = (event: KeyboardEvent) => {
  if (locked.value) {
    event.preventDefault();
    return;
  }

  clearTimeout(timeout.value);
  locked.value = true;

  const target = event.target as HTMLDivElement;
  const targetIndex = target.getAttribute('data-index');
  const closest = target.closest('[data-row]');

  const up = closest?.previousElementSibling as HTMLDivElement;
  const upButton = up?.querySelector(`a[data-index="${targetIndex}"]`) as HTMLAnchorElement;

  const down = closest?.nextElementSibling as HTMLDivElement;
  const downButton = down?.querySelector(`a[data-index="${targetIndex}"]`) as HTMLAnchorElement;

  const leftButton = target.previousElementSibling as HTMLDivElement;
  const rightButton = target.nextElementSibling as HTMLDivElement;

  if (upButton && event.key == 'ArrowUp') {
    event.preventDefault();
    upButton.focus();
  } else if (downButton && event.key == 'ArrowDown') {
    event.preventDefault();
    downButton.focus();
  } else if (leftButton && event.key == 'ArrowLeft') {
    event.preventDefault();
    leftButton.focus();
  } else if (rightButton && event.key == 'ArrowRight') {
    event.preventDefault();
    rightButton.focus();
  } else if (up && event.key == 'ArrowUp') {
    const upButton = Array.from(up?.querySelectorAll<HTMLAnchorElement>('a'))?.at(-1);
    if (upButton) {
      upButton.focus();
    }
  } else if (down && event.key == 'ArrowDown') {
    const downButton = Array.from(down?.querySelectorAll<HTMLAnchorElement>('a'))?.at(-1);
    if (downButton) {
      downButton.focus();
    }
  }
};

const handleUp = (event: KeyboardEvent) => {
  timeout.value = setTimeout(() => {
    locked.value = false;
  }, 150);
};

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class=" w-screen h-screen relative overflow-hidden bg-[#131314]">

        <MusicHeader v-if="selected" :selected="selected" />

        <div ref="scrollContainer" tabindex="0" @focus="handleFocus($event)"
          class="flex flex-col justify-start items-start w-available -mx-3 px-3 absolute left-14 right-14 top-[320px] h-available overflow-auto scroll-smooth gap-4 flex-1 pb-8">

          <template v-if="data">

            <TvCarousel2 v-for="(render, index) in data?.filter?.((item) => item.component == 'NMCarousel') ?? []"
              :key="render.id" :title="render.props.title" :data="render.props.items ?? []" :handleFocus="handleFocus"
              :handleDown="handleDown" :handleUp="handleUp" />

            <!--            <component-->
            <!--                v-for="(render, index) in data?.filter((item) => item.component == 'NMCarousel') ?? []"-->
            <!--                :index="index"-->
            <!--                :key="render.id"-->
            <!--                :is="render.component"-->
            <!--                v-bind="render.props"-->
            <!--                :handleFocus="handleFocus"-->
            <!--                :handleDown="handleDown"-->
            <!--                :handleUp="handleUp"-->
            <!--            />-->
          </template>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
