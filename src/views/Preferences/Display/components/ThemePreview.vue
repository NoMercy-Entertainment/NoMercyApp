<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';

// import { getColorFromPercent, percentColors } from '@/lib/colorHelper';
import AppLogo from "@/components/Images/icons/AppLogo.vue";
import { showBackdrops } from "@/store/preferences";

const { t } = useTranslation();

const colors = computed(() => {
	// if (useGradientPercentageColors.value) {
	// 	return [50, 90, 20, 40, 20, 30, 10, 100, 90, 70, 50, 70, 30, 80, 100, 40, 10, 60, 80, 60]
	// 		.map(i => (getColorFromPercent(i, percentColors)));
	// }

	return ['#F79009', '#f44', '#F79009', '#12B76A', '#94f', '#F79009', '#94f', '#f44', '#f44', '#F79009', '#12B76A', '#f44', '#f44', '#94f', '#12B76A', '#F79009', '#12B76A', '#94f', '#12B76A', '#94f'];
});

</script>

<template>
	<div
		class="mb-4 hidden sm:flex tv:!hidden xl:col-start-1 xl:col-span-2 xl:row-start-2 xl:row-span-2 2xl:col-start-1 2xl:col-span-2 2xl:row-start-2 2xl:row-span-2">
		<div class="relative flex select-none flex-col gap-3 w-available">
			<p class="font-bold">{{ t('Theme preview') }}</p>
			<div
				class="relative flex h-auto items-start justify-start overflow-hidden rounded-2xl border-2 aspect-[16/10] bg-slate-light-1 dark:bg-slate-dark-1 border-auto-9/20">

				<div class="relative flex w-full flex-shrink-0 flex-col overflow-clip px-2 h-available">
					<div class="mt-1 flex h-8">
						<div class="w-auto h-[7%] aspect-square absolute right-3 top-2 rounded-full bg-[#51525C] z-10">
						</div>
						<div class="mt-1 flex items-center justify-start gap-4">
							<AppLogo class="z-10 mr-4 ml-1 w-20" />

							<div class="w-12 rounded-full h-1.5 bg-auto-12/60"></div>
							<div class="w-6 rounded-full h-1.5 bg-theme-8"></div>
							<div class="w-9 rounded-full h-1.5 bg-auto-11/20"></div>
						</div>
					</div>
					<div class="mt-2 flex w-full overflow-clip h-available">
						<div class="mt-2 flex w-24 flex-col items-start justify-start gap-4 pr-4 pl-1">

							<div class="relative flex w-full items-center justify-start gap-2">
								<div class="aspect-square h-auto w-3 rounded-full bg-theme-7"></div>
								<div class="w-14 h-1.5 rounded-[8.48px] bg-theme-7"></div>
							</div>

							<div class="relative flex w-full items-center justify-start gap-2">
								<div class="aspect-square h-auto w-3 rounded-full bg-auto-11/40"></div>
								<div class="w-4/6 h-1.5 rounded-[8.48px] bg-auto-11/40"></div>
							</div>

							<div class="relative flex w-full items-center justify-start gap-2">
								<div class="aspect-square h-auto w-3 rounded-full bg-auto-11/20"></div>
								<div class="w-2/5 h-1.5 rounded-[8.48px] bg-auto-11/20"></div>
							</div>

							<div class="relative flex w-full items-center justify-start gap-2">
								<div class="aspect-square h-auto w-3 rounded-full bg-auto-11/10"></div>
								<div class="w-5/6 h-1.5 rounded-[8.48px] bg-auto-11/10"></div>
							</div>
						</div>

						<div class="relative w-px flex-1 rounded-lg mb-1.5">
							<div class="w-full h-full px-2 pt-2 gap-2.5 flex flex-col ml-auto overflow-hidden rounded-xl bg-slate-light-6 dark:bg-slate-dark-3
								bg-cover border-2 border-transparent text-start transition-transform duration-200">

								<div class="mx-auto h-24 w-full rounded-sm min-h-[5.5rem] bg-slate-light-11/90 dark:bg-slate-dark-1/90">
								</div>

								<div class="flex w-auto flex-wrap overflow-hidden transition-transform duration-500"
									:class="showBackdrops
										? '-mr-[54.2%] gap-y-2'
										: '-mr-[23.3%] gap-y-2'">
									<div v-for="(item, index) in colors"
										class="relative flex h-auto flex-col overflow-clip pr-2 transition-transform duration-500"
										:class="showBackdrops
											? 'w-1/6'
											: 'w-1/6'">
										<div class="flex h-auto w-full overflow-clip transition-transform duration-500 rounded-[3px] bg-auto-11/30"
											:class="showBackdrops
												? `aspect-backdrop ${index != 0 && index % 6 == 4
													? 'bg-auto-11/0'
													: 'bg-auto-11/30'
												}`
												: `aspect-poster ${index != 0 && index % 6 == 5
													? 'bg-auto-11/0'
													: 'bg-auto-11/30'
												}`">
										</div>
										<div class="absolute left-0 transition-transform duration-500 w-[2.5px] h-2.5 top-1.5 rounded-tr-[2.5px] rounded-br-[2.5px]"
											:style="`background-color:${item}`" :class="showBackdrops
												? `${index != 0 && (index % 6 == 4 || index % 6 == 5)
													? 'opacity-0'
													: 'opacity-100'
												}`
												: `${index != 0 && (index % 6 == 5 || index % 6 == 6)
													? 'opacity-0'
													: 'opacity-100'
												}`">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
