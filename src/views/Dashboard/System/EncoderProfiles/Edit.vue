<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';

import type {EncoderProfile} from '@/types/api/base/library';
import type {
  AvailableAudioCodec,
  AvailableSubtitleCodec,
  AvailableVideoCodec,
  Container,
  LabelValue
} from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';

import DeleteEncoderProfileModal from './components/DeleteEncoderProfileModal.vue';
import DashboardLayout from '@/Layout/Desktop/DashboardLayout.vue';
import {Nullable} from 'vitest';

const route = useRoute();

const {data: encoderProfiles, error, refetch} = useServerClient<EncoderProfile[]>({
  path: 'dashboard/encoderProfiles',
  queryKey: ['dashboard', 'encoderProfiles'],
});

const {data: videoContainers} = useServerClient<Container[]>({
  path: 'dashboard/encoderProfiles/containers',
  queryKey: ['dashboard', 'videoContainers'],
});

const settings = ref<EncoderProfile>();
watch(encoderProfiles, (value) => {
  if (!value) return;
  settings.value = value.find(l => l.id == route.params.id);
});

onMounted(() => {
  if (!encoderProfiles.value) return;
  settings.value = encoderProfiles.value.find(l => l.id == route.params.id);
});

const deleteConfirmOpen = ref(false);
const openDeleteConfirm = () => {
  deleteConfirmOpen.value = true;
};
const closeDeleteConfirm = () => {
  deleteConfirmOpen.value = false;
};

const handleCancel = () => {
  window.history.back();
};

const handleSave = () => {
};

const submitHandler = (e: any) => {
  console.log(e);
};

const classes = {
  outer: ' ',
  inner: 'focus-within:!shadow-none',
  input: 'relative w-full h-10 !text-auto-12 cursor-default rounded-md !bg-transparent py-1.5 pl-3 pr-10 text-contrast shadow-sm ring-[1.5px] ring-inset ring-auto-3 focus:outline-none focus:ring-2 focus:ring-focus data-[formkit-state=\'open\']:ring-2 data-[formkit-state=\'open\']:ring-focus sm:text-sm sm:leading-6 data-[formkit-state=\'disabled\']:grayscale *:data-[formkit-state=\'disabled\']:hidden border-none outline-none',
  option: 'bg-auto-1 !text-auto-12 hover:!bg-theme-7 py-2',
  help: '!text-auto-alpha-11',
};

// const schema = computed(() => {
//   return [
//     {
//       $formkit: 'text',
//       name: 'name',
//       label: 'Name',
//       classes: classes,
//       value: settings.value?.name,
//     },
//     {
//       $formkit: 'select',
//       name: 'media_type',
//       label: 'Media type',
//       classes: classes,
//       value: mediaType.value,
//       options: [
//         'audio', 'video', 'image'
//       ],
//     },
//     {
//       $formkit: 'select',
//       name: 'container',
//       label: 'Video container',
//       classes: classes,
//       value: videoContainers.value?.find(encoderContainer =>
//           encoderContainer.type === mediaType.value),
//       options: videoContainers.value?.filter(encoderContainer =>
//           encoderContainer.type === formContext.value?.value.media_type) ?? [],
//     },
//     {
//       $formkit: 'select',
//       name: 'video_codec',
//       label: 'Video codec',
//       classes: classes,
//       value: schema.value?.find(schema => schema.name === 'container')?.value?.available_video_codecs?.at(0),
//       options: schema.value?.find(schema => schema.name === 'container')?.value?.available_video_codecs ?? [],
//     },
//     {
//       $formkit: 'select',
//       name: 'audio_codec',
//       label: 'Audio codec',
//       classes: classes,
//       value: schema.value?.find(schema => schema.name === 'container')?.value?.available_audio_codecs?.at(0),
//       options: schema.value?.find(schema => schema.name === 'container')?.value?.available_audio_codecs ?? [],
//     },
//     {
//       $formkit: 'select',
//       name: 'subtitle_codec',
//       label: 'Subtitle codec',
//       classes: classes,
//       value: schema.value?.find(schema => schema.name === 'container')?.value?.available_subtitle_codecs?.at(0),
//       options: schema.value?.find(schema => schema.name === 'container')?.value?.available_subtitle_codecs ?? [],
//     },
//   ];
// });

const mediaTypes = ref([
  {label: 'audio', value: 'audio'},
  {label: 'video', value: 'video'},
  {label: 'image', value: 'image'},
]);
const name = ref(settings.value?.name);
const mediaType = ref<{ label: string, value: string }>();
const container = ref<Container>();

const videoCodecs = ref<AvailableVideoCodec[][]>([[]]);
const resolutions = ref<LabelValue[][]>([[]]);
const colorSpaces = ref<LabelValue[][]>([[]]);
const crfs = ref<Nullable<number>[][]>([[]]);
const widths = ref<Nullable<number>[][]>([[]]);
const tunes = ref<LabelValue[][]>([[]]);
const profiles = ref<LabelValue[][]>([[]]);
const playlistNames = ref<Nullable<string>[][]>([[]]);
const segmentNames = ref<Nullable<string>[][]>([[]]);
const bitrates = ref<Nullable<number>[][]>([[]]);

const audioCodecs = ref<AvailableAudioCodec[][]>([[]]);
const allowedAudioLanguages = ref<LabelValue[][]>([[]]);

const subtitleCodecs = ref<AvailableSubtitleCodec[][]>([[]]);
const allowedSubtitleLanguages = ref<LabelValue[][]>([[]]);

const addVideoProfile = () => {
  videoCodecs.value.push([]);
};

const addAudioProfile = () => {
  audioCodecs.value.push([]);
};

const addSubtitleProfile = () => {
  subtitleCodecs.value.push([]);
};

const deleteVideoProfile = (index: number) => {
  videoCodecs.value.splice(index, 1);
};

const deleteAudioProfile = (index: number) => {
  audioCodecs.value.splice(index, 1);
};

const deleteSubtitleProfile = (index: number) => {
  subtitleCodecs.value.splice(index, 1);
};

onMounted(() => {
  if (!settings.value) return;
  mediaType.value = mediaTypes.value.find(type => type.value === settings.value?.type);
  if (!videoContainers.value) return;
  container.value = videoContainers.value.find(ec => ec.type == settings.value!.type);
});

watch(settings, (value) => {
  if (!value) return;
  name.value = value.name;
  mediaType.value = mediaTypes.value.find(type => type.value === value?.type);
  if (!videoContainers.value) return;
  container.value = videoContainers.value!.find(ec => ec.type == value!.type);
});


watch(videoContainers, (value) => {
  if (!value) return;
  container.value = value.find(ec => ec.type == settings.value!.type);
});

watch(container, (value) => {
  if (!value) return;
  console.log('container', value);
  // @ts-ignore
  videoCodecs.value = settings.value!.videoProfiles
      ?.map(vp => [value.available_video_codecs.find(codec => codec.value == vp.codec)]) ?? [];

  // @ts-ignore
  audioCodecs.value = settings.value!.audioProfiles
      ?.map(ap => [value.available_audio_codecs.find(codec => codec.value == ap.codec)]) ?? [];

  // @ts-ignore
  subtitleCodecs.value = settings.value!.subtitleProfiles
      ?.map(sp => [value.available_subtitle_codecs.find(codec => codec.value == sp.codec)]) ?? [];

  // @ts-ignore
  resolutions.value = settings.value!.videoProfiles
      ?.map(vp => [value.available_resolutions.find(codec => codec.width == vp.width)]) ?? [];

  // @ts-ignore
  colorSpaces.value = settings.value!.videoProfiles
      ?.map(vp => [value.available_video_codecs.find(codec => codec.value == vp.codec)?.color_spaces
          ?.find(c => settings.value?.videoProfiles?.map(vp => vp.colorSpace)?.includes(c.value) ?? true)]) ?? [];

  // @ts-ignore
  tunes.value = settings.value!.videoProfiles
      ?.map(vp => [value.available_video_codecs.find(codec => codec.value == vp.codec)?.tunes
          ?.find(t => settings.value?.videoProfiles?.map(vp => vp.tune)?.includes(t.value) ?? true)]) ?? [];

  // @ts-ignore
  profiles.value = settings.value!.videoProfiles
      ?.map(vp => [value.available_video_codecs.find(codec => codec.value == vp.codec)?.profiles
          ?.find(p => settings.value?.videoProfiles?.map(vp => vp.preset)?.includes(p.value) ?? true)]) ?? [];

  // @ts-ignore
  allowedSubtitleLanguages.value = settings.value!.subtitleProfiles
      ?.map(sp => sp.allowedLanguages
          ?.map(lang => value.available_subtitle_codecs.find(codec => codec.value == sp.codec)?.available_languages
              // @ts-ignore
              ?.find(l => l.value == lang)) ?? []) ?? [];

  // @ts-ignore
  allowedAudioLanguages.value = settings.value!.audioProfiles
      ?.map(ap => ap.allowedLanguages
          ?.map(lang => value.available_audio_codecs.find(codec => codec.value == ap.codec)?.available_languages
              // @ts-ignore
              ?.find(l => l.value == lang)) ?? []) ?? [];

  crfs.value = settings.value!.videoProfiles
      ?.map(vp => [vp.crf]) ?? [];

  bitrates.value = settings.value!.videoProfiles
      ?.map(vp => [vp.bitrate]) ?? [];

  playlistNames.value = settings.value!.videoProfiles
      ?.map(vp => [vp.playlistName]) ?? [];

  segmentNames.value = settings.value!.videoProfiles
      ?.map(vp => [vp.segmentName]) ?? [];

  widths.value = settings.value!.videoProfiles
      ?.map(vp => [vp.width]) ?? [];

});

watch(videoCodecs, value => {
  if (!value) return;
  console.log('videoCodecs', value);
});

// watch(() => videoCodecs[0], (value) => {
//   if (!value) return;
//   console.log('videoCodec',value);


// colorSpaces.value = value.map(vp => vp.map(codec => codec?.color_spaces
//     ?.find(c => settings.value?.videoProfiles?.map(vp => vp.colorSpace)?.includes(c.value) ?? true)) ?? []);

// crfs.value = value.map(vp => vp.map(codec => codec.crfs ?? []));
// widths.value = value.map(vp => vp.map(codec => codec.widths ?? []));
// tunes.value = value.map(vp => vp.map(codec => codec.tunes ?? []));
// playlistNames.value = value.map(vp => vp.map(codec => codec.playlist_names ?? []));
// segmentNames.value = value.map(vp => vp.map(codec => codec.segment_names ?? []));
// });

const value = ref('');
</script>

<template>
  <DashboardLayout :gridStyle="4" :error="error" :title="`Encoder profile: {{name}}`" :params="{name: settings?.name}">
    <template v-slot:cta>
    </template>

    <span class="block whitespace-nowrap text-sm font-medium text-contrast">
        {{ $t('Profiles settings') }}
      </span>
    <div class="grid w-full grid-cols-12 gap-4" v-if="settings">
      <FloatLabel variant="on" class="col-span-3">
        <InputText v-model="name" id="name" name="Name" class="col-span-3"/>
        <label for="name">Name</label>
      </FloatLabel>
      <FloatLabel variant="on" class="col-span-2">
        <Select v-model="mediaType" id="type" class="col-span-2"
                :options="mediaTypes" optionLabel="label"/>
        <label for="type">Media type</label>
      </FloatLabel>
      <FloatLabel variant="on" class="col-span-2">
        <Select v-model="container" id="container" class="col-span-2"
                :options="videoContainers?.filter(vc => vc.type == mediaType?.value) ?? []"
                optionLabel="label"/>
        <label for="container">Container</label>
      </FloatLabel>
    </div>

    <div class="flex w-full flex-col" v-if="settings">

      <div class="flex w-full justify-between">
      <span class="block whitespace-nowrap text-sm font-medium text-contrast">
        {{ $t('Video Profiles') }}
      </span>
        <Button type="button" @click="addVideoProfile" id="addVideoProfile">Add Video Profile</Button>
      </div>
      <template v-for="(profile, index) in videoCodecs" :key="index">
        <div class="m-2 mt-2 ml-0 flex w-full rounded-md border-white/5 p-4 border-1 odd:bg-auto-1/5 even:bg-auto-2/2">
          <div class="grid h-auto w-full grid-cols-8 flex-wrap gap-2">
            <FloatLabel variant="on" class="col-span-2">
              <Select :id="`videoProfiles_${index}`" label="Codec" class="col-span-2"
                      v-model="videoCodecs[index]" optionLabel="label"
                      :options="container?.available_video_codecs ?? []"/>
              <label :for="`videoProfiles_${index}`">Codec</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <Select :id="`resolutions_${index}`" label="Resolution" class="col-span-2"
                      v-model="resolutions[index]" optionLabel="label"
                      :options="container?.available_resolutions ?? []"/>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <Select :id="`colorSpaces_${index}`" class="col-span-2"
                      v-model="colorSpaces[index]" optionLabel="label"
                      :options="profile?.[index]?.color_spaces ?? []"/>
              <label :for="`colorSpaces_${index}`">Colorspace</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <Select :id="`profiles_${index}`" l class="col-span-2"
                      v-model="profiles[index]" optionLabel="label"
                      :options="profile?.[index]?.profiles ?? []"/>
              <label :for="`profiles_${index}`">Profile</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <Select :id="`tunes_${index}`" class="col-span-2"
                      v-model="tunes[index]" optionLabel="label"
                      :options="profile?.[index]?.tunes ?? container?.available_video_codecs.map(avc => avc.tunes) ?? []"/>
              <label for="`tunes_${index}`">Tune</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <InputNumber :id="`crfs_${index}`" type="number" :min="0" :max="51" class="col-span-2"
                           v-model="crfs[index]"/>
              <label :for="`crfs_${index}`">CRF</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <InputNumber :id="`bitrates_${index}`" type="number" :min="0" :max="1000000" class="col-span-2"
                           v-model="bitrates[index]"/>
              <label :for="`bitrates_${index}`">Bitrate</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <InputText :id="`playlistNames_${index}`" class="col-span-2"
                         v-model="playlistNames[index]"/>
              <label :for="`playlistNames_${index}`">Playlist name</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <InputText :id="`segmentNames_${index}`" class="col-span-2"
                         v-model="segmentNames[index]"/>
              <label :for="`segmentNames_${index}`">Segment name</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <InputNumber :id="`bitrates_${index}`" type="number" :min="0" :max="1000000" class="col-span-2"
                           optionLabel="label"
                           v-model="bitrates[index]"/>
              <label :for="`bitrates_${index}`">Bitrate</label>
            </FloatLabel>
          </div>
          <Button type="button" @click="() => deleteVideoProfile(index)" id="addVideoProfile" class="col-span-2" variant="text"
                  end-icon="trash"></Button>
        </div>
      </template>

      <div class="flex w-full justify-between">
      <span class="mt-2 block whitespace-nowrap text-sm font-medium text-contrast">
        {{ $t('Audio Profiles') }}
      </span>
        <Button type="button" @click="addAudioProfile" id="addAudioProfile">Add Audio Profile</Button>
      </div>
      <template v-for="(profile, index) in audioCodecs" :key="index">
        <div class="m-2 mt-2 ml-0 flex w-full rounded-md border-white/5 p-4 border-1 odd:bg-auto-1/5 even:bg-auto-2/2">
          <div class="grid h-auto w-full grid-cols-8 flex-wrap gap-2">
              <FloatLabel variant="on" class="col-span-2">
                <Select :id="`audioCodecs_${index}`" class="col-span-2"
                        optionLabel="label"
                        v-model="audioCodecs[index]"
                        :options="container?.available_audio_codecs ?? []"/>
                <label :for="`audioCodecs_${index}`">Codec</label>
              </FloatLabel>
              <FloatLabel variant="on" class="col-span-2">
                <MultiSelect :id="`allowedAudioLanguages_${index}`" class="col-span-2"
                             optionLabel="label"
                             v-model="allowedAudioLanguages[index]"
                             :options="profile?.[index]?.available_languages ?? []"/>
                <label :for="`allowedAudioLanguages_${index}`">Allowed languages</label>
              </FloatLabel>
          </div>
          <Button type="button" @click="() => deleteAudioProfile(index)" id="addVideoProfile" class="col-span-2" variant="text"
                  end-icon="trash"></Button>
        </div>
      </template>

      <div class="flex w-full justify-between">
      <span class="mt-2 block whitespace-nowrap text-sm font-medium text-contrast">
        {{ $t('Subtitle Profiles') }}
      </span>
        <Button type="button" @click="addSubtitleProfile" id="addSubtitleProfile">Add Subtitle Profile</Button>
      </div>
      <template v-for="(profile, index) in subtitleCodecs" :key="index">
        <div class="m-2 mt-2 ml-0 flex w-full rounded-md border-white/5 p-4 border-1 odd:bg-auto-1/5 even:bg-auto-2/2">
          <div class="grid h-auto w-full grid-cols-8 flex-wrap gap-2">
            <FloatLabel variant="on" class="col-span-2">
              <Select v-model="subtitleCodecs[index]" id="subtitleProfiles"
                      optionLabel="label"
                      class="col-span-2"
                      :options="container?.available_subtitle_codecs ?? []"/>
                <label for="subtitleProfiles">Codec</label>
            </FloatLabel>
            <FloatLabel variant="on" class="col-span-2">
              <Select v-model="allowedSubtitleLanguages[index]" :id="`allowedSubtitleLanguages_${index}`" class="col-span-2"
                      optionLabel="label"
                      :options="profile?.[index]?.available_languages ?? []" multiple/>
              <label :for="`allowedSubtitleLanguages_${index}`">Allowed languages</label>
            </FloatLabel>
          </div>
          <Button type="button" @click="() => deleteSubtitleProfile(index)" id="addVideoProfile" class="col-span-2" variant="text"
                  end-icon="trash"></Button>
        </div>
      </template>
    </div>

    <template v-slot:actions>
      <Button type="button"
              id="remove"
              variant="text"
              class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
              color="text-auto-alpha-11"
              startIcon="folderRemove"
              @click="openDeleteConfirm">
        {{ $t('Remove') }}
      </button>
      <Button type="button"
              id="cancel"
              variant="text"
              color="white"
              @click="handleCancel">
        {{ $t('Cancel') }}
      </Button>
      <Button type="submit"
              id="save"
              variant="default"
              color="theme"
              class="ml-auto"
              form="myForm"
              @click="handleSave">
        {{ $t('Save') }}
      </button>
    </template>

    <DeleteEncoderProfileModal
        v-if="settings?.id"
        :id="settings?.id ?? ''"
        :name="settings?.name ?? ''"
        :close="closeDeleteConfirm"
        :open="deleteConfirmOpen"
    />
  </DashboardLayout>
</template>
