// eslint-disable-next-line @typescript-eslint/ban-types
export const handlePromises = async <CB extends Function>(promises: Array<() => Promise<unknown>>, cb: CB): Promise<void> => {
	for (const promise of promises) {
		await promise()
			.catch((error) => {
				throw new Error(error);
			});
	}

	cb();
};
