<script lang="ts" setup>
import {onMounted, ref} from 'vue';
import router from '@/router';

const refHandle = ref<HTMLSpanElement>();
const refBar = ref<HTMLDivElement>();
const element = ref<HTMLDivElement>();
const show = ref(false);

defineProps({
    autoHide: {
        type: Boolean,
        default: false,
    },
    className: {
        type: String,
        required: false,
        default: '',
    },
    static: {
        type: Boolean,
        default: true,
    },
});

const enable = () => {

  const handle = refHandle.value;
  const bar = refBar.value;
  const container = element.value;

  if (!handle || !container || !bar) return;
  container.scrollTop = 0;

  const update = () => {

    const height = Math.ceil(container.clientHeight / container.scrollHeight * container.clientHeight) + 5;
    handle.style.height = `${height}px`;

    const scroll = container.scrollTop / container.scrollHeight;
    handle.style.top = `${scroll * 100}%`;

    if ((container.firstElementChild as HTMLDivElement).scrollHeight >= height || container.scrollHeight >= height) {
      show.value = true;
    } else {
      show.value = false;
    }

    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);

  function start(e: MouseEvent) {
    e.preventDefault();

    document.addEventListener('mouseup', end);
    document.addEventListener('mousemove', drag);
  }

  function end() {
    document.removeEventListener('mouseup', end);
    document.removeEventListener('mousemove', drag);
  }

  function lim(down: number, y: number, up: number) {
    return Math.min(Math.max(down, y), up);
  }

  function drag(e: MouseEvent) {
    e.preventDefault();

    if (!handle || !container || !bar || !!(e.target as HTMLDivElement)?.dataset?.scrollbar) return;

    const y = lim(0, e.clientY - bar!.getBoundingClientRect().top, bar!.clientHeight) - (handle.clientHeight / 2);

    container.scrollTop = (container.scrollHeight - container.clientHeight) * (y / (bar!.clientHeight - handle!.clientHeight));

  }

  handle.addEventListener('mousedown', start);
}

onMounted(() => {
    enable();
});

router.afterEach(enable);

</script>

<template>
    <div class="flex h-auto w-full flex-col overflow-auto min-h-available scrollbar-none group/scrollContainer" ref="element">
        <slot/>

        <div ref="refBar"
             data-scrollbar
             :style="`position: ${static ? 'fixed' : 'absolute'}`"
             :class="{
                 'opacity-100' : show,
                 'opacity-0' : !show,
                 'top-16 mr-1': static,
                 'top-0 mr-1': !static,
                 className,
             }"
             class="right-0 bottom-0 mt-2 mb-2 hidden rounded-full border-r-2 border-l-4 border-transparent transition-all duration-300 w-3.5 group-active/scrollContainer:bg-auto-2/9 hover:bg-auto-2/9 sm:flex">
            <span draggable="true"
                  data-scrollbar
                  ref="refHandle"
                  :class="{
                    'opacity-0 group-hover/scrollContainer:opacity-100': autoHide,
                  }"
                  class="absolute w-2 rounded-full transition-all right-[1px] bg-auto-12/11 active:opacity-100 [transition-duration:75ms] [animation-duration:75ms] active:[transition-duration:0ms] active:[animation-duration:0ms]"
            >
            </span>
        </div>
    </div>
</template>
