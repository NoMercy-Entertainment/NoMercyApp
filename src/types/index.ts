export interface ModalData<T> {
	modalName: string;
	modalTitle: string;
	modalTitleArgs?: Record<string, unknown>;
	modalProps: T;
}
