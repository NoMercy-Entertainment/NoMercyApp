export async function handlePromises<CB extends Function>(promises: Array<() => Promise<unknown>>, cb?: CB): Promise<void> {
	for (const promise of promises) {
		await promise().catch((error) => {
			throw new Error(error);
		});
	}

	cb?.();
}
