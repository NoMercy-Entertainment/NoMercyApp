import { computed } from 'vue';
import { isMobile, isTv } from '@/config/global';

export function useResponsiveComponent() {
  const currentLayout = computed(() => {
    if (isTv.value) return 'tv';
    if (isMobile.value) return 'mobile';
    return 'desktop';
  });

  const isDesktop = computed(() => currentLayout.value === 'desktop');
  const isMobileView = computed(() => currentLayout.value === 'mobile');
  const isTvView = computed(() => currentLayout.value === 'tv');

  return {
    currentLayout,
    isDesktop,
    isMobileView,
    isTvView
  };
}

export function createResponsiveComponent<T = any>(components: {
  mobile?: T;
  desktop?: T;
  tv?: T;
  default?: T;
}) {
  return computed(() => {
    const { currentLayout } = useResponsiveComponent();
    
    switch (currentLayout.value) {
      case 'tv':
        return components.tv || components.default;
      case 'mobile':
        return components.mobile || components.default;
      case 'desktop':
      default:
        return components.desktop || components.default;
    }
  });
}
