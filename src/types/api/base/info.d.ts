import type {ColorPalettes} from '../shared';
import {InfoCredit} from '@/types/server';
import {Item} from '@/lib/MusicPlayer/lib/types';
import {Rating} from '@/types/api/base/collection';

export interface InfoResponse {
	id: number;
	duration: number | null;
	poster: string | null;
	backdrop: string | null;
	logo: string | null;
	title: string;
	name?: string;
	overview: string | null;
	titleSort: string;
	voteAverage: number | null;
	content_ratings: Rating[];
	year: number;
	number_of_items?: number;
	have_items?: number;
	backdrops: MediaItem[];
	posters: MediaItem[];
	logos: MediaItem[];
	genres: Item[];
	creators: Item[];
	directors: Item[];
	writers: Item[];
	keywords: string[];
	budget?: number | null;
	type: string;
	media_type: string;
	favorite: boolean;
	watched: boolean;
	external_ids: {
		imdb_id: string | null;
		tvdb_id: number | null;
	};
	cast: InfoCredit[];
	crew: InfoCredit[];
	director: Item[];
	writer: Item[];
	creator: Item[];
	color_palette?: ColorPalettes;

	videos: ExtendedVideo[];
	similar: any[];
	recommendations: any[];
	seasons: Season[];
}

export interface Season {
	id: number;
	overview: string;
	poster: string;
	season_number: number;
	title: string;
	color_palette: SeasonColorPalette;
	episodes: Episode[];
}

export interface SeasonColorPalette {
	poster: ColorPaletteClass;
}

export interface Episode {
	id: number;
	episode_number: number | null;
	season_number: number | null;
	title: string;
	overview: string;
	airDate: string;
	still: string;
	color_palette: EpisodeColorPalette;
	progress: null;
	available: boolean;
}

export interface EpisodeColorPalette {
	still: ColorPaletteClass;
}

export interface MediaItem {
	blurHash: string;
	aspectRatio: number;
	createdAt: string;
	height: number;
	id: number;
	iso6391: string | null;
	name: string | null;
	site: string | null;
	size: string | null;
	profilePath?: string | null;
	poster?: string | null;
	backdrop?: string | null;
	src: string;
	type: string;
	updatedAt: string;
	voteAverage: number;
	voteCount: number;
	width: number;
	color_palette: ColorPalettes | undefined;
}

export interface Video {
	iso_639_1: string;
	iso_3166_1: string;
	name: string;
	key: string;
	src: string;
	site: string;
	size: number;
	type: string;
	official: boolean;
	published_at: string;
	id: string;
}

export interface ExtendedVideo extends Video {
	src: string;
	site: string;
	size: number;
}


export interface Tv {
	id: number;
	title: string;
	titleSort: string;
	have_items: number | null;
	folder: string;
	backdrop: string;
	created_at: string;
	duration: number | null;
	firstAirDate: string;
	homepage: string;
	imdb_id: string;
	inProduction: number;
	lastEpisodeToAir: number;
	lastAirDate: null;
	media_type: string;
	nextEpisodeToAir: number | null;
	number_of_items: number;
	numberOfSeasons: number;
	originCountry: string;
	originalLanguage: string;
	overview: string;
	popularity: number;
	poster: string;
	spokenLanguages: string;
	status: string;
	tagline: string;
	trailer: null;
	tvdb_id: number | null;
	type: string;
	updated_at: string;
	voteAverage: number;
	voteCount: number;
	blurHash: null;
	color_palette: ColorPalettes;
	library_id: string;
}

export interface Movie extends Tv {
	title: string;
	titleSort: string;
	duration: null | string;
	show: number;
	folder: string;
	budget: number;
	homepage: string;
	imdb_id: null | string;
	originalTitle: string;
	releaseDate: string;
	revenue: number;
	runtime: number;
}
