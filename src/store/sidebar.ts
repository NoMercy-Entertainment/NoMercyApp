import {computed, ref} from 'vue';

const sidebar = ref<'open' | 'closed' | 'hidden'>('hidden');

export const sidebarState = computed(() => sidebar.value);

export const toggleSidebar = () => {
	sidebar.value = sidebar.value === 'open' ? 'closed' : 'open';
};

export const hideSidebar = () => {
	sidebar.value = 'hidden';
}

export const openSidebar = () => {
	sidebar.value = 'open';
}

export const closeSidebar = () => {
	sidebar.value = 'closed';
}

export const isSidebarOpen = () => sidebar.value === 'open';

export const isSidebarClosed = () => sidebar.value === 'closed';

export const isSidebarHidden = () => sidebar.value === 'hidden';

export default sidebar;
