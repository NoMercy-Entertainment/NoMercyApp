import {computed, ref} from 'vue';
import {Message} from '@/types/auth';
import apiClient from "@/lib/clients/apiClient";

const notifications = ref<Message[]>([]);
const notificationsState = computed(() => notifications.value);

export const setNotifications = (data: Message[]) => {
	notifications.value = data;
};

export const addNotification = (message: Message) => {
	notifications.value.push(message);
};

export const removeNotification = (message: Message) => {
	const index = notifications.value.indexOf(message);
	if (index !== -1) notifications.value.splice(index, 1);

	apiClient()
		.delete(`/notifications/${message.id}`)
		.catch(console.error);
};

export const clearNotifications = () => {
	notifications.value = [];

	apiClient()
		.delete(`/notifications`)
		.catch(console.error);
}

export default notificationsState;
