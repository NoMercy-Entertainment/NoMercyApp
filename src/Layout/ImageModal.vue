<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {Portal} from '@headlessui/vue';
import {
  disableScreensaver,
  imageModalData,
  setImageModalData,
  setImageModalOpen,
  showImageModal,
  showScreensaver
} from '@/store/imageModal';
import currentServer from '@/store/currentServer';
import {pickPaletteColor} from '@/lib/colorHelper';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import TMDBImage from '@/components/Images/TMDBImage.vue';


const showButton = ref(false);
const src = ref<string | null>();
const logoSrc = ref<string | undefined>();
const logoAspect = ref<number>(1);
const logoColor = ref<string>();
const overlayRef = ref<HTMLDivElement>();
const timeout = ref<NodeJS.Timeout>();
const timeout2 = ref<NodeJS.Timeout>();
const timeout3 = ref<NodeJS.Timeout>();

const imageBaseUrl = computed(() => {
	return `${currentServer.value?.serverBaseUrl}/images/original`;
});

const delay = computed(() => {
  return showScreensaver.value ? 2400 : 400;
});

watch(imageModalData, (data) => {

  if (overlayRef?.value?.style) {
    overlayRef.value.style.opacity = '1';
  }

  if (!data) return;

  if (src.value == null && data.src) {
    src.value = `${imageBaseUrl.value}${data.src}`;
    logoColor.value = pickPaletteColor(data.color_palette?.image)
        ?.replace('rgb(', '')
        .replace(')', '')
        .replace(/,/gu, ' ');

    timeout2.value = setTimeout(() => {
      // if (!data.meta?.logo?.src) {
      logoSrc.value = undefined;
      // 	return;
      // }
      setTimeout(() => {
        // logoSrc.value = `${imageBaseUrl.value}/original${data.meta?.logo?.src}`;
        logoSrc.value = data.meta?.logo?.src;
        logoAspect.value = data.meta?.logo?.aspectRatio || 1;
      }, 4000);
    }, delay.value);

  } else if (data.src) {
    timeout2.value = setTimeout(() => {
      src.value = `${imageBaseUrl.value}${data.src}`;
      logoColor.value = pickPaletteColor(data.color_palette?.image)
          ?.replace('rgb(', '')
          .replace(')', '')
          .replace(/,/gu, ' ');

      // if (!data.meta?.logo?.src) {
      logoSrc.value = undefined;
      //     return;
      // }
      setTimeout(() => {
        // logoSrc.value = `${imageBaseUrl.value}/original${data.meta?.logo?.src}`;
        logoSrc.value = data.meta?.logo?.src;
        logoAspect.value = data.meta?.logo?.aspectRatio || 1;
      }, 4000);
    }, delay.value);
  }
});

onBeforeUnmount(() => {
  clearTimeout(timeout.value);
  clearTimeout(timeout2.value);
  clearTimeout(timeout3.value);
});


const handleClose = () => {
  setImageModalOpen(false);
  setImageModalData(null);
  src.value = null;
  // setTemp(null);
};

const handleShowButtonToggle = () => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    document.querySelector<HTMLDivElement>('#imageModal')?.classList.add('allchildren:cursor-none');
    showButton.value = true;
  }, 2000);
  showButton.value = false;
  document.querySelector<HTMLDivElement>('#imageModal')?.classList.remove('allchildren:cursor-none');
};

const handleLoaded = () => {
  setTimeout(() => {
    if (overlayRef.value) {
      overlayRef.value.style.opacity = '0';
    }
  }, delay.value);
};

const handleClick = (e: MouseEvent | TouchEvent) => {
  handleClose();
  e.stopPropagation();
  e.preventDefault();
};

onMounted(() => {
  if (!showImageModal) return;

  window.addEventListener('mousemove', handleShowButtonToggle);
  return () => {
    window.removeEventListener('mousemove', handleShowButtonToggle);
    clearTimeout(timeout.value);
  };
});

</script>

<template>
  <Portal>
    <div id="imageModal"
         v-if="(showImageModal || showScreensaver) && !disableScreensaver"
         class="fixed inset-0 w-full z-[999999999] bg-auto-4 dark:bg-auto-9"
         :class="(showImageModal || showScreensaver) && !disableScreensaver ? '' : 'hidden pointer-events-none'"
         @click="handleClick">
      <div ref="overlayRef"
           :style="`--delay: ${showScreensaver ? '2400ms' : '400ms'}`"
           class="pointer-events-none absolute inset-0 bg-black w-available h-available z-999 transitioning-slower"></div>
      <div
          class="absolute z-0 h-screen w-screen items-center border-solid border-black bg-black p-8 text-center left-50 border-1 transitioning-slower">
        <img :src="src ?? ''"
             alt=""
             @load="handleLoaded"
             class="h-0 w-0 opacity-0">
        <div class="absolute z-0 bg-center opacity-75 -inset-[50vh] w-[200vw] h-[400vh] bg-blur"
             :style="`background-image: url(${src});`"></div>

        <button aria-hidden="true"
                tabindex="-1"
                @click="handleClose"
                class="absolute flex transitioning top-8 right-8 w-10 min-w-[2.5rem] h-10 min-h-[2.5rem] z-0 items-center justify-center disabled:opacity-50 disabled:text-auto-3 disabled:hover:!bg-transparent rounded-full overflow-clip hover:bg-transparent focus-visible:bg-transparent active:bg-transparent sm:focus-visible:bg-auto-4/80 sm:hover:bg-auto-4/80 pointer-events-auto"
                :class="!showButton && !showScreensaver ? 'flex' : 'hidden'">
          <MoooomIcon icon="cross" class="h-5 w-5"/>
        </button>

        <div
            class="absolute inset-2 tv:inset-2 z-0 m-auto h-auto overflow-clip rounded-xl bg-cover bg-center bg-no-repeat opacity-90 shadow-img max-w-[82vw] max-h-[83vh] bg-image-blur md:inset-16"
            :style="`background-image: url(${src}); aspect-ratio: ${imageModalData?.aspectRatio}`"></div>

        <div
            class="absolute inset-2 tv:inset-20 z-0 m-auto h-auto overflow-clip rounded-xl bg-cover bg-center bg-no-repeat shadow-img max-w-[82vw] max-h-[83vh] md:inset-24"
            :style="`background-image: url(${src}); aspect-ratio: ${imageModalData?.aspectRatio}; box-shadow: 0 0 800px 80px rgba(0,0,0,.2) inset;`">
          <div class="absolute tv:bottom-2 left-2 tv:left-4 z-0 p-4 bottom:2 sm:bottom-6 sm:left-8">
            <div
                class="pointer-events-none flex h-full w-full select-none items-start justify-start bg-cover min-h-[20vh] max-h-[20vh] min-w-[30vw] max-w-[30vw] tv:min-h-[20vh] tv:max-h-[20vh] tv:min-w-[40vw] tv:max-w-[40vw]">
              <TMDBImage
                  v-if="logoSrc"
                  :key="logoSrc"
                  :autoShadow="true"
                  :path="logoSrc"
                  :shadow="logoColor"
                  :size="500"
                  class="w-auto object-contain h-available object-[0_0%] max-h-inherit !duration-700 children:!duration-700"
                  className="mr-auto p-4 !duration-700 children:!duration-700"
                  type="logo"/>
            </div>
          </div>
        </div>

        <div class="absolute bottom-6 mx-auto -ml-8 flex w-full justify-center gap-8 text-crimson-11"
             :class="showButton && !showScreensaver ? 'flex' : 'hidden'">
          <button aria-hidden="true"
                  tabindex="-1"
                  data-state="closed"
                  class="z-0 flex h-10 w-10 items-center justify-center min-w-[2.5rem] min-h-[2.5rem]"
                  style="opacity: 0.3;">
            <MoooomIcon icon="arrowRight" class="h-8 w-8 rotate-180 text-white/10"/>
          </button>
          <button aria-hidden="true"
                  tabindex="-1"
                  data-state="closed"
                  class="z-0 flex h-10 w-10 items-center justify-center transitioning min-w-[2.5rem] min-h-[2.5rem]"
                  style="opacity: 0.3;">

            <MoooomIcon icon="arrowLeft" class="h-8 w-8 text-white/10"/>
          </button>
        </div>
        <div class="absolute right-6 bottom-3 z-0 tv:h-12 h-20 tv:w-12 w-20 tv:right-3.5"
             :style="`--color-focus: ${logoColor  ?? 'var(--color-theme-7)'};`">
          <AppLogoSquare class=""/>
        </div>
      </div>
    </div>
  </Portal>
</template>
