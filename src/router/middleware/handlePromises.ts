export interface MiddlewareConfig {
	/** Middleware functions that must run sequentially before parallel ones */
	sequential?: Array<() => Promise<unknown>>;
	/** Middleware functions that can run in parallel */
	parallel?: Array<() => Promise<unknown>>;
	/** Middleware functions that can be deferred until after render */
	deferred?: Array<() => Promise<unknown>>;
}

export async function handlePromises<CB extends Function>(
	config: MiddlewareConfig | Array<() => Promise<unknown>>,
	cb?: CB,
): Promise<void> {
	// Support legacy array format
	if (Array.isArray(config)) {
		for (const promise of config) {
			await promise().catch((error) => {
				throw new Error(error);
			});
		}
		cb?.();
		return;
	}

	// Run sequential middleware first
	if (config.sequential) {
		for (const promise of config.sequential) {
			await promise().catch((error) => {
				throw new Error(error);
			});
		}
	}

	// Run parallel middleware concurrently
	if (config.parallel) {
		await Promise.all(
			config.parallel.map(promise =>
				promise().catch((error) => {
					throw new Error(error);
				}),
			),
		);
	}

	cb?.();

	// Run deferred middleware after callback (non-blocking)
	if (config.deferred) {
		queueMicrotask(() => {
			Promise.all(config.deferred!.map(promise => promise().catch(console.error)));
		});
	}
}
