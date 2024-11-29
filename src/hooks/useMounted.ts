import {onBeforeUnmount, onMounted} from 'vue';

const useMounted = (onMount: Function, onUnmount: Function) => {
	onMounted(onMount);
	onBeforeUnmount(onUnmount);
}

export default useMounted;
