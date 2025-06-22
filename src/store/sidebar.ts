import { computed, ref } from 'vue';

const sb = ref<'open' | 'closed' | 'hidden'>('hidden');

export const sidebar = computed(() => sb.value);

export function setSidebar(state: 'open' | 'closed' | 'hidden') {
	sb.value = state;
}

export function toggleSidebar() {
	sb.value = sb.value === 'open' ? 'closed' : 'open';
}

export function hideSidebar() {
	sb.value = 'hidden';
}

export function openSidebar() {
	sb.value = 'open';
}

export function closeSidebar() {
	sb.value = 'closed';
}

export const isSidebarOpen = () => sb.value === 'open';

export const isSidebarClosed = () => sb.value === 'closed';

export const isSidebarHidden = () => sb.value === 'hidden';

export default sidebar;
