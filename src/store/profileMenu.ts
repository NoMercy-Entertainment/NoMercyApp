import {computed, ref} from 'vue';

const mo = ref(false);
export const menuOpen = computed(() => mo.value);

export const openMenu = () => {
	mo.value = !mo.value;
};
export const closeMenu = () => {
	mo.value = false;
};
export const toggleMenu = async () => {
	if (mo.value) {
		closeMenu();
	} else {
		openMenu();
	}
};
