import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

const konamiEnabled = useLocalStorage('konami_active', false);
export const konamiEnabledState = computed(() => konamiEnabled.value);

export default konamiEnabled;
