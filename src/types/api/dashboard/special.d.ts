/**
 * A single item in a special's playlist.
 * Returned by GET /dashboard/specials/:id/items
 */
export interface SpecialItem {
	id: string;
	order: number;
	media_type: 'movie' | 'episode';
	media_id: number;
	title: string;
	overview: string | null;
	still: string | null;
	poster: string | null;
	year: number | null;
	show_title: string | null;
	season_number: number | null;
	episode_number: number | null;
	available: boolean;
}

/**
 * A search result from GET /dashboard/specials/search?q=
 */
export interface SpecialSearchResult {
	id: number;
	media_type: 'movie' | 'episode';
	title: string;
	overview: string | null;
	still: string | null;
	poster: string | null;
	year: number | null;
	show_title: string | null;
	season_number: number | null;
	episode_number: number | null;
	available: boolean;
}
