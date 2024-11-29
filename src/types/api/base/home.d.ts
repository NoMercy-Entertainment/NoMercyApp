import type {ColorPalettes} from '../shared.d.ts';
import {Rating} from '@/types/api/base/collection';
import {ExtendedVideo} from '@/types/api/base/info';

export interface HomeResponse {
	id: number;
	title: string;
	moreLink: string;
	items: HomeItem[];
}

export interface HomeItem {
	id: number;
	backdrop: null | string;
	overview: string;
	poster: string;
	duration: number;
	watched: boolean;
	title: string;
	name?: string;
	titleSort: string;
	type: string;
	year: number;
	media_type: string;
	content_ratings: Rating[];
	tags: string[];
	color_palette: ColorPalettes;
	logo?: string;
	favorite?: boolean;
	number_of_items: number;
	have_items: number;
	videos: ExtendedVideo[];
	link: string;
}

export interface ContinueWatching {
	id: number;
	media_type: string;
	poster: string;
	backdrop: string;
	title: string;
	favorite: boolean;
	name?: string;
	titleSort: string;
	type: string;
	color_palette?: ColorPalettes;
	number_of_items: number;
	have_items: number;
	year: number;
	overview: string;
	logo: string;
	content_ratings: Rating[];
	videoId: string;
	videos: ExtendedVideo[];
	link: string;
}
