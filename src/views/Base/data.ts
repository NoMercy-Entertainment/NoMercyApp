import type { ContinueWatching, HomeItem, HomeResponse } from '@/types/api/base/home';

import useServerClient from '@/lib/clients/useServerClient';
import useInfiniteServerClient from '@/lib/clients/useInfiniteServerClient';
import { shuffle } from '@/lib/stringArray';

export const useCollectionData = <T>(props?: any) => useServerClient<T>({
	limit: 10,
	keepForever: true,
	...props,
});

export const useHomeData = () => useInfiniteServerClient<{ data: HomeResponse[] }>({
	path: '/',
	queryKey: ['home'],
	limit: 3,
});

export const useContinueWatchingData = () => useServerClient<ContinueWatching[]>({
	path: 'userdata/continue',
	queryKey: ['continue'],
	refetchInterval: 1000 * 60 * 5,
});

export const getHomeItem = (data: ReturnType<typeof useHomeData>['data']['value']): HomeItem | undefined => {
	if (data?.pages) {
		const page = shuffle([...data.pages]);
		const items = shuffle([...page[0]?.data ?? []])
			.filter(item => item.items.length > 0);
		const item = shuffle([...items[0]?.items ?? []]
			.filter(item => item && item?.backdrop));

		return item[0];
	}
};
