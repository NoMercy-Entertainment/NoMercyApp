import { useRoute } from 'vue-router';
import { useIsMutating, useMutation, useQuery } from '@tanstack/vue-query';
import serverClient from '@/lib/clients/serverClient';
import router from '@/router';
import { Ref, toRaw } from 'vue';

export interface Component<T> {
	id: string;
	component: string;
	props: Props<T>;
	items: T[];
	update: {
		when: string;
		link: string;
		body: {
			replace_id: string;
			[key: string]: string;
		}
	};
}

export interface Props<T> {
	id: null;
	title: string;
	moreLink: null;
	children: T[];
	items: T[];
	data: T;
}

/**
 * Returns the queryKey for the query based on the url of the page.
 */
export const queryKey = (path?: string): string[] => {
	const route = useRoute();
	const queryKey: string[] = [];

	(path ?? route.path)
		?.split('/')
		.slice(1)
		.forEach(p => {
			if (p.includes('?')) {
				queryKey.push(p.split('?')[0]);
				queryKey.push(p.split('?')[1].split('=')[1]);
			} else {
				queryKey.push(p);
			}
		});

	return queryKey;
};

export const getMutating = ({ queryKey: key, path }: { queryKey?: string[], path?: string } = { queryKey: undefined, path: undefined }) => useIsMutating({
	mutationKey: key ?? queryKey(path),
});

export const getQuery = <T>({ queryKey: key, path }: { queryKey?: string[], path?: string } = { queryKey: undefined, path: undefined }) => useQuery<Component<T>[]>({
	queryKey: key ?? queryKey(path),
	queryFn: async () => {
		if (!navigator.onLine) {
			return [];
		}
		return serverClient()
			.get<{ data: Component<T>[] }>(path ?? router.currentRoute.value.path)
			.then(({ data }) => {
				return data.data;
			});
	},
});

export const getMutation = <T>({ queryKey: key, path, homeData }: { queryKey?: string[], path?: string, homeData: Ref<Component<T>[]> | Ref<undefined, undefined> }) => useMutation({
	mutationKey: key ?? queryKey(path),
	mutationFn: async (mutations: Component<T>[]) => {
		if (!navigator.onLine) {
			return homeData.value;
		}
		const data = [...homeData.value?.map(d => {
			return structuredClone(toRaw(d));
		}) ?? []];

		for (const item of mutations) {
			await serverClient()
				.post<{ data: Component<T>[] }>(path ?? item.update.link, {
					replace_id: item.update.body.replace_id
				})
				.then((response) => {
					for (let i = 0; i < data.length; i++) {
						if (data[i].id == item.update?.body?.replace_id) {
							data[i] = response.data?.data[0];
						}
					}
				});
		}

		return data;
	},
});
