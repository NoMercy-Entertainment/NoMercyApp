<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";

import type {EncoderProfile} from "@/types/api/base/library";
import type {
  AvailableAudioCodec,
  AvailableSubtitleCodec,
  AvailableVideoCodec,
  Container,
  LabelValue,
} from "@/types/api/dashboard/server";

import useServerClient from "@/lib/clients/useServerClient";

import DeleteEncoderProfileModal from "./components/DeleteEncoderProfileModal.vue";
import DashboardLayout from "@/Layout/Desktop/DashboardLayout.vue";
import {Nullable} from "vitest";
import router from "@/router";

const route = useRoute();

const {data: encoderProfiles, error} = useServerClient<EncoderProfile[]>({
  path: "dashboard/encoderProfiles",
  queryKey: ["dashboard", "encoderProfiles"],
});

const {data: videoContainers} = useServerClient<Container[]>({
  path: "dashboard/encoderProfiles/containers",
  queryKey: ["dashboard", "videoContainers"],
});

const settings = ref<EncoderProfile>();
watch(encoderProfiles, (value) => {
  if (!value) return;
  settings.value = value.find((l) => l.id === route.params.id);
});

onMounted(() => {
  if (!encoderProfiles.value) return;
  settings.value = encoderProfiles.value.find((l) => l.id === route.params.id);
});

const deleteConfirmOpen = ref(false);
const openDeleteConfirm = () => {
  deleteConfirmOpen.value = true;
};
const closeDeleteConfirm = () => {
  deleteConfirmOpen.value = false;
};

const handleCancel = () => {
  router.back();
};

const handleSave = () => {
};

// const submitHandler = (e: any) => {
//   console.log(e);
// };

const mediaTypes = ref([
  {label: "audio", value: "audio"},
  {label: "video", value: "video"},
  {label: "image", value: "image"},
]);
const name = ref(settings.value?.name);
const mediaType = ref<{ label: string; value: string } | undefined>(
    mediaTypes.value?.find((type) => type.value === settings.value?.type)
);
const container = ref<Container | undefined>(
    videoContainers.value?.find((ec) => ec.type === settings.value?.type)
);

const videoCodecs = ref<AvailableVideoCodec[]>([]);
const resolutions = ref<LabelValue[]>([]);
const colorSpaces = ref<LabelValue[]>([]);
const crfs = ref<Nullable<number>[]>([]);
const widths = ref<Nullable<number>[]>([]);
const tunes = ref<LabelValue[]>([]);
const profiles = ref<LabelValue[]>([]);
const presets = ref<LabelValue[]>([]);
const playlistNames = ref<Nullable<string>[]>([]);
const segmentNames = ref<Nullable<string>[]>([]);
const bitrates = ref<Nullable<number>[]>([]);

const audioCodecs = ref<AvailableAudioCodec[]>([]);
const allowedAudioLanguages = ref<LabelValue[][]>([]);

const subtitleCodecs = ref<AvailableSubtitleCodec[]>([]);
const allowedSubtitleLanguages = ref<LabelValue[][]>([]);

const addVideoProfile = () => {
  videoCodecs.value.push(<AvailableVideoCodec>{});
};

const addAudioProfile = () => {
  audioCodecs.value.push(<AvailableAudioCodec>{});
};

const addSubtitleProfile = () => {
  subtitleCodecs.value.push(<AvailableSubtitleCodec>{});
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
  mediaType.value = mediaTypes.value.find(
      (type) => type.value === settings.value?.type
  );
  container.value = videoContainers.value?.find(
      (ec) => ec.type === settings.value?.type
  );
});

watch(settings, (value) => {
  if (!value) return;
  name.value = value.name;
});

watch(videoContainers, (value) => {
  if (!value) return;
  container.value = value.find((ec) => ec.value === settings.value!.container);
});

const setValues = (value?: Container) => {
  if (!value) return;
  console.raw("container", value, mediaTypes.value);

  mediaType.value = mediaTypes.value.find((type) => type.value === value.type);

  // @ts-ignore
  videoCodecs.value =
      settings.value!.videoProfiles?.map((vp) =>
          value.available_video_codecs.find((codec) => codec.value === vp.codec)
      ) ?? [];

  // @ts-ignore
  audioCodecs.value =
      settings.value!.audioProfiles?.map((ap) =>
          value.available_audio_codecs.find((codec) => codec.value === ap.codec)
      ) ?? [];

  // @ts-ignore
  subtitleCodecs.value =
      settings.value!.subtitleProfiles?.map((sp) =>
          value.available_subtitle_codecs.find((codec) => codec.value === sp.codec)
      ) ?? [];

  // @ts-ignore
  resolutions.value =
      settings.value!.videoProfiles?.map((vp) =>
          value.available_resolutions.find((res) => res.width === vp.width)
      ) ?? [];

  // @ts-ignore
  colorSpaces.value = settings.value.videoProfiles.map((p) =>
      videoCodecs.value
          .find((vc) => vc.value === p.codec)
          ?.color_spaces.find((cs2) => cs2.value === p.colorSpace)
  );

  // @ts-ignore
  tunes.value = settings.value!.videoProfiles.map((p) =>
      videoCodecs.value
          .find((vc) => vc.value === p.codec)
          ?.tunes.find((t2) => t2.value === p.tune)
  );

  // @ts-ignore
  profiles.value = settings.value!.videoProfiles.map((p) =>
      videoCodecs.value
          .find((vc) => vc.value === p.codec)
          ?.profiles.find((p2) => p2.value === p.profile)
  );

  presets.value = settings.value!.videoProfiles.map((p) =>
      videoCodecs.value
          .find((vc) => vc.value === p.codec)
          ?.presets.find((p2) => p2.value === p.preset)
  );

  console.log("presets", presets.value);

  // @ts-ignore
  allowedSubtitleLanguages.value = audioCodecs.value!.map(
      (ac) => ac?.available_languages ?? []
  );

  // @ts-ignore
  allowedAudioLanguages.value = subtitleCodecs.value!.map(
      (sc) => sc?.available_languages ?? []
  );

  crfs.value = settings.value!.videoProfiles?.map((vp) => vp.crf) ?? [];

  bitrates.value = settings.value!.videoProfiles?.map((vp) => vp.bitrate) ?? [];

  playlistNames.value =
      settings.value!.videoProfiles?.map((vp) => vp.playlistName) ?? [];

  segmentNames.value =
      settings.value!.videoProfiles?.map((vp) => vp.segmentName) ?? [];

  widths.value = settings.value!.videoProfiles?.map((vp) => vp.width) ?? [];
};

watch(container, setValues);

onMounted(() => {
  setValues(container.value);

  container.value = videoContainers.value?.find(
      (ec) => ec.value === settings.value!.container
  );
});

watch(videoCodecs, (value) => {
  if (!value) return;
  console.log("videoCodecs", value);
});
</script>

<template>
  <DashboardLayout
      :error="error"
      :gridStyle="4"
      :params="{ name: settings?.name }"
      :title="`Encoder profile: {{name}}`"
  >
    <template v-slot:cta></template>

    <span class="block whitespace-nowrap text-sm font-medium">
      {{ $t("Profiles settings") }}
    </span>
    <div v-if="settings" class="grid w-full grid-cols-12 gap-4">
      <FloatLabel class="col-span-3" variant="on">
        <InputText id="name" v-model="name" class="w-full" name="Name"/>
        <label for="name">Name</label>
      </FloatLabel>
      <FloatLabel class="col-span-2" variant="on">
        <Select
            id="type"
            v-model="mediaType"
            :options="mediaTypes"
            class="w-full"
            optionLabel="label"
        />
        <label for="type">Media type</label>
      </FloatLabel>
      <FloatLabel class="col-span-2" variant="on">
        <Select
            id="container"
            v-model="container"
            :options="
            videoContainers?.filter((vc) => vc.type === mediaType?.value) ?? []
          "
            class="w-full"
            optionLabel="label"
        />
        <label for="container">Container</label>
      </FloatLabel>
    </div>

    <div v-if="settings" class="flex w-full flex-col">
      <div class="flex w-full justify-between">
        <span class="block whitespace-nowrap text-sm font-medium">
          {{ $t("Video Profiles") }}
        </span>
        <Button id="addVideoProfile" type="button" @click="addVideoProfile"
        >Add Video Profile
        </Button
        >
      </div>
      <template v-for="(profile, index) in videoCodecs" :key="index">
        <div
            class="m-2 mt-2 ml-0 flex w-full rounded-md border-white/5 p-4 border-1 odd:bg-surface-1/5 even:bg-surface-2/2"
        >
          <div class="grid h-auto w-full grid-cols-8 flex-wrap gap-2">
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`videoProfiles_${index}`"
                  v-model="videoCodecs[index]"
                  :options="container?.available_video_codecs ?? []"
                  class="col-span-2"
                  label="Codec"
                  optionLabel="label"
              />
              <label :for="`videoProfiles_${index}`">Codec</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`resolutions_${index}`"
                  v-model="resolutions[index]"
                  :options="container?.available_resolutions ?? []"
                  class="col-span-2"
                  label="Resolution"
                  optionLabel="name"
              />
              <label :for="`resolutions_${index}`">Resolution</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`colorSpaces_${index}`"
                  v-model="colorSpaces[index]"
                  :options="profile?.color_spaces ?? []"
                  class="col-span-2"
                  optionLabel="label"
              />
              <label :for="`colorSpaces_${index}`">Colorspace</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`profiles_${index}`"
                  v-model="profiles[index]"
                  :options="profile?.profiles ?? []"
                  class="col-span-2"
                  l
                  optionLabel="label"
              />
              <label :for="`profiles_${index}`">Profile</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`presets_${index}`"
                  v-model="presets[index]"
                  :options="profile?.presets ?? []"
                  class="col-span-2"
                  l
                  optionLabel="label"
              />
              <label :for="`presets_${index}`">Preset</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`tunes_${index}`"
                  v-model="tunes[index]"
                  :options="profile?.tunes ?? []"
                  class="col-span-2"
                  optionLabel="label"
              />
              <label for="`tunes_${index}`">Tune</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <InputNumber
                  :id="`crfs_${index}`"
                  v-model="crfs[index]"
                  :max="51"
                  :min="0"
                  class="w-full"
                  type="number"
              />
              <label :for="`crfs_${index}`">CRF</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <InputNumber
                  :id="`bitrates_${index}`"
                  v-model="bitrates[index]"
                  :max="1000000"
                  :min="0"
                  class="w-full"
                  type="number"
              />
              <label :for="`bitrates_${index}`">Bitrate</label>
            </FloatLabel>
            <FloatLabel class="col-span-4" variant="on">
              <InputText
                  :id="`segmentNames_${index}`"
                  v-model="segmentNames[index]"
                  class="w-full"
              />
              <label :for="`segmentNames_${index}`">Segment name</label>
            </FloatLabel>
            <FloatLabel class="col-span-4" variant="on">
              <InputText
                  :id="`playlistNames_${index}`"
                  v-model="playlistNames[index]"
                  class="w-full"
              />
              <label :for="`playlistNames_${index}`">Playlist name</label>
            </FloatLabel>
          </div>
          <Button
              id="addVideoProfile"
              class="col-span-2"
              end-icon="trash"
              type="button"
              variant="text"
              @click="() => deleteVideoProfile(index)"
          ></Button>
        </div>
      </template>

      <div class="flex w-full justify-between">
        <span class="mt-2 block whitespace-nowrap text-sm font-medium">
          {{ $t("Audio Profiles") }}
        </span>
        <Button id="addAudioProfile" type="button" @click="addAudioProfile"
        >Add Audio Profile
        </Button
        >
      </div>
      <template v-for="(profile, index) in audioCodecs" :key="index">
        <div
            class="m-2 mt-2 ml-0 flex w-full rounded-md border-white/5 p-4 border-1 odd:bg-surface-1/5 even:bg-surface-2/2"
        >
          <div class="grid h-auto w-full grid-cols-8 flex-wrap gap-2">
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  :id="`audioCodecs_${index}`"
                  v-model="audioCodecs[index]"
                  :options="container?.available_audio_codecs ?? []"
                  class="col-span-2"
                  optionLabel="label"
              />
              <label :for="`audioCodecs_${index}`">Codec</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <MultiSelect
                  :id="`allowedAudioLanguages_${index}`"
                  v-model="allowedAudioLanguages[index]"
                  :options="profile?.available_languages ?? []"
                  class="col-span-2"
                  optionLabel="label"
              />
              <label :for="`allowedAudioLanguages_${index}`"
              >Allowed languages</label
              >
            </FloatLabel>
          </div>
          <Button
              id="addVideoProfile"
              class="col-span-2"
              end-icon="trash"
              type="button"
              variant="text"
              @click="() => deleteAudioProfile(index)"
          ></Button>
        </div>
      </template>

      <div class="flex w-full justify-between">
        <span class="mt-2 block whitespace-nowrap text-sm font-medium">
          {{ $t("Subtitle Profiles") }}
        </span>
        <Button
            id="addSubtitleProfile"
            type="button"
            @click="addSubtitleProfile"
        >Add Subtitle Profile
        </Button
        >
      </div>
      <template v-for="(profile, index) in subtitleCodecs" :key="index">
        <div
            class="m-2 mt-2 ml-0 flex w-full rounded-md border-white/5 p-4 border-1 odd:bg-surface-1/5 even:bg-surface-2/2"
        >
          <div class="grid h-auto w-full grid-cols-8 flex-wrap gap-2">
            <FloatLabel class="col-span-2" variant="on">
              <Select
                  id="subtitleProfiles"
                  v-model="subtitleCodecs[index]"
                  :options="container?.available_subtitle_codecs ?? []"
                  class="col-span-2"
                  optionLabel="label"
              />
              <label for="subtitleProfiles">Codec</label>
            </FloatLabel>
            <FloatLabel class="col-span-2" variant="on">
              <MultiSelect
                  :id="`allowedSubtitleLanguages_${index}`"
                  v-model="allowedSubtitleLanguages[index]"
                  :options="profile?.available_languages ?? []"
                  class="col-span-2"
                  multiple
                  optionLabel="label"
              />
              <label :for="`allowedSubtitleLanguages_${index}`"
              >Allowed languages</label
              >
            </FloatLabel>
          </div>
          <Button
              id="addVideoProfile"
              class="col-span-2"
              end-icon="trash"
              type="button"
              variant="text"
              @click="() => deleteSubtitleProfile(index)"
          ></Button>
        </div>
      </template>
    </div>

    <template v-slot:actions>
      <Button
          id="remove"
          class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
          color="auto"
          startIcon="folderRemove"
          type="button"
          variant="text"
          @click="openDeleteConfirm"
      >
        {{ $t("Remove") }}
      </Button>
      <Button
          id="cancel"
          color="white"
          type="button"
          variant="text"
          @click="handleCancel"
      >
        {{ $t("Cancel") }}
      </Button>
      <Button
          id="save"
          class="ml-auto"
          color="theme"
          form="myForm"
          type="submit"
          @click="handleSave"
      >
        {{ $t("Save") }}
      </Button>
    </template>

    <DeleteEncoderProfileModal
        v-if="settings?.id"
        :id="settings?.id ?? ''"
        :close="closeDeleteConfirm"
        :name="settings?.name ?? ''"
        :open="deleteConfirmOpen"
    />
  </DashboardLayout>
</template>
