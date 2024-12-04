<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {twMerge} from "tailwind-merge";
import {useDebounce} from '@vueuse/core';

import {isMobile} from "@/config/global";
import {parseYear} from "@/lib/dateTime";

import {Movie, Tv, Person} from '@/types/api/base/info';
import CosmosBg2 from '@/components/Images/CosmosBg2.vue';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';


defineProps({
    greeting: {
        type: Boolean,
        required: false,
        default: true,
    },
		className: {
				type: String,
				required: false,
				default: '',
		},
});

const greetingValue = computed(() => {
    const now = new Date().getHours();

    switch (true) {
        case (now >= 6 && now < 12):
            return 'Morning!';
        case (now >= 12 && now < 16):
            return 'Afternoon!';
        case (now >= 16 && now < 20):
            return 'Evening!';
        case (now >= 20 || now < 6):
            return 'Night!';
    }
});

const hasMoreResults = ref(false);
const searchValue = ref('');
const debouncedSearchValue = useDebounce(searchValue, 500);

const results = ref<Array<Movie| Tv| Person & any>>([]);
const page = ref(1);

watch(debouncedSearchValue, (value) => {
	page.value = 1; // Reset page number on new search
	const api_key = 'ed3bf860adef0537783e4abee86d65af';
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&language=en-US&query=${value}&page=${page.value}&include_adult=false`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			results.value = data.results;
      hasMoreResults.value = data.total_pages > 1;
		});
});

const fetchNextPage = () => {
	page.value += 1;
	const api_key = 'ed3bf860adef0537783e4abee86d65af';
	const url = `https://api.themoviedb.org/3/search/multi?api_key=${api_key}&language=en-US&query=${debouncedSearchValue.value}&page=${page.value}&include_adult=false`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			results.value = [...results.value, ...data.results];
      if (data.results.length === 0) {
        hasMoreResults.value = false;
      } else {
        hasMoreResults.value = data.total_pages > page.value;
      }
		});
}

const loadMore = ref(null);

</script>

<template>

    <div :class="twMerge('h-[360px] min-h-[260px] w-available relative flex flex-col items-center gap-12 m-3 overflow-clip rounded-2xl', className)" v-if="!isMobile">
        <CosmosBg2 />
        <div v-if="greeting" class="relative z-10 mt-16 flex flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3">
            <p class="flex-shrink-0 flex-grow-0 text-7xl font-black">
                {{ $t('Good') }}
                <span class="" id="greeting">
                    {{ greetingValue }}
                </span>
            </p>
            <p class="flex-shrink-0 flex-grow-0 text-3xl font-medium">
                {{ $t('Welcome to your one-stop search for all your streaming needs') }}.
            </p>
        </div>
        <div class="relative my-auto flex w-full flex-shrink-0 flex-grow-0 items-center justify-start gap-5 self-center overflow-hidden rounded-2xl border-2 bg-black border-auto-10 sm:w-5/6">
            <label class="flex w-available">
                <input id="search" placeholder="Search for a Movie, TV Show or Actor..." class="w-full flex-shrink-0 border-transparent bg-transparent px-6 py-4 text-2xl shadow-transparent flex-grow-1 focus:border-transparent focus:shadow-transparent focus:outline-none active:border-transparent [box-shadow:none] focus:[box-shadow:none]" v-model="searchValue" name="search" type="search" />
            </label>
        </div>
    </div>

	<div v-else
		:class="twMerge(
        'flex flex-grow flex-col items-center justify-start gap-12 self-stretch overflow-hidden px-4 py-8 rounded-2xl',
        results.length > 0 ? ' !min-h-20' : '',
        className)"
	>
		<CosmosBg2 />
		<div v-if="greeting"
			class="relative flex w-full flex-shrink-0 flex-grow-0 flex-col items-center justify-end gap-3"
		>
			<p class="flex-grow-0 flex-shrink-0 text-5xl font-black text-left  text-slate-light-11 dark:text-slate-dark-11">
				{{ $t('Good') }}
				<span class="" id="greeting">
						{{ greetingValue }}
				</span>
			</p>
			<p class="flex-grow-0 flex-shrink-0 w-[333px] text-2xl text-center text-[#eff7ff]/[0.62]">
				{{ $t('Welcome to your one-stop search for all your streaming needs') }}.
			</p>
		</div>
		<div class="relative flex w-full flex-shrink-0 flex-grow-0 items-center justify-start overflow-hidden rounded-2xl border-2 bg-black transition-all duration-300 gap-5r border-auto-10 my-[60%] sm:w-5/6 has-[input:focus]:-mt-4 has-[input:focus]:-mb-0"
         :class="results.length > 0 ? '-mt-4' : 'my-[60%]'"
    >
			<label class="flex w-available">
				<input id="search" placeholder="Search for a Movie, TV Show or Actor..." class="w-full flex-shrink-0 border-transparent bg-transparent px-6 py-4 text-2xl shadow-transparent flex-grow-1 focus:border-transparent focus:shadow-transparent focus:outline-none active:border-transparent [box-shadow:none] focus:[box-shadow:none]" v-model="searchValue" name="search" type="search">
			</label>
		</div>
	</div>

	<div class="flex w-full flex-col gap-4 p-1 h-available sm:p-4"
       :class="results.length > 0 ? 'mt-4' : ''">
			<div class="flex flex-wrap gap-2 pb-3 sm:gap-4">
				<template v-for="item in results ?? []" :key="item.id">

					<RouterLink
            :to="`/search/${item?.media_type ?? 'unknown'}/${item?.id ?? 'unknown'}`"
						class="relative flex w-full gap-4 overflow-hidden rounded-lg bg-zinc-900 p-2 sm:w-[32.67%]">
						<img
							v-if="item?.backdrop_path"
							:src="'https://image.tmdb.org/t/p/original' + item?.backdrop_path"
							:alt="item?.title"
							class="absolute inset-0 h-full w-full object-cover"/>

						<div class="absolute inset-0 z-10 h-full w-full bg-gradient-to-r from-black via-black/75 to-black/40 from-25%"></div>

						<div class="relative z-20 h-auto w-1/4 overflow-clip rounded-sm aspect-poster bg-auto-1 sm:w-1/4">
							<img
								v-if="item?.poster_path || item?.profile_path"
								:src="'https://image.tmdb.org/t/p/original' + (item?.poster_path ?? item?.profile_path)"
								:alt="item?.title"
								class="absolute inset-0 h-auto w-full object-cover"/>
							<AppLogoSquare v-else class="absolute inset-0 top-2 z-20 m-auto h-16 w-16"/>
						</div>

						<div
							class="relative z-20 flex h-full w-px flex-1 flex-col items-start justify-start gap-1"
						>
							<p
								class="flex-shrink-0 flex-grow-0 self-stretch text-left text-xl font-semibold line-clamp-1"
							>
								{{ item?.name || item?.title }}
							</p>
							<div
								class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 self-stretch"
							>
								<p class="flex flex-shrink-0 flex-grow-0 items-center gap-2 text-right text-base">
									<MoooomIcon v-if="item?.media_type === 'tv'" icon="monitor" className="h-5 w-5 sm:h-4 sm:w-4" />
									<MoooomIcon v-else-if="item?.media_type === 'movie'" icon="film" className="h-5 w-5 sm:h-4 sm:w-4" />
									<MoooomIcon v-else-if="item?.media_type === 'person'" icon="user" className="h-5 w-5 sm:h-4 sm:w-4" />
									<span  v-if="item?.release_date || item?.first_air_date" class="sm:text-2xs">
										({{ parseYear(item?.release_date ?? item?.first_air_date) }})
									</span>
								</p>
							</div>
							<p class="text-sm line-clamp-[4] sm:text-2xs sm:line-clamp-4">
								{{ item?.overview }}
							</p>
						</div>
					</RouterLink>

				</template>
				<div class="z-50 mt-4 flex justify-center" ref="loadMore" v-if="hasMoreResults">
					<button @click="fetchNextPage" class="h-12 rounded bg-blue-500 px-4 py-2 text-white">
						{{ $t('Load more') }}
					</button>
				</div>
			</div>
		</div>
</template>
