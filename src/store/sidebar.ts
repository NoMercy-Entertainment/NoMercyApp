import {computed, ref} from 'vue';

const sb = ref<'open' | 'closed' | 'hidden'>('hidden');

export const sidebar = computed(() => sb.value);

export const setSidebar = (state: 'open' | 'closed' | 'hidden') => {
	sb.value = state;
}

export const toggleSidebar = () => {
	sb.value = sb.value === 'open' ? 'closed' : 'open';
};

export const hideSidebar = () => {
	sb.value = 'hidden';
}

export const openSidebar = () => {
	sb.value = 'open';
}

export const closeSidebar = () => {
	sb.value = 'closed';
}

export const isSidebarOpen = () => sb.value === 'open';

export const isSidebarClosed = () => sb.value === 'closed';

export const isSidebarHidden = () => sb.value === 'hidden';

export default sidebar;
