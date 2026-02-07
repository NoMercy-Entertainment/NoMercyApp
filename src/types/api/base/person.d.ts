import type { ColorPalettes, Crew, Translations } from '../shared';

export interface PeopleResponse {
	adult: boolean;
	alsoKnownAs: string;
	biography: string;
	birthday: string;
	createdAt: string;
	deathday: null | string;
	gender: number;
	homepage: null | string;
	id: number;
	imdb_id: string;
	knownForDepartment: string;
	name: string;
	placeOfBirth: string;
	popularity: number;
	profile: string;
	updatedAt: string;
	color_palette: ColorPalettes;
	poster: string;
	media_type: string;
}

export interface PersonResponseItem extends PeopleResponse {
	character?: string;
	job?: string;
	titleSort: string;
	Media: Media[];
	also_known_as: string[];
	imdb_id: string;
	known_for_department: string;
	place_of_birth: string;
	poster: string;
	media_type: string;
	credits: CreditsClass;
	combined_credits: Credits;
	movie_credits: Credits;
	tv_credits: Credits;
	external_ids: { [key: string]: null | string };
	images: Images;
	translations: Translations;
	known_for: KnownFor[];
	link: string;
}

export interface Credits {
	cast: Crew[];
	crew: Crew[];
}

export interface CreditsClass {
	cast: KnownFor[];
	crew: KnownFor[];
}

export interface KnownFor {
	adult: boolean;
	backdrop: null | string;
	character?: string;
	color_palette: ColorPalettes;
	credit_id: string;
	department?: string;
	episode_count?: number;
	first_air_date?: string;
	release_date?: string;
	genre_ids: number[];
	hasItem?: boolean;
	id: number;
	job?: string;
	media_type?: string;
	titleSort?: string;
	order?: number;
	origin_country?: string[];
	original_language: string;
	original_name?: string;
	original_title?: string;
	overview: string;
	popularity: number;
	poster: null | string;
	name?: string;
	title?: string;
	type?: string;
	video?: boolean;
	vote_average: number;
	vote_count: number;
	year?: number;
	link: string;
}

export interface Images {
	profiles: ImageProfile[];
}

export interface ImageProfile {
	aspect_ratio: number;
	src: string;
	height: number;
	iso_639_1: null;
	vote_average: number;
	vote_count: number;
	width: number;
}

export interface Credit {
	character?: string | null;
	job?: string | null;
	deathday: string | null;
	department?: string | null;
	gender: number | null;
	id: number;
	knownForDepartment: string | null;
	name: string | null;
	popularity: number | null;
	profilePath: string | null;
}
