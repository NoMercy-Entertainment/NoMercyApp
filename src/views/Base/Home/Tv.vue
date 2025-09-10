<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';

// import type {HomeDataItem} from '@/types/api/music';
// import type {Component} from '@/lib/routerHelper';
import useServerClient from '@/lib/clients/useServerClient';
import type { ContinueWatching, HomeItem, HomeResponse } from '@/types/api/base/home';
import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import TvCarousel2 from '@/views/Base/Home/components/TvCarousel2.vue';
import TvHeader from '@/views/Base/Home/components/TvHeader.vue';

const {
	data: home,
	fetchNextPage,
	hasNextPage,
} = useInfiniteServerClient<{ data: HomeResponse[] }>({
	path: '/',
	queryKey: ['home'],
});

watch(home, () => {
	if (hasNextPage) {
		fetchNextPage();
	}
});

const { data: continueWatching } = useServerClient<ContinueWatching[]>({
	path: 'userdata/continue',
	queryKey: ['continue'],
	refetchInterval: 1000 * 60 * 5,
});

const selected = ref<ContinueWatching | HomeItem | null>();
watch(continueWatching, (value) => {
	if (!value)
		return;
	selected.value = value?.filter(item => item.id)?.at(0);
});

onMounted(() => {
	selected.value = continueWatching.value?.filter(item => item.id)?.at(0);

	setTimeout(() => {
		const target = document.querySelector(
			`[data-card="${selected.value?.id}"]`,
		) as HTMLAnchorElement;
		if (target) {
			target.focus();
		}
	}, 1000);
});

onIonViewDidEnter(() => {
	selected.value = continueWatching.value?.filter(item => item.id)?.at(0);

	setTimeout(() => {
		const target = document.querySelector(
			`[data-card="${selected.value?.id}"]`,
		) as HTMLAnchorElement;
		if (target) {
			target.focus();
		}
	}, 1000);
});

const scrollContainer = ref<HTMLDivElement>();
const locked = ref(false);
const timeout = ref<NodeJS.Timeout>();
const lastFocused = ref<HTMLAnchorElement>();

function handleFocus(event: FocusEvent, item?: ContinueWatching | HomeItem) {
	const target = event.target as HTMLAnchorElement;

	if (target?.nodeName === 'DIV') {
		(lastFocused.value ?? target.querySelector('a'))?.focus();
		return;
	}

	if (item) {
		selected.value = item;
		lastFocused.value = target;
	}
}

function handleDown(event: KeyboardEvent) {
	if (locked.value) {
		event.preventDefault();
		return;
	}

	clearTimeout(timeout.value);
	locked.value = true;

	const target = event.target as HTMLDivElement;
	const targetIndex = target.getAttribute('data-index');
	const closest = target.closest('[data-row]');

	const up = closest?.previousElementSibling as HTMLDivElement;
	const upButton = up?.querySelector(
		`a[data-index="${targetIndex}"]`,
	) as HTMLAnchorElement;

	const down = closest?.nextElementSibling as HTMLDivElement;
	const downButton = down?.querySelector(
		`a[data-index="${targetIndex}"]`,
	) as HTMLAnchorElement;

	const leftButton = target.previousElementSibling as HTMLDivElement;
	const rightButton = target.nextElementSibling as HTMLDivElement;

	if (upButton && event.key === 'ArrowUp') {
		event.preventDefault();
		upButton.focus();
	}
	else if (downButton && event.key === 'ArrowDown') {
		event.preventDefault();
		downButton.focus();
	}
	else if (leftButton && event.key === 'ArrowLeft') {
		event.preventDefault();
		leftButton.focus();
	}
	else if (rightButton && event.key === 'ArrowRight') {
		event.preventDefault();
		rightButton.focus();
	}
	else if (up && event.key === 'ArrowUp') {
		const upButton = Array.from(
			up?.querySelectorAll<HTMLAnchorElement>('a'),
		)?.at(-1);
		if (upButton) {
			upButton.focus();
		}
	}
	else if (down && event.key === 'ArrowDown') {
		const downButton = Array.from(
			down?.querySelectorAll<HTMLAnchorElement>('a'),
		)?.at(-1);
		if (downButton) {
			downButton.focus();
		}
	}
}

function handleUp() {
	timeout.value = setTimeout(() => {
		locked.value = false;
	}, 150);
}
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div class="w-screen h-screen relative overflow-hidden bg-[#131314]">
				<TvHeader v-if="selected" :selected="selected" />

				<div
					ref="scrollContainer"
					class="flex flex-col justify-start items-start w-available -mx-3 px-3 absolute left-14 right-14 top-[264px] h-available overflow-auto scroll-smooth gap-4 flex-1 pb-16"
					tabindex="0"
					@focus="handleFocus($event)"
				>
					<TvCarousel2
						:data="continueWatching?.filter((i) => !!i.id) ?? []"
						:handle-down="handleDown"
						:handle-focus="handleFocus"
						:handle-up="handleUp"
						title="Continue watching"
					/>

					<template v-if="home?.pages">
						<template v-for="(group, index) in home.pages" :key="index">
							<template v-if="group">
								<template
									v-for="(data, index2) in group?.data ?? []"
									:key="index2"
								>
									<TvCarousel2
										:data="data.items"
										:handle-down="handleDown"
										:handle-focus="handleFocus"
										:handle-up="handleUp"
										:title="data.title"
										suffix="/watch"
									/>
								</template>
							</template>
						</template>
					</template>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>
