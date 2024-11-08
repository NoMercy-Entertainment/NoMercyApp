import {computed, ref} from 'vue';
import {Message} from '@/types/auth';

const messages = ref<Message[]>([]);
const messagesState = computed(() => messages.value);

export const addMessage = (message: Message) => {
	messages.value.push(message);
};
export const removeMessage = (message: Message) => {
	const index = messages.value.indexOf(message);
	if (index !== -1) messages.value.splice(index, 1);
};
export const markMessageRead = (message: Message) => {
	message.read = true;
}
export const markMessageUnread = (message: Message) => {
	message.read = false;
}
export const markAllMessagesRead = () => {
	messages.value.forEach(message => message.read = true);
}
export const clearMessages = () => {
	messages.value = [];
}

export default messagesState;
