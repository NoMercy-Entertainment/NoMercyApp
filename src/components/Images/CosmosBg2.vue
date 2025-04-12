<script setup lang="ts">

const images = [
  '/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
  '/pYnRJuBPEqZO1o4fcxBTgmKNHfy.jpg',
  '/eqKNlMgG6pE1tbvTcD86NDNKlru.jpg',
  '/dd5yGBLbqB507gHJSosNY0IYHRQ.jpg',
  '/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
  '/rWg4Jk7NwVEz2BtU1aKKDoDJPeB.jpg',
  '/f5ZMzzCvt2IzVDxr54gHPv9jlC9.jpg',
  '/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg',
  '/ct5pNE5dDHryHLDnxyZPYcqO1sz.jpg',
];

const calculateRotation = (index: number, total: number) => {
  const centerIndex = Math.floor(total / 2);
  return -(index - centerIndex) * 7;
};

const calculateTranslation = (index: number, total: number) => {
  const centerIndex = Math.floor(total / 2);
  const distance = Math.abs(index - centerIndex);
  const maxDistance = centerIndex;
  const factor = 68;
  return -Math.pow(distance / maxDistance, 2) * factor * maxDistance;
};

</script>

<template>
  <div class="absolute inset-0 flex w-full h-full bg-white dark:bg-black z-0 overflow-clip items-center justify-center">
    <div
      class="absolute -inset-6 z-0 flex h-available w-available to-transparent bg-gradient-circle-t from-focus/8 dark:from-focus/6 from-10%">
    </div>
    <div class="absolute top-[40%] sm:top-[49%] z-10 flex w-[2850px] min-w-[2850px] -translate-x-0 mx-auto max-w-available">
      <div class="flex h-full w-auto -translate-x-1/3 flex-nowrap gap-2 sm:gap-16 sm:-translate-x-0">
        <template v-for="(image, index) in images" :key="image">
          <div class="z-10 h-auto w-36 rounded-lg aspect-poster sm:w-full"
               :style="{
                  transform: `rotate(${calculateRotation(index, images.length)}deg) translateY(${calculateTranslation(index, images.length)}px)`,
                }"
          >
            <img :src="`https://media.themoviedb.org/t/p/w300${image}`" alt="" class="h-full w-full"
              :style="{
                // maskImage: `linear-gradient(180deg,
								// 			rgba(255, 255, 255, 0.00) 10%,
								// 			rgba(255, 255, 255, 0.01) 16.67%,
								// 			rgba(255, 255, 255, 0.04) 23.33%,
								// 			rgba(255, 255, 255, 0.08) 30%,
								// 			rgba(255, 255, 255, 0.15) 36.67%,
								// 			rgba(255, 255, 255, 0.23) 43.33%,
								// 			rgba(255, 255, 255, 0.33) 50%,
								// 			rgba(255, 255, 255, 0.44) 56.67%,
								// 			rgba(255, 255, 255, 0.56) 63.33%,
								// 			rgba(255, 255, 255, 0.67) 70%,
								// 			rgba(255, 255, 255, 0.77) 76.67%,
								// 			rgba(255, 255, 255, 0.85) 83.33%,
								// 			rgba(255, 255, 255, 0.92) 90%,
								// 			rgba(255, 255, 255, 0.96) 96.67%,
								// 			rgba(255, 255, 255, 0.99) 93.33%,
								// 			#FFF 100%
								// 		)`,
                  maskImage: `linear-gradient(180deg,
                    rgba(255, 255, 255, 0%) 0%,
                    rgba(255, 255, 255, 2%) 7%,
                    rgba(255, 255, 255, 4%) 12%,
                    rgba(255, 255, 255, 8%) 20%,
                    rgba(255, 255, 255, 15%) 27%,
                    rgba(255, 255, 255, 23%) 33%,
                    rgba(255, 255, 255, 33%) 40%,
                    rgba(255, 255, 255, 44%) 47%,
                    rgba(255, 255, 255, 56%) 53%,
                    rgba(255, 255, 255, 67%) 60%,
                    rgba(255, 255, 255, 77%) 67%,
                    rgba(255, 255, 255, 85%) 73%,
                    rgba(255, 255, 255, 92%) 80%,
                    rgba(255, 255, 255, 96%) 87%,
                    rgba(255, 255, 255, 99%) 93%,
                    #FFF 100%
                  )`,
              }" />

          </div>

        </template>
      </div>
    </div>
    <svg xmlns='http://www.w3.org/2000/svg' class="hidden z-0 dark:flex pointer-events-none absolute inset-0 opacity-40 h-full w-full">
      <filter id='noiseFilter'>
        <feTurbulence baseFrequency="0.22"/>
        <feColorMatrix values="0 0 0 9 -4
                               0 0 0 9 -4
                               0 0 0 9 -4
                               0 0 0 0 2"/>
      </filter>

      <rect width='100%' height='100%' filter='url(#noiseFilter)' />
    </svg>

  </div>
</template>
