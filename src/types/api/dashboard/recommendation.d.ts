import type { ColorPalettes } from '../shared';
import type { Genre } from '../base/genre';
import type { Rating } from '../base/collection';

export interface RecommendationSource {
	id: number;
	title: string;
	titleSort: string;
	poster: string | null;
	backdrop: string | null;
	logo: string | null;
	overview: string;
	year: number;
	color_palette: ColorPalettes;
	link: string;
	media_type: string;
	have_items: number;
	number_of_items: number;
	duration: number;
	tags: string[];
}

export interface RecommendationDetailResponse {
	id: string;
	title: string;
	overview: string | null;
	poster: string | null;
	backdrop: string | null;
	logo: string | null;
	color_palette: ColorPalettes;
	media_type: string;
	year?: number;
	voteAverage?: number | null;
	genres?: Genre[];
	content_ratings?: Rating[];
	link?: string;
	external_ids?: {
		imdb_id: string | null;
		tvdb_id: number | null;
	};
	because_you_have: RecommendationSource[];
}
