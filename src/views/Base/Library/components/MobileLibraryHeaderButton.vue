<script setup lang="ts">
import {computed, onMounted, type PropType, ref} from 'vue';
import {MoooomIcons} from '@Icons/icons';
import router from '@/router';

const props = defineProps({
	url:{
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	icon: {
		type: String as PropType<keyof typeof MoooomIcons>,
		required: false,
	}
});

const link = ref<{ $el: HTMLElement }>();

const isCurrentRoute = ref(props.url === location.hash.replace('#', ''));

router.afterEach((to) => {
  center();
    isCurrentRoute.value = to.fullPath == props.url;

  setTimeout(() => {
    center();
    isCurrentRoute.value = to.fullPath == props.url;
  }, 100);
});

const center = () => {
  link.value?.$el?.scrollIntoView({inline: 'center', block: 'center', behavior: 'smooth'});
};

const classes = computed(() =>
	(isCurrentRoute.value
		? 'flex justify-center items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 px-3.5 py-0.5 rounded-md bg-focus/10 border-focus/4 text-auto-12 shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/60%)] hover:!shadow-[0_1px_0_0_rgba(255,255,255,0.20)_inset,0_-1px_0_0_rgba(var(--color-slate-1)/30%)_inset,0_22px_30px_-4px_rgba(var(--color-slate-1)/60%)]'
		: 'flex justify-center items-center flex-grow-0 flex-shrink-0 relative overflow-hidden gap-2 px-3.5 py-0.5 rounded-md'));

const styles = computed(() =>
	(isCurrentRoute.value
		? {
			background: 'radial-gradient(50% 50% at 50% 100%, rgba(70, 70, 70, 0.09) 0%, rgba(70, 70, 70, 0.06) 40%, rgba(70, 70, 70, 0.00) 100%), linear-gradient(180deg, rgba(70, 70, 70, 0.00) 0%, rgba(70, 70, 70, 0.12) 100%), rgba(var(--color-focus) / 30%)',
			backgroundBlendMode: 'normal, overlay, normal',
		}
		: {

		}));
</script>

<template>
		<RouterLink :to="url"
					ref="link"
					:aria-label="title"
					:class="classes"
					:styles="styles"
                @click="center"
		>
			<p class="flex-shrink-0 flex-grow-0 text-left text-base font-semibold">
				{{ title }}
			</p>
		</RouterLink>
</template>
