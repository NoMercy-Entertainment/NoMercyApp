<script setup lang="ts">

</script>

<template>
<!--    <div :data-open="deviceMenuOpen"-->
<!--         :data-size="musicSize"-->
<!--         v-if="currentSong?.id"-->
<!--         class="absolute right-4 top-auto bottom-0 data-[open='true']:full:bottom-8 data-[open='true']:compact:bottom-20 sm:data-[open='true']:full:bottom-4 sm:data-[open='true']:compact:bottom-4 sm:bottom-4 ml-4 sm:w-1/4 sm:h-1/2 bg-black flex items-center justify-center rounded-lg transition-all duration-300 border-2 border-focus data-[open='false']:translate-y-[150%] z-[9999]">-->
<!--        <div-->
<!--            class="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg opacity-60 bg-auto-3/40">-->
<!--        </div>-->

<!--        <div id="devices_container"-->
<!--             class="flex h-full w-full flex-col gap-4 overflow-auto tv:overflow-clip p-6 scrollbar-none">-->

<!--            <template v-if="currentDevice" :key="currentDevice.device_id">-->
<!--                <div class="flex w-full items-center justify-between gap-2">-->
<!--                    <div class="flex w-full items-center justify-between gap-2">-->
<!--                        <div class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300"-->
<!--                             v-show="currentDevice.type === 'desktop'">-->
<!--                            <MoooomIcon icon="monitor" className="w-7 text-auto-12" />-->
<!--                        </div>-->
<!--                        <div class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300"-->
<!--                             v-show="currentDevice.type === 'mobile'">-->
<!--                            <MoooomIcon icon="mobilePhone" className="w-7 text-auto-12" />-->
<!--                        </div>-->
<!--                        <div class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300"-->
<!--                             v-show="currentDevice.type === 'tv'">-->
<!--                            <MoooomIcon icon="laptop" className="w-7 text-auto-12" />-->
<!--                        </div>-->

<!--                        <div class="flex w-full flex-col gap-1">-->
<!--                            <p class="w-full font-semibold leading-none text-md line-clamp-1">-->
<!--                                {{ $t('Current device') }}-->
<!--                            </p>-->
<!--                            <p class="text-xs leading-none text-auto-alpha-10 line-clamp-1">-->
<!--                              {{-->
<!--                                deviceId === currentDevice?.device_id-->
<!--                                    ? $t('This device')-->
<!--                                    : currentDevice?.custom_name ?? currentDevice.name-->
<!--                              }}-->
<!--                            </p>-->
<!--                        </div>-->

<!--                    </div>-->
<!--                </div>-->
<!--            </template>-->

<!--            <div class="flex items-center justify-between">-->
<!--                <h2 class="text-lg font-semibold text-auto-12">-->
<!--                    {{ $t('Select another device') }}</h2>-->
<!--            </div>-->

<!--            <div class="mt-2 flex flex-col gap-2">-->
<!--                <template v-for="device in unique(devices.filter(d => d.device_id != currentDevice?.device_id), 'deviceId')"-->
<!--                          :key="device?.id">-->
<!--                    <div class="flex items-center justify-between gap-2">-->
<!--                        <div class="flex h-full w-full items-center gap-2"-->
<!--                             v-on:click="switchDevice(device)">-->
<!--                            <div class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300"-->
<!--                                 v-show="device.type === 'desktop'">-->
<!--                                <MoooomIcon icon="monitor" className="w-7 text-auto-12" />-->
<!--                            </div>-->
<!--                            <div class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300"-->
<!--                                 v-show="device.type === 'mobile'">-->
<!--                                <MoooomIcon icon="mobilePhone" className="w-7 text-auto-12" />-->
<!--                            </div>-->
<!--                            <div class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300"-->
<!--                                 v-show="device.type === 'tv'">-->
<!--                                <MoooomIcon icon="laptop" className="w-7 text-auto-12" />-->
<!--                            </div>-->

<!--                            <div class="flex w-full flex-col gap-1">-->
<!--                                <p class="w-full font-semibold leading-none text-md line-clamp-1">-->
<!--                                  {{-->
<!--                                    deviceId === device?.device_id-->
<!--                                        ? $t('This device')-->
<!--                                        : device?.custom_name ?? device?.name-->
<!--                                  }}-->
<!--                                </p>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <button-->
<!--                            class="flex justify-center items-center w-10 h-10 rounded-full hover:bg-[#2f2f2f] active:bg-[#3f3f3f] transition-all duration-300">-->
<!--                            <MoooomIcon icon="menuDotsHorizontal" className="w-7 text-auto-12" />-->
<!--                        </button>-->
<!--                    </div>-->
<!--                </template>-->
<!--            </div>-->
<!--        </div>-->
<!--    </div>-->
</template>
