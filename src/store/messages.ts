import { computed, ref } from 'vue';
import type { Message } from '@/types/auth';
import apiClient from '@/lib/clients/apiClient';

const messages = ref<Message[]>([]);
const messagesState = computed(() => messages.value);

export function setMessages(data: Message[]) {
	messages.value = data;
}

export function addMessage(message: Message) {
	messages.value.push(message);
}

export function removeMessage(message: Message) {
	const index = messages.value.indexOf(message);
	if (index !== -1)
		messages.value.splice(index, 1);

	apiClient().delete(`/messages/${message.id}`).catch(console.error);
}
export function markMessageRead(message: Message) {
	message.read = true;

	apiClient()
		.patch(`/messages/${message.id}`, { read: true })
		.catch(console.error);
}
export function markMessageUnread(message: Message) {
	message.read = false;

	apiClient()
		.patch(`/messages/${message.id}`, { read: false })
		.catch(console.error);
}
export function markAllMessagesRead() {
	messages.value.forEach(message => (message.read = true));

	apiClient().patch(`/messages`, { read: true }).catch(console.error);
}
export function clearMessages() {
	messages.value = [];

	apiClient().delete(`/messages`).catch(console.error);
}

export default messagesState;
