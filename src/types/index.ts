import type { MoooomIcons } from '@Icons/icons.ts';

export interface ModalData<T> {
	modalName: string;
	modalTitle: string;
	modalTitleArgs?: Record<string, unknown>;
	modalProps: T;
}

export interface IMenuItem {
	icon: keyof typeof MoooomIcons;
	onclick: () => void;
	title: string;
	privileged?: boolean;
}
