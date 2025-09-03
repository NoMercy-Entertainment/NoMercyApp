import { computed, ref } from 'vue';
import type { Message } from '@/types/auth';
import apiClient from '@/lib/clients/apiClient';

const notifications = ref<Message[]>([]);
const notificationsState = computed(() => notifications.value);

export function setNotifications(data: Message[]) {
	notifications.value = data;
}

export function addNotification(message: Message) {
	if (notifications.value.find(m => m.id === message.id))
		return;
	notifications.value.push(message);
}

export function removeNotification(message: Message) {
	const index = notifications.value.indexOf(message);
	if (index !== -1)
		notifications.value.splice(index, 1);

	apiClient().delete(`/notifications/${message.id}`).catch(console.error);
}

export function clearNotifications() {
	notifications.value = [];

	apiClient().delete(`/notifications`).catch(console.error);
}

export default notificationsState;
