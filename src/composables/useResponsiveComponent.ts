import { computed } from 'vue';
import { isMobile } from '@/config/global';

export function useResponsiveComponent() {
	const currentLayout = computed(() => {
		if (isMobile.value)
			return 'mobile';
		return 'desktop';
	});

	const isDesktop = computed(() => currentLayout.value === 'desktop');
	const isMobileView = computed(() => currentLayout.value === 'mobile');

	return {
		currentLayout,
		isDesktop,
		isMobileView,
	};
}

export function createResponsiveComponent<T = any>(components: {
	mobile?: T;
	desktop?: T;
	default?: T;
}) {
	return computed(() => {
		const { currentLayout } = useResponsiveComponent();

		switch (currentLayout.value) {
			case 'mobile':
				return components.mobile || components.default;
			case 'desktop':
			default:
				return components.desktop || components.default;
		}
	});
}
