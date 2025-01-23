<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { IonPage, IonContent, IonSkeletonText, onIonViewWillEnter, onIonViewWillLeave } from '@ionic/vue';
import { useRoute } from "vue-router";
import { Swiper as SwiperComponent } from 'swiper/vue';

import type { PersonResponseItem } from "@/types/api/base/person";

import { tmdbImageBaseUrl } from "@/config/config";
import i18next from "@/config/i18next";
import { background, setBackground, setColorPalette } from '@/store/ui';

import useServerClient from "@/lib/clients/useServerClient";
import { breakTitle2, setTitle, unique } from "@/lib/stringArray";

import CreditGroup from "@/components/MusicPlayer/components/CreditGroup.vue";
import MediaCarousel from "@/components/Carousel/MediaCarousel.vue";
import TMDBImage from "@/components/Images/TMDBImage.vue";
import { isNative } from "@/config/global";
import SocialLinkItems from "@/views/Base/Person/components/SocialLinkItems.vue";
import HeaderItem from "@/views/Base/Person/components/HeaderItem.vue";
import Collapsible from "@/views/Base/Person/components/Collapsible.vue";

const route = useRoute();
const { data, isError } = useServerClient<PersonResponseItem>({
  queryKey: ['base', 'person', route.params.id],
});

const backgroundUrl = computed(() => {
  return `${tmdbImageBaseUrl}/original${background.value}`;
  // return `${currentServer.value?.serverBaseUrl}/images/original${background.value}`;
});

const age = computed(() => {
  if (data.value?.deathday) {
    const birthDate = new Date(data.value?.birthday);
    const deathDay = new Date(data.value?.deathday);
    const a = deathDay.getFullYear() - birthDate.getFullYear();
    const m = deathDay.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && deathDay.getDate() < birthDate.getDate())) {
      return a - 1;
    }
    return a;
  }
  if (data.value?.birthday) {
    const birthDate = new Date(data.value?.birthday);
    const currentDate = new Date();
    const a = currentDate.getFullYear() - birthDate.getFullYear();
    const m = currentDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < birthDate.getDate())) {
      return a - 1;
    }
    return a;
  }
  return null;
});

const gender = computed(() => {
  if (typeof data.value?.gender !== 'number') return data.value?.gender;

  switch (data.value?.gender) {
    case 0:
      return 'Not specified';
    case 1:
      return 'Female';
    case 2:
      return 'Male';
    case 3:
      return 'Non-binary';
    default:
      return null;
  }
});

watch(data, (value) => {
  setTitle(data?.value?.name);
  setBackground(value?.known_for?.at(0)?.backdrop ?? null);
  setColorPalette(value?.color_palette?.profile);
});

onIonViewWillEnter(() => {
  setTitle(data?.value?.name);
  setBackground(data?.value?.known_for?.at(0)?.backdrop ?? null);
  setColorPalette(data?.value?.color_palette?.profile);
});

onIonViewWillLeave(() => {
  setBackground(null);
  setColorPalette(null);
});

const filter = 'combined';

const currentImage = ref(data.value?.images?.profiles?.[0]);

watch(data, (value) => {
  currentImage.value = value?.images?.profiles?.[0];
});

</script>

<template>
  <ion-page>
    <ion-content ref="content" :fullscreen="true"
      :style="`--background-image: ${backgroundUrl && !backgroundUrl.includes('null') ? `url(${backgroundUrl})` : ''};`">

      <SwiperComponent ref="swiper" :slides-per-view="1" :loop="true" class="w-available swiper h-[420px] !absolute"
        :class="{
          'top-safe-offset-12': isNative,
          'top-12': !isNative,
        }">
        <template v-for="(item, index) in data?.images?.profiles ?? []" :key="item.id">
          <swiper-slide class="h-full" :data-index="index" :data-id="item.src">
            <div class="frosting w-[280px] h-[420px] z-10 absolute left-1/2 -translate-x-1/2 overflow-clip rounded-2xl">

              <TMDBImage v-if="item" :key="item.src ?? 'poster'" :autoShadow="true" :path="item.src" :size="760"
                priority="high" :title="data?.name" aspect="poster" loading="eager"
                className="pointer-events-none absolute -inset-1 z-20 flex h-auto scale-100 select-none items-center overflow-hidden w-available h-available max-h-available"
                class="m-auto children:w-full scale-100 max-h-available 5xl:w-inherit" type="image" />

            </div>
          </swiper-slide>
        </template>
      </SwiperComponent>

      <div
        class="flex z-0 flex-col justify-start items-center self-stretch flex-grow overflow-hidden gap-4 will-change-auto text-slate-lightA-12/70 dark:text-slate-darkA-12/80"
        style="box-shadow: 0 2px 2px 0 rgba(0,0,0,0.16);">
        <div class="flex justify-start items-end -mx-4 w-available h-[410px] relative gap-2">
          <div
            class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover bg-top"
            style="background: linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), var(--background-image) lightgray 50% / cover no-repeat;">
          </div>
          <div
            class="absolute flex flex-col justify-start items-end flex-grow w-available -mx-20 h-[410px] bg-cover dark:bg-black/50">
          </div>
        </div>

        <div
          class="flex bg-slate-light-3 dark:bg-slate-dark-1 flex-col justify-start items-start self-stretch gap-3 pt-16 pb-5 will-change-auto w-inherit px-6">
          <p v-if="data?.name" class="self-stretch w-[351px] text-3xl font-bold text-left z-10"
            v-html="breakTitle2(data?.name ?? ' ', 'text-lg line-clamp-2')">
          </p>
          <ion-skeleton-text v-else :animated="true" class="h-7 will-change-auto"></ion-skeleton-text>

          <Collapsible v-if="data?.biography" :text="data?.biography" :maxLines="3" />

          <div class="flex flex-col gap-3 items-start flex-nowrap w-full">

            <div class="flex justify-between items-start flex-nowrap w-full">

              <HeaderItem v-if="data?.known_for_department" title="Known for" :data="data?.known_for_department" />

              <HeaderItem v-if="data?.combined_credits?.cast" title="Credits"
                :data="data?.combined_credits?.cast.length.toString()" />


              <HeaderItem v-if="age" title="Birthday">
                <template v-slot:head>
                  <span v-if="data?.deathday"
                    class="ml-auto flex gap-1 text-xs font-bold uppercase text-auto-alpha-10 whitespace-nowrap">
                    <span v-if="data.deathday" class="-mr-1 text-base -mt-[3px]">&#8224;</span>
                    {{
                      new Date(data?.deathday!).toLocaleDateString(i18next.language ?? 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: '2-digit',
                      })
                    }}
                  </span>
                </template>

                <p v-if="age" class="text-left text-base font-medium text-contrast self-center whitespace-nowrap">{{
                  new Date(data?.birthday!).toLocaleDateString(i18next.language ?? 'en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })
                }} ({{ age }} {{ $t('years old') }})
                </p>

              </HeaderItem>
            </div>

            <div class="flex gap-3 items-start justify-between flex-nowrap w-full">

              <HeaderItem v-if="gender" title="Gender" :data="gender" />

              <HeaderItem v-if="data?.place_of_birth" title="Place of birth" :data="data?.place_of_birth" />

            </div>

          </div>

          <div class="self-stretch h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]"></div>

          <SocialLinkItems v-if="data" :data="data" />

          <div class="mb-8 -ml-1 w-[101.5%]">
            <div class="ml-2 w-[100.6%]">
              <MediaCarousel v-if="data?.known_for && data?.known_for?.length > 0" :color-palette="data?.color_palette"
                :data="unique(data.known_for, 'id')" class="-mx-6" title="Known for" type="poster" />
            </div>
          </div>

          <div class="self-stretch h-px bg-slate-dark-7/[0.1] dark:bg-slate-dark-11/[0.1]"></div>

          <CreditGroup :items="data?.[`${filter}_credits`]?.cast" title="Acting" />
          <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Produc'))"
            title="Production" />
          <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Writ'))"
            title="Writing" />
          <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Direct'))"
            title="Directing" />
          <CreditGroup
            :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => !c.job.includes('Produc') && !c.job.includes('Writ') && !c.job.includes('Direct') && !c.job.includes('Creator'))"
            title="Crew" />
          <CreditGroup :items="data?.[`${filter}_credits`]?.crew.filter((c: any) => c.job.includes('Creator'))"
            title="Creator" />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
:root {
  --background-image: none;
}
</style>