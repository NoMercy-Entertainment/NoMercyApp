import type {ColorPalettes} from '@/types/api/shared';

export interface GenreResponse {
	id: string;
	title: string;
	type: string;
	titleSort: string;
	origin: string;
	have_items: number;
	media_type: string;
	color_palette: ColorPalettes;
}

export interface Genre {
    id: string;
    name: string;
	link: string;
}
