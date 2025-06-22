import { computed, ref } from 'vue';

const mo = ref(false);
export const menuOpen = computed(() => mo.value);

export function openMenu() {
	mo.value = !mo.value;
}
export function closeMenu() {
	mo.value = false;
}
export async function toggleMenu() {
	if (mo.value) {
		closeMenu();
	}
	else {
		openMenu();
	}
}
