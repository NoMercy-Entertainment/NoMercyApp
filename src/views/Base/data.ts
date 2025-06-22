import type {
	ContinueWatching,
	HomeItem,
	HomeResponse,
} from '@/types/api/base/home';

import { shuffle } from '@/lib/stringArray';
import type { InfiniteData } from '@tanstack/vue-query';
import type { MobileLibrariesResponseItem } from '@/types/api/base/libraries';
import type { LibraryResponse } from '@/types/api/base/library';
import useServerClient from '@/lib/clients/useServerClient';

export function useContinueWatchingData() {
	return useServerClient<ContinueWatching[]>({
		path: 'userdata/continue',
		queryKey: ['continue'],
		refetchInterval: 1000 * 60 * 5,
	});
}

export function getHomeItem(data: InfiniteData<{ data: HomeResponse[] }, unknown>): HomeItem | undefined {
	if (data?.pages) {
		const page = shuffle([...data.pages]);
		const items = shuffle([...(page[0]?.data ?? [])]).filter(
			item => item.items.length > 0,
		);
		const item = shuffle(
			[...(items[0]?.items ?? [])].filter(item => item && item?.backdrop),
		);

		return item[0];
	}
}

export function getHomeItem2(data: MobileLibrariesResponseItem[] | undefined): LibraryResponse | undefined {
	if (data) {
		const items = shuffle([...data]).filter(item => item.items.length > 0);
		const item = shuffle(
			[...(items[0]?.items ?? [])].filter(item => item && item?.backdrop),
		);

		return item[0];
	}
}
