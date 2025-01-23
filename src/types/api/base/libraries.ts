import { LibraryResponse } from '@/types/api/base/library';

export interface MobileLibrariesResponseItem {
	title: string;
	moreLink: string;
	items: LibraryResponse[];
}
