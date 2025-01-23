<script setup lang="ts">
// import {onMounted} from "vue";
// import {Chromecast} from "@gameleap/capacitor-chromecast";

// import {useChromecast} from "@/hooks/useChromeCast";
// import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

// const { currentDevice, isCasting, config, startCasting, stopCasting } = useChromecast();


// onMounted(() => {
//   console.log('mounted', config);
//   // initChromeCast();
// });

</script>

<template>
  <!-- <div>
    <h1>Chromecast Demo</h1>

    <div class="flex flex-col gap-4">
      <div v-if="!currentDevice"><h2>No device connected</h2></div>
      <div v-else>
        <h2>Connected to: {{ currentDevice?.friendlyName }}</h2>
      </div>

      <div class="flex gap-4">
        <google-cast-launcher></google-cast-launcher>

        <button class="flex gap-2 items-center" @click="startCasting()" :disabled="isCasting">
          <MoooomIcon icon="chromecast" className="m-2 h-6 w-auto"/>
          <span>Start Casting</span>
        </button>

        <button class="flex gap-2 items-center" @click="stopCasting()" :disabled="!isCasting">
          <MoooomIcon icon="stop" className="m-2 h-6 w-auto"/>
          <span>Stop Casting</span>
        </button>
      </div>

      <div class="flex gap-4">

        <button class="flex gap-2 items-center" :onclick="() => Chromecast.requestSession()">
          <MoooomIcon icon="chromecast" className="m-2 h-6 w-auto"/>
          <span>Start Casting</span>
        </button>
        <button class="flex gap-2 items-center" :onclick="() => Chromecast.loadMedia({
            contentId: '7Xdu1sAAAAASUVORK5CYII',
            type: 'video',
            customData: config,
        })">
          <MoooomIcon icon="play" className="m-2 h-6 w-auto"/>
        </button>
      </div>
    </div>
  </div> -->
</template>

<style scoped></style>