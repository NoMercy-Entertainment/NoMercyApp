import {computed, ref} from 'vue';
import {Message} from '@/types/auth';
import apiClient from "@/lib/clients/apiClient";

const messages = ref<Message[]>([]);
const messagesState = computed(() => messages.value);

export const setMessages = (data: Message[]) => {
	messages.value = data;
};

export const addMessage = (message: Message) => {
	messages.value.push(message);
};

export const removeMessage = (message: Message) => {
	const index = messages.value.indexOf(message);
	if (index !== -1) messages.value.splice(index, 1);

	apiClient()
		.delete(`/messages/${message.id}`)
		.catch(console.error);
};
export const markMessageRead = (message: Message) => {
	message.read = true;

	apiClient()
		.patch(`/messages/${message.id}`, {read: true})
		.catch(console.error);
}
export const markMessageUnread = (message: Message) => {
	message.read = false;

	apiClient()
		.patch(`/messages/${message.id}`, {read: false})
		.catch(console.error);
}
export const markAllMessagesRead = () => {
	messages.value.forEach(message => message.read = true);

	apiClient()
		.patch(`/messages`, {read: true})
		.catch(console.error);
}
export const clearMessages = () => {
	messages.value = [];

	apiClient()
		.delete(`/messages`)
		.catch(console.error);
}

export default messagesState;
