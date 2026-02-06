import { computed, ref } from 'vue';
import type { Message } from '@/types/auth';
import apiClient from '@/lib/clients/apiClient';

const notifications = ref<Message[]>([]);
const notificationsState = computed(() => notifications.value);

export function setNotifications(data: Message[]) {
	// Preserve client-side notifications (SW/version updates) that the server doesn't know about
	const localNotifications = notifications.value.filter(m =>
		m.from === 'system' && (m.id.startsWith('sw-update') || m.id.startsWith('version-update'))
	);
	notifications.value = [...data, ...localNotifications];
}

export function addNotification(message: Message) {
	if (notifications.value.find(m => m.id === message.id))
		return;
	notifications.value.push(message);
}

export function removeNotification(message: Message) {
	const index = notifications.value.indexOf(message);
	if (index !== -1)
		notifications.value = notifications.value.toSpliced(index, 1);

	// Don't send API delete for client-side notifications
	if (message.from === 'system') return;

	apiClient()
		.delete(`/notifications/${message.id}`)
		.catch(console.error);
}

export function clearNotifications() {
	notifications.value = [];

	apiClient()
		.delete(`/notifications`)
		.catch(console.error);
}

export default notificationsState;
