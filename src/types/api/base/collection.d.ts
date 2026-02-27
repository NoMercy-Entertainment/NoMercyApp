import type { ExtendedVideo, MediaItem } from '@/types/api/base/info';
import type { ColorPalettes } from '@/types/api/shared';
import type { InfoCredit } from '@/types/server';

export interface CollectionResponse {
	title: string;
	overview: string;
	backdrop: string;
	poster: string;
	logo?: string;
	titleSort: string;
	type: string;
	id: string;
	total_duration: number;
	media_type: string;
	color_palette: ColorPalettes;
	collection: Collection[];
	number_of_items: number;
	have_items: number;
	duration: number;
	content_ratings: Rating[];
	year: number;
	score: number;
	favorite: boolean;
	genres: CollectionGenre[];
	link: string;

	backdrops: MediaItem[];
	posters: MediaItem[];
	cast: InfoCredit[];
	crew: InfoCredit[];
}

export interface Collection {
	id: number;
	backdrop: string;
	favorite: boolean;
	watched: boolean;
	logo: string | null;
	media_type: string;
	overview: string;
	duration: number;
	titleSort: string;
	color_palette?: ColorPalettes;
	poster: string;
	title: string;
	type: string;
	year: number;
	genres: CollectionGenre[];
	content_ratings: Rating[];
	videoId: string;
	number_of_items: number;
	have_items: number;
	videos: ExtendedVideo[];
	link: string;
}

export interface Backdrop {
	primary: string;
	lightVibrant: string;
	darkVibrant: string;
	lightMuted: string;
	darkMuted: string;
}

export interface MovieGenre {
	genre_id: number;
	genre: CollectionGenre;
	movie_id: number;
}

export interface Movie {
	id: number;
	title: string;
	title_sort: string;
	duration: string | null;
	show: boolean;
	folder: string | null;
	adult: boolean;
	backdrop: string;
	budget: number;
	homepage: string | null;
	imdb_id: string | null;
	original_title: string;
	original_language: string;
	overview: string;
	popularity: number;
	poster: string;
	release_date: string;
	revenue: number;
	runtime: number;
	status: string | null;
	tagline: string | null;
	trailer: string | null;
	video: string;
	vote_average: number;
	vote_count: number;
	library_id: string;
	library: string | null;
	alternative_titles: string | null;
	cast: string | null;
	certifications: Certification[];
	crew: string | null;
	genre: MovieGenre[];
	keywords: string | null;
	media: string | null;
	images: string | null;
	seasons: string | null;
	translations: any[];
	user_data: string | null;
	recommendationFrom: string | null;
	recommendationTo: string | null;
	similarFrom: string | null;
	similarTo: string | null;
	video_files: ExtendedVideo[];
	_colorPalette: string;
	colorPalette: ColorPalettes;
	created_at: string;
	updated_at: string;
}

export interface GenreMovie {
	genre_id: number;
	movie_id: number;
	movie: Movie;
}

export interface CollectionGenre {
	id: number;
	name: string;
	genreMovies: GenreMovie[];
}

export interface Certification {
	certification_id: number;
	certification: Rating;
	movie_id: number;
}

export interface Rating {
	id: number;
	iso_3166_1: string;
	rating: string;
	meaning: string;
	order: number;
}
