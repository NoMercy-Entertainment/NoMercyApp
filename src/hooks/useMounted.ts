import { onUnmounted, onMounted, ref, toRaw } from 'vue';

const keepAlive = ref<{
	mount: () => void;
	unmount: () => void
	timeout: NodeJS.Timeout | null;
}[]>([]);

const useMounted = (onMount: () => void, onUnmount: () => void, duration = 0) => {
	onMounted(() => {
		const last = keepAlive.value
			.find((fn) => fn.mount == onMount);

		if (last?.timeout) {
			clearTimeout(last.timeout);
			last.timeout = null;
		}

		if (last?.mount == onMount) return;
		onMount();

		keepAlive.value = [
			...toRaw(keepAlive.value),
			{
				mount: onMount,
				unmount: onUnmount,
				timeout: null
			}
		];
	});

	onUnmounted(() => {
		if (keepAlive.value.length === 0) {
			onUnmount();
			return;
		}

		const last = keepAlive.value
			.find((fn) => fn.mount == onMount);

		if (!last) {
			onUnmount();
			return;
		}

		last.timeout = setTimeout(() => {
			onUnmount();

			keepAlive.value = keepAlive.value
				.filter((fn) => fn.mount != onMount)
				.map((fn) => toRaw(fn));

		}, duration * 1000);
	});
}

export default useMounted;
