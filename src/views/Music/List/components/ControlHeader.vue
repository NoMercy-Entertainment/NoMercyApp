<script lang="ts" setup>
import {PropType} from 'vue';
import {isPlatform} from "@ionic/vue";

import type {DisplayList} from '@/types/api/music/musicPlayer';

import audioPlayer from '@/store/audioPlayer';

import BigPlayButton from '@/components/Buttons/BigPlayButton.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import MusicButton from '@/components/MusicPlayer/components/MusicButton.vue';
import MediaLikeButton from '@/components/Buttons/MediaLikeButton.vue';

const props = defineProps({
    data: {
        type: Object as PropType<DisplayList | undefined> | undefined,
        required: false,
    },
    filter: {
        type: String as PropType<string>,
        required: true,
    },
});

defineEmits(['filter-change']);

const handleMore = () => {
    audioPlayer.value?.setQueue(props.data?.tracks ?? []);
};
const handleAdd = () => {
    audioPlayer.value?.setQueue(props.data?.tracks ?? []);
};

const handleKeyup = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    const searchField = document.querySelector<HTMLButtonElement>('#search')!;

    if (document.activeElement == searchField && searchField.value.length > 0) {
        return;
    }

    if (e.key == 'ArrowUp') {

        // const el = ((target.parentElement as HTMLElement)?.parentElement as HTMLElement)
        //     ?.previousElementSibling as HTMLElement;
        //     console.log(el);
        // if (el && el.nodeName == 'BUTTON' || el.nodeName == 'A') {
        //     el.focus();
        // } else {
        //     document.querySelector<HTMLButtonElement>('#playList')?.focus();
        // }

    } else if (e.key == 'ArrowDown') {
        if (document.activeElement == searchField) {
            (((target.parentElement as HTMLElement)?.parentElement as HTMLElement)
                ?.nextElementSibling as HTMLElement)?.focus();
        } else {
            ((target.parentElement as HTMLElement)
                ?.nextElementSibling as HTMLElement)?.focus();
        }

    } else if (e.key == 'ArrowLeft') {
        const el = (target.previousElementSibling as HTMLElement);

        if (document.activeElement == document.querySelector<HTMLButtonElement>('#playList')) {
            // TODO: navigate to sidebar
        } else if (el && el?.nodeName == 'BUTTON' || el?.nodeName == 'A') {
            el.focus();
        } else if (document.activeElement == searchField) {
            document.querySelector<HTMLButtonElement>('#playList')?.focus();
        } else {
            searchField.focus();
        }
    } else if (e.key == 'ArrowRight') {
        const el = (target.nextElementSibling as HTMLElement);

        if (document.activeElement == document.querySelector<HTMLButtonElement>('#more')) {

        } else if (el && el?.nodeName == 'BUTTON' || el?.nodeName == 'A') {
            el.focus();
        } else if (document.activeElement == searchField) {
            document.querySelector<HTMLButtonElement>('#add')?.focus();
        } else {
            searchField.focus();
        }
    }
};

</script>

<template>
    <div class="pointer-events-none absolute z-0 h-96 w-full bg-spotifyBottom bg-focus"></div>
    <div class="flex gap-4 items-center py-4 px-4 sm:px-8 w-full !pl-7 !pr-6 !sm:pr-16 h-20 z-40"
         data-index="1">

        <BigPlayButton v-if="data?.tracks"
                       :data="data"
                       class="hidden sm:flex
                       shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-9)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-9)/70%)]
                       dark:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
                       hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-11)/60%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-11)/70%)]
                       dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/70%)]
                       active:!shadow-none
                       active:!dark:shadow-none
"
                       :onkeyup="handleKeyup"/>

        <div
            class="relative hidden h-fit cursor-pointer items-center justify-center text-auto-12/11 focus-within:text-auto sm:flex">
            <input id="search"
                   :onkeyup="handleKeyup"
                   :value="filter"
                   class="bg-transparent border-auto-12/5 border-2 rounded-md focus-visible:!border-auto-12/9 focus-visible:text-current placeholder-current p-2"
                   placeholder="Filter…"
                   type="text"
                   v-on:input="$emit('filter-change', ($event.target as HTMLInputElement)?.value)"
                   name="search">

            <div class="absolute top-2 right-2 bottom-2 flex items-center justify-center">
                <MoooomIcon icon="searchMagnifyingGlass" class="!w-7"/>
            </div>

        </div>
<!--      v-if="!routeIs('app.music.tracks')"-->
        <MusicButton
                     id="add"
                     :onclick="handleAdd"
                     :onkeyup="handleKeyup"
                     class="sm:ml-auto"
                     label="add">
            <MoooomIcon icon="add" class="!w-7"/>
        </MusicButton>
<!--      v-if="data && !routeIs('app.music.tracks')"-->
        <MediaLikeButton
                         :data="data"
                         :onkeyup="handleKeyup"
                         color="var(--color-focus)"
                         :type="'music/' + data.type"
                         className="!w-8 !h-8"/>
<!--        <ListControlHeaderMoreMenu v-if="!routeIs('app.music.tracks')" :items="[]"/>-->
    </div>

    <div
        class="sm:hidden sticky left-full -mt-16 top-safe-offset-10 z-1199 flex justify-center items-center gap-2 mr-4 h-auto"
         style="box-shadow: 0 1px 2px 0 rgba(16,24,40,0.05);"
    >

        <BigPlayButton v-if="data?.tracks"
                       :data="data"
                       :onkeyup="handleKeyup"/>
    </div>
</template>
