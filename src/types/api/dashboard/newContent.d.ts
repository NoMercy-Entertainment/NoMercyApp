export interface FileList {
	status: string;
	files: FileItem[];
}

export interface FileItem {
	name: string;
	file: string;
	mode: number;
	size: number;
	type: string;
	parent: string;
	extension: string;
	parsed: Parsed;
	match: Episode | Movie | null;
	streams: Streams;
}

export interface Streams {
	video: {
		index: number;
		width: number;
		height: number;
	}[];
	audio: {
		index: number;
		language: string;
	}[];
	subtitle: {
		index: number;
		language: string;
	}[];
}

export interface Episode {
	airDate: string;
	createdAt: string;
	episode_number: number;
	id: number;
	imdb_id: string;
	overview: string;
	productionCode: string;
	season_number: number;
	still: string;
	title: string;
	tvdb_id: null;
	updatedAt: string;
	voteAverage: number;
	voteCount: number;
	blurHash: string;
	color_palette: string;
	tvId: number;
	seasonId: number;
}

export interface Parsed {
	title: string;
	year: null;
	resolution: string;
	sources: string[];
	audioCodec?: string;
	audioChannels?: string;
	revision: string;
	group: string;
	edition: string;
	languages: string[];
	seasons: number[];
	episodeNumbers: number[];
	airDate: null;
	fullSeason: boolean;
	isPartialSeason: boolean;
	isMultiSeason: boolean;
	isSeasonExtra: boolean;
	isSpecial: boolean;
	seasonPart: number;
	isTv: boolean;
}

export interface Movie {
	adult: boolean;
	backdrop: string;
	belongsToCollection: null;
	budget: number;
	genres: string[];
	homepage: string;
	id: number;
	imdb_id: string;
	originalLanguage: string;
	originalTitle: string;
	overview: string;
	popularity: number;
	poster: string;
	productionCompanies: string[];
	productionCountries: string[];
	releaseDate: string;
	revenue: number;
	runtime: number;
	spokenLanguages: string[];
	status: string;
	tagline: string;
	title: string;
	video: boolean;
	voteAverage: number;
	voteCount: number;
	blurHash: string;
	color_palette: string;
}
